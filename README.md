# FirecrawlHub - Next.js Web Scraping Platform

![FirecrawlHub Logo](https://img.shields.io/badge/FirecrawlHub-Web%20Scraping%20Platform-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.2.x-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC)
![Firecrawl API](https://img.shields.io/badge/Firecrawl%20API-2023-orange)

## Overview

FirecrawlHub is a comprehensive web scraping platform built with Next.js and TypeScript, showcasing advanced integration with the Firecrawl API. This application demonstrates professional-grade implementation of web scraping, crawling, and batch processing capabilities in a modern React application.

**Created by: [Abdulaziz20007](https://github.com/Abdulaziz20007)**

## 🔥 Features

- **Single URL Scraping**: Extract content from any web page with customizable options
- **Website Crawling**: Crawl entire websites with configurable depth and page limits
- **Batch Scraping**: Process multiple URLs simultaneously
- **Job Status Tracking**: Monitor the progress of crawling jobs
- **Content Formatting Options**: Extract content as Markdown or HTML
- **Main Content Extraction**: Automatically filter out navigation and footers
- **Link Discovery**: Extract and display all links found on pages
- **Custom Crawl Options**: Control depth, page limits, and content extraction settings

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **API Integration**: Firecrawl SDK for JavaScript
- **State Management**: React Hooks
- **Code Quality**: ESLint, TypeScript strict mode
- **UI/UX**: Responsive design, dark mode support, loading states

## 📦 Project Structure

```
next-test-ts/
├── .env.local                 # Environment variables (Firecrawl API key)
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── batch-scrape/  # Batch scraping endpoint
│   │   │   ├── crawl/         # Website crawling endpoint
│   │   │   ├── crawl-status/  # Job status checking endpoint
│   │   │   └── scrape/        # Single URL scraping endpoint
│   │   ├── firecrawl-demo/    # Main application page
│   │   └── page.tsx           # Redirect to demo page
│   ├── components/            # UI components
│   │   └── ui/                # shadcn UI components
│   └── lib/                   # Utility functions and configuration
│       └── firecrawl-config.ts # Firecrawl SDK configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Firecrawl API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Abdulaziz20007/firecrawlhub.git
   cd firecrawlhub
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root with your API key
   ```env
   FIRECRAWL_API_KEY="your-firecrawl-api-key"
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Navigate to `http://localhost:3000` in your browser

## 💡 Usage Examples

### Scraping a Single URL

1. Enter a URL in the input field
2. Toggle options like "Only Main Content" or "Include HTML"
3. Click "Scrape URL"
4. View the extracted content, formatted as Markdown

### Crawling a Website

1. Enter a starting URL
2. Adjust crawl depth and page limits using the sliders
3. Click "Start Crawl"
4. Copy the Job ID to check status later

### Batch Scraping

1. Add multiple URLs to the list
2. Configure scraping options
3. Click "Batch Scrape"
4. View the Job ID or results

### Checking Job Status

1. Enter a Job ID from a previous crawl
2. Click "Check Status"
3. View the current status and progress

## ⚙️ API Architecture

The application uses a clean, RESTful API architecture:

- **`/api/scrape`**: POST endpoint for scraping a single URL
- **`/api/crawl`**: POST endpoint for crawling websites
- **`/api/batch-scrape`**: POST endpoint for batch scraping multiple URLs
- **`/api/crawl-status`**: POST endpoint for checking job status

Each API route follows best practices for error handling, input validation, and response formatting.

## 🔒 Security Considerations

- API key is stored in environment variables and never exposed to the client
- Input validation prevents malicious URL injection
- Error boundaries prevent application crashes
- Rate limiting mechanisms are recommended for production

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Firecrawl API](https://mendable.ai/firecrawl) for providing the web scraping capabilities
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Vercel](https://vercel.com) for hosting and deployment
- All open-source contributors who make projects like this possible

---

Made with ❤️ by [Abdulaziz20007](https://github.com/Abdulaziz20007)
