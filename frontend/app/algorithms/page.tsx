"use client"

import Task from "../components/Task";

export default function Algorithms() {
  return (
    <Task 
     pageName="Algorithms"
     title="Alagorithms"
     showCreateForm = {true}
     emptyMessage="No tasks related to algorithms"
     className="max-w-4xl"
    />
  )
}