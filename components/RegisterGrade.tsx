import React, { Fragment } from 'react';
import { Grade } from "../generated/graphql";

export interface Props {
    registerGrade: Grade;
}

export type GradeInput = {
    name: string,
    price: number
}

export const Grades: React.FC<Props> = ({ registerGrade }) => {
    return (
        <Fragment>
            "hi";
        </Fragment>
    );
}