"use client"

import Task from "../componentsCust/Task";

export default function PortfolioCore() {
  return (
    <Task 
      pageName="Portfolio Core"
      title="Portfolio Core"
      showCreateForm={true}
      emptyMessage="No tasks related to portfolio core"
      className="max-w-4xl"
    />
  )
}