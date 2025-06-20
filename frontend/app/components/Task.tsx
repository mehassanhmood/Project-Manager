import React from 'react'
import { useTaskManager } from '../hooks/useTask'
import TaskForm from './TaskForm'
import TaskList from './TaskList'

interface ProjectManagerProps {
  pageName: string
  baseUrl?: string
  title?: string
  showCreateForm?: boolean
  emptyMessage?: string
  className?: string
}

export default function Task({
  pageName,
  baseUrl = 'http://localhost:8000/api/v1',
  title = 'Project Manager',
  showCreateForm = true,
  emptyMessage = 'No tasks found',
  className = ''
}: ProjectManagerProps) {
  const {
    tasks,
    loading,
    isSubmitting,
    isProcessing,
    error,
    createTask,
    startTask,
    completeTask,
    deleteTask,
    refreshTasks
  } = useTaskManager({ pageName, baseUrl })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        {!showCreateForm && (
          <button
            onClick={refreshTasks}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            Refresh
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {showCreateForm && (
        <TaskForm onCreateTask={createTask} isSubmitting={isSubmitting} />
      )}

      <TaskList
        tasks={tasks}
        onStartTask={startTask}
        onCompleteTask={completeTask}
        onDeleteTask={deleteTask}
        isProcessing={isProcessing}
        emptyMessage={emptyMessage}
      />
    </div>
  )
}