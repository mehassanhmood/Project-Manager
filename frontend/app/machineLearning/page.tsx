"use client"

import Task from "../componentsCust/Task";

export default function MachineLearning() {
  return (
    <Task 
      pageName="Machine Learning"
      title="Machine Learning"
      showCreateForm={true}
      emptyMessage="No tasks related to machine learning"
      className="max-w-4xl"
    />
  )
}