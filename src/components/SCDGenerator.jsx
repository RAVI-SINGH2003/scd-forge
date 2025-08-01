import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Paper
} from "@mui/material";
import {
  Description,
  Refresh,
  Build,
  Download
} from "@mui/icons-material";

export const SCDGenerator = () => {
  const [requirements, setRequirements] = useState("");
  const [format, setFormat] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [generatedFile, setGeneratedFile] = useState(null);

  const handleReset = () => {
    setRequirements("");
    setFormat("");
    setShowDownload(false);
    setGeneratedFile(null);
  };

  const handleGenerate = async () => {
    if (!requirements.trim() || !format) {
      alert("Please provide requirements and select a format.");
      return;
    }

    setIsGenerating(true);
    setShowDownload(false);

    // Mock API call
    setTimeout(() => {
      setIsGenerating(false);
      setShowDownload(true);
      setGeneratedFile(`scd-document.${format}`);
      alert(`Your ${format.toUpperCase()} file is ready for download.`);
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

    alert(`${generatedFile} has been downloaded.`);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={0} sx={{ textAlign: "center", mb: 4, p: 3, backgroundColor: "transparent" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <Description sx={{ fontSize: 32, color: "#1976d2", mr: 1 }} />
            <Typography variant="h3" component="h1" sx={{ color: "#1976d2", fontWeight: "bold" }}>
              SCD Generator
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: "#666" }}>
            Generate Software Configuration Documents in your preferred format
          </Typography>
        </Paper>

        {/* Main Card */}
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: "#1976d2", fontWeight: "bold" }}>
              Document Configuration
            </Typography>
            <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
              Enter your requirements and select the output format to generate your SCD
            </Typography>

            <Grid container spacing={4}>
              {/* Requirements Section */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
                  Requirements
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  placeholder="Enter your software configuration requirements here..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#e0e0e0"
                      },
                      "&:hover fieldset": {
                        borderColor: "#1976d2"
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2"
                      }
                    }
                  }}
                />
              </Grid>

              {/* Format Selection */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
                  Format
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                  Select the format to download SCDs
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Select format</InputLabel>
                  <Select
                    value={format}
                    label="Select format"
                    onChange={(e) => setFormat(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e0e0e0"
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2"
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2"
                      }
                    }}
                  >
                    <MenuItem value="md">Markdown (.md)</MenuItem>
                    <MenuItem value="csv">CSV (.csv)</MenuItem>
                    <MenuItem value="xlsx">Excel (.xlsx)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={isGenerating}
                startIcon={<Refresh />}
                sx={{
                  flex: 1,
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    borderColor: "#1565c0",
                    backgroundColor: "#e3f2fd"
                  }
                }}
              >
                Reset
              </Button>
              
              <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={isGenerating || !requirements.trim() || !format}
                startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <Build />}
                sx={{
                  flex: 1,
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0"
                  }
                }}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>

              {showDownload && (
                <Button
                  variant="contained"
                  onClick={handleDownload}
                  startIcon={<Download />}
                  sx={{
                    flex: 1,
                    backgroundColor: "#4caf50",
                    "&:hover": {
                      backgroundColor: "#45a049"
                    }
                  }}
                >
                  Download
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};