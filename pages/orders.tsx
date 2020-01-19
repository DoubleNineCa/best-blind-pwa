import { useRouter } from "next/router";
import { Fragment } from "react";

import { Layout } from '../components/Layout';
import { Orders } from "../components/Order";

const Order = () => {
    const router = useRouter();

    return <Fragment>
        <Layout onTaskCreated={["DashBoard", "Orders", "Customer", "Quote", "Update"]} currentLocation={1} />
        <div className="contentContainer">
            <Orders />
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
}

export default Order;