/**
 * Utility functions for date and duration calculations
 */

export const calculateDuration = (startDate: string | null, endDate: string | null): number => {
  if (!startDate) return 0
  
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

export const formatDuration = (days: number): string => {
  if (days === 0) return 'Today'
  if (days === 1) return '1 day'
  return `${days} days`
}

export const getStatusDuration = (status: string, startedAt: string | null, completedAt: string | null): string => {
  if (status === 'Pending') return ''
  if (status === 'In progress' && startedAt) {
    const days = calculateDuration(startedAt, null)
    return `Started ${formatDuration(days)} ago`
  }
  if (status === 'Completed' && startedAt && completedAt) {
    const days = calculateDuration(startedAt, completedAt)
    return `Completed in ${formatDuration(days)}`
  }
  return ''
}

export const formatDate = (dateString: string): string => {
  try {
    // Handle different date formats
    let date: Date
    
    if (typeof dateString === 'string') {
      // Try parsing as ISO string first
      date = new Date(dateString)
      
      // If that fails, try other common formats
      if (isNaN(date.getTime())) {
        // Try parsing as timestamp
        const timestamp = parseInt(dateString)
        if (!isNaN(timestamp)) {
          date = new Date(timestamp)
        } else {
          // Try parsing as date string with timezone
          date = new Date(dateString.replace(' ', 'T'))
        }
      }
    } else {
      date = new Date(dateString)
    }
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString)
      return 'Unknown date'
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', dateString, error)
    return 'Unknown date'
  }
} 