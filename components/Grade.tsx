import React, { Fragment, useState } from 'react';
import gql from 'graphql-tag';
import { Query, useQuery, useMutation } from 'react-apollo';

import { Grade } from "../generated/graphql";
import { cashFormatter } from '../util/formatter';
import { ErrorView } from './ErrorView';
import { useRouter } from 'next/router';

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
    grade: 44,
    price: 0
}

interface inchState {
    width: number,
    height: number
}

const defaultCm: inchState = {
    width: 0,
    height: 0
}

interface gradeState {
    grade: string
}

const defaultGradeState: gradeState = {
    grade: ""
}

interface priceState {
    price: string
}

const defaultPriceState: priceState = {
    price: ""
}

interface currentLocation {
    currentLocation: string
}

const defaultCurrentLocation: currentLocation = {
    currentLocation: ""
}

const gradesQuery = gql(`
    query GetGrades{
        getGrades{
            id
            name
            price
          }
    }
`);

const REGISTER_GRADE = gql(`
mutation REGISTER_GRADE($input: GradeInput!){
    registerGrade(data: $input){
      name
      price
    }
  }
`);

const UPDATE_GRADE = gql(`
mutation UPDATE_GRADE($gradeId: Float!, $input: GradeInput!){
    updateGrade(gradeId: $gradeId, data: $input)
  }
`);

const DELETE_GRADE = gql(`
mutation DELETE_GRADE($gradeId: Float!){
    deleteGrade(gradeId: $gradeId)
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
    const router = useRouter();
    const [regularPriceState, setRegularPriceState] = useState<regularPriceState>(defaultRegularPrice);
    const [inchState, setInchState] = useState<inchState>(defaultCm);
    const { loading, error, data } = useQuery<GetGradesQuery>(gradesQuery);
    const [gradeState, setGradeState] = useState<gradeState>(defaultGradeState);
    const [priceState, setPriceState] = useState<priceState>(defaultPriceState);
    const [currentLocationState, setCurrentLocationState] = useState<currentLocation>(defaultCurrentLocation);

    const [registerGrade] = useMutation(REGISTER_GRADE);
    const [updateGrade] = useMutation(UPDATE_GRADE);
    const [deleteGrade] = useMutation(DELETE_GRADE);

    const wconverter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const area = Number(e.currentTarget.value) * regularPriceState.height / 10000;
        setRegularPriceState({
            width: Number(e.currentTarget.value) * 2.54,
            height: regularPriceState.height,
            grade: regularPriceState.grade,
            price: area < 1.5 ? 1.5 * regularPriceState.grade : area * regularPriceState.grade
        })

    }

    const hconverter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const area = Number(e.currentTarget.value) * regularPriceState.width / 10000;
        setRegularPriceState({
            width: regularPriceState.width,
            height: Number(e.currentTarget.value) * 2.54,
            grade: regularPriceState.grade,
            price: area < 1.5 ? 1.5 * regularPriceState.grade : area * regularPriceState.grade
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

    const handleGrade = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGradeState({
            grade: e.currentTarget.value
        })
    }

    const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPriceState({
            price: e.currentTarget.value
        })
    }

    const onSubmit = async (e: React.MouseEvent) => {
        if (e.currentTarget.innerHTML === "NEW") {
            const isRegister = await registerGrade({
                variables: {
                    input: {
                        name: gradeState.grade,
                        price: Number(priceState.price)
                    }
                }
            }).catch(err => {
                alert(err);
            });

            if (isRegister) {
                alert(`Your request to register grade "${gradeState.grade}" is successfully done!`);
                router.reload();
            }
        } else if (e.currentTarget.innerHTML === "UPDATE") {
            const isUpdate = await updateGrade({
                variables: {
                    gradeId: Number(currentLocationState.currentLocation),
                    input: {
                        name: gradeState.grade,
                        price: Number(priceState.price)
                    }
                }
            }).catch(err => alert(err));

            if (isUpdate) {
                alert(`Your request to update grade "${gradeState.grade}" is successfully done!`);
                router.reload();
            }
        } else if (e.currentTarget.innerHTML === "DELETE") {
            const isDelete = await deleteGrade({
                variables: {
                    gradeId: Number(currentLocationState.currentLocation)
                }
            }).catch(err => alert(err));

            if (isDelete) {
                alert(`Your request to delete grade "${gradeState.grade}" is successfully done!`);
                router.reload();
            }
        }

    }

    const setDetail = (grade: Grade) => (e: React.MouseEvent) => {
        setGradeState({
            grade: grade.name
        })

        setPriceState({
            price: grade.price.toString()
        })

        setCurrentLocationState({
            currentLocation: grade.id
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
                                        return (<div id={grade.id} className={grade.id === currentLocationState.currentLocation ? "gradeOverviewOn" : "gradeOverview"} onClick={setDetail(grade)}>
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
                                    <span className="flex-item-1">
                                        <input type="text" className="styledInput-1" placeholder="0" onChange={wconverter} />
                                    </span>
                                    X
                                    <span className="flex-item-1">
                                        <input type="text" className="styledInput-1" placeholder="0" onChange={hconverter} />
                                    </span>
                                </div>
                            </div>
                            <div className="section">
                                <div className="itemInputRow">
                                    <div className="rowTitle">WIDTH</div>
                                    <span className="flex-item">
                                        <input type="text" className="styledInput" value={regularPriceState.width} placeholder="0" onChange={widthHandle} />
                                    </span>
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">HEIGHT</div>
                                    <span className="flex-item">
                                        <input type="text" className="styledInput" value={regularPriceState.height} placeholder="0" onChange={heightHandle} />
                                    </span>
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">FABRIC GRADE</div>
                                    <select className="selectInput" onChange={gradeHandle}>
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
                            </div>
                            <div className="section">
                                <div className="itemInputRow">
                                    <div className="rowTitle">Total</div>
                                    <div>{cashFormatter(regularPriceState.price * 1.13)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="inputSection">
                            <div className="section-1">
                                <div className="partInput">
                                    <span className="blodeFont">GRADE : </span>
                                    <span className="flex-item">
                                        <input
                                            className="styledInput"
                                            value={gradeState.grade}
                                            onChange={handleGrade}
                                            type="text"
                                        />
                                    </span>
                                </div>
                                <div className="partInput">
                                    <span className="blodeFont">PRICE : </span>
                                    <span className="flex-item">
                                        $<input
                                            className="combiInput"
                                            value={priceState.price}
                                            onChange={handlePrice}
                                            type="text"
                                        />
                                    </span>
                                </div>
                            </div>

                            <div className="buttonSection">
                                <button className="newBtn" onClick={onSubmit}>NEW</button>
                                <button className="updateBtn" onClick={onSubmit}>UPDATE</button>
                                <button className="deleteBtn" onClick={onSubmit}>DELETE</button>
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
        font-family: 'Montserrat', sans-serif;
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
        font-family: 'Montserrat', sans-serif;
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
        font-family: 'Montserrat', sans-serif;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .gradePriceTitle{
        width: 40%;
        height: auto;
        font-family: 'Montserrat', sans-serif;
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
        font-family: 'Montserrat', sans-serif;
        border-bottom: 1px solid black;
        background: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .gradeOverviewOn{
        width: 100%;
        min-height: 50px;
        font-size: 0.7rem;
        border: none;
        border-bottom: 1px solid black;
        background: #C0C0C0;
        color: #7CFC00;
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
        max-height: 75vh;
        margin-top: 5vh;
        border: 2px solid black;
        border-top: 10px solid #2F3D4C;
        border-radius: 10pt;
        font-family: 'Montserrat', sans-serif;
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

    .flex-item {
        width: 150px;
        justify-content: center;
        margin-top:5px;
        border: 1px solid #dde5ff;
        border-radius: 4px;
        color: #5d647b;
        outline: 0;
        padding: 10px;
        text-align:right;
      }

    .styledInput{
        width: 140px;
        border: none;
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        text-align:right;
    }

    .combiInput{
        width: 120px;
        border: none;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.775rem;
        text-align:right;
    }

    .flex-item-1 {
        width: 70px;
        justify-content: center;
        margin-top:5px;
        border: 1px solid #dde5ff;
        border-radius: 4px;
        color: #5d647b;
        outline: 0;
        padding: 10px;
        text-align:right;
      }

    .styledInput-1{
        width: 70px;
        border: none;
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        text-align:right;
    }

    .selectInput{
        width: 200px;
        border: 1px solid #dde5ff;
        border-radius: 4px;
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        color: #5d647b;
        padding: 10px;
        text-align:right;
    }

    .inputSection{
        border-top: 1px solid grey;
        height: 250px;
    }

    .buttonSection{
        width: 100%;
        height: 7%;
        border-top: 1px solid #616161;
        background: #F1F1F1;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        position: absolute;
        bottom: 0;
        z-index: 2;
    }

    .section-1 {
        width: 85%;
        min-height: 50px;
        margin-left:10px;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        font-size: 0.875rem;
    }

    .partInput{
        width:100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
    }

    .newBtn{
        width: 30%;
        height: 40px;
        font-family: 'Montserrat', sans-serif;
        background: #FFBD00;
        color: white;
        font-size: 0.875rem;
        box-shadow: 1px 1px 1px grey;
        border: none;
        border-radius: 4pt;
        outline: none;
    }

    .updateBtn{
        width: 30%;
        height: 40px;
        font-family: 'Montserrat', sans-serif;
        background: #FFBD00;
        color: white;
        font-size: 0.875rem;
        box-shadow: 1px 1px 1px grey;
        border: none;
        border-radius: 4pt;
        outline: none;
    }

    .deleteBtn{
        width: 30%;
        height: 40px;
        font-family: 'Montserrat', sans-serif;
        background: #FFBD00;
        color: white;
        font-size: 0.875rem;
        box-shadow: 1px 1px 1px grey;
        border: none;
        border-radius: 4pt;
    }
`}
                    </style>
                </Fragment>
            }}
        </Query>

    );
}
