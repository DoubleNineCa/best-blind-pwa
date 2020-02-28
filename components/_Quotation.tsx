import React, { Fragment, useState, Component } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
// import { Customer } from "../generated/graphql";
import { Item } from "../generated/graphql";
import { ErrorView } from './ErrorView';
import { calFormatter, cashFormatter } from '../util/formatter';

export interface Props {
    orderNo: string
}

const GET_ORDER = gql(`
query getOrder($orderNo: String!){
    getOrder(orderNo: $orderNo){
        id,
        hst,
        deposit,
        discount,
        installation,
        installationDiscount,
        total,
        items{
            id,
            partId,
            itemName,
            width,
            height,
            price,
            handrailMaterial,
            handrailType,
            handrailLength,
            coverColor
          },
        payment,  
        orderDate,
        installDate,
        customer{
            name,
            address,
            phone,
            note
        }
        
    }
}
`);

export const _Quotation: React.FC<Props> = ({ orderNo }) => {
    const { loading, error, data } = useQuery(GET_ORDER, {
        variables: {
            orderNo
        }
    });



    if (loading) return <p>Loading...</p>
    else if (error) return <ErrorView errMsg={error.message} currentLocation={1} />

    const order = data.getOrder;
    const customer = order.customer;
    const items = order.items;
    const printedItems = items.concat(new Array<Item>(24 - items.length));
    const emptyItem = { itemName: "none" } as Item;
    printedItems.fill(emptyItem, items.length, printedItems.length - 1);

    const totalPrice = {
        sqrt: 0,
        selectTotalPrice: 0,
        negoTotalPrice: 0,
        saleTotalPrice: 0
    }
    items.map((item: Item) => {
        totalPrice.sqrt += (item.width * item.height / 10000) > 1.5 ? (item.width * item.height / 10000) : 1.5;
        totalPrice.selectTotalPrice += item.price;
        totalPrice.negoTotalPrice += item.price * order.discount / 100;
    });

    totalPrice.selectTotalPrice += order.installation;
    totalPrice.negoTotalPrice += order.installationDiscount;
    totalPrice.saleTotalPrice = totalPrice.selectTotalPrice - totalPrice.negoTotalPrice;

    return <Fragment>
        <div className="container">
            <div className="topSection">
                <div className="companyInfo">
                    <div className="logo">
                        <img src="/static/blue_logo.png" />
                    </div>
                    <div className="webAddr">
                        www.Best-blinds.ca
                    </div>
                    <div className="location">
                        # 11 - 70 GIBSON DR.<br />
                        MARKHAM, ON L3R 4C2<br />
                        ☎︎: (416)333-7094, (416)568-3303
                    </div>
                </div>
                <div className="workTitle">
                    WORK SHEET
                </div>
                <div className="customerInfo">
                    <div className="orderDate">
                        DATE: {calFormatter(order.orderDate)}
                    </div>
                    <div className="customerDetail">
                        ORDER # : {orderNo}<br />
                        NAME: {customer.name}<br />
                        TEL: {customer.phone}<br />
                        ADDRESS: <br />{customer.address}<br />
                    </div>
                </div>
            </div>
            <div className="listSection">
                <div className="quoteTable">
                    <div className="quoteTitles">
                        <div className="quoteRoomTitle">ROOM NAME</div>
                        <div className="quoteWindowTitle">#</div>
                        <div className="quoteBlindTitle">BLIND STYLE</div>
                        <div className="quoteWidthTitle">WIDTH</div>
                        <div className="quoteHeightTitle">HEIGHT</div>
                        <div className="quoteSqrtTitle">훼배</div>
                        <div className="quoteLRTitle">L/R</div>
                        <div className="quoteControlTitle">Control Height</div>
                        <div className="quoteSelectPTitle">SELECT PRICE</div>
                        <div className="quoteNegoTitle">NEGO ({order.discount}%)</div>
                        <div className="quoteSalePTitle">SALE PRICE</div>
                    </div>
                    <div className="quoteList">
                        {
                            printedItems.map((item: Item, idx: any) => {
                                const discountedPrice = item.price * order.discount / 100;
                                const salePrice = item.price - discountedPrice;

                                if (item.id) {
                                    return (<div className="quoteOverview">
                                        <div className="quoteRoom">거실</div>
                                        <div className="quoteWindow">{idx + 1}</div>
                                        <div className="quoteBlind">{item.itemName}</div>
                                        <div className="quoteWidth">{item.width}</div>
                                        <div className="quoteHeight">{item.height}</div>
                                        <div className="quoteSqrt">{(item.width * item.height / 10000) > 1.5 ? (item.width * item.height / 10000) : 1.5}</div>
                                        <div className="quoteLR">{item.handrailType}</div>
                                        <div className="quoteControl">{item.handrailLength}</div>
                                        <div className="quoteSelectP">{cashFormatter(item.price)}</div>
                                        <div className="quoteNego">{cashFormatter(discountedPrice)}</div>
                                        <div className="quoteSaleP">{cashFormatter(salePrice)}</div>
                                    </div>)
                                }

                                return (<div className="quoteOverview">
                                    <div className="quoteRoom"></div>
                                    <div className="quoteWindow"></div>
                                    <div className="quoteBlind"></div>
                                    <div className="quoteWidth"></div>
                                    <div className="quoteHeight"></div>
                                    <div className="quoteSqrt"></div>
                                    <div className="quoteLR"></div>
                                    <div className="quoteControl"></div>
                                    <div className="quoteSelectP"></div>
                                    <div className="quoteNego"></div>
                                    <div className="quoteSaleP"></div>
                                </div>)

                            })
                        }
                        <div className="quoteOverviewInstallation">
                            <div className="quoteRoom"></div>
                            <div className="quoteWindow"></div>
                            <div className="quoteBlind"></div>
                            <div className="quoteWidth"></div>
                            <div className="quoteHeight"></div>
                            <div className="quoteSqrt"></div>
                            <div className="quoteLR"></div>
                            <div className="quoteControl"></div>
                            <div className="quoteSelectP">[Installation]</div>
                            <div className="quoteNego">[Discount]</div>
                            <div className="quoteSaleP"></div>
                        </div>
                        <div className="quoteOverviewBottom">
                            <div className="quoteRoom">총({items.length})창</div>
                            <div className="quoteWindow"></div>
                            <div className="quoteBlind"></div>
                            <div className="quoteWidth"></div>
                            <div className="quoteHeight"></div>
                            <div className="quoteSqrt"></div>
                            <div className="quoteLR"></div>
                            <div className="quoteControl"></div>
                            <div className="quoteSelectP">{cashFormatter(order.installation)}</div>
                            <div className="quoteNego">{cashFormatter(order.installationDiscount)}</div>
                            <div className="quoteSaleP"></div>
                        </div>
                        <div className="quoteOverviewTotal">
                            <div className="quoteRoom">TOTAL</div>
                            <div className="quoteWindow"></div>
                            <div className="quoteBlind"></div>
                            <div className="quoteWidth"></div>
                            <div className="quoteHeight"></div>
                            <div className="quoteSqrt">{totalPrice.sqrt.toPrecision(2)}</div>
                            <div className="quoteLR"></div>
                            <div className="quoteControl"></div>
                            <div className="quoteSelectP">{cashFormatter(totalPrice.selectTotalPrice)}</div>
                            <div className="quoteNego">{cashFormatter(totalPrice.negoTotalPrice)}</div>
                            <div className="quoteSaleP">{cashFormatter(totalPrice.saleTotalPrice)}</div>
                        </div>
                    </div>
                </div>
                <div className="quoteOverviewTable">
                    <div className="signature">
                        <div className="signatureOverview"></div>
                        <div className="signatureOverview">
                            <div className="signatureType">[ 제작 ]</div>
                            <div className="signatureInput"></div>
                        </div>
                        <div className="signatureOverview">
                            <div className="signatureType">[ 설치 ]</div>
                            <div className="signatureInput"></div>
                        </div>
                        <div className="signatureOverview">
                            <div className="signatureType">[ 결제 ]</div>
                            <div className="signatureInput"></div>
                        </div>
                    </div>
                    <div className="emptySpace">

                    </div>
                    <div className="summary">
                        <div className="summaryOverview">
                            <div className="summaryType">&nbsp;SALE PRICE</div>
                            <div className="summaryValue">{cashFormatter(totalPrice.saleTotalPrice)}</div>
                        </div>
                        <div className="summaryOverview">
                            <div className="summaryType">&nbsp;HST(13%)</div>
                            <div className="summaryValue">{cashFormatter(totalPrice.saleTotalPrice * 0.13)}</div>
                        </div>
                        <div className="summaryOverview">
                            <div className="summaryType">&nbsp;DEPOSIT</div>
                            <div className="summaryValue">{cashFormatter(order.deposit)}</div>
                        </div>
                        <div className="summaryOverview">
                            <div className="summaryType">&nbsp;TOTAL PRICE</div>
                            <div className="summaryValue">{cashFormatter(totalPrice.saleTotalPrice + totalPrice.saleTotalPrice * 0.13 - order.deposit)}</div>
                        </div>
                    </div>
                    <div className="stamp">

                    </div>
                </div>
            </div>
        </div>

        <style jsx>{`
            .container{
                width: 750px;
                height: 981px;
                margin-left: 20px;
                margin-right: 20px;
                flex-direction:column;
                font-family: Arial, Helvetica, sans-serif;
            }
            .topSection{
                width:100%;
                height:130px;
                margin-top: 40px;
                display: flex;
                font-size: 0.675rem;
                justify-content: space-between;
                align-items: center;
            }
            .companyInfo{
                width: 30%;
                height:100%;
                display: grid;
                flex-direction: column;
                grid-row-gap: 5px;
            }
            .logo img{
                width: 70%;
            }
            .workTitle{
                width: 36%;
                height:100%;
                text-align: center;
                font-weight: bold;
                font-size: 20px;
            }
            .customerInfo{
                width: 27%;
                height:100%;
            }

            .orderDate{
                text-align: right;
            }

            .customerDetail{
                margin-top: 25px;
            }

            .listSection{
                width:100%;
                margin-top: 10px;
                height:830px;
            }

            .quoteTable{
                width: 100%;
                
                bottom: 0;
                font-size: 0.675rem;
            }

            .quoteTable .quoteTitles{
                width: 100%;
                height: 2.5vh;
                background: #68c6d9;
                color: white;
                border: 1px solid grey;
                border-bottom: none;
                display: flex;
            }

            .quoteRoomTitle{
                width: 12%;
                height: auto;
                border-right: 1px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteWindowTitle{
                width: 5%;
                height: auto;
                border-right: 1px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteBlindTitle{
                width: 20%;
                height: auto;
                border-right: 1px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteWidthTitle{
                width: 8%;
                height: auto;
                border-right: 1px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteHeightTitle{
                width: 8%;
                height: auto;
                border-right: 1px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteSqrtTitle{
                width: 5%;
                height: auto;
                border-right: 1px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteLRTitle{
                width: 5%;
                height: auto;
                border-right: 1px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteControlTitle{
                width: 5%;
                height: auto;
                border-right: 1px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteSelectPTitle{
                width: 12%;
                height: auto;
                border-right: 1px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteNegoTitle{
                width: 10%;
                height: auto;
                color: red;
                border-right: 1px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteSalePTitle{
                width: 10%;
                height: auto;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteList{
                width: 100%;
                background: white;
                display: flex;
                flex-direction: column;
                border: 1px solid grey;
                border-top: none;
                z-index: 1;
                bottom: 0;
            }

            .quoteOverview{
                width: 100%;
                border: none;
                min-height: 25px;
                border-bottom: 1px solid grey;
                background: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .quoteOverviewLast{
                width: 100%;
                border: none;
                min-height: 25px;
                border-bottom: 1px solid grey;
                background: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .quoteOverviewInstallation{
                width: 100%;
                border: none;
                min-height: 25px;
                border-top: 2px solid grey;
                border-bottom: 1px dashed grey;
                background: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .quoteOverviewBottom{
                width: 100%;
                border: none;
                min-height: 25px;
                border-bottom: 1px solid grey;
                background: ivory;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .quoteOverviewTotal{
                width: 100%;
                border: none;
                min-height: 25px;
                font-weight: bold;
                border-bottom: 1px solid grey;
                background: ivory;
                color:red;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .quoteRoom{
                width: 12%;
                min-height: 25px;
                border-right: 1px solid grey;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteWindow{
                width: 5%;
                min-height: 25px;
                border-right: 1px solid grey;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteBlind{
                width: 20%;
                min-height: 25px;
                border-right: 1px solid grey;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteWidth{
                width: 8%;
                min-height: 25px;
                border-right: 1px solid grey;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteHeight{
                width: 8%;
                min-height: 25px;
                border-right: 1px solid grey;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteSqrt{
                width: 5%;
                min-height: 25px;
                border-right: 1px solid grey;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteLR{
                width: 5%;
                min-height: 25px;
                border-right: 1px solid grey;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteControl{
                width: 5%;
                min-height: 25px;
                border-right: 1px solid grey;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteSelectP{
                width: 12%;
                min-height: 25px;
                border-right: 1px solid grey;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteNego{
                width: 10%;
                min-height: 25px;
                border-right: 1px solid grey;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteSaleP{
                width: 10%;
                min-height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .quoteOverviewTable{
                width: 100%;
                height: 100px;
                border-bottom: 2px solid grey;
                border-right: 1px solid grey;
                border-left: 1px solid grey;
                background: ivory;
                font-size: 0.675rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .signature{
                width: 37%;
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .signatureOverview{
                width: 100%;
                border: none;
                min-height: 23px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .signatureType{
                width: 47%;
                height: 90%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .signatureInput{
                width: 53%;
                height: 90%;
                border-bottom: 1px solid grey;
            }

            .emptySpace{
                width: 8.2%;
                height: 100%;
            }
            .summary{
                width: 35%;
                height: 100%;
                border: 2px solid grey;
                display: flex;
                background: #f6e8b1;
                flex-direction: column;
            }
            .summaryOverview{
                width: 100%;
                border: none;
                min-height: 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid grey;
            }
            .summaryType{
                width: 52%;
                height: 100%;
                text-align: right;
                border-right: 1px solid grey;
                display: flex;
                align-items: center;
            }
            .summaryValue{
                width: 48%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 2px;
            }
            .stamp{
                width: 19.8%;
                height: 100%;
                border-right: 2px solid grey;
            }
        `}
        </style>
    </Fragment>
}