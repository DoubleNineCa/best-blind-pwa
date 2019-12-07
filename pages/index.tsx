import React, { Fragment } from 'react';
import { NextPage } from 'next';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Layout } from '../components/Layout'
import { Grades } from "../components/Grade";


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
        id: any,
        uuid: string,
        name: string,
        price: number
    }[]
};

const IndexPage: NextPage<Props, InitialProps> = (props) => {
    return <Fragment>
        <Layout />
        <div className="contentContainer">
            <Query<TasksQuery> query={tasksQuery}>{({ loading, error, data }) => {
                if (loading) {
                    return <p>Loading.</p>
                } else if (error) {
                    return <p>An error occured.</p>
                }

                const getGrades = data && data.getGrades ? data.getGrades : [];

                return <Grades getGrades={getGrades} />
            }}</Query>
        </div>

        <style jsx>{`
                    .contentContainer {
                        width: 100vw;
                        height: 87vh;
                        background: #F9F9F9;
                        position: absolute;
                        top: 100px;
                        padding: 10px;
                        display: flex;
                        align-content: center;
                        justify-content: space-between;
                    }
                `}
        </style>
    </Fragment>


};

IndexPage.getInitialProps = async () => ({
    greetings: "Hello World"
});

export default IndexPage;