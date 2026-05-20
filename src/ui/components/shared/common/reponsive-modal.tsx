import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/components/ui/dialog";
import { ScrollArea } from "@/src/ui/components/ui/scroll-area";

type ResponsiveModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
};

const sizeClasses = {
  sm: "sm:max-w-[425px]",
  md: "sm:max-w-[600px]",
  lg: "sm:max-w-[800px]",
  xl: "sm:max-w-[1000px]",
  full: "sm:max-w-[95vw]",
};

export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
}: ResponsiveModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeClasses[size]} max-h-[95vh] w-auto max-w-[97vw] flex flex-col md:w-min p-0 overflow-auto`}>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold truncate">{title}</DialogTitle>
          {description && <DialogDescription className="truncate">{description}</DialogDescription>}
        </DialogHeader>
        
        {/* ScrollArea para garantir que forms longos não quebrem a tela */}
        <ScrollArea className="flex p-3">
          {children}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}