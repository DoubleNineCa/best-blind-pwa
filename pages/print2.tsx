import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";

import { _Print } from "../components/_Print";

const Print2 = () => {
    const router = useRouter();

    return <Fragment>
        <_Print
            orderNo={router.query.orderNo.toString()}
            customerName={router.query.customerName.toString()}
            stickerPosition={Number(router.query.stickerPosition)}
        />
    </Fragment>
}

export default Print2;