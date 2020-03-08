import React, { Fragment, useState, FormEvent } from 'react';
import gql from 'graphql-tag';

import { useQuery, useMutation } from 'react-apollo';
import { orderNoGenerator } from '../util/formatter';
import { useRouter } from 'next/router';
import { Part, Item, Order } from '../generated/graphql';
import { ErrorView } from './ErrorView';


interface Props {
    customerId: string,
    orderNo: string
}

interface selectedRoomName {
    roomName: string
}

const defaultSelectedRoomName: selectedRoomName = {
    roomName: ""
}
interface selectedBlind {
    blind: string
}

const defaultSelectedBilnd: selectedBlind = {
    blind: "1"
}

interface selectedWidth {
    width: string
}

const defaultSelectedWidth: selectedWidth = {
    width: "0"
}

interface selectedHeight {
    height: string
}

const defaultSelectedHeight: selectedHeight = {
    height: "0"
}

interface selectedCover {
    cover: string
}

const defaultSelectedCover: selectedCover = {
    cover: "WHITE"
}

interface selectedType {
    type: string
}

const defaultSelectedType: selectedType = {
    type: "R"
}

interface selectedMaterial {
    material: string
}

const defaultSelectedMaterial: selectedMaterial = {
    material: "BASIC"
}

interface selectedLength {
    length: string
}

const defaultSelectedLength: selectedLength = {
    length: "1.0"
}

interface selectedState {
    currentLocation: number
}

const defaultSelectedState: selectedState = {
    currentLocation: 0
}
interface orderState {
    order: Order;
}

const defaultOrderState: orderState = {
    order: {} as Order
}



const GET_ORDER = gql(`
query GetOrder($input: String!){
    getOrder(orderNo:$input){
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
        partId
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
      customer{
        id
        name
        address
        phone
        email
        type
        note
      }
    }
  }
`);

const PLACE_ORDER = gql(`
mutation PlaceOrder($input: PlaceOrderInput!){
    placeOrder(data: $input){
      id
      orderNo
      deposit
      payment
      items{
        partId
      }
    }
  }
`);

const GET_BLINDS = gql(`
query getBlinds($input: String!){
    getParts(type:$input, keyword:""){
      id
      type
      kind
      name
      color
    }
  }
`);

const GET_CUSTOMER = gql(`
query GetCustomer($input: Float!){
    getCustomer(id: $input){
        id
        name
    }
}
`);

const ADD_ITEM = gql(`
mutation ADD_ITEM($orderId:Float!, $partId:Float!, $data:ItemInput!){
    createItem(
      orderId:$orderId,
      partId:$partId,
      data:$data
    ){
      id
      itemName
      width
      height
      price
    }
  }
`)

const UPDATE_ITEM = gql(`
  mutation UPDATE_ITEM($itemId: Float!, $partId: Float!, $data:ItemInput!){
      updateItem(
          itemId: $itemId,
          partId: $partId,
          data: $data
      )
  }
`)

const DELETE_ITEM = gql(`
mutation DeleteItem($itemId: Float!){
    deleteItem(itemId: $itemId)
  }
`)

export const Quotes: React.FC<Props> = ({ customerId, orderNo }) => {
    const router = useRouter();
    const [selectedRoomName, setSelectedRoomName] = useState<selectedRoomName>(defaultSelectedRoomName);
    const [selectedBlind, setSelectedBlind] = useState<selectedBlind>(defaultSelectedBilnd);
    const [selectedWidth, setSelectedWidth] = useState<selectedWidth>(defaultSelectedWidth);
    const [selectedHeight, setSelectedHeight] = useState<selectedHeight>(defaultSelectedHeight);
    const [selectedCover, setSelectedCover] = useState<selectedCover>(defaultSelectedCover);
    const [selectedType, setSelectedType] = useState<selectedType>(defaultSelectedType);
    const [selectedMaterial, setSelectedMaterial] = useState<selectedMaterial>(defaultSelectedMaterial);
    const [selectedLength, setSelectedLength] = useState<selectedLength>(defaultSelectedLength);
    const [selectedState, setSelectedState] = useState<selectedState>(defaultSelectedState);

    const [orderState, setOrderState] = useState<orderState>(defaultOrderState);
    const { loading, error, data } = useQuery(GET_ORDER, {
        variables: {
            input: orderNo.toString()
        }
    });

    const { loading: customerLoading, error: customerError, data: customerData } = useQuery(GET_CUSTOMER, {
        variables: {
            input: Number(customerId)
        }
    });

    const [placeOrder] = useMutation(PLACE_ORDER);
    const { loading: blindsLoading, error: blindsError, data: blindsData } = useQuery(GET_BLINDS, {
        variables: {
            input: "FABRIC",
            keyword: ""
        }
    });

    const [addItem] = useMutation(ADD_ITEM);
    const [updateItem] = useMutation(UPDATE_ITEM);
    const [deleteItem] = useMutation(DELETE_ITEM);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const inputFields = e.currentTarget.getElementsByTagName("input");

        await placeOrder({
            variables: {
                input: {
                    orderNo: inputFields[0].value,
                    deposit: Number(inputFields[1].value),
                    installation: Number(inputFields[2].value),
                    payment: inputFields[3].value,
                    customerId: Number(customerId)

                }
            }
        });

        return router.push(`/quote?customerId=${customerId}&orderNo=${inputFields[0].value}`);
    }

    const itemHandleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const itemRouter = e.currentTarget.id;

        if (itemRouter === "add") {
            await addItem({
                variables: {
                    orderId: Number(data.getOrder.id),
                    partId: Number(selectedBlind.blind),
                    data: {
                        coverColor: selectedCover.cover,
                        width: Number(selectedWidth.width),
                        height: Number(selectedHeight.height),
                        handrailType: selectedType.type,
                        handrailMaterial: selectedMaterial.material,
                        handrailLength: Number(selectedLength.length),
                    }
                }
            })
        } else if (itemRouter === "edit") {
            await updateItem({
                variables: {
                    itemId: selectedState.currentLocation,
                    partId: Number(selectedBlind.blind),
                    data: {
                        coverColor: selectedCover.cover,
                        width: Number(selectedWidth.width),
                        height: Number(selectedHeight.height),
                        handrailType: selectedType.type,
                        handrailMaterial: selectedMaterial.material,
                        handrailLength: Number(selectedLength.length)
                    }
                }
            })
        } else {
            await deleteItem({
                variables: {
                    itemId: selectedState.currentLocation
                }
            })
        }
        return router.reload();
    }

    const roomHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRoomName({
            roomName: e.currentTarget.value
        })
    }

    const blindHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBlind({
            blind: e.currentTarget.value
        })
    }

    const widthHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedWidth({
            width: e.currentTarget.value
        })
    }

    const heightHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedHeight({
            height: e.currentTarget.value
        })
    }

    const coverHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCover({
            cover: e.currentTarget.value
        })
    }

    const typeHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedType({
            type: e.currentTarget.value
        })
    }

    const materialHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMaterial({
            material: e.currentTarget.value
        })
    }

    const lengthHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLength({
            length: e.currentTarget.value
        })
    }

    const editItem = (item: Item) => (e: React.MouseEvent) => {
        setSelectedState({
            currentLocation: Number(e.currentTarget.id)
        })
        setSelectedBlind({
            blind: (item.partId).toString()
        })
        setSelectedWidth({
            width: item.width.toString()
        })
        setSelectedHeight({
            height: item.height.toString()
        })
        setSelectedCover({
            cover: item.coverColor
        })
        setSelectedType({
            type: item.handrailType
        })
        setSelectedMaterial({
            material: item.handrailMaterial
        })
        setSelectedLength({
            length: item.handrailLength.toString()
        })
    }

    if (loading) return <p>Loading...</p>
    else if (error) {
        return <ErrorView errMsg={error.message} currentLocation={3} />
    }
    return (
        <Fragment>
            {
                orderNo === undefined || orderNo === "last" ?
                    <div className="registerContainer">
                        <form
                            className="registerForm"
                            onSubmit={handleSubmit}
                        >
                            <div className="registerTitleSection">New Order Placement</div>
                            <div className="inputRow">
                                <div className="rowTitle">ORDER#</div>
                                <input type="text" className="registerInput" value={data.getOrder ? orderNoGenerator(data.getOrder.orderNo) : orderNoGenerator("0000")} readOnly />
                            </div>
                            <div className="inputRow">
                                <div className="rowTitle">DEPOSIT</div>
                                <input type="text" className="registerInput" placeholder="0" />
                            </div>
                            <div className="inputRow">
                                <div className="rowTitle">INSTALLATION</div>
                                <input type="text" className="registerInput" placeholder="0" />
                            </div>
                            <div className="inputRow">
                                <div className="rowTitle">PAYMENT</div>
                                <input type="text" className="registerInput" />
                            </div>
                            <div className="inputRow">
                                <div className="rowTitle">CUSTOMER</div>
                                <input type="text" className="registerInput" readOnly value={customerData && customerData.getCustomer ? customerData.getCustomer.name : "Loading..."} />
                            </div>

                            <div className="inputRow">
                                <button className="customerSubmit" >Register</button>
                            </div>
                        </form>
                    </div>
                    :
                    <div className="addContainer">
                        <div className="itemContainer">
                            <div className="itemTable">
                                <div className="itemTitles">
                                    <div className="itemNoTitle">ITEM #</div>
                                    <div className="roomNameTitle">ROOM NAME</div>
                                    <div className="blindNameTitle">BLIND</div>
                                    <div className="itemWidthTitle">WIDTH</div>
                                    <div className="itemHeightTitle">HEIGHT</div>
                                    <div className="itemCoverColorTitle">COVER COLOR</div>
                                    <div className="handrailTypeTitle">HANDRAIL TYPE</div>
                                    <div className="handrailMaterialTitle">HANDRAIL MATERIAL</div>
                                    <div className="handrailLengthTitle">HANDRAIL LENGTH</div>
                                </div>

                                <div className="itemList">
                                    {
                                        data && data.getOrder && data.getOrder.items.length > 0 ?
                                            data.getOrder.items.map((item: Item, idx: any) => {
                                                return <div id={item.id} className={selectedState.currentLocation === Number(item.id) ? "itemOverviewOn" : "itemOverview"} onClick={editItem(item)}>
                                                    <div className="itemNo">{idx + 1}</div>
                                                    <div className="roomName">{item.roomName}</div>
                                                    <div className="blindName">{item.itemName}</div>
                                                    <div className="itemWidth">{item.width}</div>
                                                    <div className="itemHeight">{item.height}</div>
                                                    <div className="itemCoverColor">{item.coverColor}</div>
                                                    <div className="handrailType">{item.handrailType}</div>
                                                    <div className="handrailMaterial">{item.handrailMaterial}</div>
                                                    <div className="handrailLength">{item.handrailLength}(M)</div>
                                                </div>
                                            })
                                            :
                                            <div className="itemOverview">
                                                <div className="noneItem">None of the list</div>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="addController">
                            <div className="section">
                                <span className="blodeFont">Customer : </span>{customerData && customerData.getCustomer ? customerData.getCustomer.name : " - "}
                                <span className="blodeFont">OrderNo : </span>{data.getOrder ? data.getOrder.orderNo : " - "}
                            </div>

                            <form name="itemAddForm"
                                onSubmit={itemHandleSubmit}
                            >
                                <div className="itemAddTitleSection">ADD ITEM</div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">ROOM NAME</div>
                                    <input type="text" className="itemInput" value={selectedRoomName.roomName} onChange={roomHandle} />
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">BLIND</div>
                                    <select className="itemSelect" onChange={blindHandle}>
                                        {
                                            blindsData && blindsData.getParts ?
                                                blindsData.getParts.map((part: Part) => {
                                                    return <option value={part.id} selected={part.id === selectedBlind.blind ? true : false}> [{part.id}] / {part.name}[{part.color}]</option>
                                                })
                                                :
                                                <option value="-1">none</option>
                                        }
                                    </select>
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">WIDTH</div>
                                    <input type="text" className="itemInput" value={selectedWidth.width.toString()} onChange={widthHandle} />
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">HEIGHT</div>
                                    <input type="text" className="itemInput" value={selectedHeight.height.toString()} onChange={heightHandle} />
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">COVER COLOR</div>
                                    <select className="itemSelect" onChange={coverHandle} value={selectedCover.cover}>
                                        <option value="WHITE">white</option>
                                        <option value="IVORY">ivory</option>
                                        <option value="GREY">grey</option>
                                        <option value="BLACK">black</option>
                                        <option value="BROWN">brown</option>
                                    </select>
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">HANDRAIL TYPE</div>
                                    <select className="itemSelect" onChange={typeHandle} value={selectedType.type}>
                                        <option value="R">R</option>
                                        <option value="L">L</option>
                                    </select>
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">HANDRAIL MATERIAL</div>
                                    <select className="itemSelect" onChange={materialHandle} value={selectedMaterial.material}>
                                        <option value="BASIC">BASIC</option>
                                        <option value="CRYSTAL">CRYSTAL</option>
                                        <option value="METAL">METAL</option>
                                        <option value="MOTOR">MOTOR</option>
                                    </select>
                                </div>
                                <div className="itemInputRow">
                                    <div className="rowTitle">HANDRAIL LENGTH</div>
                                    <select className="itemSelect" onChange={lengthHandle} value={selectedLength.length}>
                                        <option value="1.0">1.0M</option>
                                        <option value="1.2">1.2M</option>
                                        <option value="1.5">1.5M</option>
                                        <option value="2.0">2.0M</option>
                                        <option value="9.9">CUSTOM</option>
                                    </select>
                                </div>
                                <div className="buttonSection">
                                    <button className="addBtn" id="add" onClick={itemHandleSubmit}>ADD</button>
                                    <button className="editBtn" id="edit" onClick={itemHandleSubmit}>EDIT</button>
                                    <button className="removeBtn" id="remove" onClick={itemHandleSubmit}>REMOVE</button>
                                </div>
                            </form>
                        </div>
                    </div>

            }


            <style jsx>{`
                .registerContainer{
                    width:100vw;
                    
                    border-radius: 10pt;
                }

                .addContainer{
                    width: 100vw;
                    height: 87vh;
                    background: #F9F9F9;
                    position: absolute;
                    padding: 10px;
                    display: flex;
                    align-content: center;
                    justify-content: center;
                }

                .registerForm{
                    margin-left: auto;
                    margin-right: auto;
                    width: 80%;
                    height: 80%;
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
                    margin-top: 50px;
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

                .itemContainer{
                    width: 75vw;
                    max-height: 81vh;
                    position: relative;
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    flex-direction: column;
                }

                .itemContainer .itemTable{
                    width: 79vw;
                    height: 75vh;
                    position: absolute;
                }

                .itemTitles{
                    width: 75vw;
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
                    width: 20%;
                    height: auto;
                    font-family: tecnico;
                    border-right: 1px solid black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .blindNameTitle{
                    width: 20%;
                    height: auto;
                    font-family: tecnico;
                    border-right: 1px solid black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .itemWidthTitle{
                    width: 5%;
                    height: auto;
                    font-family: tecnico;
                    border-right: 1px solid black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .itemHeightTitle{
                    width: 5%;
                    height: auto;
                    font-family: tecnico;
                    border-right: 1px solid black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .itemCoverColorTitle{
                    width: 10%;
                    height: auto;
                    font-family: tecnico;
                    border-right: 1px solid black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .handrailTypeTitle{
                    width: 10%;
                    height: auto;
                    font-family: tecnico;
                    border-right: 1px solid black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .handrailMaterialTitle{
                    width: 15%;
                    height: auto;
                    font-family: tecnico;
                    border-right: 1px solid black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .handrailLengthTitle{
                    width: 10%;
                    height: auto;
                    font-family: tecnico;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .itemList{
                    margin-top: 45px;
                    width: 75vw;
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

                .itemOverview{
                    width: 100%;
                    font-size: 0.8rem;
                    border: none;
                    border-bottom: 1px solid black;
                    background: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .itemOverviewOn{
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

                .noneItem{
                    width: 100%;
                    height: 40px;
                    font-family: tecnico;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .itemNo{
                    width: 5%;
                    height: 40px;
                    border-right: 1px solid black;
                    font-family: tecnico;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .roomName{
                    width: 20%;
                    height: 40px;
                    border-right: 1px solid black;
                    font-family: tecnico;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .blindName{
                    width: 20%;
                    height: 40px;
                    border-right: 1px solid black;
                    font-family: tecnico;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .itemWidth{
                    width: 5%;
                    height: 40px;
                    border-right: 1px solid black;
                    font-family: tecnico;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .itemHeight{
                    width: 5%;
                    height: 40px;
                    border-right: 1px solid black;
                    font-family: tecnico;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .itemCoverColor{
                    width: 10%;
                    height: 40px;
                    border-right: 1px solid black;
                    font-family: tecnico;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .handrailType{
                    width: 10%;
                    height: 40px;
                    border-right: 1px solid black;
                    font-family: tecnico;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .handrailMaterial{
                    width: 15%;
                    height: 40px;
                    border-right: 1px solid black;
                    font-family: tecnico;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .handrailLength{
                    width: 10%;
                    height: 40px;
                    font-family: tecnico;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                }

                .addController{
                    width: 18vw;
                    max-height: 74vh;
                    margin-left: 3vw;
                    font-family: tecnico;
                    border: 2px solid black;
                    border-top: 10px solid #2F3D4C;
                    border-radius: 10pt;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: scroll;
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

                .blodeFont{
                    font-weight: bold;
                }

                .itemAddTitleSection{
                    padding-left: 10px;
                    font-size: 1.7rem;
                    justify-content: center;
                    align-items: center;
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

                .itemInput{
                    width: 60%;
                    margin-top: 0;
                }

                .itemSelect{
                    width: 70%;
                    border: 1px solid #dde5ff;
                    border-radius: 4px;
                    font-family: tecnico;
                    font-size: 14px;
                    color: #5d647b;
                    padding: 10px;
                    text-align:right; 
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

                .addBtn{
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

                .editBtn{
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

                .removeBtn{
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
            `}</style>
        </Fragment>
    );
}