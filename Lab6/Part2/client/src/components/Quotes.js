import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import DeleteQuote from "./DeleteQuote";
import { Link } from "react-router-dom";


const getAll = gql`
    query {
        quotes{
            id
            quote
        }
    }
`;

class Quotes extends Component {
    render() {
        return (
            <div>
                <Query query={getAll}>
                    {({ data }) => {
                        if(!data) {
                            console.log(data);
                            return;
                        }
                        const { quotes } = data;
                        if (!quotes) {
                            return null;
                        }
                        return (
                            <div>
                                {quotes.map(quote => {
                                    return (
                                        <div key={quote.id}>
                                            <h5>
                                                {quote.quote}
                                            </h5>
                                            <button className="button">
                                                <Link to={`/quotes/edit/${quote.id}`}> Edit </Link>
                                            </button>
                                            <DeleteQuote qid={quote.id} />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }}
                </Query>
            </div>
        );
    }
}

export default Quotes;