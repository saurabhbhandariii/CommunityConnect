import { useState } from "react";
import Header from "@/components/header";
import RideShare from "@/components/ride-share";
import ItemShare from "@/components/item-share";
import HelpRequests from "@/components/help-requests";
import QuickActions from "@/components/quick-actions";
import MobileNav from "@/components/mobile-nav";
import { Car, Package, HandHeart } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"rides" | "items" | "help">("rides");

  const tabs = [
    { id: "rides" as const, label: "Ride Share", icon: Car, color: "uni-blue" },
    { id: "items" as const, label: "Share Items", icon: Package, color: "trust-green" },
    { id: "help" as const, label: "Get Help", icon: HandHeart, color: "energy-orange" },
  ];

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />
      
      {/* Service Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? `border-${tab.color} text-${tab.color}`
                      : "border-transparent text-neutral-medium hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "rides" && <RideShare />}
        {activeTab === "items" && <ItemShare />}
        {activeTab === "help" && <HelpRequests />}
      </main>

      <QuickActions onQuickAction={setActiveTab} />
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
