"use client"

import Task from "../componentsCust/Task";

export default function Broker() {
  return (
    <Task 
      pageName="Broker"
      title="Broker"
      showCreateForm={true}
      emptyMessage="No tasks related to broker"
      className="max-w-4xl"
    />
  )
}