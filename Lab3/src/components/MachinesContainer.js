import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import MachinesList from './MachinesList';
import Machines from './Machines';
import Err from './Err';

class MachinesContainer extends Component {
    render() {
        return (
            <div>
                <Switch>
                    {/* <Route path="/machines/" exact component={MachinesList} /> */}
                    <Route path="/machines/page/:page" component={MachinesList} />
                    <Route path="/machines/:id" component={Machines} />
                    <Route path="/404" component={Err} />
                </Switch>
            </div>
        )
    }
}

export default MachinesContainer;