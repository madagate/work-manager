
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Plus, Trash2, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: string;
}

const colors = [
  { name: "أصفر", value: "yellow", class: "bg-yellow-100 border-yellow-300" },
  { name: "أزرق", value: "blue", class: "bg-blue-100 border-blue-300" },
  { name: "أخضر", value: "green", class: "bg-green-100 border-green-300" },
  { name: "وردي", value: "pink", class: "bg-pink-100 border-pink-300" },
  { name: "بنفسجي", value: "purple", class: "bg-purple-100 border-purple-300" },
  { name: "برتقالي", value: "orange", class: "bg-orange-100 border-orange-300" },
];

interface StickyNotesProps {
  compact?: boolean;
  language?: string;
}

export const StickyNotes = ({ compact = false, language = "ar" }: StickyNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "مهمة مهمة",
      content: "لا تنسى الاتصال بالعميل أحمد محمد",
      color: "yellow",
      priority: "high",
      completed: false,
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      title: "تذكير",
      content: "تحديث قائمة الأسعار",
      color: "blue",
      priority: "medium",
      completed: true,
      createdAt: "2024-01-14"
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    color: "yellow",
    priority: "medium" as "low" | "medium" | "high"
  });

  const addNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      color: newNote.color,
      priority: newNote.priority,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: "", content: "", color: "yellow", priority: "medium" });
    setShowAddForm(false);
    
    toast({
      title: "تم إضافة الملاحظة",
      description: "تم إضافة الملاحظة بنجاح",
      duration: 2000,
    });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "تم حذف الملاحظة",
      description: "تم حذف الملاحظة بنجاح",
      duration: 2000,
    });
  };

  const toggleComplete = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const getColorClass = (color: string, isCompleted: boolean = false) => {
    const colorObj = colors.find(c => c.value === color);
    if (isCompleted) {
      return "bg-gray-100 border-gray-300 opacity-60";
    }
    return colorObj?.class || "bg-yellow-100 border-yellow-300";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high": return "عالي";
      case "medium": return "متوسط";
      case "low": return "منخفض";
      default: return "متوسط";
    }
  };

  // Filter out completed notes in compact mode
  const displayNotes = compact ? notes.filter(note => !note.completed) : notes;

  const selectedColorClass = getColorClass(newNote.color);

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-row-reverse" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <StickyNote className="w-5 h-5" />
            {compact ? "ملاحظات سريعة" : "الملاحظات"}
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant="outline"
            size="sm"
            className="text-purple-700 border-purple-200 hover:bg-purple-50"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {showAddForm && (
          <div className={`p-4 rounded-lg border-2 mb-4 ${selectedColorClass}`}>
            <div className="space-y-3">
              <Input
                placeholder="عنوان الملاحظة..."
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                className="text-right bg-white/70"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
              
              <Textarea
                placeholder="محتوى الملاحظة..."
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                className="text-right bg-white/70 min-h-[80px]"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
              
              <div className="flex gap-2 justify-between items-center">
                <div className="flex gap-1">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewNote(prev => ({ ...prev, color: color.value }))}
                      className={`w-6 h-6 rounded-full border-2 ${color.class} ${
                        newNote.color === color.value ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
                
                <select
                  value={newNote.priority}
                  onChange={(e) => setNewNote(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="text-sm border rounded px-2 py-1 bg-white/70"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <option value="low">أولوية منخفضة</option>
                  <option value="medium">أولوية متوسطة</option>
                  <option value="high">أولوية عالية</option>
                </select>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setShowAddForm(false)}
                  variant="outline"
                  size="sm"
                  className="text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  onClick={addNote}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {displayNotes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow ${getColorClass(note.color, note.completed)}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold text-sm ${note.completed ? 'line-through text-gray-500' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {note.title}
                  </h3>
                  <Badge variant={getPriorityColor(note.priority)} className="text-xs">
                    {getPriorityText(note.priority)}
                  </Badge>
                </div>
                
                <p className={`text-sm ${note.completed ? 'line-through text-gray-500' : 'text-gray-700'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {note.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{note.createdAt}</span>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => toggleComplete(note.id)}
                      variant="ghost"
                      size="sm"
                      className={`p-1 h-auto ${note.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => deleteNote(note.id)}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayNotes.length === 0 && (
          <div className="text-center py-8">
            <StickyNote className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {compact ? "لا توجد ملاحظات نشطة" : "لا توجد ملاحظات"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
