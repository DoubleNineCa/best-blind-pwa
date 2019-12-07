import React, { Fragment } from 'react';
import { Grade } from "../generated/graphql";

interface Props {
    getGrades: Grade[];
}

export const Grades: React.FunctionComponent<Props> = ({ getGrades }) => {
    return (
        <Fragment>
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
            `}
            </style>
        </Fragment>
    );
}