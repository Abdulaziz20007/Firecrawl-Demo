'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

// Define proper types for the scraped content
interface Link {
  url: string;
  title?: string;
  text?: string;
}

interface ScrapeResult {
  title?: string;
  content?: string;
  timestamp?: string;
  links?: Link[];
  // Additional fields from real Firecrawl response
  data?: {
    markdown?: string;
    html?: string;
    links?: Array<{url: string, text: string}>;
  };
  // For direct response structure (not nested under data)
  markdown?: string;
  html?: string;
  // Status fields
  success?: boolean;
  error?: string;
  message?: string;
}

interface CrawlResult {
  success: boolean;
  jobId: string;
  message: string;
  status?: string;
  error?: string;
}

interface CrawlStatusResult {
  success: boolean;
  status: string;
  error?: string;
  data?: {
    crawledUrls?: string[];
    failedUrls?: string[];
    pendingUrls?: string[];
    documents?: Array<{
      url: string;
      data: {
        markdown?: string;
        html?: string;
        links?: Array<{url: string, text: string}>;
      };
    }>;
  };
}

export default function FirecrawlDemo() {
  // URL input state
  const [url, setUrl] = useState('https://example.com');
  const [urls, setUrls] = useState<string[]>(['https://example.com']);
  
  // Operation states
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('scrape');
  
  // Result states
  const [scrapeResult, setScrapeResult] = useState<ScrapeResult | null>(null);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);
  const [crawlStatus, setCrawlStatus] = useState<CrawlStatusResult | null>(null);
  const [batchResult, setBatchResult] = useState<CrawlResult | null>(null);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Options state
  const [onlyMainContent, setOnlyMainContent] = useState(true);
  const [includeHtml, setIncludeHtml] = useState(false);
  const [crawlLimit, setCrawlLimit] = useState(10);
  const [crawlDepth, setCrawlDepth] = useState(2);
  
  // Job ID for status check
  const [jobId, setJobId] = useState('');

  // Handle new URL input for batch scraping
  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  const handleUpdateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleRemoveUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  // Handle scraping a single URL
  const handleScrape = async () => {
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setScrapeResult(null);
    
    try {
      const formats = ['markdown'];
      if (includeHtml) formats.push('html');
      
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url,
          options: {
            formats,
            onlyMainContent
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to scrape: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Scrape API response data:', data);
      setScrapeResult(data);
    } catch (error) {
      console.error('Error scraping website:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle crawling a website
  const handleCrawl = async () => {
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setCrawlResult(null);
    setCrawlStatus(null);
    
    try {
      const formats = ['markdown'];
      if (includeHtml) formats.push('html');
      
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url,
          options: {
            limit: crawlLimit,
            maxDepth: crawlDepth,
            scrapeOptions: {
              formats,
              onlyMainContent
            }
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to crawl: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCrawlResult(data);
      
      // Store the job ID for status checking
      if (data.jobId) {
        setJobId(data.jobId);
      }
    } catch (error) {
      console.error('Error crawling website:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle batch scraping multiple URLs
  const handleBatchScrape = async () => {
    if (!urls.length) return;

    setIsLoading(true);
    setError(null);
    setBatchResult(null);
    
    try {
      const formats = ['markdown'];
      if (includeHtml) formats.push('html');
      
      const response = await fetch('/api/batch-scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          urls: urls.filter(u => u), // Remove empty URLs
          options: {
            formats,
            onlyMainContent
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to batch scrape: ${response.statusText}`);
      }
      
      const data = await response.json();
      setBatchResult(data);
      
      // Store the job ID for status checking
      if (data.jobId) {
        setJobId(data.jobId);
      }
    } catch (error) {
      console.error('Error batch scraping websites:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle checking the status of a crawl or batch job
  const handleCheckStatus = async () => {
    if (!jobId) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/crawl-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to check status: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCrawlStatus(data);
    } catch (error) {
      console.error('Error checking job status:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Firecrawl Demo</h1>
      
      <Tabs defaultValue="scrape" className="w-full mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="scrape">Scrape URL</TabsTrigger>
          <TabsTrigger value="crawl">Crawl Website</TabsTrigger>
          <TabsTrigger value="batch">Batch Scrape</TabsTrigger>
          <TabsTrigger value="status">Check Status</TabsTrigger>
        </TabsList>
        
        {/* Scrape URL Tab */}
        <TabsContent value="scrape">
          <Card>
            <CardHeader>
              <CardTitle>Scrape a Single URL</CardTitle>
              <CardDescription>
                Enter a URL to extract content using Firecrawl
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="url">URL to Scrape</Label>
                  <Input
                    id="url"
                    type="url" 
                    placeholder="https://example.com" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="main-content"
                      checked={onlyMainContent}
                      onCheckedChange={setOnlyMainContent}
                    />
                    <Label htmlFor="main-content">Only Extract Main Content</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-html"
                      checked={includeHtml}
                      onCheckedChange={setIncludeHtml}
                    />
                    <Label htmlFor="include-html">Include HTML Content</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleScrape} disabled={isLoading} className="w-full">
                {isLoading && activeTab === 'scrape' ? 'Scraping...' : 'Scrape Website'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Crawl Website Tab */}
        <TabsContent value="crawl">
          <Card>
            <CardHeader>
              <CardTitle>Crawl a Website</CardTitle>
              <CardDescription>
                Crawl a website to extract content from multiple pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="crawl-url">URL to Start Crawling</Label>
                  <Input
                    id="crawl-url"
                    type="url" 
                    placeholder="https://example.com" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <div className="flex justify-between">
                    <Label htmlFor="crawl-limit">Page Limit: {crawlLimit}</Label>
                  </div>
                  <Slider
                    id="crawl-limit"
                    min={1}
                    max={100}
                    step={1}
                    value={[crawlLimit]}
                    onValueChange={(value: number[]) => setCrawlLimit(value[0])}
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <div className="flex justify-between">
                    <Label htmlFor="crawl-depth">Max Depth: {crawlDepth}</Label>
                  </div>
                  <Slider
                    id="crawl-depth"
                    min={1}
                    max={5}
                    step={1}
                    value={[crawlDepth]}
                    onValueChange={(value: number[]) => setCrawlDepth(value[0])}
                  />
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="crawl-main-content"
                      checked={onlyMainContent}
                      onCheckedChange={setOnlyMainContent}
                    />
                    <Label htmlFor="crawl-main-content">Only Extract Main Content</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="crawl-include-html"
                      checked={includeHtml}
                      onCheckedChange={setIncludeHtml}
                    />
                    <Label htmlFor="crawl-include-html">Include HTML Content</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCrawl} disabled={isLoading} className="w-full">
                {isLoading && activeTab === 'crawl' ? 'Starting Crawl...' : 'Start Crawling'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Batch Scrape Tab */}
        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <CardTitle>Batch Scrape Multiple URLs</CardTitle>
              <CardDescription>
                Scrape multiple URLs in one operation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {urls.map((batchUrl, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="url" 
                      placeholder="https://example.com" 
                      value={batchUrl} 
                      onChange={(e) => handleUpdateUrl(index, e.target.value)}
                      className="flex-1"
                    />
                    {urls.length > 1 && (
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleRemoveUrl(index)}
                      >
                        &#10005;
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button variant="outline" onClick={handleAddUrl} className="w-full">
                  Add URL
                </Button>
                
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="batch-main-content"
                      checked={onlyMainContent}
                      onCheckedChange={setOnlyMainContent}
                    />
                    <Label htmlFor="batch-main-content">Only Extract Main Content</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="batch-include-html"
                      checked={includeHtml}
                      onCheckedChange={setIncludeHtml}
                    />
                    <Label htmlFor="batch-include-html">Include HTML Content</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBatchScrape} disabled={isLoading} className="w-full">
                {isLoading && activeTab === 'batch' ? 'Processing...' : 'Batch Scrape URLs'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Check Status Tab */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Check Job Status</CardTitle>
              <CardDescription>
                Check the status of a crawl or batch scrape job
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="job-id">Job ID</Label>
                <Input
                  id="job-id"
                  placeholder="Enter job ID" 
                  value={jobId} 
                  onChange={(e) => setJobId(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCheckStatus} disabled={isLoading} className="w-full">
                {isLoading && activeTab === 'status' ? 'Checking...' : 'Check Status'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* Results Display */}
      <div className="space-y-8">
        {/* Scrape Result */}
        {scrapeResult && (
          <Card>
            <CardHeader>
              <CardTitle>Scrape Result</CardTitle>
              <CardDescription>
                Content extracted from {url}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none dark:prose-invert">
                {scrapeResult.success === false ? (
                  <p className="text-red-500">Error: {scrapeResult.error}</p>
                ) : (
                  <>
                    {console.log('Rendering scrapeResult:', scrapeResult)}
                    {scrapeResult.data?.markdown && (
                      <div className="whitespace-pre-wrap">
                        <h3 className="text-lg font-medium mb-2">Markdown Content:</h3>
                        <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                          {scrapeResult.data.markdown}
                        </div>
                      </div>
                    )}
                    
                    {/* Add fallback if data structure is different */}
                    {!scrapeResult.data?.markdown && scrapeResult.markdown && (
                      <div className="whitespace-pre-wrap">
                        <h3 className="text-lg font-medium mb-2">Markdown Content:</h3>
                        <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                          {scrapeResult.markdown}
                        </div>
                      </div>
                    )}

                    {/* Debug output to see entire scrapeResult */}
                    <div className="mt-4 border-t pt-4">
                      <h3 className="text-lg font-medium mb-2">Debug Output:</h3>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                        {JSON.stringify(scrapeResult, null, 2)}
                      </pre>
                    </div>
                    
                    {scrapeResult.data?.links && scrapeResult.data.links.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-lg font-medium mb-2">Links Found:</h3>
                        <ul className="space-y-1">
                          {scrapeResult.data.links.map((link, index) => (
                            <li key={index}>
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {link.text || link.url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Crawl Result */}
        {crawlResult && (
          <Card>
            <CardHeader>
              <CardTitle>Crawl Job Started</CardTitle>
              <CardDescription>
                {crawlResult.message}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {crawlResult.success ? (
                <div>
                  <p><strong>Job ID:</strong> {crawlResult.jobId}</p>
                  {crawlResult.status && <p><strong>Status:</strong> {crawlResult.status}</p>}
                  <p className="mt-4">Use the &quot;Check Status&quot; tab to monitor the progress of this job.</p>
                </div>
              ) : (
                <p className="text-red-500">Error: {crawlResult.error}</p>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Batch Result */}
        {batchResult && (
          <Card>
            <CardHeader>
              <CardTitle>Batch Scrape Job Started</CardTitle>
              <CardDescription>
                {batchResult.message}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {batchResult.success ? (
                <div>
                  <p><strong>Job ID:</strong> {batchResult.jobId}</p>
                  {batchResult.status && <p><strong>Status:</strong> {batchResult.status}</p>}
                  <p className="mt-4">Use the &quot;Check Status&quot; tab to monitor the progress of this job.</p>
                </div>
              ) : (
                <p className="text-red-500">Error: {batchResult.error}</p>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Crawl Status */}
        {crawlStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Job Status</CardTitle>
              <CardDescription>
                Status: {crawlStatus.status}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {crawlStatus.success ? (
                <div className="space-y-4">
                  {crawlStatus.data?.crawledUrls && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Crawled URLs ({crawlStatus.data.crawledUrls.length}):</h3>
                      <ul className="list-disc pl-5 space-y-1 max-h-40 overflow-y-auto">
                        {crawlStatus.data.crawledUrls.map((url, index) => (
                          <li key={index}>
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {crawlStatus.data?.pendingUrls && crawlStatus.data.pendingUrls.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Pending URLs ({crawlStatus.data.pendingUrls.length}):</h3>
                      <ul className="list-disc pl-5 space-y-1 max-h-40 overflow-y-auto">
                        {crawlStatus.data.pendingUrls.map((url, index) => (
                          <li key={index}>{url}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {crawlStatus.data?.failedUrls && crawlStatus.data.failedUrls.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Failed URLs ({crawlStatus.data.failedUrls.length}):</h3>
                      <ul className="list-disc pl-5 space-y-1 max-h-40 overflow-y-auto">
                        {crawlStatus.data.failedUrls.map((url, index) => (
                          <li key={index}>{url}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {crawlStatus.data?.documents && crawlStatus.data.documents.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Documents ({crawlStatus.data.documents.length}):</h3>
                      <div className="space-y-4">
                        {crawlStatus.data.documents.map((doc, index) => (
                          <div key={index} className="border p-4 rounded-md">
                            <h4 className="font-medium mb-2">{doc.url}</h4>
                            {doc.data.markdown && (
                              <div className="bg-gray-100 p-2 rounded-md mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap text-sm">
                                {doc.data.markdown.substring(0, 300)}
                                {doc.data.markdown.length > 300 && '...'}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-red-500">Error: {crawlStatus.error}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleCheckStatus} variant="outline">
                Refresh Status
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
      
      <div className="mt-12 bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Getting Started with Firecrawl</h2>
        
        <div className="prose max-w-none">
          <p>
            To use this demo with real Firecrawl functionality, you need to:
          </p>
          
          <ol className="list-decimal pl-5 space-y-2 my-4">
            <li>Sign up for a Firecrawl account at <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer">firecrawl.dev</a></li>
            <li>Get your API key from the dashboard</li>
            <li>Add your API key to the <code>.env.local</code> file:</li>
          </ol>
          
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            FIRECRAWL_API_KEY=&quot;fc-your-api-key-here&quot;
          </pre>
          
          <p className="mt-4">
            Once you&apos;ve set up your API key, the demo will use the real Firecrawl API to scrape and crawl websites.
          </p>
        </div>
      </div>
    </div>
  );
}
