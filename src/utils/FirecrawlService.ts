import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      console.log('Attempting to crawl:', url);
      const apiKey = this.getApiKey();
      if (!apiKey) {
        return { success: false, error: 'API key not found' };
      }

      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const crawlResponse = await this.firecrawlApp.crawlUrl(url, {
        limit: 100,
        scrapeOptions: {
          formats: ['markdown', 'html'],
          // Remove the selectors property as it's not supported
          // Instead, we'll process the HTML content after crawling
          waitForSelector: '.about-us, .company-info, .products, .services, .team, .contact-us',
          includeSelectors: [
            '.about-us',
            '.company-info',
            '.products',
            '.services',
            '.team',
            '.contact-us',
            'meta[name="description"]',
            '.social-media',
            '.locations'
          ]
        }
      }) as CrawlResponse;

      if (!crawlResponse.success) {
        console.error('Crawl failed:', (crawlResponse as ErrorResponse).error);
        return { 
          success: false, 
          error: (crawlResponse as ErrorResponse).error || 'Failed to crawl website' 
        };
      }

      // Process the crawled data
      const processedData = await this.processScrapedData(crawlResponse.data, url);
      console.log('Processed data:', processedData);

      return { 
        success: true,
        data: processedData
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }

  private static async processScrapedData(rawData: any[], baseUrl: string) {
    // Extract company name from URL
    const companyName = baseUrl.replace(/^https?:\/\//, '').split('.')[0];

    // Use additional APIs to enrich the data
    const enrichedData = {
      profile: this.extractProfile(rawData),
      products: this.extractProducts(rawData),
      activity: this.extractActivities(rawData),
      industry: [{
        sector: this.extractIndustry(rawData),
        subsectors: this.extractSubsectors(rawData),
        marketPosition: this.extractMarketPosition(rawData)
      }],
      website: baseUrl,
      financials: await this.enrichFinancialData(companyName),
      leadership: this.extractLeadership(rawData),
      locations: this.extractLocations(rawData),
      socialMedia: this.extractSocialMedia(rawData),
      certifications: this.extractCertifications(rawData),
      sources: [baseUrl, ...this.extractSources(rawData)]
    };

    return enrichedData;
  }

  private static extractProfile(data: any[]): string {
    // Extract profile from meta description or about section
    const description = data.find(d => d.type === 'meta' && d.name === 'description')?.content;
    return description || 'Company profile information not available';
  }

  private static extractProducts(data: any[]): Array<{ name: string; description: string; features?: string[] }> {
    // Extract products and services information
    const productsData = data.filter(d => 
      d.selector?.includes('products') || 
      d.selector?.includes('services')
    );

    return productsData.map(p => ({
      name: p.title || 'Product',
      description: p.content || 'Description not available',
      features: p.features || []
    }));
  }

  private static extractActivities(data: any[]): Array<{ type: string; description: string; regions?: string[] }> {
    // Extract business activities
    const activitiesData = data.filter(d => 
      d.selector?.includes('activities') || 
      d.selector?.includes('operations')
    );

    return activitiesData.map(a => ({
      type: a.title || 'Business Activity',
      description: a.content || 'Description not available',
      regions: a.regions || ['Global']
    }));
  }

  private static extractIndustry(data: any[]): string {
    // Extract industry information
    const industryData = data.find(d => d.selector?.includes('industry'));
    return industryData?.content || 'Industry information not available';
  }

  private static extractSubsectors(data: any[]): string[] {
    // Extract subsector information
    const subsectorData = data.filter(d => d.selector?.includes('subsector'));
    return subsectorData.map(s => s.content) || ['Subsector information not available'];
  }

  private static extractMarketPosition(data: any[]): string {
    // Extract market position information
    const positionData = data.find(d => d.selector?.includes('market-position'));
    return positionData?.content || 'Market position information not available';
  }

  private static async enrichFinancialData(companyName: string) {
    // This would typically call a financial data API
    // For now, return placeholder data
    return {
      revenue: 'Financial information not available',
      employees: 'Employee count not available',
      marketCap: 'Market cap not available',
      stockInfo: 'Stock information not available',
      growthMetrics: ['Growth metrics not available'],
      keyFinancials: ['Key financials not available']
    };
  }

  private static extractLeadership(data: any[]): Array<{ name: string; position: string }> {
    // Extract leadership information
    const leadershipData = data.filter(d => 
      d.selector?.includes('leadership') || 
      d.selector?.includes('team')
    );

    return leadershipData.map(l => ({
      name: l.name || 'Name not available',
      position: l.position || 'Position not available'
    }));
  }

  private static extractLocations(data: any[]): Array<{ type: string; address: string; country: string }> {
    // Extract location information
    const locationData = data.filter(d => 
      d.selector?.includes('locations') || 
      d.selector?.includes('offices')
    );

    return locationData.map(l => ({
      type: l.type || 'Office',
      address: l.address || 'Address not available',
      country: l.country || 'Country not available'
    }));
  }

  private static extractSocialMedia(data: any[]): { linkedin?: string; twitter?: string; facebook?: string } {
    // Extract social media links
    const socialData = data.filter(d => d.selector?.includes('social'));
    
    return {
      linkedin: socialData.find(s => s.url?.includes('linkedin'))?.url,
      twitter: socialData.find(s => s.url?.includes('twitter'))?.url,
      facebook: socialData.find(s => s.url?.includes('facebook'))?.url
    };
  }

  private static extractCertifications(data: any[]): string[] {
    // Extract certification information
    const certData = data.filter(d => 
      d.selector?.includes('certifications') || 
      d.selector?.includes('awards')
    );

    return certData.map(c => c.content) || ['Certification information not available'];
  }

  private static extractSources(data: any[]): string[] {
    // Extract source URLs
    return data
      .filter(d => d.url)
      .map(d => d.url)
      .filter((url: string) => url.startsWith('http'));
  }
}