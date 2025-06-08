
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "مراجعة فواتير الموردين",
      completed: false
    },
    {
      id: "2", 
      title: "تحديث أسعار البطاريات",
      completed: true
    },
    {
      id: "3",
      title: "جرد المخزن الشهري", 
      completed: false
    },
    {
      id: "4",
      title: "متابعة مديونيات العملاء",
      completed: false
    },
    {
      id: "5",
      title: "تنظيف وترتيب المتجر",
      completed: true
    },
    {
      id: "6",
      title: "تحديث قائمة العملاء",
      completed: false
    },
    {
      id: "7",
      title: "مراجعة الحسابات الشهرية",
      completed: false
    },
    {
      id: "8",
      title: "طلب بطاريات جديدة من الموردين",
      completed: true
    }
  ]);
  
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان المهمة",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false
    };

    setTasks(prev => [...prev, task]);
    setNewTaskTitle("");

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

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <CheckCircle className="w-5 h-5" />
          قائمة المهام
          {totalTasks > 0 && (
            <span className="text-sm text-gray-500">
              ({completedTasks}/{totalTasks})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* إضافة مهمة جديدة */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="أدخل عنوان المهمة"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <Button onClick={addTask} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
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
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  
                  <div className="flex-1">
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
                    {task.completed && (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ مكتملة
                      </span>
                    )}
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
