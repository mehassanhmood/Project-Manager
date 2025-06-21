"use client"

import Task from "../componentsCust/Task";

export default function Trader() {
  return (
    <Task 
      pageName="Trader"
      title="Trader"
      showCreateForm={true}
      emptyMessage="No tasks related to trader"
      className="max-w-4xl"
    />
  )
}