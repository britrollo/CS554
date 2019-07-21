import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import noImage from '../img/download.jpeg';

class Pokemon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            loading: false,
            error: false
        };
    }

    componentWillMount() {
        this.getPokemon();
    }

    async getPokemon() {
        this.setState({
            loading: true
        });
        try {
            const response = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${this.props.match.params.id}`
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
                    <h1>Pokémon</h1>
                    <br />
                    Loading...
                </div>
            );
        } else if (this.state.error) {
            body = (
                <div>
                    <h1>{this.state.error}</h1>
                </div>
            );
        } else {
            let img = null;
            if (this.state.data.sprites.front_default) {
                img = <img alt="Pokemon" src={this.state.data.sprites.front_default} />;
            } else {
                img = <img alt="Pokemon" src={noImage} />;
            }
            body = (
                <div>
                    <h2 className="cap-first-letter">
                        {this.state.data && this.state.data.name}
                    </h2>
                    {img}
                    <div className="attributes">
                        <p>
                            <b>Height:</b> {this.state.data.height}
                            <br />
                            <b>Weight:</b> {this.state.data.weight}
                            <br />
                            <b>Base Experience:</b> {this.state.data.base_experience}
                        </p>
                        <p><b>Types:</b></p><ul>
                            {this.state.data.types.map(obj => {
                                return <ul key={obj.type.name}>{obj.type.name}</ul>;
                            })}
                        </ul>
                        <p><b>Abilities:</b></p>
                        <ul>
                            {this.state.data.abilities.map(obj => {
                                return <ul key={obj.ability.name}>{obj.ability.name}</ul>;
                            })}
                        </ul>
                        <p><b>Moves:</b></p>
                        <ul>
                            {this.state.data.moves.map(obj => {
                                return <ul key={obj.move.name}>{obj.move.name}</ul>;
                            })}
                        </ul>
                    </div>
                </div>
            );
        }
        return body;
    }
}

export default Pokemon;