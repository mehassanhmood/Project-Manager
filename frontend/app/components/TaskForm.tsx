import React, { useState } from 'react'
import { TaskCreate, SubtaskCreate } from '../types'

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
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({...newTask, name: e.target.value})}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
        
        {/* Subtasks Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Subtasks</h3>
          <div className="space-y-3">
            {newTask.subtasks.map((subtask, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium">{subtask.title}</div>
                  {subtask.description && <div className="text-sm text-gray-600">{subtask.description}</div>}
                </div>
                <button
                  type="button"
                  onClick={() => removeSubtask(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              </div>
            ))}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Subtask Title"
                value={newSubtask.title}
                onChange={(e) => setNewSubtask({...newSubtask, title: e.target.value})}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="Subtask Description (optional)"
                value={newSubtask.description}
                onChange={(e) => setNewSubtask({...newSubtask, description: e.target.value})}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="button"
              onClick={addSubtask}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Add Subtask
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div> 
  )
}