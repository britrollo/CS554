import React, { Component } from 'react';
import ApiService from '../ApiService';

class EditTodo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            actualTodo: null,
            id: null,
            todo: [],
            users: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const id = this.props.match.params.todoId;
        this.setState({ id: id });
        try {
            const todo = (await ApiService.getTodos());
            await this.findTodo(id, todo);
            const users = await ApiService.getUsers();
            this.setState({ users });
        } catch (e) {
            console.error(`An error ${e.message} occured while loading tasks for user ${id}`);
        }
    }

    async findTodo(id, todos) {
        for (var i = 0; i < todos.length; i++) {
            let t = todos[i];
            if (t.id === id) {
                this.setState({ actualTodo: t });
                break;
            }
        }
    }

    async handleSubmit(e) {
        e.preventDefault()
        const user = this.state.actualTodo.user;
        const title = this.state.actualTodo.title;
        const completed = this.state.actualTodo.completed;

        await ApiService.updateTodo({
            id: this.state.id,
            user: parseInt(user.id, 10),
            title,
            completed
        });


        this.props.history.push(`/todos/${user.id}`);
    }

    handleChange(e) {
        const t = e.target;
        if (t.name === 'user') {
            this.setState(prevState => ({
                actualTodo: {
                    ...prevState.actualTodo,
                    user: {
                        id: t.value
                    }
                }
            }));
        }
        else if (t.name === 'title') {
            this.setState(prevState => ({
                actualTodo: {
                    ...prevState.actualTodo,
                    title: t.name
                }
            }));
        }
        else if (t.name === 'completed') {
            this.setState(prevState => ({
                actualTodo: {
                    ...prevState.actualTodo,
                    completed: t.checked
                }
            }));
        }
    }

    render() {
        if (this.state.actualTodo) {
            return (
                <div>
                    <form className='user__form' onSubmit={this.handleSubmit}>
                        <label>
                            Title
                            <input name='title' value={this.state.actualTodo.title} required onChange={this.handleChange} />
                        </label>
                        <label>
                            User
                            <select name='user' value={this.state.actualTodo.user.id} onChange={this.handleChange}>
                                {this.state.users.map(({ first_name, last_name, id }, i) =>
                                    <option key={i} value={id}>{first_name} {last_name}</option>
                                )}
                            </select>
                        </label>
                        <label>
                            Complete
                            <input name='completed' type='checkbox' checked={this.state.actualTodo.completed} onChange={this.handleChange} />
                        </label>
                        <input type='submit' value='Update' />
                    </form>
                    <button onClick={() => this.props.history.goBack()}>Cancel</button>
                </div>
            );
        }
        return (
            <div>
                <h1>Loading...</h1>
                <button onClick={() => this.props.history.goBack()}>Cancel</button>
            </div>
        );
    }
}

export default EditTodo;