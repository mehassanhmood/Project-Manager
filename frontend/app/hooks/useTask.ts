import { useState, useEffect } from 'react'
import { Task, TaskCreate, SubtaskCreate } from '../types'
import { TaskApiService } from '../services/apis'

interface UseTaskManagerProps {
  pageName: string
  baseUrl?: string
}

export function useTaskManager({ pageName, baseUrl }: UseTaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiService = new TaskApiService(baseUrl, pageName)

  const fetchTasks = async () => {
    try {
      setError(null)
      const data = await apiService.fetchTasks()
      setTasks(data)
    } catch (error) {
      setError('Failed to fetch tasks')
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: TaskCreate) => {
    try {
      setIsSubmitting(true)
      setError(null)
      await apiService.createTask(taskData)
      await fetchTasks()
    } catch (error) {
      setError('Failed to create task')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const startTask = async (taskId: number) => {
    try {
      setIsProcessing(true)
      setError(null)
      await apiService.startTask(taskId)
      await fetchTasks()
    } catch (error) {
      setError('Failed to start task')
      console.error('Error starting task:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const completeTask = async (taskId: number) => {
    try {
      setIsProcessing(true)
      setError(null)
      await apiService.completeTask(taskId)
      await fetchTasks()
    } catch (error) {
      setError('Failed to complete task')
      console.error('Error completing task:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const deleteTask = async (taskId: number) => {
    try {
      setIsProcessing(true)
      setError(null)
      await apiService.deleteTask(taskId)
      await fetchTasks()
    } catch (error) {
      setError('Failed to delete task')
      console.error('Error deleting task:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Subtask management functions
  const addSubtask = async (taskId: number, subtask: SubtaskCreate) => {
    try {
      setIsProcessing(true)
      setError(null)
      const newSubtask = await apiService.createSubtask(taskId, subtask)
      // Update the task's subtasks list
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      ))
    } catch (error) {
      setError('Failed to add subtask')
      console.error('Error adding subtask:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const updateSubtaskStatus = async (subtaskId: number, status: string) => {
    try {
      setIsProcessing(true)
      setError(null)
      const updatedSubtask = await apiService.updateSubtaskStatus(subtaskId, status)
      // Update the subtask in the appropriate task
      setTasks(tasks.map(task => ({
        ...task,
        subtasks: task.subtasks.map(subtask =>
          subtask.id === subtaskId ? updatedSubtask : subtask
        )
      })))
    } catch (error) {
      setError('Failed to update subtask status')
      console.error('Error updating subtask status:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const deleteSubtask = async (subtaskId: number) => {
    try {
      setIsProcessing(true)
      setError(null)
      await apiService.deleteSubtask(subtaskId)
      // Remove the subtask from the appropriate task
      setTasks(tasks.map(task => ({
        ...task,
        subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
      })))
    } catch (error) {
      setError('Failed to delete subtask')
      console.error('Error deleting subtask:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const refreshTasks = () => {
    setLoading(true)
    fetchTasks()
  }

  const fetchAllTasksForAnalytics = async () => {
    try {
      setError(null)
      setLoading(true)
      const apiService = new TaskApiService(baseUrl, pageName)
      const data = await apiService.fetchAllTasks()
      setTasks(data)
    } catch (error) {
      setError('Failed to fetch all tasks for analytics')
      console.error('Error fetching all tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [pageName])

  return {
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
    refreshTasks,
    fetchAllTasksForAnalytics
  }
}