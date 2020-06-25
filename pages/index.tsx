import React, { Fragment } from 'react';
import { NextPage } from 'next';
import { Layout } from '../components/Layout'
import { Dashboard } from '../components/Dashboard';

interface InitialProps {
    greetings: string;
}

interface Props extends InitialProps {
    menus: string[];
}



const IndexPage: NextPage<Props, InitialProps> = () => {
    return (
        <div>
            <Layout onTaskCreated={["DashBoard", "Orders", "Customer", "Quote", "Update"]} currentLocation={0} />
            <div className="contentContainer">
                <Dashboard />
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
                        font-family: 'Montserrat', sans-serif;
                        justify-content: space-between;
                    }

                `}
            </style>
        </div>


    )
};

IndexPage.getInitialProps = async () => ({
    greetings: "Hello World"
});

export default IndexPage;