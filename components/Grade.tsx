import React, { Fragment, useState } from 'react';
import gql from 'graphql-tag';
import { Query, useQuery } from 'react-apollo';

import { Grade } from "../generated/graphql";
import { cashFormatter } from '../util/formatter';
import { ErrorView } from './ErrorView';

export interface Props {
    getGrades: Grade[];
}
interface regularPriceState {
    width: number,
    height: number,
    grade: number,
    price: number;
}

const defaultRegularPrice: regularPriceState = {
    width: 0,
    height: 0,
    grade: 0,
    price: 0
}

interface inchState {
    cm: number
}

const defaultCm: inchState = {
    cm: 0
}

const gradesQuery = gql(`
    query GetGrades{
        getGrades{
            name
            price
          }
    }
`);

interface GetGradesQuery {
    getGrades: {
        id: any,
        uuid: string,
        name: string,
        price: number
    }[]
};

export const Grades: React.FunctionComponent = () => {
    const [regularPriceState, setRegularPriceState] = useState<regularPriceState>(defaultRegularPrice);
    const [inchState, setInchState] = useState<inchState>(defaultCm);
    const { loading, error, data } = useQuery<GetGradesQuery>(gradesQuery);

    const converter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInchState({
            cm: Number(e.currentTarget.value) * 2.54
        })
    }

    const widthHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const area = Number(e.currentTarget.value) * regularPriceState.height / 10000;
        setRegularPriceState({
            width: Number(e.currentTarget.value),
            height: regularPriceState.height,
            grade: regularPriceState.grade,
            price: area < 1.5 ? 1.5 * regularPriceState.grade : area * regularPriceState.grade
        })
    }

    const heightHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const area = Number(e.currentTarget.value) * regularPriceState.width / 10000;
        setRegularPriceState({
            width: regularPriceState.width,
            height: Number(e.currentTarget.value),
            grade: regularPriceState.grade,
            price: area < 1.5 ? 1.5 * regularPriceState.grade : area * regularPriceState.grade
        })
    }

    const gradeHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const area = regularPriceState.width * regularPriceState.height / 10000;
        setRegularPriceState({
            width: regularPriceState.width,
            height: regularPriceState.height,
            grade: Number(e.currentTarget.value),
            price: area < 1.5 ? 1.5 * Number(e.currentTarget.value) : area * Number(e.currentTarget.value)
        })
    }

    return (
        <Query<GetGradesQuery> query={gradesQuery}>
            {({ loading, error, data }) => {
                if (loading) {
                    return <p>Loading.</p>
                } else if (error) {
                    return <p><ErrorView errMsg={error.message} currentLocation={0} /></p>
                }

                const getGrades = data && data.getGrades ? data.getGrades : [];

                return <Fragment>
                    <div className="fillBlank"></div>
                    <div className="gradeContainer">
                        <div className="gradeTopSection">
                            <div className="gradeSectionTitle">Grade</div>
                        </div>
                        <div className="gradeTable">
                            <div className="gradeTitles">
                                <div className="gradeNameTitle">Grade #</div>
                                <div className="gradePriceTitle">Price</div>
                            </div>
                            <div className="gradeList">
                                {
                                    getGrades.map(grade => {
                                        return (<div className="gradeOverview">
                                            <div className="gradeName">{grade.name}</div>
                                            <div className="gradePrice">
                                                {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(grade.price)}
                                            </div>
                                        </div>)
                                    })
                                }
                            </div>
                        </div>

                    </div>
                    <div className="gradeController">
                        <div className="gradeDetails">
                            <div className="section">
                                <div className="itemInputRow">
                                    <div className="rowTitle">INCH</div>
                                    <input type="text" className="itemInput" placeholder="0" onChange={converter} />
                                    <div>{inchState.cm}cm</div>
                                </div>
                            </div>
                            <div className="section">
                                <div className="itemInputRow">
                                    <div className="rowTitle">WIDTH</div>
                                    <input type="text" className="itemInput" placeholder="0" onChange={widthHandle} />
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">HEIGHT</div>
                                    <input type="text" className="itemInput" placeholder="0" onChange={heightHandle} />
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">FABRIC GRADE</div>
                                    <select className="gradeSelect" onChange={gradeHandle}>
                                        {
                                            getGrades.map((grade, i) => {
                                                return <option value={grade.price}>{i + 1}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="section">
                                <div className="itemInputRow">
                                    <div className="rowTitle">Estimation</div>
                                    <div>{cashFormatter(regularPriceState.price)}</div>
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">Tax</div>
                                    <div>{cashFormatter(regularPriceState.price * 0.13)}</div>
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">Installation</div>
                                    <div>{cashFormatter(10)}</div>
                                </div>
                            </div>
                            <div className="section">
                                <div className="itemInputRow">
                                    <div className="rowTitle">Total</div>
                                    <div>{cashFormatter(regularPriceState.price * 1.13 + 10)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fillBlank"></div>

                    <style jsx>{`
    .fillBlank{
        width: 5vw;
    }

    .gradeContainer{
        width: 50vw;
        max-height: 81vh;
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
    }

    .gradeController{
        width: 39vw;
        max-height: 81vh;
        border: 2px solid black;
        border-top: 10px solid #2F3D4C;
        border-radius: 10pt;
        background: white;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: scroll;
    }

    .gradeTopSection{
        width: 49vw;
        height: 6vh;
        border-radius: 5pt;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
    }

    .gradeTopSection .gradeSectionTitle{
        width: 100px;
        height: auto;
        font-size: 1.125rem;
        font-family: tecnico;
        color: #2F3D4C;
        padding: 10px 0px 0px 10px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .gradeTopSection .tableToggle{
        width: 30%;
        height: 35px;
        display: flex;
        background: #2F3D4C;
        color: white;
        border: 1pt solid black;
        font-family: tecnico;
        border-radius: 25pt;
        box-shadow: 0px 1px 1px #F1F1F1;
        justify-content: space-evenly;
        align-items: center;
    }

    .gradeTopSection .tableToggle .tableToggleButton{
        width: 42%;
        height: 33px;
        font-size: 0.875rem;
        padding-top: 1.5pt;
        border-bottom: 1.5pt solid #FFC62B;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .gradeTopSection .tableToggle .tableToggleButtonInactive{
        width: 42%;
        height: 33px;
        font-size: 0.875rem;
        opacity: 0.6;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .gradeContainer .gradeTable{
        width: 50vw;
        height: 75vh;
        position: absolute;
        bottom: 0;
    }

    .gradeContainer .gradeTable .gradeTitles{
        width: 100%;
        height: 5vh;
        background: #2F3D4C;
        font-size: 0.875rem;
        color: white;
        border: 2px solid black;
        border-bottom: none;
        border-top-left-radius: 7pt;
        border-top-right-radius: 7pt;
        display: flex;
        position: absolute;
        top: 0;
    }

    .gradeContainer .gradeTable .gradeTitles .gradeNameTitle{
        width: 60%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .gradePriceTitle{
        width: 40%;
        height: auto;
        font-family: tecnico;
        border-right: 1pt solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .gradeList{
        width: 100%;
        height: 70vh;
        background: white;
        display: flex;
        flex-direction: column;
        border: 2px solid black;
        border-top: none;
        border-bottom-left-radius: 10pt;
        border-bottom-right-radius: 10pt;
        z-index: 1;
        position: absolute;
        bottom: 0;
        overflow: scroll;
    }

    .gradeOverview{
        width: 100%;
        min-height: 50px;
        font-size: 0.7rem;
        border: none;
        font-family: tecnico;
        border-bottom: 1px solid black;
        background: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .gradeName{
        width: 60%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .gradePrice{
        width: 40%;
        height: 50px;
        border-right: 1pt solid grey;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .gradeController{
        width: 25vw;
        max-height: 81vh;
        border: 2px solid black;
        border-top: 10px solid #2F3D4C;
        border-radius: 10pt;
        font-family: tecnico;
        background: white;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: scroll;
    }

    .gradeDetails{
        width: 100%;
        height: 88%;
        background: white;
        padding: 10px;
        overflow: scroll;
    }

    .itemInputRow{
        width: 90%;
        margin-top: 10px;
        margin-right: auto;
        margin-left: auto;
        justify-content: space-between;
        align-items: center;
        display: flex;   
    }

    .gradeSelect{
        width: 45%;
        margin-left: auto;
        justify-content: space-between;
        align-items: center;
        display: flex;   
    }

    .section {
        width: 80%;
        min-height: 20px;
        margin-left:10px;
        padding: 10px;
        border-bottom: 1px solid #616161;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        font-size: 0.875rem;
    }
`}
                    </style>
                </Fragment>
            }}
        </Query>

    );
}
