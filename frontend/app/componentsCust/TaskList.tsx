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
    <div className="space-y-fib-21">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-fib-8">
          <div className="p-fib-8 rounded-fib-md bg-primary/10">
            <ListTodo className="h-fib-21 w-fib-21 text-primary" />
          </div>
          <div>
            <h2 className="text-fib-base font-semibold text-foreground">Tasks</h2>
            <p className="text-fib-xs text-muted-foreground">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in your list
            </p>
          </div>
        </div>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-fib-55">
          <div className="mx-auto w-fib-55 h-fib-55 rounded-full bg-muted/50 flex items-center justify-center mb-fib-13">
            <Inbox className="h-fib-34 w-fib-34 text-muted-foreground" />
          </div>
          <h3 className="text-fib-base font-medium text-foreground mb-fib-3">No tasks yet</h3>
          <p className="text-fib-sm text-muted-foreground max-w-golden-sm mx-auto">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-fib-13">
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