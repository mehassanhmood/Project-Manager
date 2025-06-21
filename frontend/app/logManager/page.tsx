"use client"

import Task from "../componentsCust/Task";

export default function LogManager() {
  return (
    <Task 
      pageName="Log Manager"
      title="Log Manager"
      showCreateForm={true}
      emptyMessage="No tasks related to log manager"
      className="max-w-4xl"
    />
  )
}