import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Machines extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: undefined,
            loading: false,
            error: false
        };
    }

    componentWillMount() {
        this.getMachine()
    }

    async getMachine() {
        this.setState({
            loading: true
        });
        try {
            const response = await axios.get(
                `https://pokeapi.co/api/v2/machine/${this.props.match.params.id}`
            );
            this.setState({
                data: response.data,
                loading: false
            });
        } catch(e) {
            this.setState({error: true});
            console.log(`error ${e}`);
        }
    }

    render() {
        if (this.state.error) {
            return (<Redirect to = '/404/' />);
        } 
        let body = null;
        if (this.state.loading) {
            body = (
                <div>
                    <h1>Loading...</h1>
                </div>
            );
        } else {
            body = (
                <div>
                    <h2 className="cap-first-letter">
                        {this.state.data && this.state.data.item.name}
                    </h2>
                    <div className="attributes">
                        <p>
                            <b>Move:</b> {this.state.data.move.name}
                            <br />
                            <b>Version Group:</b> {this.state.data.version_group.name}
                        </p>
                    </div>
                </div>
            );
        }
        return body;
    }
}

export default Machines;