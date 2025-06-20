import React from 'react'
import { Task } from '../types'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  onStartTask: (taskId: number) => Promise<void>
  onCompleteTask: (taskId: number) => Promise<void>
  onDeleteTask: (taskId: number) => Promise<void>
  isProcessing?: boolean
  emptyMessage?: string
}

export default function TaskList({
  tasks,
  onStartTask,
  onCompleteTask,
  onDeleteTask,
  isProcessing = false,
  emptyMessage = "No tasks found"
}: TaskListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStartTask={onStartTask}
              onCompleteTask={onCompleteTask}
              onDeleteTask={onDeleteTask}
              isProcessing={isProcessing}
            />
          ))}
        </div>
      )}
    </div>
  )
}