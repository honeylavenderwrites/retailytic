import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Table, ArrowRight, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useDataStore } from "@/store/dataStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const sampleRawData = [
  { row: 1, original: 'ANUSMRITI', parsed: { type: 'Customer', name: 'Anusmriti', productCode: '—' } },
  { row: 2, original: 'BELT HALF PANT | 9002 | Pcs | 1', parsed: { type: 'Product', name: 'Belt Half Pant', productCode: '9002' } },
  { row: 3, original: 'SHRUTI', parsed: { type: 'Customer', name: 'Shruti', productCode: '—' } },
  { row: 4, original: 'SILK TOP | 6112-2 | Pcs | 1', parsed: { type: 'Product', name: 'Silk Top', productCode: '6112-2' } },
  { row: 5, original: 'BELT HALF PANT | 9002 | Pcs | 1', parsed: { type: 'Product', name: 'Belt Half Pant', productCode: '9002' } },
  { row: 6, original: 'CASH PARTY', parsed: { type: 'Customer', name: 'Cash Party (Walk-in)', productCode: '—' } },
  { row: 7, original: 'SHOES | 9806-2 | Pair | 1', parsed: { type: 'Product', name: 'Shoes', productCode: '9806-2' } },
];

export default function DataManagement() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setAnalysisData, dataSource } = useDataStore();
  const { toast } = useToast();

  const cleaningStats = [
    { label: 'Total Rows Parsed', value: '5,247', icon: Table },
    { label: 'Customer Records', value: '1,247', icon: CheckCircle },
    { label: 'Product Records', value: '3,845', icon: FileSpreadsheet },
    { label: 'Parsing Errors', value: '12', icon: AlertCircle },
  ];

  const handleFileUpload = async (file: File) => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .csv or .xlsx file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('analyze-sales', {
        body: formData,
      });

      if (error) throw error;

      if (data && data.success) {
        setAnalysisData(data);
        setUploadResult({ success: true, message: `Successfully analyzed ${data.summary?.rowCount || 0} rows` });
        toast({
          title: "Upload successful!",
          description: `Analyzed ${data.summary?.rowCount || 0} rows from ${file.name}`,
        });
      } else {
        throw new Error(data?.error || 'Analysis failed');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadResult({ success: false, message: err.message || 'Upload failed' });
      toast({
        title: "Upload failed",
        description: err.message || "Failed to analyze the file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="animate-slide-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data Management</h1>
        <p className="text-sm text-muted-foreground">Upload, clean & inspect your sales data pipeline</p>
        {dataSource !== 'mock' && (
          <p className="mt-1 text-xs text-primary font-medium">✓ Using uploaded data</p>
        )}
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-card'
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-card-foreground">Analyzing your data...</p>
            <p className="mt-1 text-xs text-muted-foreground">This may take a moment for large files</p>
          </>
        ) : (
          <>
            <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium text-card-foreground">Drop your sales data file here</p>
            <p className="mt-1 text-xs text-muted-foreground">Supports XLSX, CSV — Max 50MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleBrowse}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse Files
            </button>
          </>
        )}
        {uploadResult && (
          <div className={`mt-4 rounded-md px-4 py-2 text-sm ${uploadResult.success ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {uploadResult.message}
          </div>
        )}
      </div>

      {/* Only show stats and transparency sections after data upload */}
      {dataSource !== 'mock' && (
        <>
          {/* Cleaning Stats */}
          <div className="grid grid-cols-4 gap-4">
            {cleaningStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 rounded-lg border bg-card p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold text-card-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Data Transparency */}
          <div className="rounded-lg border bg-card">
            <div className="border-b p-4">
              <h3 className="text-sm font-semibold text-card-foreground">Data Parsing Transparency</h3>
              <p className="text-xs text-muted-foreground">How raw rows are separated into customer & product records</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase text-muted-foreground">
                    <th className="px-4 py-3 text-left font-medium">Row</th>
                    <th className="px-4 py-3 text-left font-medium">Raw Input</th>
                    <th className="w-8 px-2 py-3" />
                    <th className="px-4 py-3 text-left font-medium">Detected Type</th>
                    <th className="px-4 py-3 text-left font-medium">Parsed Name</th>
                    <th className="px-4 py-3 text-left font-medium">Product Code</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleRawData.map((row) => (
                    <tr key={row.row} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.row}</td>
                      <td className="px-4 py-3 font-mono text-xs text-card-foreground">{row.original}</td>
                      <td className="px-2 py-3">
                        <ArrowRight className="h-3.5 w-3.5 text-primary" />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.parsed.type === 'Customer' ? 'bg-info/15 text-info' : 'bg-primary/15 text-primary'
                        }`}>
                          {row.parsed.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-card-foreground">{row.parsed.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-primary">{row.parsed.productCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Processing Pipeline */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground">Processing Pipeline</h3>
            <p className="mb-4 text-xs text-muted-foreground">How your data flows through Retailytics</p>
            <div className="flex flex-wrap items-center gap-2">
              {['Raw Upload', 'Row Classification', 'Customer Extraction', 'Product Normalization', 'Code Assignment', 'Analytics Ready'].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </div>
                    <span className="whitespace-nowrap text-xs font-medium text-card-foreground">{step}</span>
                  </div>
                  {i < 5 && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
