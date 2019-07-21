/*
Brianne Trollo
CS 554
Lab 7
I pledge my honor that I have abided by the Stevens Honor System.
*/


import { MongoClient } from "mongodb";

class connectDb {
	public db: MongoClient;

	public async connect() {
		try {
			this.db = await MongoClient.connect("mongodb://localhost:27017/Trollo-Brianne-CS554-Lab1");
			return this.db;
		} catch (error) {
			console.log("Unable to connect to db");
		}

	}
}

export = new connectDb();