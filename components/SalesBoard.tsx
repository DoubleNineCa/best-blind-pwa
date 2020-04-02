import React, { Fragment, useState } from 'react';
import gql from 'graphql-tag';
import { Query, useQuery } from 'react-apollo';

import { cashFormatter, monthlyCal } from '../util/formatter';
import { ErrorView } from './ErrorView';
import { Order } from '../generated/graphql';

interface sales {
    year: string
}

const defaultSales: sales = {
    year: new Date().getFullYear().toString()
}

const GET_ORDERS = gql(`
query GetSalesOrders($year: String!){
    getSalesOrders(year: $year){
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
        partType
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

export const SalesBoard: React.FunctionComponent = () => {
    const [salesState, setSalesState] = useState<sales>(defaultSales);

    const { loading, error, data } = useQuery(GET_ORDERS, {
        variables: {
            year: salesState.year && salesState.year.length >= 4 ? salesState.year : new Date().getFullYear().toString()
        }
    });


    const annual = new Array(12);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (loading) { return <p> Loading..</p> }
    else if (error) {
        return <ErrorView errMsg={error.message} currentLocation={1} />
    }

    if (!data && !data.getSalesOrders) {
        console.log("invalid request");
    }


    data.getSalesOrders.map((order: Order, i: any) => {
        if (order.hst) {
            const invDate = new Date(order.invoiceDate).getMonth();

            if (annual[invDate] === undefined) {
                annual[invDate] = {
                    invoice: new Array<Order>(),
                    cash: new Array<Order>()
                };
            }
            annual[invDate].invoice.push(order);
        } else {
            const instDate = new Date(order.installDate).getMonth();
            if (annual[instDate] === undefined) {
                annual[instDate] = {
                    invoice: new Array<Order>(),
                    cash: new Array<Order>()
                };
            }
            annual[instDate].cash.push(order);
        }
    });

    const handleYear = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSalesState({
            year: e.currentTarget.value
        })
    }

    return <Fragment>
        <div className="fillBlank"></div>
        <div className="salesContainer">
            <div className="salesTopSection">
                <div className="salesSectionTitle">Sales Profit Board</div>
            </div>
            <div className="salesTable">
                <div className="salesTitles">
                    <div className="emptyTitle">
                        <input
                            type="text"
                            value={salesState.year}
                            onChange={handleYear}
                        />
                    </div>
                    <div className="invoiceTitle">Invoice</div>
                    <div className="cashTitle">Cash</div>
                    <div className="monthlyTotalTitle">Total</div>
                </div>
                <div className="salesList">
                    {
                        months.map((month: any, i) => {
                            if (annual[i] !== undefined) {
                                monthlyCal(annual[i]);
                                return <div className="salesOverview">
                                    <div className="monthlyHeader">{month}</div>
                                    <div className="invoice">{cashFormatter(annual[i].invTot)}</div>
                                    <div className="cash">{cashFormatter(annual[i].cashTot)}</div>
                                    <div className="monthlyTotal">{cashFormatter(annual[i].invTot + annual[i].cashTot)}</div>
                                </div>
                            } else {
                                return <div className="salesOverview">
                                    <div className="monthlyHeader">{month}</div>
                                    <div className="invoice">-</div>
                                    <div className="cash">-</div>
                                    <div className="monthlyTotal">-</div>
                                </div>
                            }

                        })
                    }

                    <div className="salesOverview">
                        <div className="monthlyHeader _total">Total</div>
                        <div className="invoice _total">{
                            cashFormatter(annual.reduce((acc, order) => {
                                return acc + order.invTot;
                            }, 0))
                        }</div>
                        <div className="cash _total">{
                            cashFormatter(annual.reduce((acc, order) => {
                                return acc + order.cashTot;
                            }, 0))
                        }</div>
                        <div className="monthlyTotal _total">{
                            cashFormatter(annual.reduce((acc, order) => {
                                return acc + order.invTot + order.cashTot;
                            }, 0))
                        }</div>
                    </div>
                </div>
            </div>

        </div>
        <div className="fillBlank"></div>
        <style jsx>{`
            .fillBlank{
                width: 5vw;
            }

            .salesContainer{
                width: 70vw;
                max-height: 81vh;
                position: relative;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                flex-direction: column;
            }

            .salesTopSection{
                width: 69vw;
                height: 6vh;
                border-radius: 5pt;
                position: absolute;
                top: 0;
                right: 0;
                display: flex;
                justify-content: space-between;
            }

            .salesSectionTitle{
                width: 30vw;
                height: auto;
                font-size: 1.125rem;
                font-family: tecnico;
                color: #2F3D4C;
                padding: 10px 0px 0px 10px;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
            }

            .salesTable{
                width: 70vw;
                height: 75vh;
                position: absolute;
                bottom: 0;
            }

            .salesTitles{
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

            .salesList{
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

            .emptyTitle{
                width: 25%;
                height: auto;
                font-family: tecnico;
                border-right: 1pt solid black;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .invoiceTitle{
                width: 25%;
                height: auto;
                font-family: tecnico;
                border-right: 1pt solid black;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .cashTitle{
                width: 25%;
                height: auto;
                font-family: tecnico;
                border-right: 1pt solid black;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .monthlyTotalTitle{
                width: 25%;
                height: auto;
                font-family: tecnico;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .salesOverview{
                width: 100%;
                min-height: 50px;
                font-size: 0.7rem;
                font-family: tecnico;
                border-bottom: 1px solid black;
                background: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .monthlyHeader{
                width: 25%;
                height: 50px;
                border-right: 1px solid grey;
                border-top: 1px solid black;
                z-index: 1;
                font-size: 0.875rem;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #2F3D4C;
                color: white;
            }

            .invoice{
                width: 25%;
                height: 50px;
                border-right: 1px solid grey;
                z-index: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .cash{
                width: 25%;
                height: 50px;
                border-right: 1px solid grey;
                z-index: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .monthlyTotal{
                width: 25%;
                height: 50px;
                z-index: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #AFADAC;
            }

            ._total{
                background: #AFADAC;
            }

        `}</style>
    </Fragment>
}