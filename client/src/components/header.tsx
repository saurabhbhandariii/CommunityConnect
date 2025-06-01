import { Bell, ChevronDown, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-uni-blue rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">UniShare</h1>
              <p className="text-xs neutral-medium">Graphic Era University</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="relative p-2">
              <Bell className="w-5 h-5 neutral-medium" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-energy-orange text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarImage 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Student profile" 
                />
                <AvatarFallback>SB</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                Saurabh B.
              </span>
              <ChevronDown className="w-3 h-3 neutral-medium" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
