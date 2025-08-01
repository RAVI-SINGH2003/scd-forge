import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SCDGenerator = () => {
  const [requirements, setRequirements] = useState("");
  const [format, setFormat] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const handleReset = () => {
    setRequirements("");
    setFormat("");
    setShowDownload(false);
    setGeneratedFile(null);
  };

  const handleGenerate = async () => {
    if (!requirements.trim() || !format) {
      toast({
        title: "Missing Information",
        description: "Please provide requirements and select a format.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setShowDownload(false);

    // Mock API call
    setTimeout(() => {
      setIsGenerating(false);
      setShowDownload(true);
      setGeneratedFile(`scd-document.${format}`);
      toast({
        title: "SCD Generated Successfully",
        description: `Your ${format.toUpperCase()} file is ready for download.`,
      });
    }, 3000);
  };

  const handleDownload = () => {
    if (!generatedFile) return;

    // Create mock file content based on format
    let content = "";
    let mimeType = "";

    switch (format) {
      case "md":
        content = `# Software Configuration Document\n\n## Requirements\n\n${requirements}\n\n## Generated on\n${new Date().toLocaleDateString()}`;
        mimeType = "text/markdown";
        break;
      case "csv":
        content = `Requirement,Description,Date\n"SCD Requirements","${requirements.replace(/"/g, '""')}","${new Date().toLocaleDateString()}"`;
        mimeType = "text/csv";
        break;
      case "xlsx":
        content = `Requirements,${requirements},Generated on ${new Date().toLocaleDateString()}`;
        mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = generatedFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `${generatedFile} has been downloaded.`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold text-foreground">SCD Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Generate Software Configuration Documents in your preferred format
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Document Configuration</CardTitle>
            <CardDescription>
              Enter your requirements and select the output format to generate your SCD
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Requirements Section */}
              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-sm font-medium">
                  Requirements
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="Enter your software configuration requirements here..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <Label htmlFor="format" className="text-sm font-medium">
                  Format
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select the format to download SCDs
                </p>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="md">Markdown (.md)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isGenerating}
                className="flex-1"
              >
                Reset
              </Button>
              
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !requirements.trim() || !format}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>

              {showDownload && (
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};