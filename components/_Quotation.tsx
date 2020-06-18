import React, { Fragment, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { Item, PartType } from "../generated/graphql";
import { ErrorView } from './ErrorView';
import { calFormatter, cashFormatter, roundUp } from '../util/formatter';

export interface Props {
    orderNo: string
}

interface bgImg {
    imgSrc: string
}

const defaultBgImg: bgImg = {
    imgSrc: "none"
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
            partType,
            itemName,
            width,
            height,
            price,
            roomName,
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
    const [bgImgState, setBgImgState] = useState<bgImg>(defaultBgImg);
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
    const fabrics = order.items.filter((item: Item) => item.width > 0);
    const component = order.items.filter((item: Item) => item.width === 0);
    const printedItems = items.length < 24 ? fabrics.concat(new Array<Item>(24 - items.length)) : fabrics.concat(new Array<Item>(65 - items.length));
    const emptyItem = { itemName: "none" } as Item;
    const emptyItemArr = [emptyItem, emptyItem, emptyItem];
    let _printedItems;
    if (items.length > 24) {
        if (fabrics.length > 30) {
            const firstArr = fabrics.slice(0, 31);
            const followArr = fabrics.slice(30, fabrics.length);
            const firstPage = firstArr.concat(emptyItemArr).concat(followArr);

            if (component.length > 0) {
                _printedItems = firstPage.concat(new Array<Item>(30 - component.length));
                _printedItems.fill(emptyItem, firstPage.length, _printedItems.length - 1);
                _printedItems = _printedItems.concat(component);
            }
        }
    } else {
        _printedItems = fabrics.concat(new Array<Item>(24 - fabrics.length - component.length));
        _printedItems.fill(emptyItem, fabrics.length, _printedItems.length - 1);

        if (component.length > 0) {
            _printedItems = _printedItems.concat(component);
        }
    }
    printedItems.fill(emptyItem, items.length, printedItems.length - 1);
    // if (component.length > 0) {
    //     printedItems.fill(emptyItem, fabrics.length, printedItems.length - component.length - 1);
    //     printedItems.fill(component, printedItems.length - component.length - 1, printedItems.length - 1);
    // } else {
    //     printedItems.fill(emptyItem, items.length, printedItems.length - 1);
    // }

    // To-Do
    // Distribute print layout based on the number of order items
    // Case 1. if order item has less than 24, the process will be the same
    // Case 2. if order item has more than 24, need to print next page

    const totalPrice = {
        sqrt: 0,
        selectTotalPrice: 0,
        negoTotalPrice: 0,
        saleTotalPrice: 0
    }
    items.map((item: Item) => {
        //Math.round(input * 100) / 100
        if (item.partType === PartType.Fabric) {
            totalPrice.sqrt += roundUp(item.width * item.height / 10000, 10) > 1.5 ? roundUp(item.width * item.height / 10000, 10) : 1.5;
            totalPrice.selectTotalPrice += item.price;
            totalPrice.negoTotalPrice += Math.floor(item.price * order.discount) / 100;
        } else if (item.partType === PartType.Component) {
            totalPrice.selectTotalPrice += item.price * item.handrailLength;
        }

    });
    totalPrice.selectTotalPrice += order.installation;
    totalPrice.negoTotalPrice += order.installationDiscount;
    totalPrice.saleTotalPrice = totalPrice.selectTotalPrice - totalPrice.negoTotalPrice;

    const doPrint = async () => {
        await setBgImgState({
            imgSrc: "none"
        })
        window.print();
    }

    const showPrint = () => {
        setBgImgState({
            imgSrc: "url(/static/print_icon1.gif) #f0f0f0 no-repeat 50% 50%"
        })
    }

    const offPrint = () => {
        setBgImgState({
            imgSrc: "none"
        })
    }

    return <Fragment>
        <div className="container" onClick={doPrint} onMouseOver={showPrint} onMouseOut={offPrint} style={{ background: bgImgState.imgSrc }}>
            <div className="topSection">
                <div className="companyInfo">
                    <div className="logo">
                        <img src="/static/invoice_logo.png" />
                    </div>
                    <div className="webAddr">
                        www.Best-blinds.ca
                    </div>
                    <div className="location">
                        # 11 - 70 GIBSON DR.<br />
                        MARKHAM, ON L3R 4C2<br />
                        ☎︎: (647)718-0333, (416)385-3030<br />
                        Email: bestblindsca@gmail.com
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
            <div className="sizeUnit">(Unit : CM)</div>
            <div className="listSection">
                <div className="quoteTable">
                    <div className="quoteTitles">
                        <div className="quoteRoomTitle">ROOM NAME</div>
                        <div className="quoteWindowTitle">#</div>
                        <div className="quoteBlindTitle">BLIND STYLE</div>
                        <div className="quoteWidthTitle">WIDTH</div>
                        <div className="quoteHeightTitle">HEIGHT</div>
                        <div className="quoteSqrtTitle">G.A</div>
                        <div className="quoteLRTitle">L/R</div>
                        <div className="quoteControlTitle">Control Height</div>
                        <div className="quoteSelectPTitle">SELECT PRICE</div>
                        <div className="quoteNegoTitle">NEGO ({order.discount}%)</div>
                        <div className="quoteSalePTitle">SALE PRICE</div>
                    </div>
                    <div className="quoteList">
                        {
                            _printedItems.map((item: Item, idx: any) => {
                                const discountedPrice = item.partType === PartType.Fabric ? Math.floor(item.price * order.discount) / 100 : 0;
                                const salePrice = item.price - discountedPrice;
                                if (item.id && idx !== 31 && idx !== 32 && idx !== 33) {
                                    return (<div className="quoteOverview">
                                        <div className="quoteRoom">{item.roomName}</div>
                                        <div className="quoteWindow">{item.partType === PartType.Fabric ? idx < 31 ? idx + 1 : idx - 2 : ""}</div>
                                        <div className="quoteBlind">{item.itemName}</div>
                                        <div className="quoteWidth">{item.partType === PartType.Fabric ? item.width : ""}</div>
                                        <div className="quoteHeight">{item.partType === PartType.Fabric ? item.height : ""}</div>
                                        <div className="quoteSqrt">{item.partType === PartType.Fabric ? roundUp(item.width * item.height / 10000, 10) > 1.5 ? roundUp(item.width * item.height / 10000, 10) : 1.5 : ""}</div>
                                        <div className="quoteLR">{item.partType === PartType.Fabric ? item.handrailType : ""}</div>
                                        <div className="quoteControl">{item.handrailLength}</div>
                                        <div className="quoteSelectP">{cashFormatter(item.price)}</div>
                                        <div className="quoteNego">{item.partType === PartType.Fabric ? cashFormatter(discountedPrice) : ""}</div>
                                        <div className="quoteSaleP">{item.partType === PartType.Fabric ? cashFormatter(salePrice) : cashFormatter(item.price * Number(item.handrailLength))}</div>
                                    </div>)
                                } else if (idx === 31 || idx === 32 || idx === 33) {
                                    return <div className={idx !== 33 ? "quoteOverviewNone" : "quoteOverviewNone NoneBottom"}></div>
                                } else {
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
                                }

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
                            <div className="quoteNego">[Round Off]</div>
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
                            <div className="quoteSqrt">{Math.floor(totalPrice.sqrt * 10) / 10}</div>
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
                            <div className="signatureType">[ Made by ]</div>
                            <div className="signatureInput"></div>
                        </div>
                        <div className="signatureOverview">
                            <div className="signatureType">[ Installed by ]</div>
                            <div className="signatureInput"></div>
                        </div>
                        <div className="signatureOverview">
                            <div className="signatureType">[ Paid to ]</div>
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
                            <div className="summaryValue">{order.hst ? cashFormatter(totalPrice.saleTotalPrice * 0.13) : cashFormatter(0)}</div>
                        </div>
                        <div className="summaryOverview">
                            <div className="summaryType">&nbsp;DEPOSIT</div>
                            <div className="summaryValue">{cashFormatter(order.deposit)}</div>
                        </div>
                        <div className="summaryOverview">
                            <div className="summaryType">&nbsp;TOTAL PRICE</div>
                            <div className="summaryValue">{cashFormatter(totalPrice.saleTotalPrice + (order.hst ? totalPrice.saleTotalPrice * 0.13 : 0) - order.deposit)}</div>
                        </div>
                    </div>
                    <div className="stamp">
                        2 years warranty
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
            .webAddr{
                font-size: 1rem;
                font-weight: bold;
                color: #68c6d9;
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

            .sizeUnit{
                display: flex;
                justify-content: flex-end;
                margin-bottom: 3px;
                padding: 0;
                font-size: 0.675rem;
            }

            .listSection{
                width:100%;
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
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .quoteOverviewNone{
                width: 100%;
                border: none;
                min-height: 25px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .NoneBottom{
                border-bottom: 1px solid grey;
            }

            .quoteOverviewLast{
                width: 100%;
                border: none;
                min-height: 25px;
                border-bottom: 1px solid grey;
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
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
        `}
        </style>
    </Fragment>
}