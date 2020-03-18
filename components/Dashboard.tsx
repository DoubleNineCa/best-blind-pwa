import React, { Fragment, useState } from 'react';
import gql from 'graphql-tag';
import { Query, useQuery, useMutation } from 'react-apollo';

import { cashFormatter } from '../util/formatter';
import { ErrorView } from './ErrorView';
import { Order, Status } from '../generated/graphql';
import { useRouter } from 'next/router';

interface _currentTarget {
    target: any;
}

const defaultCurrentTarget: _currentTarget = {
    target: ''
}

const GET_ORDERS = gql(`
{
    getOrders{
      id
      orderNo
      hst
      deposit
      discount
      installationDiscount
      payment
      orderDate
      installDate
      invoiceDate
      status
      installation
      total
      items{
        id
        partId
        itemName
        roomName
        width
        price
        height
        price
        handrailType
        handrailMaterial
        handrailLength
        coverColor
      }
      customer{
        id
        name
        address
        phone
        note
      }
      invAddress
      invCity
      invProvince
      invPostal
    }
  }
`);

const UPDATE_STEP = gql(`
mutation UpdateStep($orderId: Float!){
    updateStep(orderId:$orderId)
  }
`)


export const Dashboard: React.FunctionComponent = () => {
    const router = useRouter();
    const { loading, error, data } = useQuery(GET_ORDERS);
    const [currentTargetState, setCurrentTargetState] = useState<_currentTarget>(defaultCurrentTarget);
    const [updateStep] = useMutation(UPDATE_STEP);

    if (loading) { return <p> Loading..</p> }
    else if (error) {
        return <ErrorView errMsg={error.message} currentLocation={0} />
    }

    const getList = (_status: Status) => {
        return data.getOrders.filter((order: Order) => order.status === _status)
    }

    const _measureList = getList(Status.Measure);
    const _manufactureList = getList(Status.Manufacture);
    const _installList = getList(Status.Install);
    const _remainList = getList(Status.Remaining);
    const rootElement = document.getElementsByClassName("contentContainer")[0];

    const onRevealMenu = (e: React.MouseEvent) => {
        if (currentTargetState.target === '') {
            setCurrentTargetState({
                target: e.currentTarget
            })
        }

        if (currentTargetState.target !== e.currentTarget) {
            rootElement.querySelectorAll("div.dropDownContent").forEach(element => {
                element.setAttribute("style", "display:none");
            })

            setCurrentTargetState({
                target: e.currentTarget
            })
        }

        const curState = e.currentTarget.querySelector("div.dropDownContent");
        if (curState && curState.getAttribute("style") !== null && curState.getAttribute("style") === "display:block") {
            curState.setAttribute("style", "display:none");
        } else if (curState && curState.getAttribute("style") === "display:none" || curState && curState.getAttribute("style") === null) {
            curState.setAttribute("style", "display:block");
        }
    }

    const onNext = (orderId: string) => async (e: React.MouseEvent) => {
        await updateStep({
            variables: {
                orderId: Number(orderId),
            }
        }).then(() => {
            router.reload();
        }).catch((e) => {
            alert(e);
        })
    }

    const onDetails = (orderNo: string) => (e: React.MouseEvent) => {
        return router.push(`/orders?orderNo=${orderNo}`);
    }

    const offMenu = (e: React.MouseEvent) => {
        rootElement.querySelectorAll("div.dropDownContent").forEach(element => {
            element.setAttribute("style", "display:none");
        })
    }

    const onMouseIn = (e: React.MouseEvent) => {
        e.currentTarget.setAttribute("style", "font-weight: bold");
    }

    const onMouseOut = (e: React.MouseEvent) => {
        e.currentTarget.removeAttribute("style");
    }

    return <Fragment>

        <div className="recapContainer">
            <div className="recapTopSection" onClick={offMenu}>
                <div className="recapSectionTitle">Measured</div>
            </div>
            <div className="recapTable">
                <div className="recapTitles" onClick={offMenu}>
                    <div className="recapNameTitle">Name</div>
                    <div className="recapAddrTitle">Addr</div>
                    <div className="recapPhoneTitle">Phone</div>
                </div>
                <div className="recapList">
                    {
                        _measureList.length > 0 ?
                            _measureList.map((order: Order) => {
                                return <div className="recapOverview" onClick={onRevealMenu}>
                                    <div className="recapName">{order.customer.name}</div>
                                    <div className="recapAddr">
                                        {order.customer.address}
                                    </div>
                                    <div className="recapPhone">{order.customer.phone}</div>
                                    <div className="dropDownContent">
                                        <p onClick={onNext(order.id)} onMouseEnter={onMouseIn} onMouseLeave={onMouseOut}>Next Step</p>
                                        <p onClick={onDetails(order.orderNo)} onMouseEnter={onMouseIn} onMouseLeave={onMouseOut}>View Details</p>
                                    </div>
                                </div>
                            })
                            :
                            <div className="recapOverview">
                                <div className="noneItems">None of the List.</div>
                            </div>
                    }
                </div>

            </div>
        </div>
        <div className="fillArrow" onClick={offMenu}></div>
        <div className="recapContainer">
            <div className="recapTopSection" onClick={offMenu}>
                <div className="recapSectionTitle">Manufacture</div>
            </div>
            <div className="recapTable">
                <div className="recapTitles" onClick={offMenu}>
                    <div className="recapNameTitle">Name</div>
                    <div className="recapAddrTitle">Addr</div>
                    <div className="recapPhoneTitle">Phone</div>
                </div>
                <div className="recapList">
                    {
                        _manufactureList.length > 0 ?
                            _manufactureList.map((order: Order) => {
                                return <div className="recapOverview" onClick={onRevealMenu}>
                                    <div className="recapName">{order.customer.name}</div>
                                    <div className="recapAddr">
                                        {order.customer.address}
                                    </div>
                                    <div className="recapPhone">{order.customer.phone}</div>
                                    <div className="dropDownContent">
                                        <p onClick={onNext(order.id)} onMouseEnter={onMouseIn} onMouseLeave={onMouseOut}>Next Step</p>
                                        <p onClick={onDetails(order.orderNo)} onMouseEnter={onMouseIn} onMouseLeave={onMouseOut}>View Details</p>
                                    </div>
                                </div>
                            })
                            :
                            <div className="recapOverview">
                                <div className="noneItems">None of the List.</div>
                            </div>
                    }
                </div>
            </div>
        </div>
        <div className="fillArrow" onClick={offMenu}></div>
        <div className="recapContainer">
            <div className="recapTopSection" onClick={offMenu}>
                <div className="recapSectionTitle">Install</div>
            </div>
            <div className="recapTable">
                <div className="recapTitles" onClick={offMenu}>
                    <div className="recapNameTitle">Name</div>
                    <div className="recapAddrTitle">Addr</div>
                    <div className="recapPhoneTitle">InstallDate</div>
                </div>
                <div className="recapList">
                    {
                        _installList.length > 0 ?
                            _installList.map((order: Order) => {
                                return <div className="recapOverview" onClick={onRevealMenu}>
                                    <div className="recapName">{order.customer.name}</div>
                                    <div className="recapAddr">
                                        {order.customer.address}
                                    </div>
                                    <div className="recapPhone">{order.installDate ? new Date(order.installDate).toLocaleDateString("en-US") : "-"}</div>
                                    <div className="dropDownContent">
                                        <p onClick={onNext(order.id)} onMouseEnter={onMouseIn} onMouseLeave={onMouseOut}>Next Step</p>
                                        <p onClick={onDetails(order.orderNo)} onMouseEnter={onMouseIn} onMouseLeave={onMouseOut}>View Details</p>
                                    </div>
                                </div>
                            })
                            :
                            <div className="recapOverview">
                                <div className="noneItems">None of the List.</div>
                            </div>
                    }
                </div>
            </div>
        </div>
        <div className="fillArrow" onClick={offMenu}></div>
        <div className="unpaidContainer" >
            <div className="unpaidTopSection" onClick={offMenu}>
                <div className="unpaidSectionTitle">Unpaid</div>
            </div>
            <div className="unpaidTable">
                <div className="unpaidTitles" onClick={offMenu}>
                    <div className="unpaidNameTitle">Name</div>
                    <div className="unpaidPhoneTitle">Phone</div>
                    <div className="unpaidInstallDateTitle">InstallDate<br /> InvoiceDate</div>
                    <div className="unpaidRemainTitle">Amount</div>
                </div>
                <div className="recapList">
                    {
                        _remainList.length > 0 ?
                            _remainList.map((order: Order) => {
                                return <div className={order.hst ? "recapOverview hst" : "recapOverview"} onClick={onRevealMenu}>
                                    <div className="unpaidName">{order.customer.name}</div>
                                    <div className="unpaidPhone">{order.customer.phone}</div>
                                    <div className="unpaidInstallDate">{new Date(order.installDate).toLocaleDateString("en-US")}<br />{order.invoiceDate ? new Date(order.invoiceDate).toLocaleDateString("en-US") : "-"}</div>
                                    <div className="unpaidRemain">
                                        {cashFormatter(order.total! + (order.hst ? order.total! * 0.13 : 0) - order.deposit)}
                                    </div>
                                    <div className="dropDownContent">
                                        <p onClick={onNext(order.id)} onMouseEnter={onMouseIn} onMouseLeave={onMouseOut}>Next Step</p>
                                        <p onClick={onDetails(order.orderNo)} onMouseEnter={onMouseIn} onMouseLeave={onMouseOut}>View Details</p>
                                    </div>
                                </div>
                            })
                            :
                            <div className="recapOverview">
                                <div className="noneItems">None of the List.</div>
                            </div>
                    }
                </div>
            </div>
        </div>

        <div className="fillBlank"></div>
        <style jsx>{`
    .fillArrow{
        width: 3vw;
        background-image: url(/static/arrow.png);
        background-repeat: no-repeat;
        background-size: 40%;
        background-position: center;
    }
    .fillBlank{
        width: 2vw;
    }

    .recapContainer{
        width: 20vw;
        max-height: 81vh;
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
    }

    .unpaidContainer{
        width: 25vw;
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

    .recapTopSection{
        width: 20vw;
        height: 6vh;
        border-radius: 5pt;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
    }

    .unpaidTopSection{
        width: 25vw;
        height: 6vh;
        border-radius: 5pt;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
    }

    .recapTopSection .recapSectionTitle{
        width: 20vw;
        height: auto;
        font-size: 1.125rem;
        font-family: tecnico;
        color: #2F3D4C;
        padding: 10px 0px 0px 10px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .unpaidSectionTitle{
        width: 25vw;
        height: auto;
        font-size: 1.125rem;
        font-family: tecnico;
        color: #2F3D4C;
        padding: 10px 0px 0px 10px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .noneItems{
        width: 100%;
        min-height: 50px;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    

    .recapContainer .recapTable{
        width: 20vw;
        height: 75vh;
        position: absolute;
        bottom: 0;
    }

    .unpaidTable{
        width: 25vw;
        height: 75vh;
        position: absolute;
        bottom: 0;
    }

    .recapContainer .recapTable .recapTitles{
        width: 100%;
        height: 5vh;
        background: #2F3D4C;
        font-size: 0.7rem;
        color: white;
        border: 2px solid black;
        border-bottom: none;
        border-top-left-radius: 7pt;
        border-top-right-radius: 7pt;
        display: flex;
        position: absolute;
        top: 0;
    }

    .unpaidTitles{
        width: 100%;
        height: 5vh;
        background: #2F3D4C;
        font-size: 0.7rem;
        color: white;
        border: 2px solid black;
        border-bottom: none;
        border-top-left-radius: 7pt;
        border-top-right-radius: 7pt;
        display: flex;
        position: absolute;
        top: 0;
    }

    .recapNameTitle{
        width: 25%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .recapAddrTitle{
        width: 40%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .recapPhoneTitle{
        width: 35%;
        height: auto;
        font-family: tecnico;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .unpaidNameTitle{
        width: 20%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .unpaidPhoneTitle{
        width: 30%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .unpaidInstallDateTitle{
        width: 30%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .unpaidRemainTitle{
        width: 20%;
        height: auto;
        font-family: tecnico;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .recapList{
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

    .recapOverview{
        width: 100%;
        min-height: 50px;
        font-size: 0.65rem;
        border: none;
        font-family: tecnico;
        border-bottom: 1px solid black;
        background: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .recapName{
        width: 25%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .recapAddr{
        width: 40%;
        height: 50px;
        border-right: 1pt solid grey;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .recapPhone{
        width: 35%;
        height: 50px;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .unpaidName{
        width: 20%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .unpaidPhone{
        width: 30%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .unpaidInstallDate{
        width: 30%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .unpaidRemain{
        width: 20%;
        height: 50px;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .gradeController{
        width: 25vw;
        max-height: 75vh;
        margin-top: 5vh;
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

    .flex-item {
        width: 180px;
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
        width: 170px;
        border: none;
        font-family: tecnico;
        font-size: 14px;
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
        font-family: tecnico;
        font-size: 14px;
        text-align:right;
    }

    .selectInput{
        width: 200px;
        border: 1px solid #dde5ff;
        border-radius: 4px;
        font-family: tecnico;
        font-size: 14px;
        color: #5d647b;
        padding: 10px;
        text-align:right;
    }
    
    .hst{
        background: #7FADAC;
    }

    .dropDownContent{
        display: none;
        margin-top: 12%;
        margin-left: 70%;
        position: absolute;
        background-color: #F1F1F1;
        width: 20%;
        box-shadow: 0px 1px 1px grey;
        padding: 1px 5px;
        z-index: 5;
        justify-content: center;
    }
`}
        </style>
    </Fragment>
}
