
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface BatteryTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// قائمة أنواع البطاريات الشائعة
const commonBatteryTypes = [
  "AA",
  "AAA", 
  "C",
  "D",
  "9V",
  "CR2032",
  "CR2016",
  "LR44",
  "A23",
  "CR123A",
  "18650",
  "21700",
  "26650",
  "بطارية سيارة",
  "بطارية دراجة نارية",
  "بطارية UPS",
  "بطارية شمسية"
];

export const BatteryTypeSelector = ({ value, onChange, placeholder = "اختر نوع البطارية" }: BatteryTypeSelectorProps) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customType, setCustomType] = useState("");

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      onChange(selectedValue);
    }
  };

  const handleCustomSubmit = () => {
    if (customType.trim()) {
      onChange(customType.trim());
      setCustomType("");
      setIsCustom(false);
    }
  };

  if (isCustom) {
    return (
      <div className="flex gap-2">
        <Input
          placeholder="أدخل نوع البطارية"
          value={customType}
          onChange={(e) => setCustomType(e.target.value)}
          style={{ fontFamily: 'Tajawal, sans-serif' }}
          onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
        />
        <Button onClick={handleCustomSubmit} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
        <Button onClick={() => setIsCustom(false)} variant="outline" size="sm">
          إلغاء
        </Button>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent dir="rtl">
        {commonBatteryTypes.map((type) => (
          <SelectItem key={type} value={type} style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {type}
          </SelectItem>
        ))}
        <SelectItem value="custom" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            إضافة نوع جديد
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
