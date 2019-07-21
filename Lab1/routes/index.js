/*
Brianne Trollo
CS 554
Lab 1
I pledge my honor that I have abided by the Stevens Honor System.
*/
const apiTasksRoutes = require("./tasks");

const constructorMethod = app => {
	app.use("/api/tasks", apiTasksRoutes);
	
	app.use("*", (req, res) => {
		res.status(404).json({ error: "Not found" });
	});
};

module.exports = constructorMethod;