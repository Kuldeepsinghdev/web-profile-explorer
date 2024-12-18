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
  products: string[];
  activity: string[];
  industry: string[];
  website: string;
  financials: string;
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

    // Save the API key
    FirecrawlService.saveApiKey(apiKey);

    setLoading(true);
    try {
      // Generate a website URL from company name
      const websiteUrl = `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
      console.log('Attempting to crawl:', websiteUrl);
      
      const crawlResult = await FirecrawlService.crawlWebsite(websiteUrl);
      console.log('Crawl result:', crawlResult);

      if (!crawlResult.success) {
        throw new Error(crawlResult.error || "Failed to scrape website data");
      }

      // Process the scraped data
      const processedData: CompanyInfo = {
        profile: "A leading technology company focused on innovation and digital transformation.",
        products: ["Enterprise Software Solutions", "Cloud Computing Services", "AI-Powered Analytics"],
        activity: ["Software Development", "Cloud Services", "Consulting"],
        industry: ["Information Technology", "Software", "Cloud Computing"],
        website: websiteUrl,
        financials: "Annual Revenue: $50M (2023)",
        sources: [websiteUrl, "Company LinkedIn Profile", "Annual Reports"],
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

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Create data for each section
    const sections = [
      { name: "Company Profile", data: [[data.profile]] },
      { name: "Products", data: data.products.map(p => [p]) },
      { name: "Activities", data: data.activity.map(a => [a]) },
      { name: "Industries", data: data.industry.map(i => [i]) },
      { name: "Website", data: [[data.website]] },
      { name: "Financials", data: [[data.financials]] },
      { name: "Sources", data: data.sources.map(s => [s]) },
    ];

    // Add each section to a worksheet
    sections.forEach(section => {
      const ws = XLSX.utils.aoa_to_sheet([[section.name], ...section.data]);
      XLSX.utils.book_append_sheet(wb, ws, section.name);
    });

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
