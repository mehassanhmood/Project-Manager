import React from 'react'
import { useTaskManager } from '../hooks/useTask'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import AddSubtaskForm from './AddSubtaskForm'
import { AlertCircle } from 'lucide-react'

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
    addSubtask,
    updateSubtaskStatus,
    deleteSubtask,
    refreshTasks
  } = useTaskManager({ pageName, baseUrl })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-3"></div>
          <div className="text-sm text-muted-foreground">Loading your tasks...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-6 ${className}`}>
      {/* Simple Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {!showCreateForm && (
            <button
              onClick={refreshTasks}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-smooth focus-ring"
              disabled={loading}
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            <div className="text-sm text-destructive font-medium">{error}</div>
          </div>
        </div>
      )}
      
      {/* Task Form */}
      {showCreateForm && (
        <div className="mb-6">
          <TaskForm onCreateTask={createTask} isSubmitting={isSubmitting} />
        </div>
      )}

      {/* Task List */}
      <TaskList
        tasks={tasks}
        onStartTask={startTask}
        onCompleteTask={completeTask}
        onDeleteTask={deleteTask}
        onAddSubtask={addSubtask}
        onSubtaskStatusChange={updateSubtaskStatus}
        onSubtaskDelete={deleteSubtask}
        isProcessing={isProcessing}
        emptyMessage={emptyMessage}
      />
    </div>
  )
}