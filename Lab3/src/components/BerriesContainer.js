import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import BerriesList from './BerriesList';
import Berries from './Berries';
import Err from './Err';

class BerriesContainer extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/berries/page/:page" component={BerriesList} />
                    <Route path="/berries/:id" component={Berries} />
                    <Route path="/404" component={Err} />
                </Switch>
            </div>
        )
    }
}

export default BerriesContainer;