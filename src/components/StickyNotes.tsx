import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StickyNote, Plus, Trash2, Edit3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: string;
  color: string;
}

interface StickyNotesProps {
  compact?: boolean;
  language?: string;
}

const noteColors = [
  { bg: 'bg-yellow-100', border: 'border-yellow-400', header: 'bg-yellow-500' },
  { bg: 'bg-pink-100', border: 'border-pink-400', header: 'bg-pink-500' },
  { bg: 'bg-blue-100', border: 'border-blue-400', header: 'bg-blue-500' },
  { bg: 'bg-green-100', border: 'border-green-400', header: 'bg-green-500' },
  { bg: 'bg-purple-100', border: 'border-purple-400', header: 'bg-purple-500' },
  { bg: 'bg-orange-100', border: 'border-orange-400', header: 'bg-orange-500' },
];

export const StickyNotes = ({ compact = false, language = "ar" }: StickyNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "متابعة عميل أحمد",
      content: "الاتصال بأحمد لتذكيره بموعد التسليم",
      completed: false,
      createdAt: new Date().toISOString(),
      color: 'yellow'
    }
  ]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const isRTL = language === "ar";

  const addNote = () => {
    if (!newNote.title.trim()) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى إدخال عنوان للملاحظة" : "Please enter a note title",
        variant: "destructive",
      });
      return;
    }

    const colorOptions = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      completed: false,
      createdAt: new Date().toISOString(),
      color: randomColor
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: "", content: "" });
    
    toast({
      title: language === "ar" ? "تم إضافة الملاحظة" : "Note Added",
      description: language === "ar" ? "تم إضافة الملاحظة بنجاح" : "Note added successfully",
    });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: language === "ar" ? "تم حذف الملاحظة" : "Note Deleted",
      description: language === "ar" ? "تم حذف الملاحظة بنجاح" : "Note deleted successfully",
    });
  };

  const toggleCompleted = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, title, content } : note
    ));
    setEditingNote(null);
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: any } = {
      yellow: noteColors[0],
      pink: noteColors[1], 
      blue: noteColors[2],
      green: noteColors[3],
      purple: noteColors[4],
      orange: noteColors[5]
    };
    return colorMap[color] || noteColors[0];
  };

  const activeNotes = notes.filter(note => !note.completed);
  const completedNotes = notes.filter(note => note.completed);

  if (compact) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {/* Add Note Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-3">
            <CardTitle className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="w-4 h-4" />
              {language === "ar" ? "ملاحظة جديدة" : "New Note"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            <Input
              placeholder={language === "ar" ? "عنوان..." : "Title..."}
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              className={`text-xs ${isRTL ? 'text-right' : 'text-left'}`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
            <Textarea
              placeholder={language === "ar" ? "المحتوى..." : "Content..."}
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              rows={2}
              className={`text-xs ${isRTL ? 'text-right' : 'text-left'}`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
            <Button
              onClick={addNote}
              size="sm"
              className="w-full text-xs"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              {language === "ar" ? "إضافة" : "Add"}
            </Button>
          </CardContent>
        </Card>

        {/* Notes Grid */}
        {activeNotes.slice(0, 6).map(note => {
          const colors = getColorClasses(note.color);
          return (
            <Card key={note.id} className={`shadow-md hover:shadow-lg transition-shadow ${colors.bg} border-2 ${colors.border}`}>
              <CardHeader className={`${colors.header} text-white p-2`}>
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h4 className="font-semibold text-xs truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {note.title}
                  </h4>
                  <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button
                      onClick={() => setEditingNote(note.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => deleteNote(note.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                {note.content && (
                  <p className={`text-xs text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {note.content.length > 80 ? note.content.substring(0, 80) + "..." : note.content}
                  </p>
                )}
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Checkbox
                    checked={note.completed}
                    onCheckedChange={() => toggleCompleted(note.id)}
                  />
                  <span className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {language === "ar" ? "مكتملة" : "Complete"}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {activeNotes.length > 6 && (
          <Card className="shadow-md border-2 border-dashed border-gray-300">
            <CardContent className="p-4 flex items-center justify-center">
              <p className="text-sm text-gray-500 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {language === "ar" ? `و ${activeNotes.length - 6} ملاحظات أخرى...` : `and ${activeNotes.length - 6} more notes...`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <StickyNote className="w-5 h-5" />
            {language === "ar" ? "الملاحظات اللاصقة" : "Sticky Notes"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Add New Note */}
          <div className="space-y-4 mb-6 p-4 bg-yellow-50 rounded-lg border">
            <Input
              placeholder={language === "ar" ? "عنوان الملاحظة..." : "Note title..."}
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              className={isRTL ? 'text-right' : 'text-left'}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
            <Textarea
              placeholder={language === "ar" ? "محتوى الملاحظة..." : "Note content..."}
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              rows={3}
              className={isRTL ? 'text-right' : 'text-left'}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
            <Button
              onClick={addNote}
              className={`w-full flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Plus className="w-4 h-4" />
              {language === "ar" ? "إضافة ملاحظة" : "Add Note"}
            </Button>
          </div>

          {/* Toggle completed notes */}
          <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              onClick={() => setShowCompleted(!showCompleted)}
              variant="outline"
              size="sm"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              {showCompleted 
                ? `${language === "ar" ? `المكتملة (${completedNotes.length})` : `Completed (${completedNotes.length})`}` 
                : `${language === "ar" ? `النشطة (${activeNotes.length})` : `Active (${activeNotes.length})`}`
              }
            </Button>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showCompleted ? completedNotes : activeNotes).map(note => {
              const colors = getColorClasses(note.color);
              return (
                <Card key={note.id} className={`${colors.bg} border-2 ${colors.border} ${note.completed ? 'opacity-60' : ''}`}>
                  {editingNote === note.id ? (
                    <EditNoteForm
                      note={note}
                      onSave={updateNote}
                      onCancel={() => setEditingNote(null)}
                      language={language}
                    />
                  ) : (
                    <>
                      <CardHeader className={`${colors.header} text-white p-3`}>
                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h4 className={`font-semibold ${note.completed ? 'line-through' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {note.title}
                          </h4>
                          <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Button
                              onClick={() => setEditingNote(note.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-white hover:bg-white/20"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => deleteNote(note.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-white hover:bg-white/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3">
                        {note.content && (
                          <p className={`text-gray-700 mb-3 ${note.completed ? 'line-through' : ''} ${isRTL ? 'text-right' : 'text-left'}`} 
                             style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {note.content}
                          </p>
                        )}
                        
                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Checkbox
                              checked={note.completed}
                              onCheckedChange={() => toggleCompleted(note.id)}
                            />
                            <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {language === "ar" ? "مكتملة" : "Complete"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(note.createdAt).toLocaleDateString(language === "ar" ? 'ar-SA' : 'en-US')}
                          </span>
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              );
            })}
          </div>
          
          {(showCompleted ? completedNotes : activeNotes).length === 0 && (
            <div className="text-center py-8">
              <StickyNote className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {showCompleted 
                  ? (language === "ar" ? "لا توجد ملاحظات مكتملة" : "No completed notes") 
                  : (language === "ar" ? "لا توجد ملاحظات نشطة" : "No active notes")
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface EditNoteFormProps {
  note: Note;
  onSave: (id: string, title: string, content: string) => void;
  onCancel: () => void;
  language?: string;
}

const EditNoteForm = ({ note, onSave, onCancel, language = "ar" }: EditNoteFormProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const isRTL = language === "ar";

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى إدخال عنوان للملاحظة" : "Please enter a note title",
        variant: "destructive",
      });
      return;
    }
    onSave(note.id, title, content);
  };

  return (
    <CardContent className="p-3 space-y-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={isRTL ? 'text-right' : 'text-left'}
        style={{ fontFamily: 'Tajawal, sans-serif' }}
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className={isRTL ? 'text-right' : 'text-left'}
        style={{ fontFamily: 'Tajawal, sans-serif' }}
      />
      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button onClick={handleSave} size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          {language === "ar" ? "حفظ" : "Save"}
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          {language === "ar" ? "إلغاء" : "Cancel"}
        </Button>
      </div>
    </CardContent>
  );
};
