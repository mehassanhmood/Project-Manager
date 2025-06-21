export interface Subtask {
  id: number
  title: string
  description: string | null
  status: 'Pending' | 'In progress' | 'Completed'
  task_id: number
  created_at: string
  started_at: string | null
  completed_at: string | null
  updated_at: string
}

export interface Task {
  id: number
  name: string
  description: string | null
  created_at: string
  started_at: string | null
  completed_at: string | null
  status: string
  subtasks: Subtask[]
  page_name: string
}

export interface SubtaskCreate {
  title: string
  description?: string
}

export interface SubtaskUpdate {
  status?: 'Pending' | 'In progress' | 'Completed'
  title?: string
  description?: string
}

export interface TaskCreate {
  name: string
  description?: string
  subtasks: SubtaskCreate[]
}