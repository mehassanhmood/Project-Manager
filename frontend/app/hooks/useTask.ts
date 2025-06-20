import { useState, useEffect } from 'react'
import { Task, TaskCreate } from '../types'
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

  const refreshTasks = () => {
    setLoading(true)
    fetchTasks()
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
    refreshTasks
  }
}