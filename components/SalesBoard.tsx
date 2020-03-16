import React, { Fragment, useState } from 'react';
import gql from 'graphql-tag';
import { Query, useQuery } from 'react-apollo';

import { cashFormatter } from '../util/formatter';
import { ErrorView } from './ErrorView';

export const SalesBoard: React.FunctionComponent = () => {
    return <Fragment>
        <div className="fillBlank"></div>
        <div className="salesContainer">
            <div className="salesTopSection">
                <div className="salesSectionTitle">Sales Profit Board</div>
            </div>
            <div className="salesTable">
                <div className="salesTitles">
                    <div className="emptyTitle"></div>
                    <div className="invoiceTitle">Invoice</div>
                    <div className="cashTitle">Cash</div>
                    <div className="monthlyTotalTitle">Total</div>
                </div>
                <div className="salesList">
                    <div className="salesOverview">
                        <div className="monthlyHeader">January</div>
                        <div className="invoice">{cashFormatter(15500)}</div>
                        <div className="cash">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal">{cashFormatter(24000)}</div>
                    </div>
                    <div className="salesOverview">
                        <div className="monthlyHeader">February</div>
                        <div className="invoice">{cashFormatter(15500)}</div>
                        <div className="cash">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal">{cashFormatter(24000)}</div>
                    </div>
                    <div className="salesOverview">
                        <div className="monthlyHeader">March</div>
                        <div className="invoice">{cashFormatter(15500)}</div>
                        <div className="cash">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal">{cashFormatter(24000)}</div>
                    </div>
                    <div className="salesOverview">
                        <div className="monthlyHeader">April</div>
                        <div className="invoice">{cashFormatter(15500)}</div>
                        <div className="cash">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal">{cashFormatter(24000)}</div>
                    </div>
                    <div className="salesOverview">
                        <div className="monthlyHeader">May</div>
                        <div className="invoice">{cashFormatter(15500)}</div>
                        <div className="cash">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal">{cashFormatter(24000)}</div>
                    </div>
                    <div className="salesOverview">
                        <div className="monthlyHeader">June</div>
                        <div className="invoice">{cashFormatter(15500)}</div>
                        <div className="cash">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal">{cashFormatter(24000)}</div>
                    </div>
                    <div className="salesOverview">
                        <div className="monthlyHeader">July</div>
                        <div className="invoice">{cashFormatter(15500)}</div>
                        <div className="cash">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal">{cashFormatter(24000)}</div>
                    </div>
                    <div className="salesOverview">
                        <div className="monthlyHeader">August</div>
                        <div className="invoice">{cashFormatter(15500)}</div>
                        <div className="cash">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal">{cashFormatter(24000)}</div>
                    </div>
                    <div className="salesOverview">
                        <div className="monthlyHeader">September</div>
                        <div className="invoice">{cashFormatter(15500)}</div>
                        <div className="cash">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal">{cashFormatter(24000)}</div>
                    </div>
                    <div className="salesOverview">
                        <div className="monthlyHeader">October</div>
                        <div className="invoice">{cashFormatter(15500)}</div>
                        <div className="cash">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal">{cashFormatter(24000)}</div>
                    </div>
                    <div className="salesOverview">
                        <div className="monthlyHeader">November</div>
                        <div className="invoice">{cashFormatter(15500)}</div>
                        <div className="cash">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal">{cashFormatter(24000)}</div>
                    </div>
                    <div className="salesOverview">
                        <div className="monthlyHeader">December</div>
                        <div className="invoice">{cashFormatter(15500)}</div>
                        <div className="cash">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal">{cashFormatter(24000)}</div>
                    </div>
                    <div className="salesOverview">
                        <div className="monthlyHeader _total">Total</div>
                        <div className="invoice _total">{cashFormatter(15500)}</div>
                        <div className="cash _total">{cashFormatter(8500)}</div>
                        <div className="monthlyTotal _total">{cashFormatter(24000)}</div>
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