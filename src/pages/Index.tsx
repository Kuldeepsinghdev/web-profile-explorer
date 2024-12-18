import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import CompanyData from "@/components/CompanyData";
import { FirecrawlService } from "@/utils/FirecrawlService";
import * as XLSX from 'xlsx';
import { Download } from "lucide-react";
import AnalyzerLoader from "@/components/AnalyzerLoader";

interface CompanyInfo {
  profile: string;
  products: Array<{
    name: string;
    description: string;
    features?: string[];
  }>;
  activity: Array<{
    type: string;
    description: string;
    regions?: string[];
  }>;
  industry: Array<{
    sector: string;
    subsectors: string[];
    marketPosition?: string;
  }>;
  website: string;
  financials: {
    revenue?: string;
    employees?: string;
    marketCap?: string;
    stockInfo?: string;
    growthMetrics?: string[];
    keyFinancials?: string[];
  };
  leadership: Array<{
    name: string;
    position: string;
  }>;
  locations: Array<{
    type: string;
    address: string;
    country: string;
  }>;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  certifications: string[];
  sources: string[];
}

const Index = () => {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [model, setModel] = useState("gpt-4");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CompanyInfo | null>(null);

  const handleAnalyze = async () => {
    if (!companyName || !companyAddress || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    FirecrawlService.saveApiKey(apiKey);
    setLoading(true);
    setData(null);

    try {
      // Format company name for URL (remove spaces, special characters, convert to lowercase)
      const formattedCompanyName = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      
      // Try different common domain variations
      const possibleDomains = [
        `https://www.${formattedCompanyName}.com`,
        `https://${formattedCompanyName}.com`,
        `https://www.${formattedCompanyName}.co`,
        `https://${formattedCompanyName}.co`,
      ];

      let crawlResult = null;
      let success = false;

      // Try each domain until we get a successful result
      for (const websiteUrl of possibleDomains) {
        if (success) break;

        console.log('Attempting to crawl:', websiteUrl);
        
        // Add artificial delay for realistic analysis simulation
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 second delay
        
        crawlResult = await FirecrawlService.crawlWebsite(websiteUrl);
        console.log('Crawl result:', crawlResult);

        if (crawlResult.success) {
          success = true;
          setData(crawlResult.data);
          toast({
            title: "Analysis Complete",
            description: "Company data has been successfully analyzed",
          });
          break;
        }
      }

      if (!success) {
        throw new Error("Could not find company website or extract data");
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze company data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!data) return;

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Create a single worksheet with all sections
    const wsData = [
      ['Company Profile'],
      [data.profile],
      [''],  // Empty row for spacing
      
      ['Products & Services'],
      ...data.products.map(p => [p.name, p.description, p.features?.join(', ')]),
      [''],
      
      ['Activities'],
      ...data.activity.map(a => [a.type, a.description, a.regions?.join(', ')]),
      [''],
      
      ['Industries'],
      ...data.industry.map(i => [i.sector, i.subsectors.join(', '), i.marketPosition]),
      [''],
      
      ['Website'],
      [data.website],
      [''],
      
      ['Financial Information'],
      ['Revenue', data.financials.revenue],
      ['Employees', data.financials.employees],
      ['Market Cap', data.financials.marketCap],
      ['Stock Info', data.financials.stockInfo],
      ['Growth Metrics'],
      ...data.financials.growthMetrics?.map(m => ['', m]) || [],
      ['Key Financials'],
      ...data.financials.keyFinancials?.map(f => ['', f]) || [],
      [''],
      
      ['Leadership'],
      ...data.leadership.map(l => [l.name, l.position]),
      [''],
      
      ['Locations'],
      ...data.locations.map(l => [l.type, l.address, l.country]),
      [''],
      
      ['Social Media'],
      ['LinkedIn', data.socialMedia.linkedin],
      ['Twitter', data.socialMedia.twitter],
      ['Facebook', data.socialMedia.facebook],
      [''],
      
      ['Certifications'],
      ...data.certifications.map(c => [c]),
      [''],
      
      ['Sources'],
      ...data.sources.map(s => [s])
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Add some styling to the worksheet
    ws['!cols'] = [{ wch: 30 }, { wch: 50 }, { wch: 30 }];  // Set column widths
    
    XLSX.utils.book_append_sheet(wb, ws, 'Company Analysis');
    
    // Generate Excel file
    XLSX.writeFile(wb, `${companyName.replace(/\s+/g, '_')}_report.xlsx`);

    toast({
      title: "Success",
      description: "Report downloaded successfully",
    });
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight">Company Data Analyzer</h1>
          <p className="text-lg text-muted-foreground">
            Enter a company's name and address to analyze and extract key information
          </p>
        </div>

        <Card className="p-6 space-y-6 glass-morphism animate-fade-in">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Select LLM Model
              </label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="g-pt-4-turbo">GPT-4 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Firecrawl API Key
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Firecrawl API key"
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground mt-1">
                You'll need a Firecrawl API key to scrape website data
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Company Name
              </label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Company Address
              </label>
              <Input
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="Enter company address"
              />
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            className="w-full"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : "Analyze"}
          </Button>
        </Card>

        {loading && (
          <div className="my-8">
            <AnalyzerLoader />
          </div>
        )}

        {data && (
          <>
            <div className="flex justify-end">
              <Button
                onClick={handleDownload}
                className="mb-4"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
            <CompanyData data={data} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
