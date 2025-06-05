
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, StickyNote, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Note {
  id: string;
  content: string;
  color: string;
  completed: boolean;
  createdAt: string;
}

const noteColors = [
  { name: "أصفر", value: "#fef3c7", bg: "bg-yellow-100", border: "border-yellow-300" },
  { name: "أخضر", value: "#d1fae5", bg: "bg-green-100", border: "border-green-300" },
  { name: "أزرق", value: "#dbeafe", bg: "bg-blue-100", border: "border-blue-300" },
  { name: "وردي", value: "#fce7f3", bg: "bg-pink-100", border: "border-pink-300" },
  { name: "بنفسجي", value: "#e0e7ff", bg: "bg-purple-100", border: "border-purple-300" },
  { name: "برتقالي", value: "#fed7aa", bg: "bg-orange-100", border: "border-orange-300" },
];

interface StickyNotesProps {
  compact?: boolean;
  language?: string;
}

export const StickyNotes = ({ compact = false, language = "ar" }: StickyNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState(noteColors[0]);
  const [formBackgroundColor, setFormBackgroundColor] = useState(noteColors[0].value);
  const isRTL = language === "ar";

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('sticky-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        color: selectedColor.value,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setNotes(prev => [note, ...prev]);
      setNewNote("");
      toast({
        title: language === "ar" ? "تمت الإضافة" : "Added",
        description: language === "ar" ? "تمت إضافة الملاحظة بنجاح" : "Note added successfully",
      });
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف الملاحظة بنجاح" : "Note deleted successfully",
    });
  };

  const toggleComplete = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const handleColorSelect = (color: typeof noteColors[0]) => {
    setSelectedColor(color);
    setFormBackgroundColor(color.value);
  };

  // Filter completed notes in compact mode (daily view)
  const displayNotes = compact ? notes.filter(note => !note.completed) : notes;

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <StickyNote className="w-5 h-5" />
          {language === "ar" ? "الملاحظات اللاصقة" : "Sticky Notes"}
          {compact && (
            <Badge variant="secondary" className="bg-white text-yellow-600">
              {language === "ar" ? "مضغوط" : "Compact"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Add New Note Form */}
        <div 
          className="mb-6 p-4 rounded-lg border-2 transition-colors duration-200"
          style={{ backgroundColor: formBackgroundColor }}
        >
          <div className="space-y-4">
            <Textarea
              placeholder={language === "ar" ? "اكتب ملاحظة جديدة..." : "Write a new note..."}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className={`min-h-[100px] resize-none border-0 bg-transparent placeholder:text-gray-600 focus:ring-0 ${isRTL ? 'text-right' : 'text-left'}`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
            
            {/* Color Picker */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {language === "ar" ? "اللون:" : "Color:"}
              </span>
              {noteColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorSelect(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    selectedColor.name === color.name ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            
            <Button 
              onClick={addNote} 
              className="w-full"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {language === "ar" ? "إضافة ملاحظة" : "Add Note"}
            </Button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border-2 shadow-sm transition-all duration-200 hover:shadow-md ${
                note.completed ? 'opacity-50 grayscale' : ''
              }`}
              style={{ backgroundColor: note.color }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-xs text-gray-600 font-medium">
                    {note.createdAt}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => toggleComplete(note.id)}
                      variant="ghost"
                      size="sm"
                      className={`h-6 w-6 p-0 ${note.completed ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteNote(note.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <p 
                    className={`text-sm leading-relaxed whitespace-pre-wrap ${isRTL ? 'text-right' : 'text-left'} ${
                      note.completed ? 'line-through' : ''
                    }`}
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    {note.content}
                  </p>
                </div>
                
                {note.completed && (
                  <Badge variant="secondary" className="mt-2 self-start bg-gray-500 text-white">
                    {language === "ar" ? "مكتمل" : "Completed"}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {displayNotes.length === 0 && (
          <div className="text-center py-12">
            <StickyNote className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {language === "ar" ? "لا توجد ملاحظات" : "No Notes"}
            </h3>
            <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {compact 
                ? (language === "ar" ? "لا توجد ملاحظات نشطة" : "No active notes")
                : (language === "ar" ? "ابدأ بإضافة ملاحظة جديدة" : "Start by adding a new note")
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
