import React from 'react'
import { Task } from '../types'

interface TaskItemProps {
  task: Task
  onStartTask: (taskId: number) => Promise<void>
  onCompleteTask: (taskId: number) => Promise<void>
  onDeleteTask: (taskId: number) => Promise<void>
  isProcessing?: boolean
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800'
    case 'In progress': return 'bg-blue-100 text-blue-800'
    case 'Completed': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function TaskItem({ 
  task, 
  onStartTask, 
  onCompleteTask, 
  onDeleteTask,
  isProcessing = false 
}: TaskItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{task.name}</h3>
          {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
            <span>Subtasks: {task.subtasks.length}</span>
          </div>
          
          {/* Display Subtasks */}
          {task.subtasks.length > 0 && (
            <div className="mt-3 space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Subtasks:</h4>
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="ml-4 p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium">{subtask.title}</div>
                  {subtask.description && <div className="text-gray-600">{subtask.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <div className="flex gap-1">
            {task.status === 'Pending' && (
              <button
                onClick={() => onStartTask(task.id)}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                disabled={isProcessing}
              >
                Start
              </button>
            )}
            {task.status === 'In progress' && (
              <button
                onClick={() => onCompleteTask(task.id)}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 disabled:opacity-50"
                disabled={isProcessing}
              >
                Complete
              </button>
            )}
            <button
              onClick={() => onDeleteTask(task.id)}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
              disabled={isProcessing}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}