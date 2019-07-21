import React, { Component } from 'react';
import ApiService from '../ApiService';

class AddTodo extends Component {
    constructor(props){
        super(props);
        this.state = {
            users: [],
            title: '',
            user: ''
        };
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        const users = await ApiService.getUsers()
        let user1 = users[0];
        this.setState({
            users,
            user: user1
        });
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    async handleSubmit(e) {
        e.preventDefault();
        const user = this.state.user;
        const title = this.state.title;

        await ApiService.createTodo({
            user: parseInt(user, 10),
            title
        });

        this.props.history.push('/');
    }

    render() {
        return (
            <div>
                <form className='user__form' onSubmit={this.handleSubmit}>
                    <label>
                        Title
                        <input name='title' required value={this.state.title} onChange={this.handleChange}/>
                    </label>
                    <label>
                        User
                        <select name='user' value={this.state.user.id} onChange={this.handleChange}>
                            {this.state.users.map(({ first_name, last_name, id }, i) =>
                                <option key={i} value={id}>{first_name} {last_name}</option>
                            )}
                        </select>
                    </label>
                    <input type='submit' value='Submit' />
                </form>
                <button onClick={() => this.props.history.goBack()}>Cancel</button>
            </div>
        )
    }
}

export default AddTodo;