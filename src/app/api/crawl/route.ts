import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import { firecrawlConfig } from '@/lib/firecrawl-config';

// Initialize the Firecrawl client
const firecrawl = new FirecrawlApp({ apiKey: firecrawlConfig.apiKey });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, options } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Default crawl options if none provided
    const crawlOptions = options || {
      limit: 10, // Limit to 10 pages by default
      maxDepth: 2, // Only go 2 levels deep by default
      scrapeOptions: {
        formats: ['markdown'],
        onlyMainContent: true
      }
    };

    // Use Firecrawl SDK to crawl the website
    const response = await firecrawl.crawlUrl(url, crawlOptions);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to crawl website' },
        { status: 500 }
      );
    }

    // Return the crawl job ID and basic info
    return NextResponse.json({
      success: true,
      jobId: response.id,
      message: 'Crawl job started successfully',
      status: response.status
    });
  } catch (error) {
    console.error('Error crawling website:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to crawl website' },
      { status: 500 }
    );
  }
}
