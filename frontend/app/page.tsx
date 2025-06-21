'use client'

import Task from './componentsCust/Task'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Task 
        pageName="main"
        title="Task Manager"
        showCreateForm={true}
        emptyMessage="No tasks found. Create your first task to get started!"
      />
    </div>
  )
}