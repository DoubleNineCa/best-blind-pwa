import { useRouter } from "next/router";
import { Fragment } from "react";

import { Layout } from '../components/Layout';
import { Parts } from "../components/Part";
import { Grades } from "../components/Grade";

const Update = () => {
    const router = useRouter();

    return <Fragment>
        <Layout onTaskCreated={["DashBoard", "Orders", "Customer", "Quote", "Update"]} currentLocation={router.query.subMenu !== 'Parts' ? 4 : 5} />
        <div className="contentContainer">
            {
                router.query.subMenu === 'Parts' ?
                    <Parts />
                    :
                    <Grades />
            }

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

export default Update;