import React, { Fragment, useState } from 'react';
import { useRouter } from "next/router";

import { Layout } from "../components/Layout";
import { Quotes } from '../components/Quote';

interface quoteState {
    customerId: string,
    orderNo: string
}

const defaultQuoteState: quoteState = {
    customerId: "0",
    orderNo: "last"
}

const Quote: React.FC = () => {
    const router = useRouter();
    const [quoteState, setQuoteState] = useState<quoteState>(defaultQuoteState);

    return (
        <Fragment>
            <Layout onTaskCreated={["DashBoard", "Orders", "Customer", "Quote", "Update"]} currentLocation={3} />
            <div className="contentContainer">
                <Quotes
                    customerId={router.query.customerId ? router.query.customerId.toString() : "0"}
                    orderNo={router.query.orderNo ? router.query.orderNo.toString() : "last"}
                />
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
                    justify-content: center;
                }
            `}</style>
        </Fragment>
    );
}

export default Quote;