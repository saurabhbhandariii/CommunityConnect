import { Car, Package, HandHeart } from "lucide-react";

interface MobileNavProps {
  activeTab: "rides" | "items" | "help";
  onTabChange: (tab: "rides" | "items" | "help") => void;
}

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const tabs = [
    { id: "rides" as const, label: "Rides", icon: Car },
    { id: "items" as const, label: "Items", icon: Package },
    { id: "help" as const, label: "Help", icon: HandHeart },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg lg:hidden z-50">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                activeTab === tab.id ? "text-uni-blue" : "text-neutral-medium"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
