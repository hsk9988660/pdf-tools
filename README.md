# PDF Tools

A modern web application for PDF manipulation built with Next.js and Node.js.

## Features

- **Merge PDF** - Combine multiple PDFs into one
- **Split PDF** - Split PDFs into separate pages
- **Compress PDF** - Reduce PDF file size
- **Rotate PDF** - Rotate PDF pages
- **Add Watermark** - Add text/image watermarks to PDFs
- **Page Numbers** - Add page numbers to PDFs
- **JPG to PDF** - Convert images to PDF
- **PDF to JPG** - Convert PDF pages to images

## Tech Stack

- **Frontend:** Next.js 14, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express
- **PDF Processing:** pdf-lib, sharp
- **Deployment:** Docker, Nginx

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
# Start backend
cd backend
npm run dev

# Start frontend (in another terminal)
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
