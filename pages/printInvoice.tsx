import { useRouter } from "next/router";
import { Fragment } from "react";
import _Invoice from "../components/_Invoice";

const PrintInvoice = () => {
    const router = useRouter();

    return <Fragment>
        <_Invoice orderNo={router.query.orderNo.toString()} />
    </Fragment>
}

export default PrintInvoice;