// here we will have apis for fetching, making, deleting, starting, and completing the task.

import {Task, TaskCreate, Subtask, SubtaskCreate, SubtaskUpdate } from "../types";


export class TaskApiService {

    private baseUrl: string
    constructor(baseUrl: string = 'http://localhost:8000/api/v1', pageName: string = "Home"){
        this.baseUrl = `${baseUrl}/pages/${pageName}`
    }

    async fetchTasks(): Promise<Task[]> {
        try {
            const response = await fetch(`${this.baseUrl}/tasks`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching tasks:", error)
            throw error
        }
    }

    async fetchAllTasks(): Promise<Task[]> {
        try {
            // Use the new endpoint that gets all tasks from all pages
            const baseUrl = this.baseUrl.split('/pages/')[0]; // Get http://localhost:8000/api/v1
            const response = await fetch(`${baseUrl}/tasks/all`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tasks = await response.json();
            return tasks;
        } catch (error) {
            console.error("Error fetching all tasks:", error)
            throw error
        }
    }

    async createTask(taskData: TaskCreate): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            })
            if (!response.ok) {
                const errorData = await response.json()
                console.error("Server error:", errorData)
                throw new Error(`Failed to make a new task: ${response.status}`)
            }
        } catch (error){
            console.error("Error making the task: ", error)
            throw error
        }
        
    }


    async startTask(taskId: number): Promise<void> {
        try {
        const response = await fetch(`${this.baseUrl}/tasks/${taskId}/start`, {
            method: 'PUT',
        })
        
        if (!response.ok) {
            throw new Error(`Failed to start task: ${response.status}`)
        }
        } catch (error) {
        console.error('Error starting task:', error)
        throw error
        }
    }


    async completeTask(taskId: number): Promise<void> {
        try {
        const response = await fetch(`${this.baseUrl}/tasks/${taskId}/complete`, {
            method: 'PUT',
        })
        
        if (!response.ok) {
            throw new Error(`Failed to complete task: ${response.status}`)
        }
        } catch (error) {
        console.error('Error completing task:', error)
        throw error
        }
    }


    async deleteTask(taskId: number): Promise<void> {
        try {
        const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
            method: 'DELETE',
        })
        
        if (!response.ok) {
            throw new Error(`Failed to delete task: ${response.status}`)
        }
        } catch (error) {
        console.error('Error deleting task:', error)
        throw error
        }
    }

    // Subtask API methods
    async createSubtask(taskId: number, subtask: SubtaskCreate): Promise<Subtask> {
        try {
            const response = await fetch(`${this.baseUrl.replace('/pages/' + this.baseUrl.split('/').pop(), '')}/tasks/${taskId}/subtasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subtask)
            })
            if (!response.ok) {
                throw new Error(`Failed to create subtask: ${response.status}`)
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating subtask:', error)
            throw error
        }
    }

    async updateSubtaskStatus(subtaskId: number, status: string): Promise<Subtask> {
        try {
            const response = await fetch(`${this.baseUrl.replace('/pages/' + this.baseUrl.split('/').pop(), '')}/subtasks/${subtaskId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            })
            if (!response.ok) {
                throw new Error(`Failed to update subtask status: ${response.status}`)
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating subtask status:', error)
            throw error
        }
    }

    async deleteSubtask(subtaskId: number): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl.replace('/pages/' + this.baseUrl.split('/').pop(), '')}/subtasks/${subtaskId}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                throw new Error(`Failed to delete subtask: ${response.status}`)
            }
        } catch (error) {
            console.error('Error deleting subtask:', error)
            throw error
        }
    }
}