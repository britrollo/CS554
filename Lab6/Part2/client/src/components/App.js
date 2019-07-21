/*
I pledge my honor that I have abided by the Stevens Honor System. 
Brianne Trollo
CS554: Lab6, Part2
*/

import React, { Component } from 'react';
import { NavLink, BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Quotes from './Quotes';
import CreateQuote from './CreateQuote';
import EditQuote from './EditQuote';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <header className="App-header">
            <h1>Chuck Norris Says...</h1>
            <h2>Lab 6: Part 2</h2>
            <nav>
              <NavLink className="navlink" to="/quotes">
                <button>View Quotes</button>
              </NavLink>
              <NavLink to="/quotes/create">
                <button>Create Quote</button>
              </NavLink>
            </nav>
          </header>
          <Route exact path="/quotes" component={Quotes} />
          <Route path="/quotes/create" component={CreateQuote} />
          <Route path="/quotes/edit/:id" component={EditQuote} />
        </div>
      </Router>
    );
  }
}

export default App;
