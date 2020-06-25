import { Fragment } from "react";
import gql from 'graphql-tag';
import { useQuery } from "react-apollo";
import { ErrorView } from "./ErrorView";
import { Order } from "../generated/graphql";
import { cashFormatter } from "../util/formatter";

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

const _Invoice: React.FC<Props> = ({ orderNo }) => {
    const { loading, error, data } = useQuery(GET_ORDER, {
        variables: {
            orderNo
        }
    })

    if (loading) return <p>Loading...</p>
    else if (error) return <ErrorView errMsg={error.message} currentLocation={1} />

    const order = data.getOrder as Order;
    const customer = order.customer;

    return <Fragment>
        <div className="container">
            <div className="topSection">
                <div className="logoArea">
                    <div className="logo">
                        <img src="/static/blue_logo.png" />
                    </div>
                </div>
                <div className="companyInfo">
                    <div className="contact">
                        BestBlinds<br />
                        www.Best-blinds.ca<br />
                        bestblindsca@gmail.com<br />
                        4163337094<br />
                        4165683303
                    </div>
                    <div className="location">
                        # 11 - 70 GIBSON DR.<br />
                        MARKHAM, ONTARIO<br />
                        L3R 4C2<br />
                    </div>
                </div>
            </div>
            <div className="billingSection">
                <div className="billedTo">
                    <span className="coloredTitle">
                        Billed To
                    </span><br />
                    {customer.name}<br />
                    53 Elsa Vine Way<br />
                    North York, ON<br />
                    M2J 4H8
                </div>
                <div className="dates">
                    <div className="doi">
                        <span className="coloredTitle">
                            Date of Issue
                        </span><br />
                        02/03/2020
                    </div>
                    <div className="dd">
                        <span className="coloredTitle">
                            Due Date
                        </span><br />
                        09/03/2020
                    </div>
                </div>
                <div className="invoiceNo">
                    <span className="coloredTitle">
                        Invoice Number
                    </span><br />
                    20200001
                </div>
                <div className="amountDue">
                    <span className="coloredTitle">
                        Amount Due (CAD)
                    </span><br />
                    <span className="bigFont">
                        {cashFormatter(order.total)}
                    </span>
                </div>
            </div>

            <div className="content">
                <div className="titleOverview">
                    <div className="descriptionTitle">
                        Description
                    </div>
                    <div className="rateTitle">
                        Rate
                    </div>
                    <div className="qtyTitle">
                        QTY
                    </div>
                    <div className="lineTotalTitle">
                        Line Total
                    </div>
                </div>
                <div className="listOverview">
                    <div className="description">
                        COMBI BLINDS
                    </div>
                    <div className="rate">
                        $1,700.00
                    </div>
                    <div className="qty">
                        1
                    </div>
                    <div className="lineTotal">
                        $1,700.00
                    </div>
                </div>
                <div className="listOverview">
                    <div className="description">
                        DEPOSIT
                    </div>
                    <div className="rate">
                        $100.00
                    </div>
                    <div className="qty">
                        1
                    </div>
                    <div className="lineTotal">
                        $100.00
                    </div>
                </div>

                <div className="subtotalArea">
                    <div className="emptyArea">
                    </div>
                    <div className="subtotal">
                        <div className="detailOverview">
                            <div className="detailTitle">
                                Subtotal
                            </div>
                            <div className="detailAmount">
                                $1,700.00
                            </div>
                        </div>
                        <div className="detailBottomOverview">
                            <div className="detailTitle">
                                Tax
                            </div>
                            <div className="detailAmount">
                                $221.00
                            </div>
                        </div>
                        <div className="detailOverview">
                            <div className="detailTitle">
                                Total
                            </div>
                            <div className="detailAmount">
                                $1,921.00
                            </div>
                        </div>
                        <div className="detailBottomOverview">
                            <div className="detailTitle">
                                Amount Paid
                            </div>
                            <div className="detailAmount">
                                $100.00
                            </div>
                        </div>
                        <div className="detailOverview">
                            <div className="detailTitle">
                                <span className="coloredTitle">
                                    Amount Due (CAD)
                                </span>
                            </div>
                            <div className="detailAmount">
                                $1,821.00
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="notificationSection">
                <span className="notiDetail">♦ Please make cheque payable to : "Best Blinds"</span>
                <span className="notiDetail">♦︎ Mailing Address : #11 - 70 Gibson Dr, Markham, ON, L3R 4CR</span>
                <span className="notiDetail">♦︎ Business Number (GST/HST) : 75779 9895 RT0001</span>
                <span className="notiDetail">♦︎ Customer Name : 2530861 ONTARIO LTD. ( TD Canada Trust )<br />
                    &nbsp;&nbsp;&nbsp;( Transit No : 19242 &nbsp;&nbsp;&nbsp; Inst No : 004 &nbsp;&nbsp;&nbsp; Account No : 5221593 )</span>
                <span className="notiDetail">♦︎ Email - Transfer : bestblindsca@gmail.com</span>
            </div>
        </div>

        <style jsx>{`
        .container{
            width: 750px;
            height: 981px;
            margin-left: 20px;
            margin-right: 20px;
            justify-content: center;
            align-items: center;
            flex-direction:column;
            font-size: 0.8rem;
            font-family: 'Montserrat', sans-serif;
        }
        .topSection{
            width:90%;
            height:160px;
            margin-top: 40px;
            margin-right: auto;
            margin-left: auto;
            display: flex;
            font-size: 0.675rem;
            justify-content: space-between;
            align-items: center;
        }
        .logoArea{
            width: 60%;
            height: 100%;
            padding-top: 10px;
            padding-left: 10px;
        }
        .logo img{
            width: 70%;
        }
        .companyInfo{
            width: 40%;
            height: 100%;
            padding-top: 10px;
            padding-right: 10px;
            display:flex;
        }
        .contact{
            width:50%;
            justify-content: flex-end;
            align-items: top;
            text-align: right;
        }
        .location{
            width:50%;
            justify-content: flex-end;
            align-items: top;
            text-align: right;
        }
        .billingSection{
            width: 90%;
            height: 200px;
            margin-top: 20px;
            margin-right: auto;
            margin-left: auto;
            display:flex;
        }
        .coloredTitle{
            color: #19AAE5;
        }
        .billedTo{
            width:30%;
            padding-left: 10px;
        }
        .dates{
            width:20%;
        }
        .doi{
            height: 50%;
        }
        .dd{
            height: 50%;
        }
        .invoiceNo{
            width:20%;
        }
        .amountDue{
            width:30%;
            text-align: right;
            padding-right: 10px;
        }
        .bigFont{
            font-size: 2rem;
            font-weight: bold;
        }
        .content{
            width: 90%;
            height: 340px;
            margin-right: auto;
            margin-left: auto;
            flex-direction: column;
        }
        .titleOverview{
            display: flex;
            border-top: 3px solid #006C99;
            color: #19AAE5;
            padding-top: 10px;
        }
        .descriptionTitle{
            width: 60%;
            padding-left: 10px;
        }
        .rateTitle{
            width: 15%;
            text-align: right;
        }
        .qtyTitle{
            width: 10%;
            text-align: right;
        }
        .lineTotalTitle{
            width: 15%;
            text-align: right;
            padding-right: 10px;
        }
        .listOverview{
            display: flex;
            padding-top: 20px;
            border-bottom: 1px dotted grey;
            padding-bottom: 5px;
        }
        .description{
            width: 60%;
            padding-left: 10px;
        }
        .rate{
            width: 15%;
            text-align: right;
        }
        .qty{
            width: 10%;
            text-align: right;
        }
        .lineTotal{
            width: 15%;
            text-align: right;
            padding-right: 10px;
        }
        .subtotalArea{
            margin-top: 20px;
            display:flex;
        }
        .emptyArea{
            width: 50%;
        }
        .subtotal{
            width: 50%;
        }
        .detailOverview{
            margin-top: 15px;
            display:flex;
            padding-bottom: 15px;
        }
        .detailTitle{
            width: 60%;
            text-align: right;
        }
        .detailAmount{
            width: 40%;
            text-align: right;
            padding-right: 10px;
        }
        .detailBottomOverview{
            display:flex;
            padding-bottom: 10px;
            border-bottom: 1px dotted grey;
        }

        .notificationSection{
            width: 90%;
            height: 190px;
            margin-top: 30px;
            margin-left: auto;
            margin-right: auto;
            border-top: 1px dotted grey;
            display: flex;
            flex-direction:column;
        }
        .notiDetail{
            margin-top: 10px;
            margin-left: 40px;
        }
        `}</style>
    </Fragment>
}

export default _Invoice;