export interface Task {
    id?: any
    title: string
    description: string
    hoursEstimated: number
    completed: boolean
    comments?: Comment[]
}

export interface Comment {
    id?: any
    name: string
    comment: string
}