"use client"

import Task from "../componentsCust/Task";

export default function Algorithms() {
  return (
    <Task 
      pageName="Algorithms"
      title="Algorithms"
      showCreateForm={true}
      emptyMessage="No tasks related to algorithms"
      className="max-w-4xl"
    />
  )
}