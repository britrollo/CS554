/*
Brianne Trollo
CS 554
Lab 1
I pledge my honor that I have abided by the Stevens Honor System.
*/
const express = require("express");
const app = express();
const configRoutes = require("./routes");
const bodyparser = require("body-parser");

app.use(bodyparser.json());

const pathsAccessed = {};
app.use(function (req, res, next) {
	if (!pathsAccessed[req.path]) pathsAccessed[req.path]=0;
	pathsAccessed[req.path]++;
	console.log("==========REQUEST==========");
	console.log("HTTP: " + req.method);
	console.log("Path: " + req.originalUrl);
	console.log("Body: " + JSON.stringify(req.body));
	console.log("Total accesses: " + pathsAccessed[req.path]);
	next();
});

configRoutes(app);
app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log("Your routes will be running on http://localhost:3000");
});