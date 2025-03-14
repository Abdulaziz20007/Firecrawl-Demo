import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import { firecrawlConfig } from '@/lib/firecrawl-config';

// Initialize the Firecrawl client
const firecrawl = new FirecrawlApp({ apiKey: firecrawlConfig.apiKey });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls, options } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Default scrape options if none provided
    const scrapeOptions = options || {
      formats: ['markdown'],
      onlyMainContent: true
    };

    // Use Firecrawl SDK to batch scrape the URLs
    // Handle potential differences in the SDK's API by trying different method names
    let response;
    try {
      // Try using the method as a property of the firecrawl object
      if (typeof (firecrawl as any).batchScrape === 'function') {
        response = await (firecrawl as any).batchScrape(urls, scrapeOptions);
      } else if (typeof (firecrawl as any).createBatchScrape === 'function') {
        response = await (firecrawl as any).createBatchScrape({
          urls,
          options: scrapeOptions
        });
      } else if (typeof (firecrawl as any).startBatchScrape === 'function') {
        response = await (firecrawl as any).startBatchScrape(urls, scrapeOptions);
      } else {
        // If none of the expected methods are available, scrape each URL individually
        console.log('Batch scrape methods not available, falling back to individual scraping');
        const results = [];
        for (const url of urls) {
          const result = await firecrawl.scrapeUrl(url, scrapeOptions);
          results.push(result);
        }
        response = {
          success: true,
          data: results,
          message: 'URLs scraped individually'
        };
      }
    } catch (error) {
      console.error('Error with batch scraping methods:', error);
      throw error;
    }

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to batch scrape URLs' },
        { status: 500 }
      );
    }

    // Return the job ID if available, otherwise return the direct results
    return NextResponse.json({
      success: true,
      jobId: response.id,
      data: response.data,
      message: response.message || 'Batch scrape operation completed successfully'
    });
  } catch (error) {
    console.error('Error batch scraping URLs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to batch scrape URLs' },
      { status: 500 }
    );
  }
}
