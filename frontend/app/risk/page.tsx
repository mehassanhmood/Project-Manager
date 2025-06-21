"use client"

import Task from "../componentsCust/Task";

export default function Risk() {
  return (
    <Task 
      pageName="Risk"
      title="Risk"
      showCreateForm={true}
      emptyMessage="No tasks related to risk"
      className="max-w-4xl"
    />
  )
}