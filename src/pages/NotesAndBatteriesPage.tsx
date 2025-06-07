
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyNote, Battery, Plus, Edit, Trash2, Search } from "lucide-react";
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
  price: number;
  stock: number;
  minStock: number;
  supplier: string;
}

const NotesAndBatteriesPage = () => {
  // Sticky Notes State
  const [notes, setNotes] = useState<StickyNote[]>([
    {
      id: "1",
      title: "ملاحظة مهمة",
      content: "تذكير بموعد تسليم الطلبية الكبيرة",
      color: "bg-yellow-200",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20"
    }
  ]);
  
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    color: "bg-yellow-200"
  });

  // Battery Types State
  const [batteryTypes, setBatteryTypes] = useState<BatteryType[]>([
    {
      id: "1",
      name: "AAA",
      description: "بطارية حجم صغير",
      price: 2.5,
      stock: 100,
      minStock: 20,
      supplier: "الشركة الرئيسية"
    },
    {
      id: "2",
      name: "AA",
      description: "بطارية حجم متوسط",
      price: 3.0,
      stock: 80,
      minStock: 15,
      supplier: "الشركة الرئيسية"
    }
  ]);

  const [newBatteryType, setNewBatteryType] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    minStock: 0,
    supplier: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [editingNote, setEditingNote] = useState<StickyNote | null>(null);
  const [editingBattery, setEditingBattery] = useState<BatteryType | null>(null);

  const noteColors = [
    { name: "أصفر", value: "bg-yellow-200" },
    { name: "أزرق", value: "bg-blue-200" },
    { name: "أخضر", value: "bg-green-200" },
    { name: "وردي", value: "bg-pink-200" },
    { name: "بنفسجي", value: "bg-purple-200" }
  ];

  // Sticky Notes Functions
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

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: "", content: "", color: "bg-yellow-200" });
    
    toast({
      title: "تمت الإضافة",
      description: "تمت إضافة الملاحظة بنجاح"
    });
  };

  const updateNote = () => {
    if (!editingNote) return;

    setNotes(prev => prev.map(note => 
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
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast({
      title: "تم الحذف",
      description: "تم حذف الملاحظة بنجاح"
    });
  };

  // Battery Types Functions
  const addBatteryType = () => {
    if (!newBatteryType.name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم نوع البطارية",
        variant: "destructive"
      });
      return;
    }

    const batteryType: BatteryType = {
      id: Date.now().toString(),
      ...newBatteryType
    };

    setBatteryTypes(prev => [...prev, batteryType]);
    setNewBatteryType({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      minStock: 0,
      supplier: ""
    });
    
    toast({
      title: "تمت الإضافة",
      description: "تمت إضافة نوع البطارية بنجاح"
    });
  };

  const updateBatteryType = () => {
    if (!editingBattery) return;

    setBatteryTypes(prev => prev.map(battery => 
      battery.id === editingBattery.id ? editingBattery : battery
    ));
    setEditingBattery(null);
    
    toast({
      title: "تم التحديث",
      description: "تم تحديث نوع البطارية بنجاح"
    });
  };

  const deleteBatteryType = (batteryId: string) => {
    setBatteryTypes(prev => prev.filter(battery => battery.id !== batteryId));
    toast({
      title: "تم الحذف",
      description: "تم حذف نوع البطارية بنجاح"
    });
  };

  const filteredBatteryTypes = batteryTypes.filter(battery =>
    battery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    battery.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <StickyNote className="w-4 h-4 ml-2" />
            الملاحظات الملصقة
          </TabsTrigger>
          <TabsTrigger value="batteries" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Battery className="w-4 h-4 ml-2" />
            أنواع البطاريات
          </TabsTrigger>
        </TabsList>

        {/* Sticky Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إضافة ملاحظة جديدة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="noteTitle" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  العنوان
                </Label>
                <Input
                  id="noteTitle"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="أدخل عنوان الملاحظة"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div>
                <Label htmlFor="noteContent" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المحتوى
                </Label>
                <Textarea
                  id="noteContent"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="أدخل محتوى الملاحظة"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                  rows={3}
                />
              </div>

              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>اللون</Label>
                <div className="flex gap-2 mt-2">
                  {noteColors.map((color) => (
                    <button
                      key={color.value}
                      className={`w-8 h-8 rounded-full border-2 ${color.value} ${
                        newNote.color === color.value ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      onClick={() => setNewNote({ ...newNote, color: color.value })}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <Button onClick={addNote} className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة ملاحظة
              </Button>
            </CardContent>
          </Card>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Card key={note.id} className={`${note.color} border-2`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {note.title}
                    </h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingNote(note)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {note.content}
                  </p>
                  <p className="text-xs text-gray-600">
                    آخر تحديث: {note.updatedAt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Battery Types Tab */}
        <TabsContent value="batteries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إضافة نوع بطارية جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم النوع</Label>
                  <Input
                    value={newBatteryType.name}
                    onChange={(e) => setNewBatteryType({ ...newBatteryType, name: e.target.value })}
                    placeholder="مثل: AAA, AA, D"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  />
                </div>

                <div>
                  <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</Label>
                  <Input
                    value={newBatteryType.description}
                    onChange={(e) => setNewBatteryType({ ...newBatteryType, description: e.target.value })}
                    placeholder="وصف نوع البطارية"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  />
                </div>

                <div>
                  <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>السعر</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newBatteryType.price || ""}
                    onChange={(e) => setNewBatteryType({ ...newBatteryType, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>المخزون الحالي</Label>
                  <Input
                    type="number"
                    value={newBatteryType.stock || ""}
                    onChange={(e) => setNewBatteryType({ ...newBatteryType, stock: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الحد الأدنى للمخزون</Label>
                  <Input
                    type="number"
                    value={newBatteryType.minStock || ""}
                    onChange={(e) => setNewBatteryType({ ...newBatteryType, minStock: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>المورد</Label>
                  <Input
                    value={newBatteryType.supplier}
                    onChange={(e) => setNewBatteryType({ ...newBatteryType, supplier: e.target.value })}
                    placeholder="اسم المورد"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  />
                </div>
              </div>

              <Button
                onClick={addBatteryType}
                className="w-full mt-4"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة نوع البطارية
              </Button>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن نوع بطارية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>

          {/* Battery Types List */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة أنواع البطاريات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</th>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</th>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>السعر</th>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>المخزون</th>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>المورد</th>
                      <th className="p-3 text-right font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBatteryTypes.map((battery) => (
                      <tr key={battery.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">{battery.name}</td>
                        <td className="p-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>{battery.description}</td>
                        <td className="p-3 font-bold text-green-600">{battery.price.toFixed(2)} ريال</td>
                        <td className="p-3">
                          <span className={`font-bold ${battery.stock <= battery.minStock ? 'text-red-600' : 'text-blue-600'}`}>
                            {battery.stock}
                          </span>
                          {battery.stock <= battery.minStock && (
                            <span className="text-red-600 text-xs block">تحت الحد الأدنى</span>
                          )}
                        </td>
                        <td className="p-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>{battery.supplier}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingBattery(battery)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteBatteryType(battery.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Note Dialog */}
      {editingNote && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تعديل الملاحظة
            </h3>
            <div className="space-y-4">
              <Input
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                placeholder="العنوان"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
              <Textarea
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                placeholder="المحتوى"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
                rows={3}
              />
              <div className="flex gap-2">
                {noteColors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded-full border-2 ${color.value} ${
                      editingNote.color === color.value ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    onClick={() => setEditingNote({ ...editingNote, color: color.value })}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={updateNote} className="flex-1">حفظ</Button>
                <Button variant="outline" onClick={() => setEditingNote(null)} className="flex-1">إلغاء</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Battery Dialog */}
      {editingBattery && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تعديل نوع البطارية
            </h3>
            <div className="space-y-4">
              <Input
                value={editingBattery.name}
                onChange={(e) => setEditingBattery({ ...editingBattery, name: e.target.value })}
                placeholder="اسم النوع"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
              <Input
                value={editingBattery.description}
                onChange={(e) => setEditingBattery({ ...editingBattery, description: e.target.value })}
                placeholder="الوصف"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
              <Input
                type="number"
                step="0.01"
                value={editingBattery.price}
                onChange={(e) => setEditingBattery({ ...editingBattery, price: parseFloat(e.target.value) || 0 })}
                placeholder="السعر"
              />
              <Input
                type="number"
                value={editingBattery.stock}
                onChange={(e) => setEditingBattery({ ...editingBattery, stock: parseInt(e.target.value) || 0 })}
                placeholder="المخزون"
              />
              <Input
                type="number"
                value={editingBattery.minStock}
                onChange={(e) => setEditingBattery({ ...editingBattery, minStock: parseInt(e.target.value) || 0 })}
                placeholder="الحد الأدنى"
              />
              <Input
                value={editingBattery.supplier}
                onChange={(e) => setEditingBattery({ ...editingBattery, supplier: e.target.value })}
                placeholder="المورد"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
              <div className="flex gap-2">
                <Button onClick={updateBatteryType} className="flex-1">حفظ</Button>
                <Button variant="outline" onClick={() => setEditingBattery(null)} className="flex-1">إلغاء</Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NotesAndBatteriesPage;
