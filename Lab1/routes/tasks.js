/*
Brianne Trollo
CS 554
Lab 1
I pledge my honor that I have abided by the Stevens Honor System.
*/
const express = require("express");
const router = express.Router();
const data = require("../data");
const taskData = data.tasks;

/*
GET
path: /api/tasks
Shows a list of tasks
*/
router.get("/", async (req, res) => {
	let skipped, took;
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
router.get("/:id", async(req, res) => {
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
router.post("/", async (req, res) => {
	try	{
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
		let newTask =  await taskData.addTask(newTaskInfo.title, newTaskInfo.description, newTaskInfo.hoursEstimated);
		res.json(newTask);
	} catch (e) { 
		res.status(500).json({error: e});
	}
});

/*
PUT
path: /api/tasks/:id
Updates the task with the id and returns created object
Must provide all details
*/
router.put("/:id", async (req, res) => {
	let updatedData = req.body;
	try{
		let getTask = await taskData.getTaskById(req.params.id);
		let updatedTask = await taskData.updateTask(req.params.id, updatedData);
		res.json(updatedTask);
		return updatedTask;
	} catch(e) {
		res.status(404).json({ error: e });
	}
});

/*
PATCH
path: /api/tasks/:id
Updates the task with the id and returns created object
Updates with provide details only
*/
router.patch("/:id", async (req, res) => {
	let updatedData = req.body;
	try {
		let getTask = await taskData.getTaskById(req.params.id);
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
router.post("/:id/comments", async (req, res) => {
	try {
		let taskId = req.params.id;
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
		let newComment = await taskData.addComment(taskId, commentInfo.name, commentInfo.comment);
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
router.delete("/:taskId/:commentId", async (req, res) => {
	try {
		let taskId = req.params.taskId;
		let commentId = req.params.commentId;
		let commment = await taskData.removeComment(taskId, commentId);
		res.send("The comment was deleted");
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

module.exports = router;