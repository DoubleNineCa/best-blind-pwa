import React, { Fragment, useState, Component } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
// import { Customer } from "../generated/graphql";
import { Item } from "../generated/graphql";
import { ErrorView } from './ErrorView';


export interface Props {
    // items: Item[],
    orderNo: string,
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

interface printState {
    items: Item[]
}

const defaultPrintState: printState = {
    items: {} as Item[]
}

const GET_ORDER = gql(`
query getOrder($orderNo: String!){
    getOrder(orderNo: $orderNo){
        id,
        items{
            id
            partId
            itemName
            width
            height
            price
            handrailMaterial
            handrailType
            handrailLength
            coverColor
          }
    }
}
`);



export const _Print: React.FC<Props> = ({ orderNo, customerName }) => {
    const [printState, setPrintState] = useState<printState>(defaultPrintState);
    const { loading, error, data } = useQuery(GET_ORDER, {
        variables: {
            orderNo
        }
    });


    const doPrint = () => {
        window.print();
        window.close();
    }

    if (loading) return <p>Loading...</p>
    else if (error) return <ErrorView errMsg={error.message} currentLocation={1} />

    const items = data.getOrder.items;
    return <html>
        <img src="/static/logo.png" onLoad={doPrint} />
        <div className="printItems">
            {
                items !== undefined && items !== null && items.length > 0 ?
                    items.map((item: Item, i: any) => {
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
        <style jsx>{`
        body{padding-top: 25px; padding-left: 12px;}
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
            font-family: tecnico;
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
            margin-left: 10px;
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
            margin-left: 10px;
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
    </html>
}