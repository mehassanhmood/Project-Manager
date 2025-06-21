"use client"

import Task from "../componentsCust/Task";

export default function Backtester() {
  return (
    <Task 
      pageName="Backtester"
      title="Backtester"
      showCreateForm={true}
      emptyMessage="No tasks related to backtester"
      className="max-w-4xl"
    />
  )
}