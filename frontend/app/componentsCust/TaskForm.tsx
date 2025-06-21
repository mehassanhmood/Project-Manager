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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-1.5 rounded bg-primary/10">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Create New Task</h2>
          <p className="text-xs text-muted-foreground">Add a new task to your workflow</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Task Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Task Name</label>
            <input
              type="text"
              placeholder="Enter task name..."
              value={newTask.name}
              onChange={(e) => setNewTask({...newTask, name: e.target.value})}
              className="w-full px-3 py-2 rounded border border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus-ring transition-smooth text-sm"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Description (Optional)</label>
            <input
              type="text"
              placeholder="Enter task description..."
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="w-full px-3 py-2 rounded border border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus-ring transition-smooth text-sm"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        {/* Subtasks Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-accent/10">
              <ListTodo className="h-3 w-3 text-accent" />
            </div>
            <h3 className="font-medium text-foreground text-sm">Subtasks</h3>
            <span className="text-xs text-muted-foreground">({newTask.subtasks.length} added)</span>
          </div>
          
          {/* Existing Subtasks */}
          {newTask.subtasks.length > 0 && (
            <div className="space-y-2">
              {newTask.subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50 border border-gray-200">
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">{subtask.title}</div>
                    {subtask.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">{subtask.description}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubtask(index)}
                    className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
                    disabled={isSubmitting}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add New Subtask */}
          <div className="p-3 rounded border border-dashed border-gray-300 bg-muted/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                placeholder="Subtask title..."
                value={newSubtask.title}
                onChange={(e) => setNewSubtask({...newSubtask, title: e.target.value})}
                className="px-2 py-1.5 rounded border border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus-ring transition-smooth text-sm"
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="Description (optional)..."
                value={newSubtask.description}
                onChange={(e) => setNewSubtask({...newSubtask, description: e.target.value})}
                className="px-2 py-1.5 rounded border border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus-ring transition-smooth text-sm"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="button"
              onClick={addSubtask}
              className="flex items-center space-x-1 px-2 py-1 bg-accent text-accent-foreground rounded text-xs hover:bg-accent/90 transition-smooth disabled:opacity-50"
              disabled={isSubmitting || !newSubtask.title.trim()}
            >
              <Plus className="h-3 w-3" />
              <span>Add Subtask</span>
            </button>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="pt-3 border-t border-gray-200">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-smooth disabled:opacity-50 focus-ring font-medium text-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
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