import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

const steps = [
  "Initializing data crawler...",
  "Scanning company website...",
  "Analyzing financial records...",
  "Processing market data...",
  "Extracting product information...",
  "Gathering leadership details...",
  "Validating company locations...",
  "Compiling industry analysis...",
  "Verifying social media presence...",
  "Finalizing report generation..."
];

const AnalyzerLoader = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 1000; // 1 second per step
    const totalSteps = steps.length;
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (totalSteps * 10));
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <Progress value={progress} className="w-full h-2" />
      <div className="text-center">
        <p className="text-lg font-medium text-primary">{steps[currentStep]}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  );
};

export default AnalyzerLoader;