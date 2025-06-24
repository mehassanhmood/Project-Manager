import React, { useState } from 'react'
import { Task } from '../types'
import SubtaskItem from './SubtaskItem'
import AddSubtaskForm from './AddSubtaskForm'
import { Play, CheckCircle, Trash2, Plus, Calendar, ListTodo, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate, getStatusDuration } from '../utils/dateUtils'

interface TaskItemProps {
  task: Task
  onStartTask: (taskId: number) => Promise<void>
  onCompleteTask: (taskId: number) => Promise<void>
  onDeleteTask: (taskId: number) => Promise<void>
  onAddSubtask: (taskId: number, subtask: any) => Promise<void>
  onSubtaskStatusChange: (subtaskId: number, status: string) => Promise<void>
  onSubtaskDelete: (subtaskId: number) => Promise<void>
  isProcessing?: boolean
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Pending': return 'warning'
    case 'In progress': return 'default'
    case 'Completed': return 'success'
    default: return 'secondary'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Pending': return <Clock className="h-fib-13 w-fib-13" />
    case 'In progress': return <Play className="h-fib-13 w-fib-13" />
    case 'Completed': return <CheckCircle className="h-fib-13 w-fib-13" />
    default: return <Clock className="h-fib-13 w-fib-13" />
  }
}

export default function TaskItem({ 
  task, 
  onStartTask, 
  onCompleteTask, 
  onDeleteTask,
  onAddSubtask,
  onSubtaskStatusChange,
  onSubtaskDelete,
  isProcessing = false 
}: TaskItemProps) {
  const [showAddSubtaskForm, setShowAddSubtaskForm] = useState(false)

  return (
    <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21 hover-lift">
      <div className="flex flex-col lg:flex-row lg:items-start gap-fib-21">
        {/* Main Content */}
        <div className="flex-1 space-y-fib-13">
          {/* Task Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-fib-base font-semibold text-foreground mb-fib-3">{task.name}</h3>
              {task.description && (
                <p className="text-fib-sm text-muted-foreground mb-fib-8">{task.description}</p>
              )}
              
              {/* Task Meta */}
              <div className="flex items-center gap-fib-13 text-fib-xs text-muted-foreground">
                <div className="flex items-center gap-fib-3">
                  <Calendar className="h-fib-13 w-fib-13" />
                  <span>Created: {formatDate(task.created_at)}</span>
                </div>
                <div className="flex items-center gap-fib-3">
                  <ListTodo className="h-fib-13 w-fib-13" />
                  <span>{task.subtasks.length} subtasks</span>
                </div>
                {/* Duration Information */}
                {task.status !== 'Pending' && (
                  <div className="flex items-center gap-fib-3 text-accent">
                    <Clock className="h-fib-13 w-fib-13" />
                    <span>{getStatusDuration(task.status, task.started_at, task.completed_at)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Status Badge */}
            <Badge variant={getStatusVariant(task.status) as any} className="flex items-center gap-fib-3 text-fib-xs">
              {getStatusIcon(task.status)}
              <span>{task.status}</span>
            </Badge>
          </div>
          
          {/* Add Subtask Button */}
          <div className="flex items-center gap-fib-8">
            <button
              onClick={() => setShowAddSubtaskForm(!showAddSubtaskForm)}
              className="flex items-center gap-fib-3 px-fib-8 py-fib-3 bg-accent/10 text-accent rounded-fib-md text-fib-xs hover:bg-accent/20 transition-smooth disabled:opacity-50"
              disabled={isProcessing}
            >
              <Plus className="h-fib-13 w-fib-13" />
              <span className="font-medium">
                {showAddSubtaskForm ? 'Cancel' : 'Add Subtask'}
              </span>
            </button>
          </div>

          {/* Add Subtask Form */}
          {showAddSubtaskForm && (
            <div className="mt-fib-13">
              <AddSubtaskForm
                taskId={task.id}
                onAddSubtask={async (subtask) => {
                  await onAddSubtask(task.id, subtask)
                  setShowAddSubtaskForm(false)
                }}
                isSubmitting={isProcessing}
              />
            </div>
          )}
          
          {/* Subtasks */}
          {task.subtasks.length > 0 && (
            <div className="space-y-fib-8">
              <h4 className="font-medium text-foreground text-fib-sm flex items-center gap-fib-3">
                <ListTodo className="h-fib-13 w-fib-13" />
                Subtasks ({task.subtasks.length})
              </h4>
              <div className="space-y-fib-3">
                {task.subtasks.map((subtask) => (
                  <SubtaskItem
                    key={subtask.id}
                    subtask={subtask}
                    onStatusChange={onSubtaskStatusChange}
                    onDelete={onSubtaskDelete}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-fib-3 lg:flex-shrink-0">
          {task.status === 'Pending' && (
            <button
              onClick={() => onStartTask(task.id)}
              className="flex items-center gap-fib-3 px-fib-13 py-fib-8 bg-primary text-primary-foreground rounded-fib-md text-fib-xs hover:bg-primary/90 transition-smooth disabled:opacity-50"
              disabled={isProcessing}
            >
              <Play className="h-fib-13 w-fib-13" />
              <span>Start</span>
            </button>
          )}
          {task.status === 'In progress' && (
            <button
              onClick={() => onCompleteTask(task.id)}
              className="flex items-center gap-fib-3 px-fib-13 py-fib-8 bg-accent text-accent-foreground rounded-fib-md text-fib-xs hover:bg-accent/90 transition-smooth disabled:opacity-50"
              disabled={isProcessing}
            >
              <CheckCircle className="h-fib-13 w-fib-13" />
              <span>Complete</span>
            </button>
          )}
          <button
            onClick={() => onDeleteTask(task.id)}
            className="flex items-center gap-fib-3 px-fib-13 py-fib-8 bg-destructive/10 text-destructive rounded-fib-md text-fib-xs hover:bg-destructive/20 transition-smooth disabled:opacity-50"
            disabled={isProcessing}
          >
            <Trash2 className="h-fib-13 w-fib-13" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}