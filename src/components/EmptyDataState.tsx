import { Upload, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyDataStateProps {
  title: string;
  description: string;
}

export default function EmptyDataState({ title, description }: EmptyDataStateProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
        <Upload className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      <button
        onClick={() => navigate("/data")}
        className="mt-6 flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Upload Data
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
