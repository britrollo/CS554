# Lab 1
## Set up
* Install node modules: `npm i`
* Start mongo service: `brew services start mongodb/brew/mongodb-community@4.2`
* Start server: `npm start`

## Routes
* `GET /api/tasks` - get all tasks in collection
* `GET /api/tasks/:id` - get tasks by id
* `POST /api/tasks` - add new task
* `PUT /api/tasks/:id` - update task by id; must provide all task details
* `PATCH /api/tasks/:id` - update task by id with only provided information
* `POST /api/tasks/:id/comments` - add comment to task by id
* `DELETE /api/tasks/:taskId/:commentId` - deletes comment with `:commentId` from task with `:taskId`

## Testing
Included postman collection and environment with example calls and tests for each endpoint.
