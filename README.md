# LLM Evals App

Interactive presentations for evaluating AI systems with companion documentation.

## Project Structure

```
llm-evals-app/
├── public/
│   └── pdfs/                    # PDF slide files
│       └── First_Principles_AI_Evals.pdf
├── docs/                        # Markdown documentation (hosted on GitHub)
│   ├── the_conversation_paradox_hassan_story.md
│   └── 06_multi_turn_conversation_evaluation.md
├── src/
│   ├── App.jsx                  # Presentation configuration
│   └── components/
│       ├── LandingPage.jsx      # Landing page with presentation table
│       └── PDFSlideViewer.jsx   # PDF viewer component
└── README.md
```

## Adding New Content

### 1. Add a New PDF Presentation (Slides)

**Step 1:** Place your PDF file in the `public/pdfs/` folder:

```
public/pdfs/your_new_presentation.pdf
```

**Step 2:** Add a new entry to the `presentations` array in `src/App.jsx`:

```javascript
const presentations = [
  // Existing presentations...
  {
    id: 'unique-id',                    // Unique identifier (kebab-case)
    title: 'Your Presentation Title',   // Display title
    description: 'Brief description',   // Shown in the table
    pdfUrl: '/pdfs/your_new_presentation.pdf',  // Path to PDF
    totalPages: 10,                     // Number of slides
    icon: '📊',                         // Emoji icon for the presentation
    storyDoc: 'your_story.md',          // Optional: Story document filename
    guideDoc: 'your_guide.md',          // Optional: Guide document filename
  }
];
```

### 2. Add a Story Document

Stories are narrative-style markdown documents that provide context or background.

**Step 1:** Create your markdown file in the `docs/` folder:

```
docs/your_story.md
```

**Step 2:** Add the `storyDoc` field to your presentation in `src/App.jsx`:

```javascript
{
  id: 'your-presentation',
  // ... other fields
  storyDoc: 'your_story.md',  // Just the filename, not the full path
}
```

**Step 3:** Push to GitHub so the link works:

```bash
git add docs/your_story.md
git commit -m "Add story document"
git push
```

### 3. Add a Guide Document

Guides are technical documentation or tutorials.

**Step 1:** Create your markdown file in the `docs/` folder:

```
docs/your_guide.md
```

**Step 2:** Add the `guideDoc` field to your presentation in `src/App.jsx`:

```javascript
{
  id: 'your-presentation',
  // ... other fields
  guideDoc: 'your_guide.md',  // Just the filename, not the full path
}
```

**Step 3:** Push to GitHub so the link works:

```bash
git add docs/your_guide.md
git commit -m "Add guide document"
git push
```

## Complete Example

Here's a complete example of adding a new presentation with all three components:

### Files to create:

1. `public/pdfs/rag_evaluation_guide.pdf` - Your PDF slides
2. `docs/rag_debugging_story.md` - Narrative story
3. `docs/rag_evaluation_technical_guide.md` - Technical guide

### Configuration in `src/App.jsx`:

```javascript
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
  // NEW PRESENTATION
  {
    id: 'rag-evals',
    title: 'RAG System Evaluation',
    description: 'Evaluating Retrieval-Augmented Generation Systems',
    pdfUrl: '/pdfs/rag_evaluation_guide.pdf',
    totalPages: 12,
    icon: '🔍',
    storyDoc: 'rag_debugging_story.md',
    guideDoc: 'rag_evaluation_technical_guide.md',
  }
];
```

## Button Behavior

| Button | Color | Action |
|--------|-------|--------|
| **Slides** | Amber | Opens the PDF viewer |
| **Story** | Violet | Opens GitHub markdown (new tab) |
| **Guide** | Emerald | Opens GitHub markdown (new tab) |

- Story and Guide buttons only appear if the corresponding `storyDoc` or `guideDoc` field is set
- You can have a presentation with only slides, or with any combination of docs

## GitHub Docs URL

Documents are served from GitHub at:

```
https://github.com/rajnishkhatri/llm-evals-app/blob/main/docs/{filename}
```

To change the GitHub repository, update `GITHUB_DOCS_BASE` in `src/components/LandingPage.jsx`:

```javascript
const GITHUB_DOCS_BASE = 'https://github.com/YOUR_USERNAME/YOUR_REPO/blob/main/docs';
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

The app can be deployed to Vercel, Netlify, or any static hosting service.

```bash
# Build
npm run build

# The dist/ folder contains the static files
```

Remember to push your changes to GitHub so the Story and Guide links work correctly.
