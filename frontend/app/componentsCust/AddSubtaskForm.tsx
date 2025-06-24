import React, { useState } from 'react'
import { SubtaskCreate } from '../types'
import { Plus, X } from 'lucide-react'

interface AddSubtaskFormProps {
  taskId: number
  onAddSubtask: (subtask: SubtaskCreate) => Promise<void>
  isSubmitting?: boolean
}

export default function AddSubtaskForm({ taskId, onAddSubtask, isSubmitting = false }: AddSubtaskFormProps) {
  const [subtask, setSubtask] = useState<SubtaskCreate>({
    title: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subtask.title.trim()) return
    
    const subtaskData = {
      title: subtask.title,
      ...(subtask.description && subtask.description.trim() && { description: subtask.description })
    }
    
    await onAddSubtask(subtaskData)
    
    // Reset form
    setSubtask({ title: '', description: '' })
  }

  return (
    <div className="p-fib-13 rounded-fib-md border border-dashed border-primary/30 bg-primary/5">
      <form onSubmit={handleSubmit} className="space-y-fib-13">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-fib-8">
          <div className="space-y-fib-3">
            <label className="text-fib-xs font-medium text-foreground">Subtask Title</label>
            <input
              type="text"
              placeholder="Enter subtask title..."
              value={subtask.title}
              onChange={(e) => setSubtask({ ...subtask, title: e.target.value })}
              className="w-full px-fib-8 py-fib-8 rounded-fib-md border border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus-ring transition-smooth text-fib-sm"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-fib-3">
            <label className="text-fib-xs font-medium text-foreground">Description (Optional)</label>
            <input
              type="text"
              placeholder="Enter description..."
              value={subtask.description}
              onChange={(e) => setSubtask({ ...subtask, description: e.target.value })}
              className="w-full px-fib-8 py-fib-8 rounded-fib-md border border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus-ring transition-smooth text-fib-sm"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-fib-8">
          <button
            type="submit"
            className="flex items-center gap-fib-3 px-fib-8 py-fib-3 bg-primary text-primary-foreground rounded-fib-md text-fib-xs hover:bg-primary/90 transition-smooth disabled:opacity-50"
            disabled={isSubmitting || !subtask.title.trim()}
          >
            <Plus className="h-fib-13 w-fib-13" />
            <span className="font-medium">
              {isSubmitting ? 'Adding...' : 'Add Subtask'}
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => setSubtask({ title: '', description: '' })}
            className="flex items-center gap-fib-3 px-fib-8 py-fib-3 bg-muted text-muted-foreground rounded-fib-md text-fib-xs hover:bg-muted/80 transition-smooth disabled:opacity-50"
            disabled={isSubmitting}
          >
            <X className="h-fib-13 w-fib-13" />
            <span className="font-medium">Clear</span>
          </button>
        </div>
      </form>
    </div>
  )
} 