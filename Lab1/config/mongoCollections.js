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
		try {
			if (!_col) {
				const client = await dbConnection();
				const db = client.db("test");
				_col = await db.collection(collection);
			}
			return _col;
		} catch (err) {
			console.log(err);
		}
		
	};
};

module.exports = {
	tasks: getCollectionFn("tasks")
};