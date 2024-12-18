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

    setLoading(true);
    try {
      // Simulated API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setData({
        profile: "Sample company profile text describing the mission and vision.",
        products: ["Product 1", "Product 2", "Product 3"],
        activity: ["Manufacturing", "Research & Development"],
        industry: ["Technology", "Software"],
        website: "https://example.com",
        financials: "Revenue: $10M (2023)",
        sources: ["https://example.com", "https://example.com/about"],
      });

      toast({
        title: "Analysis Complete",
        description: "Company data has been successfully analyzed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze company data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                GPT API Key
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground mt-1">
                You can get your API key from the{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GPT Dashboard
                </a>
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

        {data && <CompanyData data={data} />}
      </div>
    </div>
  );
};

export default Index;