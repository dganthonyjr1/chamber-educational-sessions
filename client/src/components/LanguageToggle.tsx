import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      size="sm"
      className="gap-2 text-white hover:text-[#ff006e]"
    >
      <Languages className="h-4 w-4" />
      <span className="font-semibold">{language === "en" ? "ES" : "EN"}</span>
    </Button>
  );
}
