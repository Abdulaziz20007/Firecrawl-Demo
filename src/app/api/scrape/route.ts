import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import { firecrawlConfig } from '@/lib/firecrawl-config';

// Initialize the Firecrawl client
const firecrawl = new FirecrawlApp({ apiKey: firecrawlConfig.apiKey });

// Define types based on actual response structure
interface FirecrawlResponse {
  success: boolean;
  error?: string;
  // More specific types for expected properties
  markdown?: string;
  html?: string;
  content?: string;
  links?: Array<{ url: string; text?: string }>;
  // Allow for other properties without using 'any'
  [key: string]: boolean | string | Array<{ url: string; text?: string }> | undefined;
}

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

    // Default options if none provided
    const scrapeOptions = options || {
      formats: ['markdown'],
      onlyMainContent: true
    };

    // Use Firecrawl SDK to scrape the URL
    const response = await firecrawl.scrapeUrl(url, scrapeOptions) as FirecrawlResponse;
    
    // Log the response for debugging
    console.log('Firecrawl API response:', JSON.stringify(response, null, 2));

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to scrape website' },
        { status: 500 }
      );
    }

    // Format the response to ensure consistent structure
    // We'll create a new object with our expected structure
    const formattedResponse = {
      success: true,
      data: {
        // Use optional chaining to safely access properties
        markdown: response.markdown || response.content || '',
        html: response.html || '',
        links: response.links || []
      }
    };

    // Return the formatted data
    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Error scraping website:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to scrape website' },
      { status: 500 }
    );
  }
}
