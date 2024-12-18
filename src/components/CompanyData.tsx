import { Card } from "@/components/ui/card";

interface CompanyDataProps {
  data: {
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
        <div className="space-y-4">
          {data.products.map((product, index) => (
            <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
              <h4 className="font-medium text-primary">{product.name}</h4>
              <p className="text-muted-foreground mt-1">{product.description}</p>
              {product.features && (
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="text-muted-foreground text-sm">{feature}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 glass-morphism">
          <h3 className="text-lg font-semibold mb-2">Activities</h3>
          <div className="space-y-4">
            {data.activity.map((activity, index) => (
              <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                <h4 className="font-medium text-primary">{activity.type}</h4>
                <p className="text-muted-foreground mt-1">{activity.description}</p>
                {activity.regions && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Regions: {activity.regions.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 glass-morphism">
          <h3 className="text-lg font-semibold mb-2">Industries</h3>
          <div className="space-y-4">
            {data.industry.map((industry, index) => (
              <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                <h4 className="font-medium text-primary">{industry.sector}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Subsectors: {industry.subsectors.join(', ')}
                </p>
                {industry.marketPosition && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Market Position: {industry.marketPosition}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 glass-morphism">
        <h3 className="text-lg font-semibold mb-2">Financial Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.financials.revenue && (
              <div>
                <h4 className="font-medium">Revenue</h4>
                <p className="text-muted-foreground">{data.financials.revenue}</p>
              </div>
            )}
            {data.financials.employees && (
              <div>
                <h4 className="font-medium">Employees</h4>
                <p className="text-muted-foreground">{data.financials.employees}</p>
              </div>
            )}
            {data.financials.marketCap && (
              <div>
                <h4 className="font-medium">Market Cap</h4>
                <p className="text-muted-foreground">{data.financials.marketCap}</p>
              </div>
            )}
            {data.financials.stockInfo && (
              <div>
                <h4 className="font-medium">Stock Information</h4>
                <p className="text-muted-foreground">{data.financials.stockInfo}</p>
              </div>
            )}
          </div>
          {data.financials.growthMetrics && (
            <div>
              <h4 className="font-medium mb-2">Growth Metrics</h4>
              <ul className="list-disc list-inside space-y-1">
                {data.financials.growthMetrics.map((metric, index) => (
                  <li key={index} className="text-muted-foreground">{metric}</li>
                ))}
              </ul>
            </div>
          )}
          {data.financials.keyFinancials && (
            <div>
              <h4 className="font-medium mb-2">Key Financials</h4>
              <ul className="list-disc list-inside space-y-1">
                {data.financials.keyFinancials.map((financial, index) => (
                  <li key={index} className="text-muted-foreground">{financial}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 glass-morphism">
          <h3 className="text-lg font-semibold mb-2">Leadership</h3>
          <div className="space-y-3">
            {data.leadership.map((leader, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{leader.name}</span>
                <span className="text-muted-foreground text-sm">{leader.position}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 glass-morphism">
          <h3 className="text-lg font-semibold mb-2">Locations</h3>
          <div className="space-y-4">
            {data.locations.map((location, index) => (
              <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
                <h4 className="font-medium text-primary">{location.type}</h4>
                <p className="text-muted-foreground text-sm">{location.address}</p>
                <p className="text-muted-foreground text-sm">{location.country}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 glass-morphism">
        <h3 className="text-lg font-semibold mb-2">Website & Social Media</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">Website</h4>
            <a 
              href={data.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline transition-all"
            >
              {data.website}
            </a>
          </div>
          {Object.entries(data.socialMedia).map(([platform, url]) => (
            url && (
              <div key={platform}>
                <h4 className="font-medium capitalize">{platform}</h4>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline transition-all"
                >
                  {url}
                </a>
              </div>
            )
          ))}
        </div>
      </Card>

      <Card className="p-6 glass-morphism">
        <h3 className="text-lg font-semibold mb-2">Certifications</h3>
        <ul className="list-disc list-inside space-y-2">
          {data.certifications.map((cert, index) => (
            <li key={index} className="text-muted-foreground">{cert}</li>
          ))}
        </ul>
      </Card>

      <Card className="p-6 glass-morphism">
        <h3 className="text-lg font-semibold mb-2">Sources</h3>
        <ul className="list-disc list-inside space-y-2">
          {data.sources.map((source, index) => (
            <li key={index} className="text-muted-foreground">
              {source.startsWith('http') ? (
                <a 
                  href={source} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline transition-all"
                >
                  {source}
                </a>
              ) : (
                source
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default CompanyData;