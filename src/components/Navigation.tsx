
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navigation = () => {
  const [language, setLanguage] = useState("ar");

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-blue-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === "ar" ? "EN" : "عربي"}
            </Button>
          </div>
          
          <h1 className="text-xl font-bold text-blue-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            متجر البطاريات المتقدم
          </h1>
        </div>
      </div>
    </nav>
  );
};
