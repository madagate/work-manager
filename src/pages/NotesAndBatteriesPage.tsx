
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyNote, Battery, Plus, Edit, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface BatteryType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
}

const mockNotes: StickyNote[] = [
  {
    id: "1",
    title: "ملاحظة مهمة",
    content: "تذكر متابعة العميل أحمد غداً",
    color: "yellow",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20"
  },
  {
    id: "2", 
    title: "معلومات المورد",
    content: "مورد البطاريات الجديد يقدم خصم 10%",
    color: "blue",
    createdAt: "2024-01-19",
    updatedAt: "2024-01-19"
  }
];

const mockBatteryTypes: BatteryType[] = [
  {
    id: "1",
    name: "بطاريات عادية",
    description: "بطاريات عادية للاستخدام اليومي",
    basePrice: 150,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: "2",
    name: "بطاريات جافة",
    description: "بطاريات جافة عالية الجودة",
    basePrice: 200,
    isActive: true,
    createdAt: "2024-01-01"
  }
];

const noteColors = [
  { value: "yellow", label: "أصفر", class: "bg-yellow-200" },
  { value: "blue", label: "أزرق", class: "bg-blue-200" },
  { value: "green", label: "أخضر", class: "bg-green-200" },
  { value: "pink", label: "وردي", class: "bg-pink-200" },
  { value: "purple", label: "بنفسجي", class: "bg-purple-200" }
];

const NotesAndBatteriesPage = () => {
  const [notes, setNotes] = useState<StickyNote[]>(mockNotes);
  const [batteryTypes, setBatteryTypes] = useState<BatteryType[]>(mockBatteryTypes);
  const [editingNote, setEditingNote] = useState<StickyNote | null>(null);
  const [editingBattery, setEditingBattery] = useState<BatteryType | null>(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    color: "yellow"
  });
  const [newBattery, setNewBattery] = useState({
    name: "",
    description: "",
    basePrice: 0
  });

  // Notes Functions
  const addNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء العنوان والمحتوى",
        variant: "destructive"
      });
      return;
    }

    const note: StickyNote = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      color: newNote.color,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "", color: "yellow" });

    toast({
      title: "تمت الإضافة",
      description: "تمت إضافة الملاحظة بنجاح"
    });
  };

  const updateNote = () => {
    if (!editingNote) return;

    setNotes(notes.map(note => 
      note.id === editingNote.id 
        ? { ...editingNote, updatedAt: new Date().toISOString().split('T')[0] }
        : note
    ));
    setEditingNote(null);

    toast({
      title: "تم التحديث",
      description: "تم تحديث الملاحظة بنجاح"
    });
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    toast({
      title: "تم الحذف",
      description: "تم حذف الملاحظة بنجاح"
    });
  };

  // Battery Types Functions
  const addBatteryType = () => {
    if (!newBattery.name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم نوع البطارية",
        variant: "destructive"
      });
      return;
    }

    const batteryType: BatteryType = {
      id: Date.now().toString(),
      name: newBattery.name,
      description: newBattery.description,
      basePrice: newBattery.basePrice,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBatteryTypes([batteryType, ...batteryTypes]);
    setNewBattery({ name: "", description: "", basePrice: 0 });

    toast({
      title: "تمت الإضافة",
      description: "تمت إضافة نوع البطارية بنجاح"
    });
  };

  const updateBatteryType = () => {
    if (!editingBattery) return;

    setBatteryTypes(batteryTypes.map(battery => 
      battery.id === editingBattery.id ? editingBattery : battery
    ));
    setEditingBattery(null);

    toast({
      title: "تم التحديث",
      description: "تم تحديث نوع البطارية بنجاح"
    });
  };

  const toggleBatteryStatus = (batteryId: string) => {
    setBatteryTypes(batteryTypes.map(battery => 
      battery.id === batteryId 
        ? { ...battery, isActive: !battery.isActive }
        : battery
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
          <CardTitle className="flex items-center gap-2 flex-row-reverse text-lg sm:text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <StickyNote className="w-4 h-4 sm:w-5 sm:h-5" />
            الملاحظات وأنواع البطاريات
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الملاحظات الملصقة
          </TabsTrigger>
          <TabsTrigger value="batteries" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            أنواع البطاريات
          </TabsTrigger>
        </TabsList>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          {/* Add New Note */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إضافة ملاحظة جديدة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="noteTitle" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</Label>
                <Input
                  id="noteTitle"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="عنوان الملاحظة"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>
              
              <div>
                <Label htmlFor="noteContent" style={{ fontFamily: 'Tajawal, sans-serif' }}>المحتوى</Label>
                <Textarea
                  id="noteContent"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="محتوى الملاحظة"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                  rows={3}
                />
              </div>

              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>اللون</Label>
                <div className="flex gap-2 mt-2">
                  {noteColors.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setNewNote({ ...newNote, color: color.value })}
                      className={`w-8 h-8 rounded ${color.class} border-2 ${
                        newNote.color === color.value ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <Button onClick={addNote} className="w-full">
                <Plus className="w-4 h-4 ml-2" />
                إضافة الملاحظة
              </Button>
            </CardContent>
          </Card>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map(note => (
              <Card
                key={note.id}
                className={`${noteColors.find(c => c.value === note.color)?.class} border-none shadow-md`}
              >
                <CardContent className="p-4">
                  {editingNote?.id === note.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingNote.title}
                        onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                        className="bg-white/70"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                      />
                      <Textarea
                        value={editingNote.content}
                        onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                        className="bg-white/70"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button onClick={updateNote} size="sm" className="flex-1">
                          <Save className="w-3 h-3 ml-1" />
                          حفظ
                        </Button>
                        <Button 
                          onClick={() => setEditingNote(null)} 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {note.title}
                      </h3>
                      <p className="text-sm mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {note.content}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">{note.createdAt}</span>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => setEditingNote(note)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => deleteNote(note.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Battery Types Tab */}
        <TabsContent value="batteries" className="space-y-6">
          {/* Add New Battery Type */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إضافة نوع بطارية جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batteryName" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم النوع</Label>
                  <Input
                    id="batteryName"
                    value={newBattery.name}
                    onChange={(e) => setNewBattery({ ...newBattery, name: e.target.value })}
                    placeholder="اسم نوع البطارية"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="batteryPrice" style={{ fontFamily: 'Tajawal, sans-serif' }}>السعر الأساسي</Label>
                  <Input
                    id="batteryPrice"
                    type="number"
                    value={newBattery.basePrice || ''}
                    onChange={(e) => setNewBattery({ ...newBattery, basePrice: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="batteryDescription" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</Label>
                <Textarea
                  id="batteryDescription"
                  value={newBattery.description}
                  onChange={(e) => setNewBattery({ ...newBattery, description: e.target.value })}
                  placeholder="وصف نوع البطارية"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                  rows={2}
                />
              </div>

              <Button onClick={addBatteryType} className="w-full">
                <Battery className="w-4 h-4 ml-2" />
                إضافة نوع البطارية
              </Button>
            </CardContent>
          </Card>

          {/* Battery Types List */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                قائمة أنواع البطاريات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batteryTypes.map(battery => (
                  <div
                    key={battery.id}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    {editingBattery?.id === battery.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            value={editingBattery.name}
                            onChange={(e) => setEditingBattery({ ...editingBattery, name: e.target.value })}
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          />
                          <Input
                            type="number"
                            value={editingBattery.basePrice || ''}
                            onChange={(e) => setEditingBattery({ ...editingBattery, basePrice: Number(e.target.value) })}
                          />
                        </div>
                        <Textarea
                          value={editingBattery.description}
                          onChange={(e) => setEditingBattery({ ...editingBattery, description: e.target.value })}
                          style={{ fontFamily: 'Tajawal, sans-serif' }}
                        />
                        <div className="flex gap-2">
                          <Button onClick={updateBatteryType} size="sm">
                            <Save className="w-3 h-3 ml-1" />
                            حفظ
                          </Button>
                          <Button 
                            onClick={() => setEditingBattery(null)} 
                            variant="outline" 
                            size="sm"
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {battery.name}
                            </h3>
                            <Badge variant={battery.isActive ? "default" : "secondary"}>
                              {battery.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {battery.description}
                          </p>
                          <p className="font-bold text-green-600">
                            {battery.basePrice.toLocaleString()} ريال
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => setEditingBattery(battery)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => toggleBatteryStatus(battery.id)}
                            variant="outline"
                            size="sm"
                            className={battery.isActive ? "text-red-600" : "text-green-600"}
                          >
                            {battery.isActive ? "إيقاف" : "تفعيل"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotesAndBatteriesPage;
