import React from 'react'
import { Task } from '../types'
import TaskItem from './TaskItem'
import { ListTodo, Inbox } from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
  onStartTask: (taskId: number) => Promise<void>
  onCompleteTask: (taskId: number) => Promise<void>
  onDeleteTask: (taskId: number) => Promise<void>
  onAddSubtask: (taskId: number, subtask: any) => Promise<void>
  onSubtaskStatusChange: (subtaskId: number, status: string) => Promise<void>
  onSubtaskDelete: (subtaskId: number) => Promise<void>
  isProcessing?: boolean
  emptyMessage?: string
}

export default function TaskList({
  tasks,
  onStartTask,
  onCompleteTask,
  onDeleteTask,
  onAddSubtask,
  onSubtaskStatusChange,
  onSubtaskDelete,
  isProcessing = false,
  emptyMessage = "No tasks found"
}: TaskListProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-primary/10">
            <ListTodo className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Tasks</h2>
            <p className="text-xs text-muted-foreground">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in your list
            </p>
          </div>
        </div>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
            <Inbox className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium text-foreground mb-1">No tasks yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStartTask={onStartTask}
              onCompleteTask={onCompleteTask}
              onDeleteTask={onDeleteTask}
              onAddSubtask={onAddSubtask}
              onSubtaskStatusChange={onSubtaskStatusChange}
              onSubtaskDelete={onSubtaskDelete}
              isProcessing={isProcessing}
            />
          ))}
        </div>
      )}
    </div>
  )
}