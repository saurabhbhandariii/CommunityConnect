import { Button } from "@/components/ui/button";
import { Car, Package, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface QuickActionsProps {
  onQuickAction: (tab: "rides" | "items" | "help") => void;
}

export default function QuickActions({ onQuickAction }: QuickActionsProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="flex flex-col space-y-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="w-14 h-14 bg-uni-blue hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => onQuickAction("rides")}
              >
                <Car className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Quick ride request</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="w-14 h-14 bg-trust-green hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => onQuickAction("items")}
              >
                <Package className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Quick item share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="w-14 h-14 bg-energy-orange hover:bg-yellow-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => onQuickAction("help")}
              >
                <AlertTriangle className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Emergency help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
