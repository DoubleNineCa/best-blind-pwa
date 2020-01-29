import React, { Fragment, useState } from 'react';
import { useRouter } from "next/router";

export interface Props {
    errMsg: string;
    currentLocation: number
}
export const ErrorView: React.FC<Props> = ({ errMsg, currentLocation }) => {
    const router = useRouter();

    if (errMsg.includes("not authenticated")) {
        router.push(`/login?currentLocation=${currentLocation}`);
    }

    return <span>An error occured </span>
}
