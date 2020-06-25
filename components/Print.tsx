import React, { Fragment, useState } from 'react';
import { Item } from "../generated/graphql";
// import { Customer } from "../generated/graphql";

export interface Props {
    items: Item[],
    customerName: string
}

interface itemState {
    startPosition: number;
    totalCount: number;
}

const defaultItemState: itemState = {
    startPosition: 0,
    totalCount: 30
};

export const Print: React.FC<Props> = ({ items, customerName }) => {
    const [itemState, setItemState] = useState<itemState>(defaultItemState);
    const doPrint = () => {
        window.open("/print2", "_blank")!.focus();
    }

    return <Fragment>
        <div className="printContainer">
            <div className="printTopSection">
                <div className="printSectionTitle">Print</div>
            </div>
            <div className="printTable" id="printTable">
                <div className="headerSection" onClick={doPrint}>doPrint</div>
                <div className="printItems">
                    {
                        items !== undefined && items !== null && items.length > 0 ?
                            items.map((item, i) => {
                                const coverClass = item.coverColor.toLowerCase();
                                return <div className="item">
                                    <div className="itemHeader">
                                        <div className="hLeft">{i + 1}</div>
                                        <div className="hCenter">{Number(new Date(Date.now()).getMonth()) + 1} / {(new Date(Date.now()).getDate())}</div>
                                        <div className="hRight">{customerName}</div>
                                    </div>
                                    <div className="itemContent">{item.itemName}</div>
                                    <div className="itemFooter">
                                        {/* <div className="fLeft" style={{ background: item.coverColor === "IVORY" ? "Wheat" : item.coverColor.toLowerCase(), color: item.coverColor === "BLACK" || item.coverColor === "BROWN" ? "white" : "black" }}>{item.coverColor}</div> */}
                                        <div className={"fLeft" + " " + coverClass}>{item.coverColor}</div>
                                        <div className="fCenter">{item.width} X {item.height}</div>
                                        <div className="fRight">{item.handrailMaterial.substr(0, 1)}({item.handrailType})-{item.handrailLength}</div>
                                    </div>
                                </div>
                            })
                            :
                            <div> "hi" </div>
                    }
                </div>

            </div>
        </div>
        <style jsx>{`
            .printContainer{
                width: 812.6px;
                max-height: 1058.27px;
                position: relative;
                margin-right: 515px;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                flex-direction: column;
            }

            .printTopSection{
                width: 812.6px;
                height: 6vh;
                border-radius: 5pt;
                position: absolute;
                top: 0;
                right: 0;
                display: flex;
                justify-content: space-between;
            }

            .printTopSection .printSectionTitle{
                width: 100px;
                height: auto;
                font-size: 1.125rem;
                font-family: 'Montserrat', sans-serif;
                color: #2F3D4C;
                padding: 10px 0px 0px 10px;
                display: flex;
                justify-content: flex-start;
                // align-items: flex-start;
            }

            .printTable{
                width: 812.6px;
                height: 75vh;
                padding-left: 30px;
                position: absolute;
                border: 2px solid black;
                // float:left;
                bottom: 0;
                border-top-left-radius: 7pt;
                border-top-right-radius: 7pt;
            }

            .printTable .headerSection{
                height: 45.3px;
                border: 1px solid red;
                flex-direction: column;
            }

            .printItems{
                width: 100%;
                height: 5vh;
                margin-top: 45.3px;
                border-bottom: none;
                border-top-left-radius: 7pt;
                border-top-right-radius: 7pt;
                position: absolute;
                top: 0;
                
            }

            .item{
                width: 242.45px;
                height: 94.49px;
                border: 1px none black;
                border-radius: 5pt;
                margin-right: 15px;
                padding: 2px 5px 2px;
                font-family: 'Montserrat', sans-serif;
                float:left;
                align-items: center;
                justify-content: center;
            }
            .itemHeader{
                height: 25%;
                display:flex;
                text-align: center;
            }
            .hLeft{
                width: 30%;
                text-align: left;
                color: skyblue;
            }
            .hCenter{
                width: 40%;
            }
            .hRight{
                width: 30%;
                text-align: right;
            }

            .itemContent{
                height: 50%;
                line-height: 45px;
                text-align: center;
            }
            .itemFooter{
                height: 25%;
                display:flex;
                text-align: center;
                justify-content: space-evenly;
            }
            .fLeft{
                width: 25%;
                height: 18px;
                text-align: center;
                justify-content:center;
                border-radius: 5px;
                font-weight: bold;
                align-items: flex-start;
                border: 1px solid;
            }
            .ivory{
                -webkit-print-color-adjust: exact !important;
                background: Wheat;
            }
    
            .black{
                -webkit-print-color-adjust: exact !important;
                background: black;
                color: white;
            }
    
            .brown{
                -webkit-print-color-adjust: exact !important;
                background: brown;
                color: white
            }
            .grey{
                -webkit-print-color-adjust: exact !important;
                background: grey;
                color: white;
            }
            .fCenter{
                width: 40%;
                color: red;
                background: yellow;
                font-weight: bold;
                border-radius: 5px;
                height: 18px;
            }
            .fRight{
                width: 30%;
                text-align: right;
                height: 18px;
            }
        `}</style>
    </Fragment>
}
