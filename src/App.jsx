import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage.jsx'
import PDFSlideViewer from './components/PDFSlideViewer.jsx'

// Presentation data
const presentations = [
  {
    id: 'ai-evals',
    title: 'Multi-Turn Conversation Evaluation',
    description: 'A First Principles Guide to Debugging LLM Conversations',
    pdfUrl: '/pdfs/First_Principles_AI_Evals.pdf',
    totalPages: 14,
    icon: '🔬',
    storyDoc: 'the_conversation_paradox_hassan_story.md',
    guideDoc: '06_multi_turn_conversation_evaluation.md',
  },
  {
    id: 'kappa-framework',
    title: 'LLM Application Collaborative Evals & IAA',
    description: 'Inter-Annotator Agreement and Cohens Kappa for Gold Standard AI',
    pdfUrl: '/pdfs/Kappa_Framework_for_Gold_Standard_AI.pdf',
    totalPages: 15,
    icon: '🤝',
    storyDoc: 'the_agreement_paradox_barbara_plank_story.md',
    guideDoc: '04_collaborative_evaluation_practices.md',
  }
];

// Parse URL hash: #/ai-evals/5 -> { presentationId: 'ai-evals', slide: 5 }
const parseHash = () => {
  const match = window.location.hash.match(/^#\/([^/]+)(?:\/(\d+))?$/);
  if (match) {
    return { presentationId: match[1], slide: parseInt(match[2]) || 1 };
  }
  return null;
};

function App() {
  const [currentView, setCurrentView] = useState('landing')
  const [selectedPresentation, setSelectedPresentation] = useState(null)
  const [initialSlide, setInitialSlide] = useState(1)

  // Handle URL hash on mount and hashchange events
  useEffect(() => {
    const handleHashChange = () => {
      const hashData = parseHash();
      if (hashData) {
        const presentation = presentations.find(p => p.id === hashData.presentationId);
        if (presentation) {
          setSelectedPresentation(presentation);
          setInitialSlide(hashData.slide);
          setCurrentView('viewer');
          return;
        }
      }
      // No valid hash - show landing page
      setCurrentView('landing');
      setSelectedPresentation(null);
      setInitialSlide(1);
    };

    // Check hash on mount
    handleHashChange();

    // Listen for hash changes (back/forward navigation)
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (presentationId) => {
    const presentation = presentations.find(p => p.id === presentationId)
    if (presentation) {
      setSelectedPresentation(presentation)
      setInitialSlide(1)
      setCurrentView('viewer')
      // Update URL hash
      window.location.hash = `/${presentationId}/1`;
    }
  }

  const handleBack = () => {
    setCurrentView('landing')
    setSelectedPresentation(null)
    setInitialSlide(1)
    // Clear the hash without triggering hashchange navigation back to viewer
    history.pushState(null, '', window.location.pathname);
  }

  if (currentView === 'landing') {
    return <LandingPage presentations={presentations} onNavigate={handleNavigate} />
  }

  if (currentView === 'viewer' && selectedPresentation) {
    return (
      <PDFSlideViewer 
        presentation={selectedPresentation} 
        initialSlide={initialSlide}
        onBack={handleBack} 
      />
    )
  }

  return <LandingPage presentations={presentations} onNavigate={handleNavigate} />
}

export default App
