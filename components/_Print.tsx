import React, { Fragment, useState, Component } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
// import { Customer } from "../generated/graphql";
import { Item, PartType } from "../generated/graphql";
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
            partType
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


    const doPrint = async () => {
        await window.print();
        window.close();
    }

    if (loading) return <p>Loading...</p>
    else if (error) return <ErrorView errMsg={error.message} currentLocation={1} />

    const items = data.getOrder.items.filter((item: Item) => {
        return item.partType === PartType.Fabric;
    });
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
                                <div className="hRight">{customerName.length > 10 ? customerName.substr(0, 10) : customerName}</div>
                            </div>
                            <div className="itemContent">
                                <div className={"cover" + " " + coverClass}>{item.coverColor}</div> {item.itemName}
                            </div>
                            <div className="itemFooter">
                                {/* <div className="fLeft" style={{ background: item.coverColor === "IVORY" ? "Wheat" : item.coverColor.toLowerCase(), color: item.coverColor === "BLACK" || item.coverColor === "BROWN" ? "white" : "black" }}>{item.coverColor}</div> */}
                                {/* <div className={"fLeft" + " " + coverClass}>{item.coverColor}</div> */}
                                <div className="fCenter">{item.width} X {item.height}</div>
                                <div className="fRight">{item.handrailMaterial.substr(0, 1)}({item.handrailType})-{item.handrailLength}</div>
                            </div>
                        </div>
                    })
                    :
                    <div> No items on the order. </div>
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
            font-weight: bold;
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
            width: 10%;
            text-align: left;
            color: skyblue;
            margin-left: 10px;
        }
        .hCenter{
            width: 25%;
        }
        .hRight{
            width: 65%;
            text-align: center;
        }

        .itemContent{
            height: 50%;
            font-size: 0.9rem;
            display: flex;
            text-align: center;
            justify-content: space-around;
            align-items: center;
        }
        .itemFooter{
            height: 25%;
            display:flex;
            text-align: center;
            justify-content: space-evenly;
        }

        .cover{
            width: 20%;
            height: 18px;
            font-size: 0.8rem;
            border-radius: 5px;
            font-weight: bold;
            margin-left: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .white{
            -webkit-print-color-adjust: exact !important;
            border: 1px solid black;
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
            width: 60%;
            color: red;
            background: yellow;
            font-weight: bold;
            border-radius: 5px;
            height: 18px;
        }
        .fRight{
            width: 40%;
            text-align: center;
            height: 18px;
        }
    `}</style>
    </html>
}