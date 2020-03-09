import { Fragment, useState } from "react";
import gql from 'graphql-tag';
import { useQuery } from "react-apollo";
import { ErrorView } from "./ErrorView";
import { Order, Item } from "../generated/graphql";
import { cashFormatter } from "../util/formatter";

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
        orderNo,
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
        invoiceDate,
        customer{
            name,
            address,
            city,
            province,
            postal,
            phone,
            note
        },
        invAddress,
        invCity,
        invProvince,
        invPostal
        
    }
}
`);

const _Invoice2: React.FC<Props> = ({ orderNo }) => {
    const [bgImgState, setBgImgState] = useState<bgImg>(defaultBgImg);
    const { loading, error, data } = useQuery(GET_ORDER, {
        variables: {
            orderNo
        }
    });

    if (loading) return <p>Loading...</p>
    else if (error) return <ErrorView errMsg={error.message} currentLocation={1} />

    const order = data.getOrder as Order;
    const customer = order.customer;
    const items = order.items;

    if (items === null || items === undefined) {
        return <ErrorView errMsg={"Something went wrong"} currentLocation={1} />
    }
    const itemLists = items.concat(new Array<Item>(38 - items.length));
    const emptyItem = { itemName: "none" } as Item;
    itemLists.fill(emptyItem, items.length, itemLists.length - 1);
    const revertedDate = new Date(order.invoiceDate);

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
                    <div className="companyDetails">
                        <div className="logo">
                            <img src="/static/invoice_logo.png" />
                        </div>
                        UNIT#11, 70 Gibson Drive<br />
                        MARKHAM, ON L3R 4C2<br />
                        (647)718-0333<br />
                        (647)385-3030
                    </div>
                    <div className="bsNo">
                        GST/HST No. 75779 9895 RT0001
                    </div>
                </div>

                <div className="invoiceInfo">
                    <div className="infoTable">
                        <div className="invoiceOverview">
                            Invoice
                        </div>
                        <div className="invContentOverview">
                            <div className="invContentLeft">
                                Date
                            </div>
                            <div className="invContentRight">
                                Invoice #
                            </div>
                        </div>
                        <div className="invContentOverview">
                            <div className="invContentLeft">
                                {order.invoiceDate ? revertedDate.toLocaleDateString("en-US") : new Date().toLocaleDateString("en-US")}
                            </div>
                            <div className="invContentRight">
                                Inv{order.orderNo}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="destSection">
                <div className="invTo">
                    <div className="invToTitle">
                        <span>Invoice To</span>
                    </div>
                    <div className="addrInfo">
                        {customer.name}<br />
                        {order.invAddress ? order.invAddress : customer.address}<br />
                        {order.invCity ? order.invCity : customer.city}
                        {(order.invCity && order.invProvince) || (customer.city && customer.province) ? ", " : ""}
                        {order.invProvince ? order.invProvince : customer.province}<br />
                        {order.invPostal ? order.invPostal : customer.postal}
                    </div>
                </div>
                <div className="shipTo">
                    <div className="shipToTitle">
                        <span>Ship To</span>
                    </div>
                    <div className="addrInfo">
                        {customer.name}<br />
                        {customer.address}<br />
                        {customer.city} {customer.city && customer.province ? ", " : ""} {customer.province}<br />
                        {customer.postal}
                    </div>
                </div>
            </div>

            <div className="itemList">
                <div className="shipInfo">
                    <div className="dueDateLabel">
                        Due Date
                    </div>
                    <div className="dueDateValue">
                        2/24/2020
                    </div>
                    <div className="shipDateLabel">
                        Ship Date
                    </div>
                    <div className="shipDateValue">
                        2/20/2020
                    </div>
                    <div className="shipViaLabel">
                        Ship Via
                    </div>
                    <div className="shipViaValue">
                    </div>
                </div>

                <div className="itemTitles">
                    <div className="itemNoTitle">itemNo</div>
                    <div className="blindTitle">Blind Style</div>
                    <div className="widthTitle">Width</div>
                    <div className="heightTitle">Height</div>
                    <div className="priceTitle">Amount</div>
                </div>

                {
                    itemLists.map((item, i) => {
                        if (item.id) {
                            return <div className="itemOverview endLine itemMinHeight">
                                <div className="itemNo">{i + 1}</div>
                                <div className="blind">&nbsp;&nbsp;{item.itemName}</div>
                                <div className="bWidth">{item.width}</div>
                                <div className="bHeight">{item.height}</div>
                                <div className="price">{cashFormatter(item.price - item.price * (order.discount / 100))}&nbsp;&nbsp;</div>
                            </div>
                        }

                        return <div className="itemOverview endLine itemMinHeight">
                            <div className="itemNo"></div>
                            <div className="blind"></div>
                            <div className="bWidth"></div>
                            <div className="bHeight"></div>
                            <div className="price"></div>
                        </div>

                    })
                }

            </div>

            <div className="summaryArea">
                <div className="itemOverview topLine bottomMinHeight">
                    <div className="itemNo">Installation</div>
                    <div className="blind nonRight"></div>
                    <div className="bWidth nonRight"></div>
                    <div className="bHeight nonRight"></div>
                    <div className="price">{cashFormatter(order.installation)}&nbsp;&nbsp;</div>
                </div>
                <div className="itemOverview bottomMinHeight">
                    <div className="itemNo">Round Off</div>
                    <div className="blind nonRight"></div>
                    <div className="bWidth nonRight"></div>
                    <div className="bHeight nonRight"></div>
                    <div className="price">{cashFormatter(order.installationDiscount)}&nbsp;&nbsp;</div>
                </div>
                <div className="itemOverview">
                    <div className="notification">
                        <span className="notiDetail">♦ Please make cheque payable to : "Best Blinds"</span>
                        <span className="notiDetail">♦︎ Mailing Address : #11 - 70 Gibson Dr, Markham, ON, L3R 4CR</span>
                        <span className="notiDetail">♦︎ Customer Name : 2530861 ONTARIO LTD. ( TD Canada Trust )<br />
                            &nbsp;&nbsp;&nbsp;( Transit No : 19242 &nbsp;&nbsp;&nbsp; Inst No : 004 &nbsp;&nbsp;&nbsp; Account No : 5221593 )</span>
                        <span className="notiDetail">♦︎ Email - Transfer : bestblindsca@gmail.com</span>
                        <span className="notiDetail">♦︎ 2 years warranty</span>
                    </div>
                    <div className="amountTable">
                        <div className="attrOverview">
                            <div className="attrLabel">Subtotal</div>
                            <div className="attrValue">{cashFormatter(order.total)}</div>
                        </div>
                        <div className="attrOverview">
                            <div className="attrLabel">Sales Tax Total</div>
                            <div className="attrValue">{cashFormatter(order.total! * 0.13)}</div>
                        </div>
                        <div className="attrOverview">
                            <div className="attrLabel">Total</div>
                            <div className="attrValue">{cashFormatter(order.total! * 1.13)}</div>
                        </div>
                        <div className="attrOverview">
                            <div className="attrLabel">Payments/Credits</div>
                            <div className="attrValue">{cashFormatter(order.deposit)}</div>
                        </div>
                        <div className="attrOverview endLine">
                            <div className="attrLabel">Balance Due</div>
                            <div className="attrValue">{cashFormatter(order.total! * 1.13 - order.deposit)}</div>
                        </div>
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
            justify-content: center;
            align-items: center;
            flex-direction:column;
            font-size: 0.8rem;
            font-family: Arial, Helvetica, sans-serif;
        }
        .topSection{
            width:675px;
            height:120px;
            margin-top: 40px;
            margin-right: auto;
            margin-left: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }    
        .companyInfo{
            width: 60%;
            height: 100%;
        }
        .companyDetails{
            height: 90%;
        }
        .bsNo{
            height: 10%;
            font-size: 0.675rem;
        }
        .invoiceInfo{
            width: 40%;
            height: 100%;
        }
        .logo img{
            width: 50%;
        }

        .invoiceInfo{
            display: flex;
            justify-content: flex-end;
        }

        .infoTable{
            width: 70%;
            border-bottom: 0;
        }

        .invoiceOverview{
            font-size: 1.5rem;
            text-align: right;
            border: 1px solid black;
            padding-right: 10px;
        }

        .invContentOverview{
            display: flex;
            border-bottom: 1px solid black;
        }

        .invContentLeft{
            width: 50%;
            text-align: center;
            border-left: 1px solid black;
        }

        .invContentRight{
            width: 50%;
            text-align: center;
            border-left: 1px solid black;
            border-right: 1px solid black;
        }

        .destSection{
            width: 675px;
            height: 130px;
            margin-top: 10px;
            margin-right: auto;
            margin-left: auto;
            display: flex;
            justify-content: space-between;
        }
        
        .invTo{
            width: 47%;
            border: 1px solid black;
        }
        
        .shipTo{
            width: 47%;
            border: 1px solid black;
        }

        .invToTitle{
            width: 100%;
            height: 30px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid black;
        }

        .shipToTitle{
            width: 100%;
            height: 30px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid black;
        }
        
        span{
            padding-left: 10px;
        }
        
        .addrInfo{
            padding-top: 5px;
            padding-left: 10px;
        }

        .itemList{
            width: 675px;
            margin-top: 10px;
            margin-right: auto;
            margin-left: auto;
        }

        .shipInfo{
            width: 675px;
            height: 30px;
            display:flex;
            border: 1px solid black;
            align-items: center;
            text-align: center;
        }

        .dueDateLabel{
            width: 17%;
            border-right: 1px solid black;
        }

        .dueDateValue{
            width: 17%;
            border-right: 1px solid black;
        }

        .shipDateLabel{
            width: 17%;
            border-right: 1px solid black;
        }

        .shipDateValue{
            width: 17%;
            border-right: 1px solid black;
        }

        .shipViaLabel{
            width: 17%;
            border-right: 1px solid black;
        }

        .shipViaValue{
            width: 17%;
        }

        .itemTitles{
            width: 675px;
            margin-top: 10px;            
            height: 30px;
            border: 1px solid black;
            display: flex;
        }

        .itemNoTitle{
            width: 10%;
            height: 100%;
            border-right: 1px solid black;
            display:flex;
            align-items: center;
            justify-content: center;
        }

        .blindTitle{
            width: 50%;
            border-right: 1px solid black;
            display:flex;
            align-items: center;
            justify-content: center;
        }

        .widthTitle{
            width: 10%;
            border-right: 1px solid black;
            display:flex;
            align-items: center;
            justify-content: center;
        }

        .heightTitle{
            width: 10%;
            border-right: 1px solid black;
            display:flex;
            align-items: center;
            justify-content: center;
        }

        .priceTitle{
            width: 20%;
            display:flex;
            align-items: center;
            justify-content: center;

        }

        .itemOverview{
            width: 675px;
            font-size: 0.675rem;
            display: flex;
            border: 1px solid black;
            border-top: 0;
        }

        .itemNo{
            width: 10%;
            border-right: 1px solid black;
            display:flex;
            align-items: center;
            justify-content: center;
        }

        .blind{
            width: 50%;
            border-right: 1px solid black;
            display:flex;
            align-items: center;
            justify-content: flex-start;
        }

        .bWidth{
            width: 10%;
            border-right: 1px solid black;
            display:flex;
            align-items: center;
            justify-content: center;
        }

        .bHeight{
            width: 10%;
            border-right: 1px solid black;
            display:flex;
            align-items: center;
            justify-content: center;
        }

        .price{
            width: 20%;
            display:flex;
            align-items: center;
            justify-content: flex-end;
        }

        .summaryArea{
            width: 675px;
            height: 130px;
            margin-right: auto;
            margin-left: auto;
        }

        .notification{
            width: 68%;
            height: 130px;
            border-right: 1px solid black;
            display: flex;
            flex-direction: column;
        }

        .notiDetail{
            margin-top: 10px;
            margin-left: 10px;
        }

        .amountTable{
            width: 32%;
            display: flex;
            flex-direction: column;
        }

        .attrOverview{
            width: 100%;
            height: 25%;
            display: flex;
            border-bottom: 1px solid black;
            justify-content: space-between;
        }

        .topLine{
            border-top: 1px solid black;
        }

        .endLine{
            border-bottom: 0;
        }

        .nonRight{
            border-right: 0;
        }

        .itemMinHeight{
            height: 12px;
        }

        .bottomMinHeight{
            height: 26.2px;;
        }

        .attrLabel{
            font-size: 1rem;
            font-weight: bold;
            padding-left: 5px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        .attrValue{
            padding-right: 5px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        `}</style>
    </Fragment>
}

export default _Invoice2;