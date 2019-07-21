import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

const editQuery = gql`
    mutation updateQuote(
        $quote: String!,
        $id: String!
    ){
        updateQuote(
            input: {
                id: $id,
                quote: $quote
            }
        ) {
            id
            quote
        }
    }
`;

const getAll = gql`
    query {
        quotes{
            id
            quote
        }
    }
`;


class EditQuote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: ""
        }
    }

    componentDidMount() {
        let url = this.props.match.params.id;
        this.setState({ id: url })
        console.log(this.props)
    }

    render() {
        let q;
        return (
            <div>
                <Query query={getAll}>
                    {({ data }) => {
                        if (!data) {
                            console.log(data);
                            return;
                        }
                        const { quotes } = data;
                        if (!quotes) {
                            return null;
                        }
                        return quotes.map(({ id, quote }) => {
                            if (id === this.state.id) {
                                return (
                                    <div key={this.state.id}>
                                        <Mutation
                                            mutation={editQuery}
                                        >
                                            {(updateQuote, { data }) => (
                                                <form
                                                    className="form"
                                                    id="add-quote"
                                                    onSubmit={e => {
                                                        e.preventDefault();
                                                        updateQuote({
                                                            variables: {
                                                                id: this.state.id,
                                                                quote: q.value
                                                            }
                                                        });
                                                        q.value = "";
                                                        this.props.history.push('/quotes')
                                                    }}
                                                >
                                                    <label>
                                                        <br />
                                                        <input
                                                            ref={node => {
                                                                q = node;
                                                            }}
                                                            defaultValue={quote}
                                                            autoFocus={true}
                                                        />
                                                    </label>
                                                    <br />
                                                    <button className="button add-button" type="submit">
                                                        Update Quote
                                                </button>
                                                </form>
                                            )}
                                        </Mutation>
                                    </div>
                                );
                            } else {
                                return null;
                            }

                        })
                    }}
                </Query>

            </div>
        );
    }
}

export default EditQuote;