/*
Brianne Trollo
CS 554
Lab 7
I pledge my honor that I have abided by the Stevens Honor System.
*/
import taskData from "../data/tasks";

import { Task, Comment } from '../types';
import { Request, Response } from 'express';

export class Tasks {

	public routes(app): void {
		/*
		GET
		path: /api/tasks
		Shows a list of tasks
		*/
		app.route("/api/tasks/").get(async (req: Request, res: Response) => {
			let skipped: number, took: number;
			if (!req.query.skip) {
				skipped = 0;
			} else {
				skipped = parseInt(req.query.skip);
			}
			if (!req.query.take) {
				took = 20;
			} else {
				took = parseInt(req.query.take);
				if (took > 100) {
					took = 100;
				}
				if (took < 0) {
					took = 20;
				}
			}
			try {
				const taskList = await taskData.getAllTasks(skipped, took);
				res.json(taskList);
			} catch (e) {
				res.status(500).send();
			}
		});

		/*
		GET
		path: /api/tasks/:id
		Shows the task with the supplied ID
		*/
		app.route("/api/tasks/:id").get(async (req: Request, res: Response) => {
			try {
				const task = await taskData.getTaskById(req.params.id);
				res.json(task);
			} catch (e) {
				res.status(404).json({ message: "Post not found" });
			}
		});

		/*
		POST
		path: /api/tasks
		Creates a new task
		*/
		app.route("/api/tasks/").post(async (req: Request, res: Response) => {
			try {
				const newTaskInfo = req.body;
				if (!newTaskInfo) {
					throw "Must enter data for task.";
				}
				if (!newTaskInfo.title) {
					throw "Must enter title data";
				}
				if (!newTaskInfo.description) {
					throw "Must enter description data";
				}
				if (!newTaskInfo.hoursEstimated) {
					throw "Must enter hours estimated data";
				}
				let newTask = await taskData.addTask(newTaskInfo.title, newTaskInfo.description, newTaskInfo.hoursEstimated);
				res.json(newTask);
			} catch (e) {
				res.status(500).json({ error: e });
			}
		});

		/*
		PUT
		path: /api/tasks/:id
		Updates the task with the id and returns created object
		Must provide all details
		*/
		app.route("/api/tasks/:id").put(async (req: Request, res: Response) => {
			let updatedData = req.body;
			try {
				let getTask: Task = await taskData.getTaskById(req.params.id);
				let updatedTask = await taskData.updateTask(req.params.id, updatedData);
				res.json(updatedTask);
				return updatedTask;
			} catch (e) {
				res.status(404).json({ error: e });
			}
		});

		/*
		PATCH
		path: /api/tasks/:id
		Updates the task with the id and returns created object
		Updates with provide details only
		*/
		app.route("/api/tasks/:id").patch(async (req: Request, res: Response) => {
			let updatedData = req.body;
			try {
				let getTask: Task = await taskData.getTaskById(req.params.id);
				let updatedTask = await taskData.patchTask(req.params.id, updatedData);
				res.json(updatedTask);
				return updatedTask;
			} catch (e) {
				res.status(404).json({ error: e });
			}
		});

		/*
		POST
		path: /api/tasks/:id/comments
		Adds a new comment to the task
		*/
		app.route("/api/tasks/:id/comments").post(async (req: Request, res: Response) => {
			try {
				let taskId: any = req.params.id;
				let commentInfo = req.body;
				if (!commentInfo) {
					throw "Must enter data for comment";
				}
				if (!commentInfo.name) {
					throw "Must enter name for comment";
				}
				if (!commentInfo.comment) {
					throw "Must enter comment data";
				}
				let newComment: Comment = await taskData.addComment(taskId, commentInfo.name, commentInfo.comment);
				res.json(newComment);
			} catch (e) {
				res.status(500).json({ error: e });
			}
		});

		/*
		DELETE
		path: /api/tasks/:taskId/:commentId
		Deletes the comment with an id of commentId on task the task with an id of taskId
		*/
		app.route("/api/tasks/:taskId/:commentId").delete(async (req: Request, res: Response) => {
			try {
				let taskId: any = req.params.taskId;
				let commentId: any = req.params.commentId;
				let commment: Comment = await taskData.removeComment(taskId, commentId);
				res.send({ status: "The comment was deleted" });
			} catch (e) {
				res.status(500).json({ error: e });
			}
		});
	}
}

export default new Tasks();