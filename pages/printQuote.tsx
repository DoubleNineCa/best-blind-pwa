import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";

import { _Quotation } from "../components/_Quotation";

const PrintQuote = () => {
    const router = useRouter();

    return <Fragment>
        <_Quotation orderNo={"20200001"} />
    </Fragment>
}

export default PrintQuote;