'use client'

import React, { useState, useEffect } from 'react'
import { useTaskManager } from '../hooks/useTask'
import { Task } from '../types'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Play, 
  Calendar,
  Target,
  Activity,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  Zap,
  Users,
  Award
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface DashboardStats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  pendingTasks: number
  totalSubtasks: number
  completedSubtasks: number
  completionRate: number
  avgSubtasksPerTask: number
  avgCompletionTime: number
  focusRatio: { [key: string]: number }
  productivityScore: number
  stagnantTasks: number
}

interface TimeFrame {
  label: string
  value: 'today' | 'week' | 'month' | 'all'
}

export default function Dashboard() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>({ label: 'This Week', value: 'week' })
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [categoryData, setCategoryData] = useState<any>(null)
  const [agingData, setAgingData] = useState<any>(null)
  const [timelineData, setTimelineData] = useState<any>(null)
  const [productivityData, setProductivityData] = useState<any>(null)
  const [completionSpeedData, setCompletionSpeedData] = useState<any>(null)
  const [goalProgress, setGoalProgress] = useState<any>(null)

  const { tasks, loading, fetchAllTasksForAnalytics } = useTaskManager({ pageName: 'main', baseUrl: 'http://localhost:8000/api/v1' })

  useEffect(() => {
    if (tasks.length > 0) {
      calculateStats()
      calculateCategoryBreakdown()
      calculateAgingReport()
      calculateTimelineData()
      calculateProductivityTrends()
      calculateCompletionSpeed()
      calculateGoalProgress()
    }
  }, [tasks, timeFrame])

  useEffect(() => {
    // Fetch all tasks for analytics on component mount
    fetchAllTasksForAnalytics()
  }, [])

  const calculateStats = () => {
    const now = new Date()
    const filteredTasks = filterTasksByTimeFrame(tasks, timeFrame.value)
    
    const totalTasks = filteredTasks.length
    const completedTasks = filteredTasks.filter(t => t.status === 'Completed').length
    const inProgressTasks = filteredTasks.filter(t => t.status === 'In progress').length
    const pendingTasks = filteredTasks.filter(t => t.status === 'Pending').length
    
    const totalSubtasks = filteredTasks.reduce((sum, task) => sum + task.subtasks.length, 0)
    const completedSubtasks = filteredTasks.reduce((sum, task) => 
      sum + task.subtasks.filter(st => st.status === 'Completed').length, 0
    )
    
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    const avgSubtasksPerTask = totalTasks > 0 ? totalSubtasks / totalTasks : 0
    
    // Calculate average completion time
    const completedTasksWithTime = filteredTasks.filter(t => 
      t.status === 'Completed' && t.started_at && t.completed_at
    )
    const avgCompletionTime = completedTasksWithTime.length > 0 
      ? completedTasksWithTime.reduce((sum, task) => {
          const start = new Date(task.started_at!)
          const end = new Date(task.completed_at!)
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) // days
        }, 0) / completedTasksWithTime.length
      : 0

    // Calculate focus ratio by category
    const focusRatio: { [key: string]: number } = {}
    const categoryCounts: { [key: string]: number } = {}
    
    filteredTasks.forEach(task => {
      const category = getTaskCategory(task.name, task.page_name)
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })
    
    Object.keys(categoryCounts).forEach(category => {
      focusRatio[category] = (categoryCounts[category] / totalTasks) * 100
    })

    // Calculate productivity score (0-100)
    const productivityScore = Math.min(100, 
      (completionRate * 0.4) + 
      (Math.min(100, (completedSubtasks / Math.max(1, totalSubtasks)) * 100) * 0.3) +
      (Math.max(0, 100 - avgCompletionTime * 10) * 0.3)
    )

    // Count stagnant tasks
    const stagnantTasks = tasks.filter(task => {
      const daysSinceCreation = Math.floor((now.getTime() - new Date(task.created_at).getTime()) / (1000 * 60 * 60 * 24))
      return daysSinceCreation > 7 && task.status === 'Pending'
    }).length

    setStats({
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      totalSubtasks,
      completedSubtasks,
      completionRate,
      avgSubtasksPerTask,
      avgCompletionTime,
      focusRatio,
      productivityScore,
      stagnantTasks
    })
  }

  const calculateCategoryBreakdown = () => {
    const categoryCounts: { [key: string]: number } = {}
    const categoryStatusCounts: { [key: string]: { pending: number, inProgress: number, completed: number } } = {}
    const categoryCompletionRates: { [key: string]: number } = {}
    
    tasks.forEach(task => {
      const category = getTaskCategory(task.name, task.page_name)
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
      
      if (!categoryStatusCounts[category]) {
        categoryStatusCounts[category] = { pending: 0, inProgress: 0, completed: 0 }
      }
      
      switch (task.status) {
        case 'Pending':
          categoryStatusCounts[category].pending++
          break
        case 'In progress':
          categoryStatusCounts[category].inProgress++
          break
        case 'Completed':
          categoryStatusCounts[category].completed++
          break
      }
    })

    // Calculate completion rates per category
    Object.keys(categoryCounts).forEach(category => {
      const total = categoryCounts[category]
      const completed = categoryStatusCounts[category].completed
      categoryCompletionRates[category] = total > 0 ? (completed / total) * 100 : 0
    })

    setCategoryData({
      counts: categoryCounts,
      statusCounts: categoryStatusCounts,
      completionRates: categoryCompletionRates
    })
  }

  const calculateAgingReport = () => {
    const now = new Date()
    const agingData = tasks.map(task => {
      const created = new Date(task.created_at)
      const started = task.started_at ? new Date(task.started_at) : null
      const completed = task.completed_at ? new Date(task.completed_at) : null
      
      const daysSinceCreation = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
      const daysToStart = started ? Math.floor((started.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)) : null
      const daysToComplete = completed ? Math.floor((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)) : null
      
      return {
        task,
        daysSinceCreation,
        daysToStart,
        daysToComplete,
        isStagnant: daysSinceCreation > 7 && task.status === 'Pending',
        isOverdue: daysSinceCreation > 14 && task.status !== 'Completed'
      }
    })

    setAgingData(agingData)
  }

  const calculateTimelineData = () => {
    const timelineData = tasks
      .filter(task => task.started_at || task.completed_at)
      .map(task => {
        const start = task.started_at ? new Date(task.started_at) : new Date(task.created_at)
        const end = task.completed_at ? new Date(task.completed_at) : new Date()
        
        return {
          id: task.id,
          name: task.name,
          category: getTaskCategory(task.name, task.page_name),
          start: start,
          end: end,
          status: task.status,
          subtasks: task.subtasks,
          duration: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        }
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime())

    setTimelineData(timelineData)
  }

  const calculateProductivityTrends = () => {
    const now = new Date()
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const dailyStats = last30Days.map(date => {
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.created_at).toISOString().split('T')[0]
        return taskDate === date
      })
      
      const completed = dayTasks.filter(t => t.status === 'Completed').length
      const total = dayTasks.length
      const inProgress = dayTasks.filter(t => t.status === 'In progress').length
      
      return {
        date,
        completed,
        total,
        inProgress,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
        productivityScore: total > 0 ? ((completed * 2) + inProgress) / (total * 2) * 100 : 0
      }
    })

    setProductivityData(dailyStats)
  }

  const calculateCompletionSpeed = () => {
    const speedData = tasks
      .filter(task => task.started_at && task.completed_at)
      .map(task => {
        const created = new Date(task.created_at)
        const started = new Date(task.started_at!)
        const completed = new Date(task.completed_at!)
        
        const timeToStart = Math.ceil((started.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
        const timeToComplete = Math.ceil((completed.getTime() - started.getTime()) / (1000 * 60 * 60 * 24))
        
        return {
          task,
          timeToStart,
          timeToComplete,
          totalTime: timeToStart + timeToComplete
        }
      })

    const avgTimeToStart = speedData.length > 0 
      ? speedData.reduce((sum, item) => sum + item.timeToStart, 0) / speedData.length 
      : 0
    
    const avgTimeToComplete = speedData.length > 0 
      ? speedData.reduce((sum, item) => sum + item.timeToComplete, 0) / speedData.length 
      : 0

    setCompletionSpeedData({
      tasks: speedData,
      avgTimeToStart,
      avgTimeToComplete,
      fastestTask: speedData.length > 0 ? speedData.reduce((min, item) => 
        item.totalTime < min.totalTime ? item : min
      ) : null,
      slowestTask: speedData.length > 0 ? speedData.reduce((max, item) => 
        item.totalTime > max.totalTime ? item : max
      ) : null
    })
  }

  const calculateGoalProgress = () => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const weeklyTasks = tasks.filter(task => new Date(task.created_at) >= weekStart)
    const monthlyTasks = tasks.filter(task => new Date(task.created_at) >= monthStart)
    
    const weeklyCompleted = weeklyTasks.filter(t => t.status === 'Completed').length
    const monthlyCompleted = monthlyTasks.filter(t => t.status === 'Completed').length
    
    // Example goals (you can make these configurable)
    const weeklyGoal = 10
    const monthlyGoal = 40
    
    setGoalProgress({
      weekly: {
        completed: weeklyCompleted,
        goal: weeklyGoal,
        progress: Math.min(100, (weeklyCompleted / weeklyGoal) * 100)
      },
      monthly: {
        completed: monthlyCompleted,
        goal: monthlyGoal,
        progress: Math.min(100, (monthlyCompleted / monthlyGoal) * 100)
      }
    })
  }

  const filterTasksByTimeFrame = (tasks: Task[], timeFrame: string) => {
    const now = new Date()
    const startDate = new Date()
    
    switch (timeFrame) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case 'all':
        return tasks
    }
    
    return tasks.filter(task => new Date(task.created_at) >= startDate)
  }

  const getTaskCategory = (taskName: string, pageName?: string): string => {
    // Use the page_name from the database if available, otherwise fall back to task name analysis
    if (pageName) {
      return pageName
    }
    
    // Fallback to task name analysis if page_name is not available
    const name = taskName.toLowerCase()
    if (name.includes('ml') || name.includes('machine') || name.includes('learning')) return 'Machine Learning'
    if (name.includes('risk')) return 'Risk Management'
    if (name.includes('algo') || name.includes('algorithm')) return 'Algorithms'
    if (name.includes('broker')) return 'Broker'
    if (name.includes('backtest')) return 'Backtesting'
    if (name.includes('trader')) return 'Trading'
    if (name.includes('portfolio')) return 'Portfolio'
    if (name.includes('research')) return 'Research'
    if (name.includes('log')) return 'Logging'
    if (name.includes('front') || name.includes('ui')) return 'Frontend'
    return 'Other'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100'
      case 'In progress': return 'text-blue-600 bg-blue-100'
      case 'Pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getProductivityColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-fib-233">
        <div className="text-center">
          <div className="animate-spin rounded-full h-fib-34 w-fib-34 border-b-2 border-primary mx-auto mb-fib-13"></div>
          <div className="text-fib-sm text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-golden-xl mx-auto px-fib-21 py-fib-34">
      {/* Header */}
      <div className="mb-fib-34">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-fib-xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-fib-sm text-muted-foreground">Comprehensive insights and performance metrics</p>
          </div>
          
          {/* Time Frame Filter */}
          <div className="flex items-center space-x-fib-8">
            <button
              onClick={() => fetchAllTasksForAnalytics()}
              className="px-fib-13 py-fib-8 bg-primary text-primary-foreground rounded-fib-md text-fib-sm hover:bg-primary/90 transition-smooth focus-ring"
              disabled={loading}
            >
              Refresh Data
            </button>
            <Filter className="h-fib-21 w-fib-21 text-muted-foreground" />
            <select
              value={timeFrame.value}
              onChange={(e) => setTimeFrame({
                label: e.target.options[e.target.selectedIndex].text,
                value: e.target.value as any
              })}
              className="px-fib-13 py-fib-8 rounded-fib-md border border-gray-200 bg-white text-fib-sm focus-ring"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {stats && (
        <>
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-fib-21 mb-fib-34">
            <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-fib-xs text-muted-foreground">Total Tasks</p>
                  <p className="text-fib-lg font-bold text-foreground">{stats.totalTasks}</p>
                  <p className="text-fib-xs text-green-600">+{stats.completedTasks} completed</p>
                </div>
                <div className="p-fib-8 rounded-fib-md bg-blue-100">
                  <BarChart3 className="h-fib-21 w-fib-21 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-fib-xs text-muted-foreground">Completion Rate</p>
                  <p className="text-fib-lg font-bold text-foreground">{stats.completionRate.toFixed(1)}%</p>
                  <p className="text-fib-xs text-blue-600">{stats.completedTasks}/{stats.totalTasks} tasks</p>
                </div>
                <div className="p-fib-8 rounded-fib-md bg-green-100">
                  <CheckCircle className="h-fib-21 w-fib-21 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-fib-xs text-muted-foreground">Productivity Score</p>
                  <p className={`text-fib-lg font-bold ${getProductivityColor(stats.productivityScore)}`}>
                    {stats.productivityScore.toFixed(0)}/100
                  </p>
                  <p className="text-fib-xs text-purple-600">Performance index</p>
                </div>
                <div className="p-fib-8 rounded-fib-md bg-purple-100">
                  <Zap className="h-fib-21 w-fib-21 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-fib-xs text-muted-foreground">Stagnant Tasks</p>
                  <p className="text-fib-lg font-bold text-red-600">{stats.stagnantTasks}</p>
                  <p className="text-fib-xs text-red-600">Need attention</p>
                </div>
                <div className="p-fib-8 rounded-fib-md bg-red-100">
                  <AlertTriangle className="h-fib-21 w-fib-21 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-fib-21 mb-fib-34">
            {/* Task Status Breakdown */}
            <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21">
              <h3 className="text-fib-base font-semibold text-foreground mb-fib-13">Task Status Distribution</h3>
              <div className="space-y-fib-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-fib-8">
                    <div className="w-fib-13 h-fib-13 rounded-full bg-yellow-500"></div>
                    <span className="text-fib-sm">Pending</span>
                  </div>
                  <span className="text-fib-sm font-medium">{stats.pendingTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-fib-8">
                    <div className="w-fib-13 h-fib-13 rounded-full bg-blue-500"></div>
                    <span className="text-fib-sm">In Progress</span>
                  </div>
                  <span className="text-fib-sm font-medium">{stats.inProgressTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-fib-8">
                    <div className="w-fib-13 h-fib-13 rounded-full bg-green-500"></div>
                    <span className="text-fib-sm">Completed</span>
                  </div>
                  <span className="text-fib-sm font-medium">{stats.completedTasks}</span>
                </div>
              </div>
            </div>

            {/* Category Focus */}
            {categoryData && (
              <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21">
                <h3 className="text-fib-base font-semibold text-foreground mb-fib-13">Category Focus</h3>
                <div className="space-y-fib-8">
                  {Object.entries(stats.focusRatio)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([category, percentage]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-fib-sm">{category}</span>
                        <div className="flex items-center space-x-fib-8">
                          <div className="w-fib-34 h-fib-8 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-fib-xs font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Subtask Granularity */}
            <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21">
              <h3 className="text-fib-base font-semibold text-foreground mb-fib-13">Subtask Metrics</h3>
              <div className="space-y-fib-8">
                <div className="flex items-center justify-between">
                  <span className="text-fib-sm">Total Subtasks</span>
                  <span className="text-fib-sm font-medium">{stats.totalSubtasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fib-sm">Avg per Task</span>
                  <span className="text-fib-sm font-medium">{stats.avgSubtasksPerTask.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fib-sm">Completion Rate</span>
                  <span className="text-fib-sm font-medium">
                    {stats.totalSubtasks > 0 ? ((stats.completedSubtasks / stats.totalSubtasks) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fib-sm">Avg Completion Time</span>
                  <span className="text-fib-sm font-medium">{stats.avgCompletionTime.toFixed(1)} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Goal Tracking */}
          {goalProgress && (
            <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21 mb-fib-34">
              <h3 className="text-fib-base font-semibold text-foreground mb-fib-13">Goal Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-fib-21">
                <div>
                  <div className="flex items-center justify-between mb-fib-8">
                    <span className="text-fib-sm font-medium">Weekly Goal</span>
                    <span className="text-fib-sm text-muted-foreground">
                      {goalProgress.weekly.completed}/{goalProgress.weekly.goal}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-fib-13">
                    <div 
                      className="bg-blue-500 h-fib-13 rounded-full transition-all duration-300"
                      style={{ width: `${goalProgress.weekly.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-fib-xs text-muted-foreground mt-fib-3">
                    {goalProgress.weekly.progress.toFixed(1)}% complete
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-fib-8">
                    <span className="text-fib-sm font-medium">Monthly Goal</span>
                    <span className="text-fib-sm text-muted-foreground">
                      {goalProgress.monthly.completed}/{goalProgress.monthly.goal}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-fib-13">
                    <div 
                      className="bg-green-500 h-fib-13 rounded-full transition-all duration-300"
                      style={{ width: `${goalProgress.monthly.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-fib-xs text-muted-foreground mt-fib-3">
                    {goalProgress.monthly.progress.toFixed(1)}% complete
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Task Aging Report */}
          {agingData && (
            <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21 mb-fib-34">
              <h3 className="text-fib-base font-semibold text-foreground mb-fib-13">Task Aging Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-fib-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-fib-8">Task</th>
                      <th className="text-left py-fib-8">Category</th>
                      <th className="text-left py-fib-8">Status</th>
                      <th className="text-left py-fib-8">Age (Days)</th>
                      <th className="text-left py-fib-8">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agingData
                      .filter((item: any) => item.isStagnant || item.isOverdue)
                      .sort((a: any, b: any) => b.daysSinceCreation - a.daysSinceCreation)
                      .slice(0, 10)
                      .map((item: any) => (
                        <tr key={item.task.id} className="border-b border-gray-100">
                          <td className="py-fib-8 font-medium">{item.task.name}</td>
                          <td className="py-fib-8 text-fib-xs">{getTaskCategory(item.task.name, item.task.page_name)}</td>
                          <td className="py-fib-8">
                            <Badge className={getStatusColor(item.task.status)}>
                              {item.task.status}
                            </Badge>
                          </td>
                          <td className="py-fib-8">
                            <span className={item.isOverdue ? 'text-red-600 font-medium' : ''}>
                              {item.daysSinceCreation}
                            </span>
                          </td>
                          <td className="py-fib-8">
                            {item.isOverdue ? (
                              <span className="text-red-600 text-fib-xs font-medium">HIGH</span>
                            ) : item.isStagnant ? (
                              <span className="text-yellow-600 text-fib-xs font-medium">MEDIUM</span>
                            ) : (
                              <span className="text-gray-600 text-fib-xs">LOW</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Completion Speed Tracker */}
          {completionSpeedData && (
            <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21 mb-fib-34">
              <h3 className="text-fib-base font-semibold text-foreground mb-fib-13">Completion Speed Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-fib-21">
                <div>
                  <h4 className="text-fib-sm font-medium mb-fib-13">Average Times</h4>
                  <div className="space-y-fib-8">
                    <div className="flex items-center justify-between">
                      <span className="text-fib-sm">Time to Start</span>
                      <span className="text-fib-sm font-medium">{completionSpeedData.avgTimeToStart.toFixed(1)} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-fib-sm">Time to Complete</span>
                      <span className="text-fib-sm font-medium">{completionSpeedData.avgTimeToComplete.toFixed(1)} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-fib-sm">Total Cycle Time</span>
                      <span className="text-fib-sm font-medium">
                        {(completionSpeedData.avgTimeToStart + completionSpeedData.avgTimeToComplete).toFixed(1)} days
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-fib-sm font-medium mb-fib-13">Performance Highlights</h4>
                  <div className="space-y-fib-8">
                    {completionSpeedData.fastestTask && (
                      <div>
                        <p className="text-fib-xs text-green-600 font-medium">Fastest Completion</p>
                        <p className="text-fib-sm">{completionSpeedData.fastestTask.task.name}</p>
                        <p className="text-fib-xs text-muted-foreground">
                          {completionSpeedData.fastestTask.totalTime} days total
                        </p>
                      </div>
                    )}
                    {completionSpeedData.slowestTask && (
                      <div>
                        <p className="text-fib-xs text-red-600 font-medium">Slowest Completion</p>
                        <p className="text-fib-sm">{completionSpeedData.slowestTask.task.name}</p>
                        <p className="text-fib-xs text-muted-foreground">
                          {completionSpeedData.slowestTask.totalTime} days total
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline View */}
          {timelineData && (
            <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21 mb-fib-34">
              <h3 className="text-fib-base font-semibold text-foreground mb-fib-13">Timeline View</h3>
              <div className="space-y-fib-13">
                {timelineData.slice(0, 8).map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-fib-13">
                    <div className="w-fib-89 flex-shrink-0">
                      <div className="text-fib-xs text-muted-foreground">
                        {item.start.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-fib-md h-fib-21 relative">
                      <div 
                        className={`h-full rounded-fib-md transition-all duration-300 ${
                          item.status === 'Completed' ? 'bg-green-500' :
                          item.status === 'In progress' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, (item.end.getTime() - item.start.getTime()) / (1000 * 60 * 60 * 24 * 7) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="w-fib-144 flex-shrink-0">
                      <div className="text-fib-xs font-medium truncate">{item.name}</div>
                      <div className="text-fib-xs text-muted-foreground">{item.category} • {item.duration}d</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Productivity Trends */}
          {productivityData && (
            <div className="bg-white rounded-fib-lg shadow-sm border border-gray-200 p-fib-21">
              <h3 className="text-fib-base font-semibold text-foreground mb-fib-13">Productivity Trends (Last 30 Days)</h3>
              <div className="h-fib-144 flex items-end space-x-fib-3">
                {productivityData.map((day: any, index: number) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t-fib-sm transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${Math.max(10, day.productivityScore * 2)}px` }}
                      title={`${day.date}: ${day.productivityScore.toFixed(1)}% productivity`}
                    ></div>
                    <div className="text-fib-xs text-muted-foreground mt-fib-3">
                      {new Date(day.date).getDate()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-fib-13 text-center">
                <p className="text-fib-xs text-muted-foreground">
                  Hover over bars to see daily productivity scores
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
} 