'use client'

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, RotateCw, Image as ImageIcon, FileText, Edit3 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';




export default function ImageConverter() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFormat, setOutputFormat] = useState('png');
  const [originalFormat, setOriginalFormat] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const outputFormats = [
    { value: 'png', label: 'PNG', mimeType: 'image/png' },
    { value: 'jpeg', label: 'JPG', mimeType: 'image/jpeg' },
    { value: 'webp', label: 'WebP', mimeType: 'image/webp' },
    { value: 'bmp', label: 'BMP', mimeType: 'image/bmp' },
    { value: 'gif', label: 'GIF', mimeType: 'image/gif' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setProcessedImage(null);
        
        // Extract original format from file type
        const mimeType = file.type;
        const format = outputFormats.find(f => f.mimeType === mimeType);
        setOriginalFormat(format ? format.label : 'Unknown');
        
        // Set original filename without extension
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        setFileName(nameWithoutExtension);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImage = () => {
    if (!originalImage || !canvasRef.current) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert to selected format
      const selectedFormat = outputFormats.find(f => f.value === outputFormat);
      const mimeType = selectedFormat?.mimeType || 'image/png';
      const quality = outputFormat === 'jpeg' ? 0.9 : undefined;
      
      const convertedDataUrl = canvas.toDataURL(mimeType, quality);
      setProcessedImage(convertedDataUrl);
      setIsProcessing(false);
    };
    
    img.src = originalImage;
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const selectedFormat = outputFormats.find(f => f.value === outputFormat);
    const extension = selectedFormat?.label.toLowerCase() || 'png';
    const finalFileName = fileName || `converted-image-${Date.now()}`;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `${finalFileName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetImage = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setOriginalFormat('');
    setOutputFormat('png');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Image Format Converter
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Convert your images between different formats in 3 simple steps
            </p>
          </div>

          {/* Upload Section */}
          {!originalImage && (
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Step 1: Upload Your Image</h3>
                    <p className="text-muted-foreground mb-4">
                      Choose any image file from your device
                    </p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button asChild size="lg" className="px-8">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-5 h-5 mr-2" />
                      Choose Image File
                    </label>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conversion Section */}
          {originalImage && (
            <div className="space-y-8">
              {/* Step 2: Select Format */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    Step 2: Choose Output Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-5 gap-4">
                    {outputFormats.map((format) => (
                      <Button
                        key={format.value}
                        variant={outputFormat === format.value ? "default" : "outline"}
                        onClick={() => setOutputFormat(format.value)}
                        className="h-16 flex-col"
                      >
                        <div className="text-lg font-bold">{format.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {format.value.toUpperCase()}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Convert & Download */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    Step 3: Convert & Download
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Original Image */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Original Image
                      </h4>
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <img
                          src={originalImage}
                          alt="Original"
                          className="w-full h-auto rounded"
                        />
                        <div className="mt-2 text-sm text-muted-foreground">
                          Format: <span className="font-medium">{originalFormat}</span>
                        </div>
                      </div>
                    </div>

                    {/* Converted Image */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Converted Image
                      </h4>
                      <div className="border rounded-lg p-4 bg-muted/30 min-h-[200px] flex flex-col justify-center">
                        {processedImage ? (
                          <>
                            <img
                              src={processedImage}
                              alt="Converted"
                              className="w-full h-auto rounded mb-3"
                            />
                            <div className="text-sm text-muted-foreground mb-3">
                              Format: <span className="font-medium">{outputFormat.toUpperCase()}</span>
                            </div>
                            
                            {/* Filename Input */}
                            <div className="mb-3">
                              <label className="text-xs font-medium mb-1 block">
                                File Name (optional)
                              </label>
                              <Input
                                type="text"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="Leave empty to use original name"
                                className="w-full"
                              />
                            </div>
                            
                            <Button
                              onClick={downloadImage}
                              className="w-full"
                              size="sm"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download {outputFormat.toUpperCase()} File
                            </Button>
                          </>
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">
                              Select format and click convert to see result
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Convert Button */}
                  {!processedImage && (
                    <div className="mt-6 text-center">
                      <Button
                        onClick={convertImage}
                        disabled={isProcessing}
                        size="lg"
                        className="px-8"
                      >
                        {isProcessing ? (
                          <>
                            <RotateCw className="w-5 h-5 mr-2 animate-spin" />
                            Converting...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-5 h-5 mr-2" />
                            Convert to {outputFormat.toUpperCase()}
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Reset Button */}
                  {processedImage && (
                    <div className="mt-6 text-center">
                      <Button
                        variant="outline"
                        onClick={resetImage}
                      >
                        <RotateCw className="w-4 h-4 mr-2" />
                        Convert Another Image
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info Section */}
          {!originalImage && (
            <Alert>
              <ImageIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Simple 3-Step Process:</strong> Upload → Choose Format → Convert & Download. 
                All processing happens locally in your browser for privacy and speed.
              </AlertDescription>
            </Alert>
          )}

          {/* SEO Content Section */}
          <section className="mt-16 prose prose-gray max-w-none">
            <div className="bg-muted/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Convert Your Images Instantly — No Software, No Uploads, Complete Privacy
              </h2>
              
              <p className="text-lg mb-6 leading-relaxed">
                Our Image Format Converter is a fast and secure online tool that lets you transform images between all popular formats including PNG, JPG, WebP, BMP, and GIF with just a few clicks.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-4">🚀 Why Choose Our Image Converter?</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary">100% Client-Side Processing</h4>
                      <p className="text-muted-foreground">
                        All conversion work happens directly in your browser for ultimate privacy and security — no file uploads, no cloud storage.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary">Super Fast Conversions</h4>
                      <p className="text-muted-foreground">
                        Modern browser APIs power instant conversions without waiting for uploads or downloads.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary">Supports All Major Formats</h4>
                      <p className="text-muted-foreground">
                        Easily switch between PNG, JPG, WebP, BMP, GIF — perfect for web, design, social media, and more.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary">No Sign-Up Required</h4>
                      <p className="text-muted-foreground">
                        Start converting right away with an intuitive, user-friendly interface.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-primary mb-4">🛠️ How It Works — Simple 3-Step Process</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary">1. Upload Your Image</h4>
                      <p className="text-muted-foreground">
                        Select one or more images from your device using drag-and-drop or file browse.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary">2. Choose Output Format</h4>
                      <p className="text-muted-foreground">
                        Pick your desired format — PNG, JPG, WebP, BMP, GIF — from the intuitive dropdown.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary">3. Convert & Download</h4>
                      <p className="text-muted-foreground">
                        Click convert and instantly download your new image. It's that easy!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-6 mb-6">
                <p className="font-medium text-primary">
                  This minimal workflow ensures you get fast, reliable results with no technical hassles — ideal for web developers, graphic designers, and anyone who needs quick image format conversions without installing bulky software.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-background rounded-lg p-6 border">
                  <h4 className="font-semibold text-primary mb-2">Built with HTML5 Canvas API</h4>
                  <p className="text-sm text-muted-foreground">
                    Modern browser technology ensures fast, reliable conversions
                  </p>
                </div>
                <div className="bg-background rounded-lg p-6 border">
                  <h4 className="font-semibold text-primary mb-2">Cross-Device Compatible</h4>
                  <p className="text-sm text-muted-foreground">
                    Works seamlessly on desktop, tablet, and mobile devices
                  </p>
                </div>
                <div className="bg-background rounded-lg p-6 border">
                  <h4 className="font-semibold text-primary mb-2">Quality Preservation</h4>
                  <p className="text-sm text-muted-foreground">
                    Maintains your image's original clarity and quality throughout conversion
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
}
