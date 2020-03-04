import { useRouter } from "next/router";
import { Fragment } from "react";
import _Invoice from "../components/_Invoice";
import _Invoice2 from "../components/_Invoice2";

const PrintInvoice = () => {
    const router = useRouter();

    return <Fragment>
        <_Invoice2 orderNo={router.query.orderNo.toString()} />
    </Fragment>
}

export default PrintInvoice;