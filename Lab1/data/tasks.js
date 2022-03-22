/*
Brianne Trollo
CS 554
Lab 1
I pledge my honor that I have abided by the Stevens Honor System.
*/

const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const uuid = require("uuid/v4");

let exportedMethods = {
	//Return all tasks in collection
	getAllTasks: async (skip, take) => {
		const taskCollection = await tasks();
		return taskCollection.find({}).project({_id: 0}).skip(skip).limit(take).toArray();
	},
	
	//Return task with given ID
	getTaskById: async (id) => {
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
	},
	
	//Create new task in Collection
	addTask: async (title, description, time) => {
		if (!title) {
			throw "You must provide a title.";
		}
		if (!description) {
			throw "You must provide description.";
		}
		if (!time) {
			throw "You must provide the amount of time to complete the task.";
		}
		if (typeof title != "string" || typeof description != "string") {
			throw "Title and description must be strings.";
		}
		if (typeof time != "number") {
			throw "Time to complete the task must be an integer.";
		}
		const taskCollection = await tasks();
		const newId = uuid();
		let newTask = {
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
		const task = await module.exports.getTaskById(newId);
		return task;
	},
	
	//Update task in Collection
	updateTask: async (taskId, updatedTask) => {
		try {
			if (!taskId) {
				throw "You must provide an updated task.";
			}
			
			const taskCollection = await tasks();
			const taskToChange = await module.exports.getTaskById(taskId);
			let newTaskData = {
				id: taskId,
				title: updatedTask.title,
				description: updatedTask.description,
				hoursEstimated: updatedTask.hoursEstimated,
				completed: updatedTask.completed,
				comments: taskToChange.comments
			};
			const updateTask = await taskCollection.updateOne({id: taskId}, {$set: newTaskData});
			
			if (updateTask.modifiedCount === 0) {
				throw "Could not update task.";
			}
			
			return await module.exports.getTaskById(taskId);
		} catch(err) {
			console.log(err);
		}
	},
	
	//Update selected features of task in Collection
	patchTask: async(taskId, updatedTask) => {
		if (!taskId) {
			throw "You must provide an updated recipe.";
		}
		
		const taskCollection = await tasks();
		const taskToChange = await module.exports.getTaskById(taskId);
		let titleT, descriptionT, hoursEstimatedT;
		
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
		
		let newTaskData = {
			id: taskId,
			title: titleT,
			description: descriptionT,
			hoursEstimated: hoursEstimatedT,
			completed: completedT,
			comments: taskToChange.comments
		};
		
		const updateTask = await taskCollection.updateOne({id: taskId}, {$set: newTaskData});
		
		if (updateTask.modifiedCount === 0) {
			throw "Could not update recipe.";
		}
		
		return await module.exports.getTaskById(taskId);
		
	},
	
	//Add comment to task
	addComment: async (taskId, name, comment) => {
		if (!taskId) {
			throw "You must provide a task ID.";
		}
		if (!name) {
			throw "You must provide a name.";
		}
		if (!comment) {
			throw "You must provide a comment.";
		}
		if (typeof taskId != "string" || typeof name != "string" || typeof comment != "string") {
			throw "Task ID, name, and comment must all be strings.";
		}
		
		const taskCollection = await tasks();
		let newId = uuid();
		let newComment = {
			id: newId,
			name: name,
			comment: comment
		};
		
		const insertComment = await taskCollection.updateOne({id: taskId}, {$addToSet: {comments: newComment}});
		if (insertComment.modifiedCount === 0) {
			throw "Could not add comment to the recipe.";
		}
		
		return newComment;
	},
	
	//Remove comment from task
	removeComment: async(taskId, commentId) => {
		if (!taskId) {
			throw "You must provide a task id to search for.";
		}
		if (!commentId) {
			throw "You must provide a comment id to search for.";
		}
		if (typeof commentId != "string" || typeof taskId != "string") {
			throw "Id input must be a string.";
		}
		
		const taskCollection = await tasks();
		const deletionComment = await taskCollection.findOneAndUpdate({"id": taskId}, {$pull: {'comments': {id: commentId}}});
		
		if (deletionComment.deletedCount === 0) {
			throw "Could not remove comment.";
		}
		return deletionComment;
	}
}

module.exports = exportedMethods;