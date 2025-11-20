import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@core/lib/utils";

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in",
  {
    variants: {
      variant: {
        default: "bg-background border-border text-foreground",
        success:
          "bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-900 dark:text-green-100",
        destructive: "bg-destructive border-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  message: string;
  onClose?: () => void;
}

export function Toast({ className, variant, message, onClose, ...props }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className={cn(toastVariants({ variant }), className)} {...props}>
      {variant === "success" && <CheckCircle className="h-5 w-5" />}
      {variant === "destructive" && <AlertCircle className="h-5 w-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="ml-auto rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
