/*
Brianne Trollo
CS 554
Lab 1
I pledge my honor that I have abided by the Stevens Honor System.
*/

const dbConnection = require("./mongoConnection");

const getCollectionFn = collection => {
	let _col = undefined;
	
	return async() => {
		if (!_col) {
			const db = await dbConnection();
			_col = await db.collection(collection);
		}
		return _col;
	};
};

module.exports = {
	tasks: getCollectionFn("tasks")
};