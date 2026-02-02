import React, { useState } from 'react';

const GITHUB_DOCS_BASE = 'https://github.com/rajnishkhatri/llm-evals-app/blob/main/docs';

const LandingPage = ({ presentations, onNavigate }) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Background texture */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.03) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-violet-600 flex items-center justify-center">
                <span className="text-2xl">🔬</span>
              </div>
              <div>
                <h1 className="text-2xl font-serif text-slate-100">LLM Evals: First Principles Guides</h1>
                <p className="text-slate-400 text-sm">Interactive presentations on evaluating AI systems</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
            <h2 className="text-2xl font-serif text-slate-100 mb-6">Available Presentations</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left text-slate-400 font-medium py-4 px-4">Title</th>
                    <th className="text-left text-slate-400 font-medium py-4 px-4">Description</th>
                    <th className="text-left text-slate-400 font-medium py-4 px-4">Slides</th>
                    <th className="text-left text-slate-400 font-medium py-4 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {presentations.map((presentation) => (
                    <tr 
                      key={presentation.id}
                      className="border-b border-slate-800/50 hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{presentation.icon}</span>
                          <span className="text-slate-100 font-medium">{presentation.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {presentation.description}
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {presentation.totalPages} slides
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onNavigate(presentation.id)}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105"
                          >
                            Slides
                          </button>
                          {presentation.storyDoc && (
                            <a
                              href={`${GITHUB_DOCS_BASE}/${presentation.storyDoc}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105 inline-flex items-center"
                            >
                              Story
                            </a>
                          )}
                          {presentation.guideDoc && (
                            <a
                              href={`${GITHUB_DOCS_BASE}/${presentation.guideDoc}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105 inline-flex items-center"
                            >
                              Guide
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions - Collapsible */}
          <div className="mt-8 bg-slate-800/30 rounded-xl border border-slate-700/30 overflow-hidden">
            <button
              onClick={() => setShowControls(!showControls)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/20 transition-colors"
            >
              <h3 className="text-lg font-medium text-slate-200">Navigation Controls</h3>
              <svg 
                className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${showControls ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showControls && (
              <div className="px-6 pb-6 grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-amber-400 font-medium mb-2">Desktop (Keyboard + Mouse)</h4>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li><kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs">→</kbd> <kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs">Space</kbd> <kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs">Enter</kbd> Next slide</li>
                    <li><kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs">←</kbd> Previous slide</li>
                    <li><kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs">Escape</kbd> Return to landing</li>
                    <li><kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs">O</kbd> Toggle overview modal</li>
                    <li><kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs">Home</kbd> / <kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs">End</kbd> First / last slide</li>
                    <li><kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs">1-9</kbd> Jump to slide directly</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-amber-400 font-medium mb-2">Mobile (Touch + Swipe)</h4>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li>Swipe left → Next slide</li>
                    <li>Swipe right → Previous slide</li>
                    <li>Tap nav buttons → Navigate</li>
                    <li>Tap dot indicators → Jump to slide</li>
                    <li>Tap overview thumbnail → Jump to slide</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
