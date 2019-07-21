import React, { Component } from 'react';
import logo from './img/logo.png';
import './App.css';
import PokemonContainer from './components/PokemonContainer.js';
import BerriesContainer from './components/BerriesContainer';
import MachinesContainer from './components/MachinesContainer';
import Err from "./components/Err";

import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

// I pledge my honor that I have abided by the Stevens Honor System. Brianne Trollo

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to the Pokédex!</h1>
            <link
              rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
              integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
              crossOrigin="anonymous"
            />
          </header>
          <br />
          <br />
          <div className="App-body">
            <p>Pokémon are small adorable battle creatures. They fight in small teams of monsters 
              to defeat other teams in a quest to become the best. Berries come in a range of flavors, 
              names, and effects. Berries can have various effects on Pokémon. Machines are used to train Pokémon 
              in new moves.</p>
            <Link className="pokemonlink" to="/pokemon/page/0" target="_self">Pokémon</Link>
            <Link className="berrieslink" to="/berries/page/0" target="_self">Berries</Link>
            <Link className="machineslink" to="/machines/page/0" target="_self">Machines</Link>
            <Switch>
              <Route path="/pokemon/" component={PokemonContainer} />
              <Route path="/berries/" component={BerriesContainer} />
              <Route path="/machines/" component={MachinesContainer} />
              {/* <Route component={Err} /> */}
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
