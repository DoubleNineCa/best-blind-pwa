import React, { Fragment, useState } from 'react';
import gql from 'graphql-tag';
import { Query, useQuery, useMutation } from 'react-apollo';
import { useRouter } from 'next/router';
import Select from "react-select";

import { Print } from "../components/Print";
import { Order, Item, Customer, Status } from "../generated/graphql";
import { calFormatter, cashFormatter, numberFormatter } from "../util/formatter";
import { ErrorView } from './ErrorView';



export interface Props {
    keyword: string;
}

interface hoverState {
    currentLocation: number
}

const defaultHoverState: hoverState = {
    currentLocation: 0
};

interface detailState {
    orderDetail: Order;
    status: boolean;
}

const defaultOrderState: detailState = {
    orderDetail: {} as Order,
    status: false
}

interface hstState {
    hst: boolean;
}

const defaultHstState: hstState = {
    hst: true
}

interface depositState {
    deposit: number;
}

const defaultDepositState: depositState = {
    deposit: 0
}

interface discountState {
    discount: number;
}

const defaultDiscountState: discountState = {
    discount: 0
}

interface installationState {
    installation: number;
}

const defaultInstallationState: installationState = {
    installation: 0
}

interface installdcState {
    installationDC: number;
}

const defaultInstallcState: installdcState = {
    installationDC: 0
}

interface statusState {
    label: string,
    value: Status
}

const defaultStatusState: statusState = {
    label: "",
    value: Status.Measure
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
      status
      installation
      total
      items{
        id
        partId
        itemName
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
    }
  }
`);

const UPDATE_ORDER = gql(`
mutation UpdateOrder($orderId: Float!, $date: DateTime!, $input: PlaceOrderInput!){
    updateOrder(orderId:$orderId, installDate:$date, data:$input)
  }
`)

export const Orders: React.FunctionComponent = () => {
    const router = useRouter();
    const [hoverState, setHoverState] = useState<hoverState>(defaultHoverState);
    const [detailState, setDetailState] = useState<detailState>(defaultOrderState);
    const [hstState, setHstState] = useState<hstState>(defaultHstState);
    const [depositState, setDepositState] = useState<depositState>(defaultDepositState);
    const [discountState, setDiscountState] = useState<discountState>(defaultDiscountState);
    const [installationState, setInstallationState] = useState<installationState>(defaultInstallationState);
    const [installdcState, setInstalldcState] = useState<installdcState>(defaultInstallcState);
    const [statusState, setStatusState] = useState<statusState>(defaultStatusState);
    const { loading, error, data } = useQuery(GET_ORDERS);
    const [updateOrder] = useMutation(UPDATE_ORDER);

    const statusList = [
        { label: "MEASUER", value: Status.Measure },
        { label: "MANUFACTURE", value: Status.Manufacture },
        { label: "INSTALL", value: Status.Install },
        { label: "REMAINING", value: Status.Ramaining },
        { label: "COMPLETE", value: Status.Complete }
    ]
    const viewDetails = (order: Order) => (e: React.MouseEvent) => {

        const detail = order;

        if (detail !== undefined) {
            setDetailState({
                orderDetail: detail,
                status: false
            })
            setHstState({
                hst: detail.hst
            })
            setDepositState({
                deposit: detail.deposit
            })
            setDiscountState({
                discount: detail.discount
            })
            setInstallationState({
                installation: detail.installation
            })
            setInstalldcState({
                installationDC: detail.installationDiscount
            })
            setStatusState({
                label: detail.status.toString(),
                value: detail.status
            })
        }
    }

    const togglePopup = () => {
        //here
        window.open(`print2?customerName=${detailState.orderDetail.customer.name}&orderNo=${detailState.orderDetail.orderNo}`, "_blank")!.focus();
    }

    const onDisplay = (e: React.MouseEvent) => {
        setHoverState({
            currentLocation: Number(e.currentTarget.id)
        })
    }

    const onDetail = (e: React.MouseEvent) => {
        setDetailState({
            orderDetail: detailState.orderDetail,
            status: !detailState.status
        })
    }

    const offDisplay = (e: React.MouseEvent) => {
        const { id } = e.currentTarget
        setHoverState({
            currentLocation: 0
        })
    }

    const toggleHst = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHstState({
            hst: e.currentTarget.checked
        })
    }

    const handleDeposit = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDepositState({
            deposit: Number(e.currentTarget.value)
        })
    }

    const handleDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiscountState({
            discount: Number(e.currentTarget.value)
        })
    }

    const handleInstallation = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInstallationState({
            installation: Number(e.currentTarget.value)
        })
    }

    const handleInstallationDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInstalldcState({
            installationDC: Number(e.currentTarget.value)
        })
    }

    const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusState({
            label: e.currentTarget.value.toString(),
            value: e.currentTarget.value as Status
        })
    }

    //HandleStatus enum

    const handlePayment = (e: React.ChangeEvent<HTMLInputElement>) => {
        detailState.orderDetail.payment = e.currentTarget.value;
        setDetailState({
            orderDetail: detailState.orderDetail,
            status: detailState.status
        })
    }

    const onUpdate = async (e: React.MouseEvent) => {

        const installDate = new Date().toLocaleString().replace(",", "").replace(/:.. /, " ")
        const isUpdate = await updateOrder({
            variables: {
                orderId: Number(detailState.orderDetail.id),
                date: installDate,
                input: {
                    customerId: Number(detailState.orderDetail.customer.id),
                    orderNo: detailState.orderDetail.orderNo,
                    hst: hstState.hst,
                    deposit: depositState.deposit,
                    discount: discountState.discount,
                    installation: installationState.installation,
                    installationDiscount: installdcState.installationDC,
                    status: statusState.value,
                    payment: "cash"
                }
            }
        })
        if (isUpdate) {
            alert("Your request successfully done!");
            return router.reload();
        } else {
            alert("Something went wrong");
        }

    }

    if (loading) { return <p> Loading..</p> }
    else if (error) {
        return <ErrorView errMsg={error.message} currentLocation={1} />
    }
    else {
        const getOrders = data && data.getOrders ? data.getOrders : [];
        return <Fragment>
            <div className="orderContainer">
                <div className="orderTopSection">
                    <div className="orderSectionTitle">{!detailState.status ? "Orders" : "Detail"}</div>
                </div>
                <div className="orderTable" style={{ display: detailState.status ? "none" : "block" }}>
                    <div className="orderTitles">
                        <div className="orderNoTitle">ORDER #</div>
                        <div className="orderNameTitle">NAME</div>
                        <div className="orderDateTitle">ORDER DATE</div>
                        <div className="orderInstallTitle">INSTALL DATE</div>
                        <div className="orderStatusTitle">STATUS</div>
                        <div className="orderInstallationTitle">INSTALLATION</div>
                        <div className="orderDepositTitle">DEPOSIT</div>
                        <div className="orderTotalTitle">TOTAL</div>
                    </div>
                    <div className="orderList">
                        {
                            getOrders.map((order: Order) => {
                                return (<div key={order.id} id={order.id} className={hoverState.currentLocation === Number(order.id) ? "orderOverviewOn" : "orderOverview"} onClick={viewDetails(order)} onMouseOver={onDisplay} onMouseLeave={offDisplay}>
                                    <div className="orderNo">{order.orderNo}</div>
                                    <div className="orderName">{order.customer.name}</div>
                                    <div className="orderDate">{calFormatter(order.orderDate)}</div>
                                    <div className="orderInstall">{calFormatter(order.installDate)}</div>
                                    <div className="orderStatus">{order.status}</div>
                                    <div className="orderInstallation">{cashFormatter(order.installation)}</div>
                                    <div className="orderDeposit">{cashFormatter(order.deposit)}</div>
                                    <div className="orderTotal">{cashFormatter(order.total)}</div>
                                </div>)
                            })
                        }
                    </div>

                </div>

                <div className="detailTable" style={{ display: detailState.status ? "block" : "none" }}>
                    <div className="detailTitles">
                        <div className="itemNoTitle">ITEM #</div>
                        <div className="roomNameTitle">ROOM NAME</div>
                        <div className="blindStyleTitle">BLIND STYLE</div>
                        <div className="coverColorTitle">COVER COLOR</div>
                        <div className="bWidthTitle">WIDTH</div>
                        <div className="bHeightTitle">HEIGHT</div>
                        <div className="baseAreaTitle">훼배</div>
                        <div className="handlePositionTitle">L/R</div>
                        <div className="controlHeightTitle">CONTROLER HEIGHT</div>
                        <div className="regularPriceTitle">REGULAR PRICE</div>
                        <div className="discountTitle">DISCOUNT</div>
                        <div className="finalPriceTitle">FINAL PRICE</div>
                    </div>

                    <div className="detailList">
                        {
                            detailState.orderDetail.items !== null && detailState.orderDetail.items !== undefined ?
                                detailState.orderDetail.items.map((item, i) => {
                                    const discountPrice = Math.round(item.price * (detailState.orderDetail.discount / 100) * 100) / 100;
                                    return <Fragment>
                                        <div className="detailOverview">
                                            <div className="itemNo">{i + 1}</div>
                                            <div className="roomName">roomName</div>
                                            <div className="blindStyle">{item.itemName}</div>
                                            <div className="coverColor">{item.coverColor}</div>
                                            <div className="bWidth">{item.width}</div>
                                            <div className="bHeight">{item.height}</div>
                                            <div className="baseArea">{Math.round(((item.width * item.height) / 10000) * 10) / 10}</div>
                                            <div className="handlePosition">{item.handrailType}</div>
                                            <div className="controlHeight">{item.handrailLength}</div>
                                            <div className="regularPrice">{cashFormatter(item.price)}</div>
                                            <div className="discount">{cashFormatter(discountPrice)}</div>
                                            <div className="finalPrice">{cashFormatter(Math.round((item.price - discountPrice) * 100) / 100)}</div>
                                        </div>
                                    </Fragment>
                                }) :
                                <div> "hi"</div>
                        }

                    </div>
                </div>

            </div>

            <div className="orderController">
                <div className="orderDetails">
                    <div className="section-1">
                        <div><span className="blodeFont">Order # : </span>{detailState.orderDetail.orderNo}</div>
                        <div>
                            <span className="blodeFont">Name : </span>
                            {detailState.orderDetail.customer === undefined ? '' : detailState.orderDetail.customer.name}
                        </div>
                        <div>
                            <span className="blodeFont">Phone : </span>
                            {detailState.orderDetail.customer === undefined ? '' : detailState.orderDetail.customer.phone}
                        </div>
                        <div>
                            <span className="blodeFont">Address : </span><br />
                            <span className="addressSection">{detailState.orderDetail.customer === undefined ? '' : detailState.orderDetail.customer.address}</span>
                        </div>
                    </div>
                    <div className="section">
                        <div>* Note *</div>
                        <div className="noteSection">
                            {detailState.orderDetail.customer === undefined ? '' : detailState.orderDetail.customer.note}
                        </div>
                    </div>
                    <div className="section">
                        <div>SUMMARY</div>
                        <div className="orderUpdate">
                            <span className="blodeFont">HST : </span>
                            <span className="flex-item">
                                <input
                                    className="orderHst"
                                    name="isHST"
                                    type="checkbox"
                                    checked={hstState.hst}
                                    onChange={toggleHst} />
                            </span>
                        </div>
                        <div className="orderUpdate">
                            <span className="blodeFont">Deposit : </span>
                            <span className="flex-item">
                                $<input
                                    className="orderInput"
                                    type="text"
                                    value={Number(depositState.deposit)}
                                    onChange={handleDeposit} />

                            </span>
                        </div>
                        <div className="orderUpdate">
                            <span className="blodeFont">Discount : </span>
                            <span className="flex-item">
                                <input
                                    className="orderInput"
                                    type="text"
                                    value={Number(discountState.discount)}
                                    onChange={handleDiscount} />%
                            </span>
                        </div>
                        <div className="orderUpdate">
                            <span className="blodeFont">Installation : </span>
                            <span className="flex-item">
                                $<input
                                    className="orderInput"
                                    type="text"
                                    value={Number(installationState.installation)}
                                    onChange={handleInstallation} />
                            </span>
                        </div>
                        <div className="orderUpdate">
                            <span className="blodeFont">Installation D.C : </span>
                            <span className="flex-item">
                                $<input
                                    className="orderInput"
                                    type="text"
                                    value={Number(installdcState.installationDC)}
                                    onChange={handleInstallationDiscount} />
                            </span>
                        </div>
                        <div className="orderUpdate">
                            <span className="blodeFont">Status : </span>
                            <select className="statusSel" value={statusState.value} onChange={handleStatus}>
                                <option value={Status.Measure}>MEASURE</option>
                                <option value={Status.Manufacture}>MANUFACTURE</option>
                                <option value={Status.Install}>INSTALL</option>
                                <option value={Status.Ramaining}>REMAINING</option>
                                <option value={Status.Complete}>COMPLETE</option>
                            </select>
                        </div>
                        <div className="orderUpdate">
                            <span className="blodeFont">Payment : </span>
                            <span className="flex-item">
                                <input
                                    className="orderInput"
                                    type="text"
                                    value={detailState.orderDetail.payment}
                                    onChange={handlePayment} />
                            </span>
                        </div>
                    </div>
                    <div className="section">
                        <div>Number of items</div>
                        <div>
                            <span className="blodeFont">Blinds : </span>
                            {detailState.orderDetail.items === undefined || detailState.orderDetail.items === null ? 0 : detailState.orderDetail.items.length}
                        </div>
                        <div>
                            <span className="blodeFont">Components : </span>
                        </div>
                    </div>
                    <div className="buttonSection">
                        <button className="specific" onClick={onDetail}>{detailState.status ? "List" : "Detail"}</button>
                        <button className="updateButton" onClick={onUpdate}>Edit</button>
                        <button className="printButton" onClick={togglePopup}>Print</button>
                    </div>
                </div>
            </div>
            <div className="fillBlank"></div>

            <style jsx>{`
    .fillBlank{
        width: 2vw;
    }

    .orderContainer{
        width: 79vw;
        max-height: 81vh;
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
    }

    .orderController{
        width: 18vw;
        max-height: 74vh;
        margin-top: 50px;
        border: 2px solid black;
        border-top: 10px solid #2F3D4C;
        border-radius: 10pt;
        background: white;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: scroll;
    }

    .orderTopSection .orderSectionTitle{
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

    .orderContainer .orderTable{
        width: 79vw;
        height: 75vh;
        position: absolute;
        bottom: 0;
    }

    .orderContainer .detailTable{
        width: 79vw;
        height: 75vh;
        position: absolute;
        bottom: 0;
    }

    .orderContainer .orderTable .orderTitles{
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

    .orderContainer .detailTable .detailTitles{
        width: 100%;
        height: 5vh;
        background: #2F3D4C;
        font-size: 0.875rem;
        color: white;
        border: 2px solid black;
        border-bottom: none;
        text-align: center;
        border-top-left-radius: 7pt;
        border-top-right-radius: 7pt;
        display: flex;
        position: absolute;
        top: 0;
    }

    .orderContainer .orderTable .orderTitles .orderNoTitle{
        width: 18%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderContainer .orderTable .orderTitles .orderNameTitle{
        width: 20%;
        height: auto;
        font-family: tecnico;
        border-right: 1pt solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderContainer .orderTable .orderTitles .orderDateTitle{
        width: 15%;
        height: auto;
        font-family: tecnico;
        border-right: 1pt solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderContainer .orderTable .orderTitles .orderInstallTitle{
        width: 15%;
        height: auto;
        font-family: tecnico;
        border-right: 1pt solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderContainer .orderTable .orderTitles .orderStatusTitle{
        width: 8%;
        height: auto;
        font-family: tecnico;
        border-right: 1pt solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderContainer .orderTable .orderTitles .orderInstallationTitle{
        width: 8%;
        height: auto;
        font-family: tecnico;
        border-right: 1pt solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderContainer .orderTable .orderTitles .orderDepositTitle{
        width: 8%;
        height: auto;
        font-family: tecnico;
        border-right: 1pt solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderContainer .orderTable .orderTitles .orderTotalTitle{
        width: 8%;
        height: auto;
        font-family: tecnico;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .itemNoTitle{
        width: 5%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .roomNameTitle{
        width: 15%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .blindStyleTitle{
        width: 16%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .coverColorTitle{
        width: 7%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bWidthTitle{
        width: 5%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bHeightTitle{
        width: 5%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .baseAreaTitle{
        width: 5%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .handlePositionTitle{
        width: 5%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .controlHeightTitle{
        width: 7%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .regularPriceTitle{
        width: 10%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .discountTitle{
        width: 10%;
        height: auto;
        font-family: tecnico;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .finalPriceTitle{
        width: 10%;
        height: auto;
        font-family: tecnico;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderContainer .orderTable .orderList{
        width: 100%;
        height: 70vh;
        background: white;
        display: flex;
        flex-direction: column;
        border: 2px solid black;
        border-top: none;
        font-family: tecnico;
        border-bottom-left-radius: 10pt;
        border-bottom-right-radius: 10pt;
        z-index: 1;
        position: absolute;
        bottom: 0;
        overflow: scroll;
    }

    .orderContainer .detailTable .detailList{
        width: 100%;
        height: 70vh;
        background: white;
        display: flex;
        flex-direction: column;
        position:absolute;
        border: 2px solid black;
        font-family: tecnico;
        border-bottom-left-radius: 10pt;
        border-bottom-right-radius: 10pt;
        z-index: 1;
        bottom: 0;
        overflow: scroll;
    }

    .orderOverview{
        width: 100%;
        min-height: 50px;
        font-size: 0.8rem;
        border: none;
        border-bottom: 1px solid black;
        background: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .orderOverviewOn{
        width: 100%;
        min-height: 50px;
        font-size: 0.8rem;
        border: none;
        border-bottom: 1px solid black;
        background: #C0C0C0;
        color: #7CFC00;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .detailOverview{
        width: 100%;
        min-height: 50px;
        font-size: 0.8rem;
        border: none;
        border-bottom: 1px solid black;
        background: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .orderNo{
        width: 18%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .orderName{
        width: 20%;
        height: 50px;
        border-right: 1pt solid grey;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderDate{
        width: 15%;
        height: 50px;
        border-right: 1pt solid grey;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderInstall{
        width: 15%;
        height: 50px;
        border-right: 1pt solid grey;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderStatus{
        width: 8%;
        height: 50px;
        border-right: 1pt solid grey;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderInstallation{
        width: 8%;
        height: 50px;
        border-right: 1pt solid grey;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderDeposit{
        width: 8%;
        height: 50px;
        border-right: 1pt solid grey;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orderTotal{
        width: 8%;
        height: 50px;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .itemNo{
        width: 5%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .roomName{
        width: 15%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .blindStyle{
        width: 16%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .coverColor{
        width: 7%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .bWidth{
        width: 5%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .bHeight{
        width: 5%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .baseArea{
        width: 5%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .handlePosition{
        width: 5%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .controlHeight{
        width: 7%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .regularPrice{
        width: 10%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .discount{
        width: 10%;
        height: 50px;
        border-right: 1px solid grey;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .finalPrice{
        width: 10%;
        height: 50px;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .addressSection{
        min-height: 50px;
        
    }

    .noteSection{
        min-height: 30px;
    }

    .orderDetails{
        width: 100%;
        height: 88%;
        font-family: tecnico;
        background: white;
        overflow: scroll;
    }
    .blodeFont{
        font-weight: bold;
    }

    .orderDetails .section-1 {
        width: 85%;
        min-height: 50px;
        margin-left:10px;
        padding: 10px;
        border-bottom: 1px solid #616161;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        font-size: 0.875rem;
    }

    .section {
        width: 85%;
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
    
    .orderUpdate{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .flex-item {
        width: 90px;
        justify-content: center;
        margin-top:5px;
        border: 1px solid #dde5ff;
        border-radius: 4px;
        color: #5d647b;
        outline: 0;
        padding: 10px;
        text-align:right;
      }

    .orderInput{
        width: 70px;
        border: none;
        font-family: tecnico;
        font-size: 14px;
        text-align:right;
    }

    .statusSel{
        margin-top:5px;
    }

    .orderHst{
        height: 20px;
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

    .specific{
        width: 30%;
        height: 40px;
        font-family: tecnico;
        background: #FFBD00;
        color: white;
        font-size: 0.875rem;
        box-shadow: 1px 1px 1px grey;
        border: none;
        border-radius: 4pt;
        outline: none;
    }

    .updateButton{
        width: 30%;
        height: 40px;
        font-family: tecnico;
        background: #FFBD00;
        color: white;
        font-size: 0.875rem;
        box-shadow: 1px 1px 1px grey;
        border: none;
        border-radius: 4pt;
        outline: none;
    }

    .printButton{
        width: 30%;
        height: 40px;
        font-family: tecnico;
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
    }
}