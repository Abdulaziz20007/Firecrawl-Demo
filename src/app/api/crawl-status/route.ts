import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import { firecrawlConfig } from '@/lib/firecrawl-config';

// Initialize the Firecrawl client
const firecrawl = new FirecrawlApp({ apiKey: firecrawlConfig.apiKey });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Use Firecrawl SDK to check the status of the crawl job
    // Passing jobId directly as a string
    const response = await firecrawl.checkCrawlStatus(jobId);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to get crawl status' },
        { status: 500 }
      );
    }

    // Return the crawl job status
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error checking crawl status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check crawl status' },
      { status: 500 }
    );
  }
}
