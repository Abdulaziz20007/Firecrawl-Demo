// src/lib/firecrawl-config.ts

// This configuration file is used to set up the Firecrawl client
// In production, you should set the API key as an environment variable

// For local development, create a .env.local file in the root directory with:
// FIRECRAWL_API_KEY=fc-your-api-key

export const firecrawlConfig = {
  apiKey: process.env.FIRECRAWL_API_KEY || 'YOUR_FIRECRAWL_API_KEY',
};

// Add instructions for how to get a Firecrawl API key in README.md
export const FIRECRAWL_INSTRUCTIONS = `
To use the Firecrawl functionality:
1. Sign up at https://firecrawl.dev/
2. Get your API key from the dashboard
3. Create a .env.local file in the root directory with:
   FIRECRAWL_API_KEY=fc-your-api-key-here
`;
