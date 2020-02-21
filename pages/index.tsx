import React, { Fragment } from 'react';
import { NextPage } from 'next';
import { Layout } from '../components/Layout'
import { Grades } from "../components/Grade";

interface InitialProps {
    greetings: string;
}

interface Props extends InitialProps {
    menus: string[];
}



const IndexPage: NextPage<Props, InitialProps> = () => {
    return <Fragment>
        <Layout onTaskCreated={["DashBoard", "Orders", "Customer", "Quote", "Update"]} currentLocation={0} />
        <div className="contentContainer">
            <Grades />
        </div>

        <style jsx>{`
                    @font-face {
                        font-family: 'tecnico';
                        src: local('tecnico'), local('tecnico regular');
                        url(../fonts/tecnico_regular.ttf) format('ttf')
                    }

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

                    @font-face {
                        font-family: 'tecnico';
                        font-style: normal;
                        font-weight: normal;
                        src: local('tecnico_regular'), url('../fonts/tecnico_regular.tff') format('tff');
                      }
                `}
        </style>
    </Fragment>


};

IndexPage.getInitialProps = async () => ({
    greetings: "Hello World"
});

export default IndexPage;