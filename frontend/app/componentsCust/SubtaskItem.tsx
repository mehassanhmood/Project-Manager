import React from 'react'
import { Subtask } from '../types'
import { CheckCircle, Circle, Clock, Trash2, Calendar } from 'lucide-react'
import { formatDate, getStatusDuration } from '../utils/dateUtils'

interface SubtaskItemProps {
  subtask: Subtask
  onStatusChange: (subtaskId: number, status: string) => Promise<void>
  onDelete: (subtaskId: number) => Promise<void>
  isProcessing?: boolean
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return 'text-muted-foreground'
    case 'In progress': return 'text-primary'
    case 'Completed': return 'text-accent'
    default: return 'text-muted-foreground'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Pending': return <Circle className="h-3 w-3" />
    case 'In progress': return <Clock className="h-3 w-3" />
    case 'Completed': return <CheckCircle className="h-3 w-3" />
    default: return <Circle className="h-3 w-3" />
  }
}

const getNextStatus = (currentStatus: string) => {
  switch (currentStatus) {
    case 'Pending': return 'In progress'
    case 'In progress': return 'Completed'
    case 'Completed': return 'Pending'
    default: return 'Pending'
  }
}

export default function SubtaskItem({ 
  subtask, 
  onStatusChange, 
  onDelete, 
  isProcessing = false 
}: SubtaskItemProps) {
  const handleStatusChange = async () => {
    const nextStatus = getNextStatus(subtask.status)
    await onStatusChange(subtask.id, nextStatus)
  }

  return (
    <div className="flex items-center justify-between p-2 rounded bg-muted/30 border border-gray-200 hover:bg-muted/50 transition-smooth">
      <div className="flex items-center gap-2 flex-1">
        {/* Status Toggle */}
        <button
          onClick={handleStatusChange}
          className={`p-1 rounded hover:bg-background/50 transition-smooth ${getStatusColor(subtask.status)}`}
          disabled={isProcessing}
        >
          {getStatusIcon(subtask.status)}
        </button>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-foreground text-sm truncate">{subtask.title}</div>
          {subtask.description && (
            <div className="text-xs text-muted-foreground mt-0.5">{subtask.description}</div>
          )}
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5" />
              <span>Created: {formatDate(subtask.created_at)}</span>
            </div>
            {/* Duration Information */}
            {subtask.status !== 'Pending' && (
              <div className="flex items-center gap-1 text-accent">
                <Clock className="h-2.5 w-2.5" />
                <span>{getStatusDuration(subtask.status, subtask.started_at, subtask.completed_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Button */}
      <button
        onClick={() => onDelete(subtask.id)}
        className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth disabled:opacity-50"
        disabled={isProcessing}
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
} 