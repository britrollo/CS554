// import React, { Component } from "react";
import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const removeQuery = gql`
mutation deleteQuote(
    $id: String!
){
    deleteQuote(
        input: {
            id: $id
        }
    ) {
        id
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

const DeleteQuote = ({ qid }) => (
    <div>
        <Mutation 
            mutation={removeQuery}
            update={(cache, { data: { deleteQuote } }) => {
                const { quotes } = cache.readQuery({
                    query: getAll
                });
                cache.writeQuery({
                    query: getAll,
                    data: {
                        quotes: quotes.filter(
                            e => e.id !== qid
                        )
                    }
                });
            }}
        >
            {(deleteQuote, { data }) => (
                <div>
                    <form
                        className="form"
                        id="delete-quote"
                        onSubmit={e => {
                            e.preventDefault();
                            deleteQuote({
                                variables: {
                                    id: qid
                                }
                            });
                        }}
                    >
                        <button type="submit"> Delete </button>
                    </form>
                </div>
            )}
        </Mutation>
    </div>
);

export default DeleteQuote;