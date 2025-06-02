
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
}

export const StickyNotes = ({ compact = false }: StickyNotesProps) => {
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

  const addNote = () => {
    if (!newNote.title.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان للملاحظة",
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
      title: "تم إضافة الملاحظة",
      description: "تم إضافة الملاحظة بنجاح",
    });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "تم حذف الملاحظة",
      description: "تم حذف الملاحظة بنجاح",
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
      <Card className="shadow-lg h-fit">
        <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white pb-3">
          <CardTitle className="flex items-center gap-2 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <StickyNote className="w-4 h-4" />
            الملاحظات ({activeNotes.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-3 max-h-64 overflow-y-auto">
          {activeNotes.slice(0, 3).map(note => (
            <div key={note.id} className="mb-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
              <h4 className="font-semibold text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {note.title}
              </h4>
              {note.content && (
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {note.content.length > 50 ? note.content.substring(0, 50) + "..." : note.content}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Checkbox
                  checked={note.completed}
                  onCheckedChange={() => toggleCompleted(note.id)}
                />
                <span className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  مكتملة
                </span>
              </div>
            </div>
          ))}
          
          {activeNotes.length > 3 && (
            <p className="text-xs text-gray-500 text-center mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              و {activeNotes.length - 3} ملاحظات أخرى...
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <StickyNote className="w-5 h-5" />
            الملاحظات اللاصقة
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Add New Note */}
          <div className="space-y-4 mb-6 p-4 bg-yellow-50 rounded-lg border">
            <Input
              placeholder="عنوان الملاحظة..."
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
            <Textarea
              placeholder="محتوى الملاحظة..."
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              rows={3}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
            <Button
              onClick={addNote}
              className="w-full flex items-center gap-2"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Plus className="w-4 h-4" />
              إضافة ملاحظة
            </Button>
          </div>

          {/* Toggle completed notes */}
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => setShowCompleted(!showCompleted)}
              variant="outline"
              size="sm"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              {showCompleted ? `المكتملة (${completedNotes.length})` : `النشطة (${activeNotes.length})`}
            </Button>
          </div>

          {/* Notes List */}
          <div className="space-y-4">
            {displayNotes.map(note => (
              <div key={note.id} className={`p-4 rounded-lg border-l-4 ${
                note.completed 
                  ? 'bg-gray-50 border-gray-400' 
                  : 'bg-yellow-50 border-yellow-400'
              }`}>
                {editingNote === note.id ? (
                  <EditNoteForm
                    note={note}
                    onSave={updateNote}
                    onCancel={() => setEditingNote(null)}
                  />
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold ${note.completed ? 'line-through text-gray-500' : ''}`} 
                          style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {note.title}
                      </h4>
                      <div className="flex items-center gap-2">
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
                      <p className={`text-gray-600 mb-3 ${note.completed ? 'line-through' : ''}`} 
                         style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {note.content}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={note.completed}
                          onCheckedChange={() => toggleCompleted(note.id)}
                        />
                        <span className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          مكتملة
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(note.createdAt).toLocaleDateString('ar-SA')}
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
                {showCompleted ? "لا توجد ملاحظات مكتملة" : "لا توجد ملاحظات نشطة"}
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
}

const EditNoteForm = ({ note, onSave, onCancel }: EditNoteFormProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان للملاحظة",
        variant: "destructive",
      });
      return;
    }
    onSave(note.id, title, content);
  };

  return (
    <div className="space-y-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ fontFamily: 'Tajawal, sans-serif' }}
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        style={{ fontFamily: 'Tajawal, sans-serif' }}
      />
      <div className="flex gap-2">
        <Button onClick={handleSave} size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          حفظ
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          إلغاء
        </Button>
      </div>
    </div>
  );
};
