import { useState } from 'react'
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
  }
];

function App() {
  const [currentView, setCurrentView] = useState('landing')
  const [selectedPresentation, setSelectedPresentation] = useState(null)

  const handleNavigate = (presentationId) => {
    const presentation = presentations.find(p => p.id === presentationId)
    if (presentation) {
      setSelectedPresentation(presentation)
      setCurrentView('viewer')
    }
  }

  const handleBack = () => {
    setCurrentView('landing')
    setSelectedPresentation(null)
  }

  if (currentView === 'landing') {
    return <LandingPage presentations={presentations} onNavigate={handleNavigate} />
  }

  if (currentView === 'viewer' && selectedPresentation) {
    return (
      <PDFSlideViewer 
        presentation={selectedPresentation} 
        onBack={handleBack} 
      />
    )
  }

  return <LandingPage presentations={presentations} onNavigate={handleNavigate} />
}

export default App
