import React, { useState } from 'react'
import { TaskCreate, SubtaskCreate } from '../types'
import { Plus, X, FileText, ListTodo } from 'lucide-react'

interface TaskFormProps {
  onCreateTask: (task: TaskCreate) => Promise<void>
  isSubmitting?: boolean
}

export default function TaskForm({onCreateTask, isSubmitting=false}: TaskFormProps) {
    const [newTask, setNewTask] = useState<TaskCreate>({
        name: '',
        description: '',
        subtasks: []
    })
    const [newSubtask, setNewSubtask] = useState<SubtaskCreate>({
        title: '',
        description: ''
    })

    const addSubtask = () => {
        const subtaskData = {
        title: newSubtask.title,
        ...(newSubtask.description && { description: newSubtask.description })
      }
        setNewTask({
        ...newTask,
        subtasks: [...newTask.subtasks, subtaskData]
        })
        setNewSubtask({ title: '', description: '' })
    }

    const removeSubtask = (index: number) => {
        setNewTask({
        ...newTask,
        subtasks: newTask.subtasks.filter((_, i) => i !== index)
        })
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
    
        // Prepare task data, omitting empty description
        const taskData = {
        name: newTask.name,
        ...(newTask.description && newTask.description.trim() && { description: newTask.description }),
        subtasks: newTask.subtasks
        }
    
        await onCreateTask(taskData)
    
        // Reset form
        setNewTask({ name: '', description: '', subtasks: [] })
        setNewSubtask({ title: '', description: '' })
  }
  
  return (
    <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21">
      <div className="flex items-center space-x-fib-8 mb-fib-21">
        <div className="p-fib-8 rounded-fib-md bg-primary/10">
          <FileText className="h-fib-21 w-fib-21 text-primary" />
        </div>
        <div>
          <h2 className="text-fib-base font-semibold text-foreground">Create New Task</h2>
          <p className="text-fib-xs text-muted-foreground">Add a new task to your workflow</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-fib-21">
        {/* Main Task Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-fib-13">
          <div className="space-y-fib-3">
            <label className="text-fib-xs font-medium text-foreground">Task Name</label>
            <input
              type="text"
              placeholder="Enter task name..."
              value={newTask.name}
              onChange={(e) => setNewTask({...newTask, name: e.target.value})}
              className="w-full px-fib-13 py-fib-8 rounded-fib-md border border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus-ring transition-smooth text-fib-sm"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-fib-3">
            <label className="text-fib-xs font-medium text-foreground">Description (Optional)</label>
            <input
              type="text"
              placeholder="Enter task description..."
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="w-full px-fib-13 py-fib-8 rounded-fib-md border border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus-ring transition-smooth text-fib-sm"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        {/* Subtasks Section */}
        <div className="space-y-fib-13">
          <div className="flex items-center space-x-fib-8">
            <div className="p-fib-3 rounded-fib-md bg-accent/10">
              <ListTodo className="h-fib-13 w-fib-13 text-accent" />
            </div>
            <h3 className="font-medium text-foreground text-fib-sm">Subtasks</h3>
            <span className="text-fib-xs text-muted-foreground">({newTask.subtasks.length} added)</span>
          </div>
          
          {/* Existing Subtasks */}
          {newTask.subtasks.length > 0 && (
            <div className="space-y-fib-8">
              {newTask.subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center justify-between p-fib-8 rounded-fib-md bg-muted/50 border border-gray-200">
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-fib-sm">{subtask.title}</div>
                    {subtask.description && (
                      <div className="text-fib-xs text-muted-foreground mt-fib-3">{subtask.description}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubtask(index)}
                    className="p-fib-3 rounded-fib-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
                    disabled={isSubmitting}
                  >
                    <X className="h-fib-13 w-fib-13" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add New Subtask */}
          <div className="p-fib-13 rounded-fib-md border border-dashed border-gray-300 bg-muted/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-fib-8 mb-fib-8">
              <input
                type="text"
                placeholder="Subtask title..."
                value={newSubtask.title}
                onChange={(e) => setNewSubtask({...newSubtask, title: e.target.value})}
                className="px-fib-8 py-fib-8 rounded-fib-md border border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus-ring transition-smooth text-fib-sm"
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="Description (optional)..."
                value={newSubtask.description}
                onChange={(e) => setNewSubtask({...newSubtask, description: e.target.value})}
                className="px-fib-8 py-fib-8 rounded-fib-md border border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus-ring transition-smooth text-fib-sm"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="button"
              onClick={addSubtask}
              className="flex items-center space-x-fib-3 px-fib-8 py-fib-3 bg-accent text-accent-foreground rounded-fib-md text-fib-xs hover:bg-accent/90 transition-smooth disabled:opacity-50"
              disabled={isSubmitting || !newSubtask.title.trim()}
            >
              <Plus className="h-fib-13 w-fib-13" />
              <span>Add Subtask</span>
            </button>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="pt-fib-13 border-t border-gray-200">
          <button
            type="submit"
            className="w-full px-fib-21 py-fib-8 bg-primary text-primary-foreground rounded-fib-md hover:bg-primary/90 transition-smooth disabled:opacity-50 focus-ring font-medium text-fib-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-fib-8">
                <div className="animate-spin rounded-full h-fib-13 w-fib-13 border-b-2 border-current"></div>
                <span>Creating Task...</span>
              </div>
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}