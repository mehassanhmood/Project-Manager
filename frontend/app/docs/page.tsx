"use client"

import Task from "../componentsCust/Task";

export default function Documentation() {
  return (
    <Task 
      pageName="Documentation"
      title="Documentation"
      showCreateForm={true}
      emptyMessage="No tasks related to documentation"
      className="max-w-4xl"
    />
  )
}