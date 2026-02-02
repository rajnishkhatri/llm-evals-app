import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFSlideViewer = ({ presentation, initialSlide = 1, onBack }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(initialSlide);
  const [isLoading, setIsLoading] = useState(true);
  const [showOverview, setShowOverview] = useState(false);
  const [containerWidth, setContainerWidth] = useState(800);
  
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Sync URL hash when slide changes
  useEffect(() => {
    if (presentation?.id && pageNumber) {
      const newHash = `#/${presentation.id}/${pageNumber}`;
      if (window.location.hash !== newHash) {
        // Use replaceState to avoid adding to history on every slide change
        history.replaceState(null, '', newHash);
      }
    }
  }, [presentation?.id, pageNumber]);

  // Update pageNumber if initialSlide changes (e.g., from browser back/forward)
  useEffect(() => {
    setPageNumber(initialSlide);
  }, [initialSlide]);

  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages: loadedNumPages }) => {
    setNumPages(loadedNumPages);
    setIsLoading(false);
    // Ensure initialSlide is within bounds
    if (initialSlide > loadedNumPages) {
      setPageNumber(loadedNumPages);
    } else if (initialSlide < 1) {
      setPageNumber(1);
    }
  };

  // Navigation functions
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  }, [numPages]);

  const goNext = useCallback(() => {
    if (pageNumber < numPages) {
      setPageNumber(prev => prev + 1);
    }
  }, [pageNumber, numPages]);

  const goPrev = useCallback(() => {
    if (pageNumber > 1) {
      setPageNumber(prev => prev - 1);
    }
  }, [pageNumber]);

  const goFirst = useCallback(() => setPageNumber(1), []);
  const goLast = useCallback(() => numPages && setPageNumber(numPages), [numPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't handle if modal is open and key is not escape or o
      if (showOverview && e.key !== 'Escape' && e.key.toLowerCase() !== 'o') {
        if (e.key >= '1' && e.key <= '9') {
          const slideNum = parseInt(e.key);
          if (slideNum <= numPages) {
            goToPage(slideNum);
            setShowOverview(false);
          }
        }
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goPrev();
          break;
        case 'Escape':
          e.preventDefault();
          if (showOverview) {
            setShowOverview(false);
          } else {
            onBack();
          }
          break;
        case 'o':
        case 'O':
          e.preventDefault();
          setShowOverview(prev => !prev);
          break;
        case 'Home':
          e.preventDefault();
          goFirst();
          break;
        case 'End':
          e.preventDefault();
          goLast();
          break;
        default:
          // Number keys 1-9 for direct slide access
          if (e.key >= '1' && e.key <= '9') {
            const slideNum = parseInt(e.key);
            if (slideNum <= numPages) {
              goToPage(slideNum);
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, goFirst, goLast, goToPage, onBack, showOverview, numPages]);

  // Touch/swipe navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;
    
    // Only trigger if horizontal swipe is greater than vertical (to avoid scroll conflicts)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goNext(); // Swipe left = next
      } else {
        goPrev(); // Swipe right = prev
      }
    }
  };

  // Container width for responsive PDF
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(Math.min(width - 32, 1200)); // Max 1200px, with padding
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const progress = numPages ? (pageNumber / numPages) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Background texture */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.03) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Back to presentations"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-medium text-slate-100">{presentation.title}</h1>
                <p className="text-sm text-slate-400">{presentation.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">
                {pageNumber} / {numPages || '...'}
              </span>
              <button
                onClick={() => setShowOverview(true)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Show overview"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-1 bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        {/* Main content area */}
        <main 
          ref={containerRef}
          className="flex-1 flex items-center justify-center overflow-hidden relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation buttons */}
          <button
            onClick={goPrev}
            disabled={pageNumber <= 1}
            className="absolute left-2 md:left-4 z-20 p-3 bg-slate-800/80 hover:bg-slate-700/80 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goNext}
            disabled={pageNumber >= numPages}
            className="absolute right-2 md:right-4 z-20 p-3 bg-slate-800/80 hover:bg-slate-700/80 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* PDF Document */}
          <div className="flex items-center justify-center p-4">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-400">Loading presentation...</span>
                </div>
              </div>
            )}
            
            <Document
              file={presentation.pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={null}
              className="shadow-2xl"
            >
              <div style={{ clipPath: 'inset(0 0 4% 0 round 12px)' }}>
                <Page 
                  pageNumber={pageNumber} 
                  width={containerWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="rounded-lg overflow-hidden"
                />
              </div>
            </Document>
          </div>
        </main>

        {/* Footer with dot navigation */}
        <footer className="border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-sm py-4">
          <div className="flex justify-center gap-2 flex-wrap px-4">
            {numPages && Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-3 h-3 rounded-full transition-all min-w-[12px] min-h-[12px] ${
                  page === pageNumber 
                    ? 'bg-amber-500 scale-125' 
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${page}`}
              />
            ))}
          </div>
        </footer>
      </div>

      {/* Overview Modal */}
      {showOverview && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowOverview(false)}
        >
          <div 
            className="bg-slate-900 rounded-xl border border-slate-700/50 max-w-6xl max-h-[90vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-slate-100">Slide Overview</h2>
              <button
                onClick={() => setShowOverview(false)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close overview"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {numPages && Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    goToPage(page);
                    setShowOverview(false);
                  }}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    page === pageNumber 
                      ? 'border-amber-500 ring-2 ring-amber-500/50' 
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <Document file={presentation.pdfUrl} loading={null}>
                    <div style={{ clipPath: 'inset(0 0 4% 0 round 8px)' }}>
                      <Page 
                        pageNumber={page} 
                        width={200}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                  </Document>
                  <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 py-1 text-center text-sm">
                    Slide {page}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFSlideViewer;
