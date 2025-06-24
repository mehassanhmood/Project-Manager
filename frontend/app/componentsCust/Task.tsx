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
      <div className="flex items-center justify-center min-h-fib-233">
        <div className="text-center">
          <div className="animate-spin rounded-full h-fib-34 w-fib-34 border-b-2 border-primary mx-auto mb-fib-13"></div>
          <div className="text-fib-sm text-muted-foreground">Loading your tasks...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-golden-lg mx-auto px-fib-21 py-fib-34 ${className}`}>
      {/* Simple Header */}
      <div className="mb-fib-34">
        <div className="flex items-center justify-between">
          <h1 className="text-fib-lg font-semibold text-foreground">{title}</h1>
          {!showCreateForm && (
            <button
              onClick={refreshTasks}
              className="px-fib-13 py-fib-8 bg-primary text-primary-foreground rounded-fib-md text-fib-sm hover:bg-primary/90 transition-smooth focus-ring"
              disabled={loading}
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-fib-21 p-fib-13 rounded-fib-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center space-x-fib-8">
            <AlertCircle className="h-fib-21 w-fib-21 text-destructive flex-shrink-0" />
            <div className="text-fib-sm text-destructive font-medium">{error}</div>
          </div>
        </div>
      )}
      
      {/* Task Form */}
      {showCreateForm && (
        <div className="mb-fib-34">
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