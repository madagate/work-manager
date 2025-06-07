
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Calendar, Clock, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'عالية' | 'متوسطة' | 'منخفضة';
  dueDate?: string;
  createdAt: string;
}

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "متوسطة" as const,
    dueDate: ""
  });

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان المهمة",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description.trim() || undefined,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate || undefined,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: "",
      description: "",
      priority: "متوسطة",
      dueDate: ""
    });

    toast({
      title: "تمت الإضافة",
      description: "تمت إضافة المهمة بنجاح"
    });
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "تم الحذف",
      description: "تم حذف المهمة"
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالية': return 'bg-red-500';
      case 'متوسطة': return 'bg-yellow-500';
      case 'منخفضة': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <CheckCircle className="w-5 h-5" />
          قائمة المهام
          {totalTasks > 0 && (
            <Badge variant="outline">
              {completedTasks}/{totalTasks}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* إضافة مهمة جديدة */}
        <div className="border rounded-lg p-4 space-y-3">
          <div>
            <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>عنوان المهمة</Label>
            <Input
              placeholder="أدخل عنوان المهمة"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>

          <div>
            <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف (اختياري)</Label>
            <Input
              placeholder="وصف المهمة"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</Label>
              <Select value={newTask.priority} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عالية" style={{ fontFamily: 'Tajawal, sans-serif' }}>عالية</SelectItem>
                  <SelectItem value="متوسطة" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسطة</SelectItem>
                  <SelectItem value="منخفضة" style={{ fontFamily: 'Tajawal, sans-serif' }}>منخفضة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</Label>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={addTask} className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة المهمة
          </Button>
        </div>

        {/* قائمة المهام */}
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              لا توجد مهام حالياً
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`border rounded-lg p-3 ${task.completed ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    {task.description && (
                      <p className={`text-sm text-gray-600 mb-2 ${task.completed ? 'line-through' : ''}`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
