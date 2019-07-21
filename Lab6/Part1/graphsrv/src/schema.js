import Users from './data/users';
import Todos from './data/todos';
import find from 'lodash/find';
import filter from 'lodash/filter';
import sumBy from 'lodash/sumBy';
import uuid from 'uuid/v4';
import {
    GraphQLInt,
    GraphQLBoolean,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
} from 'graphql';

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Users in company',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        first_name: { type: new GraphQLNonNull(GraphQLString) },
        last_name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        department: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        todo_count: {
            type: GraphQLInt,
            resolve: (user) => {
                return sumBy(Todos, todo => todo.userId === user.id ? 1 : 0);
            }
        },
        todos: {
            type: new GraphQLList(TodoType),
            resolve: (user, args) => {
                return filter(Todos, todo => todo.userId === user.id);
            }
        }
    })
});

const TodoType = new GraphQLObjectType({
    name: 'Todo',
    description: 'Task for user',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
        completed: { type: new GraphQLNonNull(GraphQLBoolean) },
        user: {
            type: UserType,
            resolve: (todo, args) => {
                return find(Users, user => user.id === todo.userId);
            }
        }
    })
});

const TodoQueryRootType = new GraphQLObjectType({
    name: 'TodoAppSchema',
    description: 'Root Todo App Schema',
    fields: () => ({
        users: {
            args: {
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                department: { type: GraphQLString },
                country: { type: GraphQLString },
            },
            type: new GraphQLList(UserType),
            description: 'List of Users',
            resolve: (parent, args) => {
                if (Object.keys(args).length) {
                    return filter(Users, args);
                }
                return Users;
            }
        },
        todos: {
            args: {
                id: { type: GraphQLString },
                userId: { type: GraphQLInt },
                completed: { type: GraphQLBoolean },
            },
            type: new GraphQLList(TodoType),
            description: 'List of Todos',
            resolve: (parent, args) => {
                if (Object.keys(args).length) {
                    return filter(Todos, args);
                }
                return Todos;
            }
        }
    })
});

const MutationRootType = new GraphQLObjectType({
    name: 'MutationRootType',
    fields: {
        createTodo: {
            type: TodoType,
            args: {
                user: { type: new GraphQLNonNull(GraphQLInt) },
                title: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                let user = args.user;
                let title = args.title;
                const found = Users.find(({ id }) => id === user);
                if (found == null) {
                    throw new Error(`User ${user} not found`)
                }
                const newTodo = {
                    id: uuid(),
                    userId: user,
                    title,
                    completed: false
                }
                Todos.push(newTodo)
                return newTodo
            }
        },
        updateTodo: {
            type: TodoType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                user: { type: GraphQLInt },
                title: { type: GraphQLString },
                completed: { type: GraphQLBoolean }
            },
            resolve: (parent, args) => {
                let id = args.id;
                let user = args.user;
                let title = args.title;
                let completed = args.completed;
                const found = Users.find(({ id }) => id === user);
                if ( found == null) {
                    throw new Error(`User ${user} not found`)
                }
                const i = Todos.findIndex(todo => todo.id.toString() === id)
                if (i !== -1) {
                    const newTodo = {
                        id,
                        userId: user,
                        title,
                        completed
                    }
                    Todos[i] = newTodo
                    return newTodo
                } else {
                    throw new Error('Todo not found')
                }
            }
        },
        deleteTodo: {
            type: TodoType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, { id }) => {
                const i = Todos.findIndex(todo => todo.id.toString() === id);
                if (i === -1){
                    throw new Error('Todo not found')
                } else {
                    let deletedTodo = Todos[i]
                    Todos.splice(i, 1)
                    return deletedTodo
                }
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: TodoQueryRootType,
    mutation: MutationRootType
});

export default schema;