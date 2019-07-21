/*
Brianne Trollo
CS 554
Lab 7
I pledge my honor that I have abided by the Stevens Honor System.
*/
import * as express from "express";
import * as bodyParser from "body-parser";
import Tasks from './routes/tasks';
const pathsAccessed: { [key: string]: number } = {};

class App {
	public app: express.Application;
	public taskRoutes = Tasks;

	constructor() {
		this.app = express();
		this.config();
		this.taskRoutes.routes(this.app);
	}

	Logger = (req: express.Request, res: express.Response, next: Function) => {
		if (!pathsAccessed[req.path]) pathsAccessed[req.path] = 0;
		pathsAccessed[req.path]++;
		console.log("==========REQUEST==========");
		console.log("HTTP: " + req.method);
		console.log("Path: " + req.originalUrl);
		console.log("Body: " + JSON.stringify(req.body));
		console.log("Total accesses: " + pathsAccessed[req.path]);
		next();
	}

	

	private config(): void {
		this.app.use(bodyParser.json());
		this.app.use(
			bodyParser.urlencoded({
				extended: false
			})
		);
		this.app.use(this.Logger);
	}
}

export default new App().app;