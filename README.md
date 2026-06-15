# PDF Tools

A modern web application for PDF manipulation built with Next.js 14 and Node.js/Express.

## Features

| Tool | Description |
|------|-------------|
| **Merge PDF** | Combine multiple PDFs into one seamless document |
| **Split PDF** | Split a PDF into separate pages |
| **Compress PDF** | Reduce PDF file size while keeping quality |
| **Rotate PDF** | Rotate pages in your PDF to the right angle |
| **Add Watermark** | Add text watermarks to protect your PDF pages |
| **Page Numbers** | Add page numbers to your PDF document |
| **JPG to PDF** | Convert your images into a PDF document |
| **PDF to JPG** | Convert PDF pages to high-quality images |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express 4 |
| **PDF Processing** | pdf-lib, sharp |
| **Database** | PostgreSQL 16 (via Sequelize ORM) |
| **Queue** | BullMQ + Redis 7 (for background jobs) |
| **Deployment** | Docker Compose, Nginx |

## Project Structure

```
pdf-tools/
├── frontend/                          # Next.js 14 App Router (TypeScript)
│   ├── app/                           # Pages (App Router)
│   │   ├── globals.css                # Global styles + design system
│   │   ├── layout.tsx                 # Root layout (Navbar + Footer + Toaster)
│   │   ├── page.tsx                   # Home page (hero + tool grid + features)
│   │   ├── merge/page.tsx             # Merge PDF tool page
│   │   ├── split/page.tsx             # Split PDF tool page
│   │   ├── compress/page.tsx          # Compress PDF tool page
│   │   ├── rotate/page.tsx            # Rotate PDF tool page
│   │   ├── watermark/page.tsx         # Watermark PDF tool page
│   │   ├── page-numbers/page.tsx      # Page Numbers tool page
│   │   ├── jpg-to-pdf/page.tsx        # JPG to PDF tool page
│   │   └── pdf-to-jpg/page.tsx        # PDF to JPG tool page
│   ├── components/                    # Shared React components
│   │   ├── Navbar.tsx                 # Sticky nav with dark mode toggle
│   │   ├── Footer.tsx                 # Site footer with links
│   │   ├── ToolCard.tsx               # Tool grid card with gradient icons
│   │   ├── FileDropzone.tsx           # Drag & drop file uploader
│   │   ├── ProgressBar.tsx            # Upload/processing progress bar
│   │   ├── DownloadButton.tsx         # Download button with states
│   │   └── ui/                        # shadcn/ui primitives
│   │       ├── button.tsx             # Button component (CVA)
│   │       ├── card.tsx               # Card component
│   │       ├── dialog.tsx             # Modal dialog
│   │       ├── input.tsx              # Text input
│   │       ├── progress.tsx           # Radix progress bar
│   │       ├── select.tsx             # Radix select dropdown
│   │       └── sonner.tsx             # Toast notifications
│   ├── lib/                           # Utility functions
│   │   ├── api.ts                     # XHR upload with progress + download helper
│   │   └── utils.ts                   # cn() helper (clsx + tailwind-merge)
│   ├── globals.d.ts                   # TypeScript declarations
│   ├── tailwind.config.js             # Tailwind config with custom animations
│   ├── tsconfig.json                  # TypeScript config
│   └── package.json                   # Dependencies
│
├── backend/                           # Express API server
│   ├── server.js                      # Entry point: middleware, routes, DB sync
│   ├── config/
│   │   └── database.js                # Sequelize PostgreSQL connection
│   ├── models/
│   │   ├── index.js                   # Model associations
│   │   ├── Conversion.js              # Conversion tracking (UUID PK)
│   │   └── File.js                    # Input/output file records
│   ├── routes/                        # Express route definitions
│   │   ├── merge.js                   # POST /api/merge
│   │   ├── split.js                   # POST /api/split
│   │   ├── compress.js                # POST /api/compress
│   │   ├── rotate.js                  # POST /api/rotate
│   │   ├── watermark.js               # POST /api/watermark
│   │   ├── pageNumbers.js             # POST /api/page-numbers
│   │   ├── jpgToPdf.js                # POST /api/jpg-to-pdf
│   │   ├── pdfToJpg.js                # POST /api/pdf-to-jpg
│   │   └── stats.js                   # GET /api/stats
│   ├── controllers/                   # Route handler logic
│   │   ├── mergeController.js         # Merge PDFs using pdf-lib
│   │   ├── splitController.js         # Split PDF into pages
│   │   ├── compressController.js      # Compress via BullMQ worker
│   │   ├── rotateController.js        # Rotate PDF pages
│   │   ├── watermarkController.js     # Add text watermarks
│   │   ├── pageNumbersController.js   # Add page numbers
│   │   ├── jpgToPdfController.js      # Convert images to PDF
│   │   └── pdfToJpgController.js      # Convert PDF to images via worker
│   ├── middleware/
│   │   ├── upload.js                  # Multer config (100MB limit, 20 files)
│   │   ├── errorHandler.js            # Global error handler
│   │   └── requestLogger.js           # Request logging middleware
│   ├── services/
│   │   └── conversionService.js       # DB operations for conversions
│   ├── utils/
│   │   ├── pdfLib.js                  # pdf-lib helpers
│   │   ├── fileHelper.js              # File path utilities
│   │   └── cleanup.js                 # Cron cleanup of old files (30 min)
│   ├── workers/
│   │   └── pdfWorker.js               # BullMQ worker (compress, pdf-to-jpg)
│   └── uploads/                       # Temp file storage (auto-cleaned)
│
├── docker-compose.yml                 # PostgreSQL + Redis + Backend + Frontend + Nginx
├── nginx.conf                         # Reverse proxy config
└── .gitignore
```

## Frontend Patterns

### Page Structure (App Router)
Every tool page follows this pattern:
```tsx
'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import FileDropzone from '../../components/FileDropzone';
import ProgressBar from '../../components/ProgressBar';
import DownloadButton from '../../components/DownloadButton';
import { uploadFile } from '../../lib/api';
import { IconName } from 'lucide-react';

export default function ToolPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate, create FormData, call uploadFile()
  };

  const reset = () => { setFiles([]); setResult(null); setError(null); setProgress(null); };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with gradient icon */}
      {/* FileDropzone */}
      {/* Submit button (conditionally shown) */}
      {/* ProgressBar */}
      {/* Error display */}
      {/* Result card + DownloadButton + Start Over */}
    </div>
  );
}
```

### State Management Pattern
- `files` - Array of selected File objects
- `progress` - Upload progress percentage (0-100) or null
- `result` - API response object or null
- `error` - Error message string or null
- `loading` - Boolean for loading state

### API Helper (`lib/api.ts`)
```ts
uploadFile(url, formData, onProgress)  // XHR upload with progress tracking
downloadFile(url)                       // Trigger file download
```

### Styling Utilities
- `cn(...inputs)` - Merge Tailwind classes (clsx + tailwind-merge)
- `text-gradient` - Gradient text effect
- `glass` / `glass-dark` - Glass morphism cards
- `btn-gradient` - Animated gradient button
- `hover-lift` - Card hover lift effect
- `animate-fade-in` / `animate-fade-in-up` - Entry animations
- `animate-float` - Floating animation for icons

### Available Animations (tailwind.config.js)
`fade-in`, `fade-in-up`, `fade-in-down`, `scale-in`, `slide-in-right`, `slide-in-left`, `pulse-soft`, `shimmer`, `float`, `gradient-x`, `spin-slow`, `bounce-gentle`, `wiggle`, `progress-fill`

## Backend Patterns

### Route Pattern
```js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/controllerName');

router.post('/', upload.array('files', 20), controller.methodName);

module.exports = router;
```

### Controller Pattern
```js
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const conversionService = require('../services/conversionService');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

exports.methodName = async (req, res, next) => {
  const startTime = Date.now();
  let conversion;

  try {
    // 1. Validate input
    // 2. Create conversion record
    // 3. Record input files
    // 4. Mark as processing
    // 5. Process PDF (pdf-lib operations)
    // 6. Save output file
    // 7. Record output file
    // 8. Mark as completed
    // 9. Return JSON response
  } catch (err) {
    if (conversion) await conversionService.markFailed(conversion.id, err.message);
    next(err);
  }
};
```

### API Response Format
```json
{
  "success": true,
  "downloadUrl": "/download/filename.pdf",
  "filename": "output.pdf",
  "pageCount": 5,
  "size": 123456,
  "originalSize": 654321,
  "processingTime": 1234,
  "conversionId": "uuid"
}
```

## Branch Naming Convention

| Type | Prefix | Example |
|------|--------|---------|
| **Frontend Ticket** | `WF-` | `WF-01`, `WF-42` |
| **Backend Ticket** | `WB-` | `WB-01`, `WB-42` |

### Workflow
```bash
# Start from master
git checkout master
git pull origin master

# Create a feature branch
git checkout -b WF-01        # For frontend work
git checkout -b WB-01        # For backend work

# Make changes, commit, push
git add .
git commit -m "Description of changes"
git push -u origin WF-01

# Create Pull Request on GitHub (WF-01 → master)
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Development
```bash
# Start backend (terminal 1)
cd backend
npm run dev

# Start frontend (terminal 2)
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Docker Deployment
```bash
docker-compose up -d
```

## License
MIT
