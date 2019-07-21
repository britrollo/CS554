import React from 'react';
import './styles/style.css';
import UserListContainer from './containers/UserListContainer';
import TodoListContainer from './containers/TodoListContainer';
import EditTodo from './components/EditTodo';
import AddTodo from './components/AddTodo';
import { Route, Switch } from 'react-router-dom';

const App = () => {
    return <Switch>
        <Route exact path='/' component={UserListContainer}/>
        <Route path='/todos/:userId' component={TodoListContainer}/>
        <Route path='/edit/:todoId' component={EditTodo}/>
        <Route path='/create' component={AddTodo} />
    </Switch>
};

export default App;
