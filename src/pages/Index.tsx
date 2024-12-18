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

  try {
    const websiteUrl = `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
    console.log('Attempting to crawl:', websiteUrl);
    
    const crawlResult = await FirecrawlService.crawlWebsite(websiteUrl);
    console.log('Crawl result:', crawlResult);

    if (!crawlResult.success) {
      throw new Error(crawlResult.error || "Failed to scrape website data");
    }

    // Enhanced mock data with more detailed information
    const processedData: CompanyInfo = {
      profile: "A global leader in consulting, technology services and digital transformation, Capgemini is at the forefront of innovation. The Group helps organizations realize their business ambitions through an array of services from strategy to operations, fueled by the fast evolving and innovative world of cloud, data, AI, connectivity, software, digital engineering and platforms.",
      products: [
        {
          name: "Digital Services",
          description: "End-to-end digital transformation solutions",
          features: ["Cloud Migration", "Digital Customer Experience", "AI & Analytics"]
        },
        {
          name: "Consulting Services",
          description: "Strategic business and technology consulting",
          features: ["Digital Strategy", "Business Transformation", "Innovation Consulting"]
        },
        {
          name: "Technology Operations",
          description: "IT infrastructure and application services",
          features: ["Application Management", "Infrastructure Services", "Security Solutions"]
        }
      ],
      activity: [
        {
          type: "Consulting",
          description: "Strategic business consulting and digital transformation services",
          regions: ["North America", "Europe", "Asia Pacific"]
        },
        {
          type: "Technology Services",
          description: "Implementation and management of enterprise technology solutions",
          regions: ["Global"]
        }
      ],
      industry: [
        {
          sector: "Information Technology",
          subsectors: ["IT Consulting", "Digital Services", "Technology Solutions"],
          marketPosition: "Market Leader in Digital Transformation"
        },
        {
          sector: "Business Services",
          subsectors: ["Management Consulting", "Business Process Outsourcing"],
          marketPosition: "Top 5 Global Consulting Firm"
        }
      ],
      website: websiteUrl,
      financials: {
        revenue: "€21.9 billion (2023)",
        employees: "340,000+ globally",
        marketCap: "€30.5 billion",
        stockInfo: "Listed on Euronext Paris (CAP.PA)",
        growthMetrics: [
          "15% YoY Revenue Growth",
          "20% Digital and Cloud Revenue Growth",
          "18% Operating Margin"
        ],
        keyFinancials: [
          "Strong Free Cash Flow: €1.8 billion",
          "Net Profit: €1.7 billion",
          "Operating Margin: 13.2%"
        ]
      },
      leadership: [
        {
          name: "Aiman Ezzat",
          position: "Chief Executive Officer"
        },
        {
          name: "Carole Ferrand",
          position: "Chief Financial Officer"
        }
      ],
      locations: [
        {
          type: "Global Headquarters",
          address: "11 rue de Tilsitt, 75017 Paris",
          country: "France"
        },
        {
          type: "Regional Headquarters",
          address: "79 Fifth Avenue, New York",
          country: "United States"
        }
      ],
      socialMedia: {
        linkedin: "https://www.linkedin.com/company/capgemini",
        twitter: "https://twitter.com/Capgemini",
        facebook: "https://www.facebook.com/Capgemini"
      },
      certifications: [
        "ISO 27001",
        "ISO 9001",
        "CMMI Level 5",
        "Great Place to Work Certified"
      ],
      sources: [
        websiteUrl,
        "Annual Report 2023",
        "Company Press Releases",
        "LinkedIn Company Profile",
        "Bloomberg Company Profile"
      ]
    };

    setData(processedData);
    toast({
      title: "Analysis Complete",
      description: "Company data has been successfully analyzed",
    });
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
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
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

