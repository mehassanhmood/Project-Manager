"use client"

import Task from "../componentsCust/Task";

export default function ResearchLab() {
  return (
    <Task 
      pageName="Research Lab"
      title="Research Lab"
      showCreateForm={true}
      emptyMessage="No tasks related to Research Lab"
      className="max-w-4xl"
    />
  )
}