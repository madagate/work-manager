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
}

interface StickyNotesProps {
  compact?: boolean;
  language?: string;
}

export const StickyNotes = ({ compact = false, language = "ar" }: StickyNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "متابعة عميل أحمد",
      content: "الاتصال بأحمد لتذكيره بموعد التسليم",
      completed: false,
      createdAt: new Date().toISOString()
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

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      completed: false,
      createdAt: new Date().toISOString()
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

  const activeNotes = notes.filter(note => !note.completed);
  const completedNotes = notes.filter(note => note.completed);
  const displayNotes = showCompleted ? completedNotes : activeNotes;

  if (compact) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {/* Add New Note Card */}
        <Card className="shadow-lg border-dashed border-2 border-yellow-300 hover:border-yellow-400 transition-colors">
          <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white pb-3">
            <CardTitle className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="w-4 h-4" />
              {language === "ar" ? "ملاحظة جديدة" : "New Note"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-3">
            <div className="space-y-2">
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
                className={`w-full text-xs ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Plus className="w-3 h-3 mr-1" />
                {language === "ar" ? "إضافة" : "Add"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Notes */}
        {activeNotes.slice(0, 5).map(note => (
          <Card key={note.id} className="shadow-lg bg-yellow-50 border-yellow-200">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white pb-2">
              <CardTitle className={`flex items-center justify-between text-xs ${isRTL ? 'flex-row-reverse' : ''}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <span className="truncate">{note.title}</span>
                <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button
                    onClick={() => setEditingNote(note.id)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-white hover:bg-yellow-700"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => deleteNote(note.id)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-white hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-3">
              {editingNote === note.id ? (
                <EditNoteForm
                  note={note}
                  onSave={updateNote}
                  onCancel={() => setEditingNote(null)}
                  language={language}
                  compact={true}
                />
              ) : (
                <div className="space-y-2">
                  {note.content && (
                    <p className={`text-xs text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {note.content.length > 80 ? note.content.substring(0, 80) + "..." : note.content}
                    </p>
                  )}
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Checkbox
                      checked={note.completed}
                      onCheckedChange={() => toggleCompleted(note.id)}
                    />
                    <span className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {language === "ar" ? "مكتملة" : "Complete"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Show more indicator if there are more notes */}
        {activeNotes.length > 5 && (
          <Card className="shadow-lg border-dashed border-2 border-gray-300">
            <CardContent className="p-6 text-center flex items-center justify-center">
              <div>
                <StickyNote className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {language === "ar" ? `+${activeNotes.length - 5} ملاحظات` : `+${activeNotes.length - 5} more`}
                </p>
              </div>
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

          {/* Notes List */}
          <div className="space-y-4">
            {displayNotes.map(note => (
              <div key={note.id} className={`p-4 rounded-lg border-l-4 ${
                note.completed 
                  ? 'bg-gray-50 border-gray-400' 
                  : 'bg-yellow-50 border-yellow-400'
              } ${isRTL ? 'border-r-4 border-l-0' : ''}`}>
                {editingNote === note.id ? (
                  <EditNoteForm
                    note={note}
                    onSave={updateNote}
                    onCancel={() => setEditingNote(null)}
                    language={language}
                  />
                ) : (
                  <div>
                    <div className={`flex items-start justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <h4 className={`font-semibold ${note.completed ? 'line-through text-gray-500' : ''} ${isRTL ? 'text-right' : 'text-left'}`} 
                          style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {note.title}
                      </h4>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Button
                          onClick={() => setEditingNote(note.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => deleteNote(note.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {note.content && (
                      <p className={`text-gray-600 mb-3 ${note.completed ? 'line-through' : ''} ${isRTL ? 'text-right' : 'text-left'}`} 
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
                        <span className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {language === "ar" ? "مكتملة" : "Complete"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(note.createdAt).toLocaleDateString(language === "ar" ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {displayNotes.length === 0 && (
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
  compact?: boolean;
}

const EditNoteForm = ({ note, onSave, onCancel, language = "ar", compact = false }: EditNoteFormProps) => {
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
    <div className="space-y-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`${compact ? 'text-xs' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
        style={{ fontFamily: 'Tajawal, sans-serif' }}
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={compact ? 2 : 3}
        className={`${compact ? 'text-xs' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
        style={{ fontFamily: 'Tajawal, sans-serif' }}
      />
      <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button 
          onClick={handleSave} 
          size={compact ? "sm" : "sm"} 
          className={compact ? 'text-xs' : ''}
          style={{ fontFamily: 'Tajawal, sans-serif' }}
        >
          {language === "ar" ? "حفظ" : "Save"}
        </Button>
        <Button 
          onClick={onCancel} 
          variant="outline" 
          size={compact ? "sm" : "sm"}
          className={compact ? 'text-xs' : ''}
          style={{ fontFamily: 'Tajawal, sans-serif' }}
        >
          {language === "ar" ? "إلغاء" : "Cancel"}
        </Button>
      </div>
    </div>
  );
};
