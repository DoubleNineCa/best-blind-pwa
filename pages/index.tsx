import React from 'react';
import { NextPage } from 'next';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

interface InitialProps {
    greetings: string;
}

interface Props extends InitialProps {

}

const tasksQuery = gql(`
    query{
        getGrades{
            name
            price
          }
    }
`);

interface TasksQuery {
    getGrades: {
        name: string,
        price: number
    }[]
};

const IndexPage: NextPage<Props, InitialProps> = (props) => {
    return <Query<TasksQuery> query={tasksQuery}>{({ loading, error, data }) => {
        if (loading) {
            return <p>Loading.</p>
        } else if (error) {
            return <p>An error occured.</p>
        }

        const getGrades = data && data.getGrades ? data.getGrades : [];

        return (<ul>{getGrades.map((grade, i) => {
            return <li key={i}>{grade.name} / {grade.price}</li>
        })}</ul>)
    }}</Query>
};

IndexPage.getInitialProps = async () => ({
    greetings: "Hello World"
});

export default IndexPage;