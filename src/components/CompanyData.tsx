import { Card } from "@/components/ui/card";

interface CompanyDataProps {
  data: {
    profile: string;
    products: string[];
    activity: string[];
    industry: string[];
    website: string;
    financials: string;
    sources: string[];
  };
}

const CompanyData = ({ data }: CompanyDataProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 glass-morphism">
        <h3 className="text-lg font-semibold mb-2">Company Profile</h3>
        <p className="text-muted-foreground">{data.profile}</p>
      </Card>

      <Card className="p-6 glass-morphism">
        <h3 className="text-lg font-semibold mb-2">Products & Services</h3>
        <ul className="list-disc list-inside space-y-2">
          {data.products.map((product, index) => (
            <li key={index} className="text-muted-foreground">{product}</li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 glass-morphism">
          <h3 className="text-lg font-semibold mb-2">Activities</h3>
          <ul className="list-disc list-inside space-y-2">
            {data.activity.map((activity, index) => (
              <li key={index} className="text-muted-foreground">{activity}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 glass-morphism">
          <h3 className="text-lg font-semibold mb-2">Industries</h3>
          <ul className="list-disc list-inside space-y-2">
            {data.industry.map((industry, index) => (
              <li key={index} className="text-muted-foreground">{industry}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6 glass-morphism">
        <h3 className="text-lg font-semibold mb-2">Website</h3>
        <a 
          href={data.website} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:underline transition-all"
        >
          {data.website}
        </a>
      </Card>

      <Card className="p-6 glass-morphism">
        <h3 className="text-lg font-semibold mb-2">Financial Information</h3>
        <p className="text-muted-foreground">{data.financials}</p>
      </Card>

      <Card className="p-6 glass-morphism">
        <h3 className="text-lg font-semibold mb-2">Sources</h3>
        <ul className="list-disc list-inside space-y-2">
          {data.sources.map((source, index) => (
            <li key={index} className="text-muted-foreground">
              <a 
                href={source} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline transition-all"
              >
                {source}
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default CompanyData;