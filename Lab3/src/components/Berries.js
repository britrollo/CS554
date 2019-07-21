import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Berries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            loading: false,
            error: false
        };
    }

    componentWillMount() {
        this.getBerries();
    }

    async getBerries(){
        this.setState({
            loading: true
        });
        try {
            const response = await axios.get(
                `https://pokeapi.co/api/v2/berry/${this.props.match.params.id}`
            );
            this.setState({
                data: response.data,
                loading: false
            });
        } catch (e) {
            this.setState({error: true});
            console.log(`error ${e}`);
        }
    }

    render() {
        if(this.state.error) {
            return (<Redirect to = '/404/' />);
        }
        let body = null;
        if (this.state.loading) {
            body = (
                <div>
                    <h1>Berries</h1>
                    <br />
                    Loading...
                </div>
            );
        } else {
            body = (
                <div>
                    <h2 className="cap-first-letter">
                        {this.state.data && this.state.data.name}
                    </h2>
                    <div className="attributes">
                        <p>
                            <b>Firmess:</b> {this.state.data.firmness.name}
                            <br />
                            <b>Growth Time:</b> {this.state.data.growth_time}
                            <br />
                            <b>Size:</b> {this.state.data.size}
                            <br />
                            <b>Smoothness:</b> {this.state.data.smoothness}
                            <br />
                            <b>Natural Gift Power:</b> {this.state.data.natural_gift_power}
                        </p>
                        <p><b>Flavors:</b></p>
                        <ul>
                            {this.state.data.flavors.map(obj => {
                                return <ul key={obj.flavor.name}>{obj.flavor.name}:{obj.potency}</ul>;
                            })}
                        </ul>
                    </div>
                </div>
            );
        }
        return body;
    }
}

export default Berries;