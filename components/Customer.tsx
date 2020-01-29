import React, { Fragment, useState, FormEvent } from 'react';
import gql from 'graphql-tag';
import { useRouter } from "next/router";
import { useQuery, useMutation } from 'react-apollo';

import { Customer, Order } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { calFormatter, cashFormatter } from "../util/formatter";
import Link from 'next/link';
import { ErrorView } from './ErrorView';

export interface Props {
    customer: Customer;
}

interface customerState {
    customers: Customer[]
}

const defaultCustomerState: customerState = {
    customers: []
}

interface hoverState {
    currentLocation: number
}

const defaultState: hoverState = {
    currentLocation: 0
};

interface onListState {
    currentLocation: number
}

const defaultOnListState: onListState = {
    currentLocation: 0
}

interface detailState {
    customer: Customer
}

const defaultDetailState: detailState = {
    customer: {} as Customer
}

interface displayState {
    on: boolean,
    title: string
}

const defaultDisplayState: displayState = {
    on: true,
    title: ""
}

interface editState {
    customerId: string,
    orderNo: string
}

const defaultEditState: editState = {
    customerId: "",
    orderNo: ""
}

const getCustomers = gql(`
query GetCustomer{
    getCustomers{
      id
      uuid
      name
      address
      phone
      email
      orders{
        id
        orderNo
        hst
        deposit
        discount
        installation
        installationDiscount
        total
        items{
          id
          itemName
          width
          height
          price
          handrailMaterial
          handrailType
          handrailLength
          coverColor
        }
        status
        payment
        orderDate
        installDate
        
      }
    }
  }
`);

const REGISTER_CUSTOMER = gql(`
mutation RegisterCustomer($input: RegisterCustomerInput!){
    registerCustomer(data: $input){
      id
      name
      address
      phone
      email
    }
  }
`);

const UPDATE_CUSTOMER = gql(`
mutation UpdateCustomer($id: Float!, $data: UpdateCustomerInput!){
    updateCustomer(id: $id, data: $data)
}
`);

const DELETE_CUSTOMER = gql(`
mutation DeleteCustomer($id : Float!){
    deleteCustomer(id: $id)
}
`);

interface GetCustomersQuery {
    getCustomers: {
        id: any,
        uuid: string,
        name: string,
        address: string,
        phone: string,
        email: string,
        orders: Order[],
        type: string,
        note: string
    }[]
}

interface GetCustomersQueryVariable {
    keyword: string
}

const Customers: React.FC = () => {
    const router = useRouter();
    const [hoverState, setHoverState] = useState<hoverState>(defaultState);
    const [onListState, setOnListState] = useState<onListState>(defaultOnListState);
    const [customerState, setCustomerState] = useState<customerState>(defaultCustomerState);
    const [detailState, setDetailState] = useState<detailState>(defaultDetailState);
    const [displayState, setDisplayState] = useState<displayState>(defaultDisplayState);
    const [editState, setEditState] = useState<editState>(defaultEditState)
    const { loading, error, data } = useQuery(getCustomers);
    const [registerCustomer] = useMutation(REGISTER_CUSTOMER);
    const [updateCustomer] = useMutation(UPDATE_CUSTOMER);
    const [deleteCustomer] = useMutation(DELETE_CUSTOMER);


    const onRegisterView = (e: React.MouseEvent) => {
        setDetailState({
            customer: defaultDetailState.customer
        })
        setDisplayState({
            on: !displayState.on,
            title: "Register"
        })
    }

    const onUpdateView = (e: React.MouseEvent) => {
        setDisplayState({
            on: !displayState.on,
            title: "Edit"
        })
    }

    const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const customer = detailState.customer;
        if (e.currentTarget.id === "name") {
            customer.name = e.currentTarget.value;
        } else if (e.currentTarget.id === "address") {
            customer.address = e.currentTarget.value;
        } else if (e.currentTarget.id === "phone") {
            customer.phone = e.currentTarget.value;
        } else if (e.currentTarget.id === "email") {
            customer.email = e.currentTarget.value;
        } else if (e.currentTarget.id === "note") {
            customer.note = e.currentTarget.value;
        } else {
            alert("Something went wrong");
        }
        setDetailState({
            customer
        });
    }

    const onClicked = async (e: React.MouseEvent) => {
        e.preventDefault();
        const btnType = e.currentTarget.id;

        if (btnType === "register") {
            const mutationData = await registerCustomer({
                variables: {
                    input: {
                        name: detailState.customer.name,
                        address: detailState.customer.address,
                        phone: detailState.customer.phone,
                        email: detailState.customer.email,
                        note: detailState.customer.note
                    }
                }
            }).catch(error => {
                alert(error);
            });


            if (mutationData && mutationData.data) {
                alert(mutationData.data.registerCustomer.name + " is registered successfully.");
            }
            // if (mutationData.errors) {
            //     alert("something went wrong");
            // }
        } else if (btnType === "update") {
            const mutationData = await updateCustomer({
                variables: {
                    id: Number(detailState.customer.id),
                    data: {
                        name: detailState.customer.name,
                        address: detailState.customer.address,
                        phone: detailState.customer.phone,
                        email: detailState.customer.email,
                        note: detailState.customer.note
                    }
                }
            });

            if (mutationData && mutationData.data && mutationData.data.updateCustomer) {
                alert("Update successfully done.");
            }
            if (mutationData.errors) {
                alert("something went wrong");
            }
        } else if (btnType === "remove") {
            const mutationData = await deleteCustomer({
                variables: {
                    id: Number(detailState.customer.id)
                }
            });
            if (mutationData && mutationData.data && mutationData.data.updateCustomer) {
                alert("Update successfully done.");
            }
            if (mutationData.errors) {
                alert("something went wrong");
            }
        } else {
            alert("Invalid Request");
        }

        // return router.reload();
    }

    const viewDetails = (customer: Customer) => (e: React.MouseEvent) => {
        setHoverState({
            currentLocation: Number(e.currentTarget.id)
        })
        const detail = customer;

        if (detail !== undefined) {
            setDetailState({
                customer: detail
            })
        }
    }

    const editView = (e: React.MouseEvent) => {
        setOnListState({
            currentLocation: Number(e.currentTarget.id)
        })
        setEditState({
            customerId: detailState.customer.id,
            orderNo: e.currentTarget.id
        })
    }

    const onEdit = (e: React.MouseEvent) => {
        if (editState.customerId !== detailState.customer.id) {
            alert("Invaild request");
            return;
        }
        return router.push(`/quote?customerId=${editState.customerId}&orderNo=${editState.orderNo}`);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.currentTarget.value;

        if (loading) {
            return <p> Loading...</p>
        } else if (error) {
            return <ErrorView errMsg={error.message} currentLocation={2} />
        } else {
            if (data && data.getCustomers && keyword !== "") {
                if (keyword === "all") {
                    setCustomerState({
                        customers: data.getCustomers
                    })
                } else {
                    const _customers = data.getCustomers.filter((customer: Customer) =>
                        customer.name.toLowerCase().includes(keyword) || customer.address.toLowerCase().includes(keyword)
                    );
                    setCustomerState({
                        customers: _customers
                    })
                }
            } else {
                setCustomerState({
                    customers: defaultCustomerState.customers
                })
            }
        }
    }

    return (
        <Fragment>
            <div className="userSearchContainer">
                <input type="text" placeholder="input customer's name or address" onChange={onChange} />
                <div className="userTopSection">User List</div>
                <div className="userTable">
                    <div className="customerTitles">
                        <div className="customerNameTitle">NAME</div>
                        <div className="customerAddressTitle">ADDRESS</div>
                    </div>
                    {
                        customerState.customers.length > 0 ?
                            <div className="userList">
                                {
                                    customerState.customers.map(customer => {
                                        return (
                                            <div key={customer.id} id={customer.id} className={hoverState.currentLocation === Number(customer.id) ? "userOverviewOn" : "userOverview"} onClick={viewDetails(customer)}>
                                                <div className="userName">{customer.name}</div>
                                                <div className="userAddress">{customer.address}</div>
                                            </div>)
                                    })
                                }
                            </div>
                            :
                            <div className="noneUser">
                                None of the list.
                                </div>
                    }
                </div>
                <div className="buttonSection">
                    <Link href={{ pathname: '/quote', query: { customerId: detailState.customer.id, orderNo: "last" } }}>
                        <button className="specific" >New Order</button>
                    </Link>
                    <button className="cstmerEditBtn" onClick={onUpdateView}>Edit</button>
                    <button className="cstmerRegisterBtn" onClick={onRegisterView}>Register</button>
                </div>
            </div>

            <div className="userDetailContainer">
                {
                    displayState.on ?
                        <div className="userView">
                            <div className="userDetail">
                                <div className="userDetailTable">
                                    <div className="titleSection">
                                        <div>NAME</div>
                                        <div>ADDRESS</div>
                                        <div>EMAIL</div>
                                        <div>PHONE</div>
                                        <div>NOTE</div>
                                    </div>
                                    <div className="contentSection">
                                        <div>{detailState.customer.name}</div>
                                        <div>{detailState.customer.address}</div>
                                        <div>{detailState.customer.email}</div>
                                        <div>{detailState.customer.phone}</div>
                                        <div>{detailState.customer.note === undefined ? " - " : detailState.customer.note}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="orderList">
                                <div className="orders">
                                    <div className="listHeader">
                                        <div className="listName">
                                            ORDER LIST
                                        </div>
                                        <div className="btnSection">
                                            <button className="editBtn" onClick={onEdit}>edit</button>
                                            <button className="removeBtn">remove</button>
                                        </div>
                                    </div>
                                    <div className="listTable">
                                        <div className="listTitle">
                                            <div className="orderNoTitle">ORDER NO</div>
                                            <div className="orderDateTitle">ORDER DATE</div>
                                            <div className="installDateTitle">INSTALL DATE</div>
                                            <div className="depositTitle">DEPOSIT</div>
                                            <div className="installationTitle">INSTALLATION</div>
                                            <div className="discountTitle">DISCOUNT</div>
                                            <div className="paymentTitle">PAYMENT</div>
                                            <div className="totalTitle">TOTAL</div>
                                        </div>
                                        {
                                            detailState.customer !== undefined && detailState.customer.orders && detailState.customer.orders.length > 0 ?
                                                detailState.customer.orders.map(order => {
                                                    return (
                                                        <div id={order.orderNo} className={onListState.currentLocation === Number(order.orderNo) ? "listOverviewOn" : "listOverview"} onClick={editView}>
                                                            <div className="orderNo">{order.orderNo}</div>
                                                            <div className="orderDate">{calFormatter(order.orderDate)}</div>
                                                            <div className="installDate">{calFormatter(order.installDate)}</div>
                                                            <div className="deposit">{cashFormatter(order.deposit)}</div>
                                                            <div className="installation">{cashFormatter(order.installation)}</div>
                                                            <div className="discount">{order.discount}%</div>
                                                            <div className="payment">{order.payment}</div>
                                                            <div className="total">{cashFormatter(order.total)}</div>
                                                        </div>
                                                    )
                                                })
                                                :
                                                <div className="noneOrder"> None of the list. </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="registerView">
                            <form name="registerForm" className="registerForm">
                                <div className="registerTitleSection">{displayState.title}</div>
                                <div className="inputRow">
                                    <div className="rowTitle">NAME</div>
                                    <input type="text" id="name" className="registerInput" value={detailState.customer.name} onChange={changeHandle} />
                                </div>
                                <div className="inputRow">
                                    <div className="rowTitle">ADDRESS</div>
                                    <input type="text" id="address" className="registerInput" value={detailState.customer.address} onChange={changeHandle} />
                                </div>
                                <div className="inputRow">
                                    <div className="rowTitle">PHONE</div>
                                    <input type="text" id="phone" className="registerInput" value={detailState.customer.phone} onChange={changeHandle} />
                                </div>
                                <div className="inputRow">
                                    <div className="rowTitle">EMAIL</div>
                                    <input type="text" id="email" className="registerInput" value={detailState.customer.email} onChange={changeHandle} />
                                </div>
                                <div className="inputRow">
                                    <div className="rowTitle">NOTE</div>
                                    <input type="text" id="note" className="registerInput" value={detailState.customer.note} onChange={changeHandle} />
                                </div>

                                <div className="inputRow">
                                    {displayState.title === "Register" ?
                                        <button id="register" className="customerSubmit" onClick={onClicked}>{displayState.title}</button>
                                        :
                                        <div className="twinSection">
                                            <button id="update" className="customerTwinSubmit" onClick={onClicked}>Update</button>
                                            <button id="remove" className="customerTwinSubmit" onClick={onClicked}>Remove</button>
                                        </div>
                                    }
                                </div>
                            </form>
                        </div>
                }



            </div>


            <style jsx>{`
                .userSearchContainer {
                width: 20vw;
                max-height: 74vh;
                margin-top: 30px;
                position: relative;
                display: flex;
                flex-direction:column;
                border: 1px solid black;
                border-top: 10px solid #2F3D4C;
                border-radius: 10pt;
                justify-content: flex-start;
                align-items: center;
                overflow: scroll;
                }

                .userDetailContainer{
                    margin-top: 30px;
                    width: 77%;
                    max-height: 74vh;
                    display: flex;
                    flex-direction:column;
                    border: 1px solid black;
                    border-top: 10px solid #2F3D4C;
                    border-radius: 10pt;
                    justify-content: flex-start;
                    align-items: center;
                    
                    overflow: scroll;
                }

                .registerForm{
                    margin-top: 20px;
                    margin-left: auto;
                    margin-right: auto;
                    width: 80%;
                    height: 90%;
                    justify-content: center;
                    align-items: center;
                    display: flex;
                    flex-direction:column;
                    font-family: tecnico;
                }
                
                .registerTitleSection{
                    min-height: 70px;
                    font-size: 2rem;
                }

                .userView{
                    width: 100%;
                    height: 100%;
                }

                .registerView{
                    width: 100%;
                    height: 100%;
                }

                input{
                    margin-top: 20px;
                    border: 1px solid #dde5ff;
                    border-radius: 4px;
                    color: #5d647b;
                    outline: 0;
                    font-size: 18px;
                    padding: 14px;
                    width: 90%;
                  }

                .inputRow{
                    width: 50%;
                    margin-top: 10px;
                    margin-right: auto;
                    margin-left: auto;
                    justify-content: space-between;
                    align-items: center;
                    display: flex;
                    
                }

                .rowTitle{
                    width: 10%;
                }

                .registerInput{
                    width: 70%;
                    margin-top: 0;
                }

                .customerSubmit{
                    margin-top: 30px;
                    width: 100%;
                    height: 40px;
                    font-family: tecnico;
                    background: #FFBD00;
                    color: white;
                    font-size: 0.875rem;
                    box-shadow: 1px 1px 1px grey;
                    border: none;
                    border-radius: 4pt;
                }

                .twinSection{
                    width: 100%;
                    align-items: center;
                    display: flex;
                    justify-content: space-between;
                }

                .customerTwinSubmit{
                    margin-top: 30px;
                    width: 48%;
                    height: 40px;
                    font-family: tecnico;
                    background: #FFBD00;
                    color: white;
                    font-size: 0.875rem;
                    box-shadow: 1px 1px 1px grey;
                    border: none;
                    border-radius: 4pt;
                }

                .userTopSection{
                    margin: 30px 0 30px 10px;
                    justify-content: center;
                    width: 100%;
                    backgroud: yellow
                    border:2px solid black;
                }

                .userTable {
                    width: 100%;
                    min-height: 530px;
                    position: absolute;
                    border-bottom:1px solid black;
                    flex-direction: column;
                    bottom: 0%;
                }

                .userTable .customerTitles{
                    width: 100%;
                    height: 4vh;
                    background: #2F3D4C;
                    font-size: 0.875rem;
                    color: white;
                    border-top: 2px solid black;
                    border-bottom: none;
                    border-top-left-radius: 7pt;
                    border-top-right-radius: 7pt;
                    display: flex;
                    position: absolute;
                    top: 0;
                }

                .customerNameTitle{
                    width: 25%;
                    border-right: 1px solid black;
                    font-family: tecnico;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .customerAddressTitle{
                    width:75%;
                    font-family: tecnico;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .userList{
                    margin-top: 37px;
                    width: 100%;
                    height: 90%;
                    overflow: scroll;
                    position: absolute;
                }

                .userOverview{
                    min-height: 40px;
                    width:100%;
                    font-size: 0.8rem;
                    font-family: tecnico;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 1px solid;
                }

                .userOverviewOn{
                    width: 100%;
                    font-size: 0.8rem;
                    border: none;
                    border-bottom: 1px solid black;
                    background: #C0C0C0;
                    color: #7CFC00;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .userName{
                    width: 25%;
                    height: 40px;
                    border-right: 1px solid black;
                    font-family: tecnico;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .userAddress{
                    width: 75%;
                    height: 40px;
                    font-family: tecnico;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .noneUser{
                    width:100%;
                    margin-top: 37px;
                    font-family: tecnico;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 1px solid;
                    
                    height: 40px;
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

                .cstmerEditBtn{
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

                .cstmerRegisterBtn{
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

                .userDetail{
                    width: 100%;
                    min-height: 20%;
                    display:flex;
                    align-items: center;
                    justify-content: center;
                }

                .userDetailTable{
                    width: 95%;
                    height:70%;
                    font-family: tecnico;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    border: 1px solid black;
                    border-radius: 4pt;
                }

                .titleSection{
                    width: 20%;
                    text-align: right;
                    margin-right: 30px;
                }

                .orderList{
                    width: 100%;
                    height: 80%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .orders{
                    width: 95%;
                    height:100%;
                    
                }

                .listHeader{
                    font-family: tecnico;
                    display:flex;
                    justify-content:space-between;
                }

                .listTable{
                    height: 90%;
                    border-radius: 4pt;
                    border: 1px solid black;
                }

                .listTitle{
                    display: flex;
                    font-family: tecnico;
                    background: #2F3D4C;
                    font-size: 0.875rem;
                    color: white;
                }

                .orderNoTitle{
                    width: 15%;
                    height: 4vh;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .orderDateTitle{
                    width: 15%;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .installDateTitle{
                    width: 15%;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }   
                
                .depositTitle{
                    width: 10%;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .installationTitle{
                    width: 15%;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }
                
                .discountTitle{
                    width: 10%;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .paymentTitle{
                    width: 10%;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .totalTitle{
                    width: 10%;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .listOverview{
                    display: flex;
                    border-bottom: 1px solid black;
                    font-family: tecnico;
                    font-size: 0.7rem;
                }

                .listOverviewOn{
                    width: 100%;
                    font-family: tecnico;
                    font-size: 0.7rem;
                    border-bottom: 1px solid black;
                    background: #C0C0C0;
                    color: #7CFC00;
                    display: flex;
                }

                .noneOrder{
                    height: 4vh;
                    border-bottom: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                    font-family: tecnico;
                }

                .orderNo{
                    width: 15%;
                    height: 4vh;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .orderDate{
                    width: 15%;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .installDate{
                    width: 15%;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }   
                
                .deposit{
                    width: 10%;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .installation{
                    width: 15%;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }
                
                .discount{
                    width: 10%;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .payment{
                    width: 10%;
                    border-right: 1px solid black;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .total{
                    width: 10%;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .editBtn{
                    width: auto;
                    height: 25px;
                    margin-right: 5px;
                    margin-bottom: 3px;
                    font-family: tecnico;
                    background: #FFBD00;
                    color: white;
                    font-size: 0.875rem;
                    box-shadow: 1px 1px 1px grey;
                    border: none;
                    border-radius: 4pt;
                    outline: none;
                }

                .removeBtn{
                    width: auto;
                    height: 25px;
                    margin-right: 5px;
                    margin-bottom: 3px;
                    font-family: tecnico;
                    background: #FFBD00;
                    color: white;
                    font-size: 0.875rem;
                    box-shadow: 1px 1px 1px grey;
                    border: none;
                    border-radius: 4pt;
                    outline: none;
                }

                `}
            </style>
        </Fragment>
    );
}

export default Customers;