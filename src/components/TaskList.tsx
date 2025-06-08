
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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "مراجعة فواتير الموردين",
      description: "مراجعة فواتير شهر يناير وتدقيق الأرقام",
      completed: false,
      priority: "عالية",
      dueDate: "2024-01-25",
      createdAt: "2024-01-20T10:00:00Z"
    },
    {
      id: "2",
      title: "تحديث أسعار البطاريات",
      description: "تحديث قائمة الأسعار للعملاء الجدد",
      completed: true,
      priority: "متوسطة",
      dueDate: "2024-01-22",
      createdAt: "2024-01-18T14:30:00Z"
    },
    {
      id: "3",
      title: "جرد المخزن الشهري",
      description: "عمل جرد شامل لجميع أنواع البطاريات",
      completed: false,
      priority: "عالية",
      dueDate: "2024-01-30",
      createdAt: "2024-01-15T09:15:00Z"
    },
    {
      id: "4",
      title: "متابعة مديونيات العملاء",
      description: "الاتصال بالعملاء المتأخرين في السداد",
      completed: false,
      priority: "متوسطة",
      dueDate: "2024-01-28",
      createdAt: "2024-01-19T16:45:00Z"
    },
    {
      id: "5",
      title: "تنظيف وترتيب المتجر",
      description: "تنظيف عام وترتيب البطاريات حسب الأنواع",
      completed: true,
      priority: "منخفضة",
      createdAt: "2024-01-17T08:00:00Z"
    }
  ]);
  
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
                className={`border rounded-lg p-3 transition-all duration-200 ${
                  task.completed ? 'bg-gray-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 
                        className={`font-medium transition-all duration-200 ${
                          task.completed 
                            ? 'line-through text-gray-500 decoration-2' 
                            : 'text-gray-900'
                        }`}
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                      >
                        {task.title}
                      </h4>
                      <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                        {task.priority}
                      </Badge>
                      {task.completed && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          مكتملة ✓
                        </Badge>
                      )}
                    </div>
                    
                    {task.description && (
                      <p 
                        className={`text-sm text-gray-600 mb-2 transition-all duration-200 ${
                          task.completed ? 'line-through decoration-1' : ''
                        }`}
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                      >
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                      {task.dueDate && (
                        <div className={`flex items-center gap-1 ${
                          task.completed ? 'line-through' : ''
                        }`}>
                          <Clock className="w-3 h-3" />
                          موعد الانتهاء: {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="opacity-70 hover:opacity-100"
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
