import React, { Fragment } from 'react';
import { useRouter } from "next/router";

import { Customer } from "../generated/graphql";
import { Layout } from "../components/Layout";
import Customers from '../components/Customer';

export interface Props {
    customer: Customer;
}

const CustomerInfo: React.FC<Props> = ({ customer }) => {
    const router = useRouter();
    return (
        <Fragment>
            <Layout onTaskCreated={["DashBoard", "Orders", "Customer", "Quote", "Update"]} currentLocation={2} />
            <div className="contentContainer">
                <Customers />
            </div>

            <style jsx>{`
                .contentContainer {
                    width: 98vw;
                    height: 87vh;
                    background: #F9F9F9;
                    position: absolute;
                    top: 100px;
                    padding: 10px;
                    display: flex;
                    align-content: center;
                    justify-content: space-evenly;
                }
            `}</style>
        </Fragment>
    );
}

export default CustomerInfo;