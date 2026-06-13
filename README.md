# PDF Tools

A full-stack web application providing free online PDF utilities. Built with Next.js 14 and Express.

## Features

- **Merge PDF** — Combine multiple PDFs into one
- **Split PDF** — Split a PDF into individual pages
- **Compress PDF** — Reduce PDF file size
- **Rotate PDF** — Rotate pages in a PDF
- **Add Watermark** — Add text watermarks to PDF pages
- **Page Numbers** — Add page numbers to PDF documents
- **JPG to PDF** — Convert images to PDF
- **PDF to JPG** — Convert PDF pages to images

## Tech Stack

- **Frontend:** Next.js 14, React 18
- **Backend:** Node.js, Express, pdf-lib, sharp
- **Background Jobs:** BullMQ + Redis
- **Reverse Proxy:** Nginx
- **Containerization:** Docker Compose

## Quick Start

### Prerequisites

- Node.js 18+
- Redis (for background job processing)

### Local Development

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:3000.

### Docker Deployment

```bash
docker compose up --build
```

This starts all services:
- Frontend on port 3000
- Backend API on port 3001
- Redis for job queues
- Nginx reverse proxy on port 80

## Project Structure

```
pdf-tools/
├── backend/
│   ├── routes/          # API route handlers (8 tools)
│   ├── utils/           # File helpers, cleanup, pdf-lib utils
│   ├── workers/         # BullMQ job workers
│   ├── uploads/         # Temporary file storage
│   ├── server.js        # Express app entry point
│   └── package.json
├── frontend/
│   ├── app/             # Next.js 14 App Router pages
│   │   ├── merge/
│   │   ├── split/
│   │   ├── compress/
│   │   ├── rotate/
│   │   ├── watermark/
│   │   ├── page-numbers/
│   │   ├── jpg-to-pdf/
│   │   └── pdf-to-jpg/
│   ├── components/      # Shared UI components
│   ├── lib/             # API client utilities
│   └── package.json
├── docker-compose.yml
├── nginx.conf
└── README.md
```

## License

MIT
