import React from 'react';
import { NextPage } from 'next';

interface InitialProps {
    greetings: string;
}

interface Props extends InitialProps {

}

const IndexPage: NextPage<Props, InitialProps> = (props) => {
    return <div>{props.greetings}</div>
};

IndexPage.getInitialProps = async () => ({
    greetings: "Hello World"
});

export default IndexPage;