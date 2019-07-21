import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const addQuery = gql`
    mutation createQuote(
        $quote: String!
    ){
        createQuote(
            input: {
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

class CreateQuote extends Component {
    submitForm() {
        this.props.history.push("/quotes");
    }

    render() {
        let body;
        let quote;
        body = (
            <Mutation
                mutation={addQuery}
                update={(cache, { data: { createQuote } }) => {
                    const { quotes } = cache.readQuery({
                        query: getAll
                    });
                    cache.writeQuery({
                        query: getAll,
                        data: { quotes: quotes.concat([createQuote]) }
                    });
                }}
            >
                {(createQuote, { data }) => (
                    <form
                        id="add-quote"
                        onSubmit={e => {
                            e.preventDefault();
                            createQuote({
                                variables: {
                                    quote: quote.value
                                }
                            });
                            quote.value = "";
                            this.submitForm()
                        }}
                    >
                        <label>
                            Enter Quote:
                            <br />
                            <input
                                ref={node => {
                                    quote = node;
                                }} 
                                required
                                autoFocus={true}
                            />
                        </label>
                        <br />
                        <input type="submit" value="Submit" />
                    </form>
                )}
            </Mutation>
        );
        return body;
    }
}

export default CreateQuote;