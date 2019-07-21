import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'
import Pagination from 'react-bootstrap/Pagination';

class BerriesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            loading: false,
            prev: null,
            next: 'https://pokeapi.co/api/v2/berry',
            page: 0,
            error: false
        };
        this.handlePrev = this.handlePrev.bind(this, this.state.page);
        this.handleNext = this.handleNext.bind(this, this.state.page);
    }

    async getBerries(newpage) {
        try {
            if (newpage) {
                await this.setState({page: newpage});
            }
            const response = await axios.get(`https://pokeapi.co/api/v2/berry?offset=${this.state.page*20}&limit=20`);
            await this.setState({
                data: response.data.results,
                total: response.data.count,
                prev: response.data.previous,
                next: response.data.next,
                maxPage: Math.floor(response.data.count / 20)
            });
            if (Number(this.state.page) > Number(this.state.maxPage) || Number(this.state.page) < 0) {
                throw new Error('Exceeded max page'); 
            }
        } catch(e) {
            this.setState({error: true});
            console.log(e);
        }
    }

    async handlePrev(self) {
        let p = Number(this.state.page);
        if (p > 0) {
            this.setState({
                page: p - 1
            }, () => {
                this.getBerries(this.state.page);
                this.props.history.push(`/berries/page/${this.state.page}`);
            });
        }
    }

    async handleNext(self) {
        let p = Number(this.state.page);
        if (p >= 0) {
            this.setState({
                page: p + 1
            }, () => {
                this.getBerries(this.state.page);
                this.props.history.push(`/berries/page/${this.state.page}`)
            });
        }
    }

    componentDidMount() {
        let page = this.props.match.params.page;
        this.getBerries(page);
    }

    render() {
        if (this.state.error) {
            return (<Redirect to = '/404/' />);
        }
        let body = null;
        let li = null;
        li = this.state.data && this.state.data.map(berries => (
            <li key={berries.name}>
                <Link to={`/berries/${berries.url.split("/")[6]}`}>{berries.name}</Link>
            </li>
        ));
        let pag = <Pagination>
            {this.state.prev ? <Pagination.Prev onClick={this.handlePrev} /> : null}
            {this.state.next ? <Pagination.Next onClick={this.handleNext} /> : null}
        </Pagination>
        body = (
            <div>
                <div className="pretty-list">
                    <ul>{li}</ul>
                </div>
                {pag}
            </div>
        );
        return body;
    }
}

export default BerriesList;