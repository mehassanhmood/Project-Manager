"use client"

import Task from "../componentsCust/Task";

export default function FrontEndDesign() {
  return (
    <Task 
      pageName="Front End Design"
      title="Front End Design"
      showCreateForm={true}
      emptyMessage="No tasks related to frontend"
      className="max-w-4xl"
    />
  )
}