/*
Brianne Trollo
CS 554
Lab 7
I pledge my honor that I have abided by the Stevens Honor System.
*/

const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
import {v4 as uuid} from "uuid";

import {Task, Comment} from '../types';

export class taskData {
	//Return all tasks in collection
	public async getAllTasks (skip: number, take: number){
		const taskCollection = await tasks();
		return taskCollection.find({}).project({_id: 0}).skip(skip).limit(take).toArray();
	}
	
	//Return task with given ID
	public async getTaskById(id: any) {
		if (!id) {
			throw "Recipe ID is invalid.";
		}
		if (typeof id != "string") {
			throw "Id input must be a string.";
		}
		const taskCollection = await tasks();
		const task = await taskCollection.findOne({id: id}, {_id: 0});
		if (!task) {
			throw "Task not found.";
		}
		return task;
	}
	
	//Create new task in Collection
	public async addTask (title: string, description: string, time: number) {
		if (!title) {
			throw "You must provide a title.";
		}
		if (!description) {
			throw "You must provide description.";
		}
		if (!time) {
			throw "You must provide the amount of time to complete the task.";
		}
		const taskCollection = await tasks();
		const newId: any = uuid();
		let newTask: Task = {
			id: newId,
			title: title,
			description: description,
			hoursEstimated: time,
			completed: false,
			comments: []
		};
		const insertTask = await taskCollection.insertOne(newTask);
		if(insertTask.insertedCount === 0) {
			throw "Could not add task.";
		}
		const task: Task = await this.getTaskById(newId);
		return task;
	}
	
	//Update task in Collection
	public async updateTask (taskId: any, updatedTask: Task) {
		if (!taskId) {
			throw "You must provide an updated recipe.";
		}
		
		const taskCollection = await tasks();
		const taskToChange = await this.getTaskById(taskId);
		
		let newTaskData: Task = {
			id: taskId,
			title: updatedTask.title,
			description: updatedTask.description,
			hoursEstimated: updatedTask.hoursEstimated,
			completed: updatedTask.completed,
			comments: taskToChange.comments
		};
		
		const updateTask = await taskCollection.updateOne({id: taskId}, newTaskData);
		
		if (updateTask.modifiedCount === 0) {
			throw "Could not update recipe.";
		}
		return await this.getTaskById(taskId);
	}
	
	//Update selected features of task in Collection
	public async patchTask (taskId: any, updatedTask: Task) {
		if (!taskId) {
			throw "You must provide an updated recipe.";
		}
		
		const taskCollection = await tasks();
		const taskToChange = await this.getTaskById(taskId);
		let titleT: string, descriptionT: string, hoursEstimatedT: number, completedT: boolean;
		
		if (!updatedTask.title) {
			titleT = taskToChange.title;
		} else {
			titleT = updatedTask.title;
		}
		if (!updatedTask.description) {
			descriptionT = taskToChange.description;
		} else {
			descriptionT = updatedTask.description;
		}
		if (!updatedTask.hoursEstimated) {
			hoursEstimatedT = taskToChange.hoursEstimated;
		} else {
			hoursEstimatedT = updatedTask.hoursEstimated;
		}
		if (!updatedTask.completed) {
			completedT = taskToChange.completed;
		} else {
			completedT = updatedTask.completed;
		}
		
		let newTaskData: Task = {
			id: taskId,
			title: titleT,
			description: descriptionT,
			hoursEstimated: hoursEstimatedT,
			completed: completedT,
			comments: taskToChange.comments
		};
		
		const updateTask = await taskCollection.updateOne({id: taskId}, newTaskData);
		
		if (updateTask.modifiedCount === 0) {
			throw "Could not update recipe.";
		}
		
		return await this.getTaskById(taskId);
		
	}
	
	//Add comment to task
	public async addComment (taskId: any, name: string, comment: string) {
		if (!taskId) {
			throw "You must provide a task ID.";
		}
		if (!name) {
			throw "You must provide a name.";
		}
		if (!comment) {
			throw "You must provide a comment.";
		}
		
		const taskCollection = await tasks();
		let newId = uuid();
		let newComment: Comment = {
			id: newId,
			name: name,
			comment: comment
		};
		
		const insertComment = await taskCollection.updateOne({id: taskId}, {$addToSet: {comments: newComment}});
		if (insertComment.modifiedCount === 0) {
			throw "Could not add comment to the recipe.";
		}
		
		return newComment;
	}
	
	//Remove comment from task
	public async removeComment (taskId: any, commentId: any) {
		if (!taskId) {
			throw "You must provide a task id to search for.";
		}
		if (!commentId) {
			throw "You must provide a comment id to search for.";
		}
		
		const taskCollection = await tasks();
		const deletionComment = await taskCollection.findOneAndUpdate({"id": taskId}, {$pull: {'comments': {id: commentId}}});
		
		if (deletionComment.deletedCount === 0) {
			throw "Could not remove comment.";
		}
		return deletionComment;
	}
}

export default new taskData();