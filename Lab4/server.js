// I pledge my honor that I have abided by the Stevens Honor System. Brianne Trollo

const bluebird = require("bluebird");

const express = require("express");
const app = express();

const redis = require("redis");
const client = redis.createClient();

const data = require("./lab4");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//Check connection to redis server
client.on('connect', function() {
	console.log('connected to redis');
});

const key = 'history';

//Get 20 most recent users from redis cache
app.get("/api/people/history", async (req, res) => {
	try {
		//Get cache from redis
		await client.lrange(key, 0, 19, (err, users) => {
			try {
				//Parse all JSONs in cache
				let parsed = [];
				for (let i = 0; i < users.length; i++) {
					let pUser = JSON.parse(users[i]);
					parsed.push(pUser);
				}
				res.json(parsed);
			} catch (err) {
				res.sendStatus(500);
			}
		});
	} catch(e) {
		console.log(e);
		res.sendStatus(500);
	}

});

//Get user by id, 
//Get user from cache if in cache
//If not in cache, find in data and add to cache
app.get("/api/people/:id", async (req, res) => {
	try {
		let id = req.params.id;
		let result;
		// check if user exists in cache
		let check = await client.existsAsync(id);
		if (check === 0) { //Not found 
			//get from data and add to cache
			result = await data.getById(id);
			await client.setAsync(
				id, 
				JSON.stringify(result)
			);
		} else {
			//get from cache
			let user = await client.getAsync(id);
			result = JSON.parse(user);
		}
		//add user to cache. duplicates allowed
		await client.lpush(
			key, 
			JSON.stringify(result)
		);
		res.json(result);
	} catch(e) {
		console.log(e);
		res.sendStatus(500);
	}

});

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log("Your routes will be running on http://localhost:3000");
});