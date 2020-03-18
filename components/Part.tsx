import React, { Fragment, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import { ErrorView } from './ErrorView';
import { Part, PartType, PartKind } from '../generated/graphql';
import { useRouter } from 'next/router';

interface hoverState {
    currentLocation: number;
}

const defaultHoverState: hoverState = {
    currentLocation: 0
}

interface detailState {
    part: Part
}

const defaultDetailState: detailState = {
    part: {} as Part
}

interface modelNoState {
    modelNo: string;
}

const defaultModelNoState: modelNoState = {
    modelNo: ""
}

interface typeState {
    type: string;
}

const defaultTypeState: typeState = {
    type: "0"
}

interface kindState {
    kind: string;
}

const defaultKindState: kindState = {
    kind: "0"
}

interface nameState {
    name: string;
}

const defaultNameState: nameState = {
    name: ""
}

interface colorState {
    color: string;
}

const defaultColorState: colorState = {
    color: "0"
}

interface companyState {
    manufacturer: string;
}

const defaultCompanyState: companyState = {
    manufacturer: ""
}

interface gradeState {
    grade: string;
}

const defaultGradeState: gradeState = {
    grade: "0"
}

const GET_PARTS = gql(`
query GetParts($keyword: String!, $type: String!){
    getParts(keyword:$keyword, type:$type){
      id
      type
      kind
      name
      color
      manufacturer
      grade
      modelNo
    }
  }
`);

const NEW_PART = gql(`
mutation NEW_PART($data:PartInput!){
    registerPart(data: $data){
      id
      type
      kind
      name
      color
      manufacturer
      grade
      modelNo
    }
  }
`);

const UPDATE_PART = gql(`
mutation NEW_PART($data:PartInput!, $id:Float!){
    updatePart(data: $data, partId: $id)
  }
`);

const DELETE_PART = gql(`
mutation DELETE_PART($id: Float!){
    deletePart(id: $id)
  }
`);

export const Parts: React.FC = () => {
    const router = useRouter();
    const [hoverState, setHoverState] = useState<hoverState>(defaultHoverState);
    const [detailState, setDetailState] = useState<detailState>(defaultDetailState);
    const [modelNoState, setModelNoState] = useState<modelNoState>(defaultModelNoState);
    const [typeState, setTypeState] = useState<typeState>(defaultTypeState);
    const [kindState, setKindState] = useState<kindState>(defaultKindState);
    const [nameState, setNameState] = useState<nameState>(defaultNameState);
    const [colorState, setColorState] = useState<colorState>(defaultColorState);
    const [companyState, setCompanyState] = useState<companyState>(defaultCompanyState);
    const [gradeState, setGradeState] = useState<gradeState>(defaultGradeState);
    const [newPart] = useMutation(NEW_PART);
    const [updatePart] = useMutation(UPDATE_PART);
    const [deletePart] = useMutation(DELETE_PART);

    const { loading, error, data } = useQuery(GET_PARTS, {
        variables: {
            keyword: "",
            type: ""
        }
    });

    const onNew = async (e: React.MouseEvent) => {
        const registeredPart = await newPart({
            variables: {
                data: {
                    type: typeState.type as PartType,
                    kind: kindState.kind as PartKind,
                    name: nameState.name,
                    color: colorState.color,
                    manufacturer: companyState.manufacturer,
                    grade: gradeState.grade,
                    modelNo: modelNoState.modelNo
                }
            }
        })

        if (registeredPart.data) {
            alert("New part is succeessfully registered!");
        } else {
            alert("Something went wrong");
        }

        router.reload();
    }

    const onUpdate = async (e: React.MouseEvent) => {
        confirm("Are you sure to update it?");
        const isUpdatedPart = await updatePart({
            variables: {
                data: {
                    type: typeState.type as PartType,
                    kind: kindState.kind as PartKind,
                    name: nameState.name,
                    color: colorState.color,
                    manufacturer: companyState.manufacturer,
                    grade: gradeState.grade,
                    modelNo: modelNoState.modelNo
                },
                id: Number(detailState.part.id)
            }
        })

        if (isUpdatedPart) {
            alert("part update is successfully done!");
        } else {
            alert("Something went wrong");
        }

        router.reload();
    }

    const onDelete = async (e: React.MouseEvent) => {
        confirm("Are you sure to delete it?");
        const isDeleted = await deletePart({
            variables: {
                id: Number(detailState.part.id)
            }
        })

        if (isDeleted) {
            alert("part deletion is successfully done!");
        } else {
            alert("Something went wrong");
        }

        router.reload();
    }

    const viewDetails = (part: Part) => (e: React.MouseEvent) => {
        setHoverState({
            currentLocation: Number(e.currentTarget.id)
        })

        if (part !== undefined) {
            setDetailState({
                part
            })
        }
        if (part.modelNo) {
            setModelNoState({
                modelNo: part.modelNo
            })
        } else {
            setModelNoState({
                modelNo: ""
            })
        }
        setTypeState({
            type: part.type
        })
        setKindState({
            kind: part.kind
        })
        setNameState({
            name: part.name
        })
        setColorState({
            color: part.color
        })
        setCompanyState({
            manufacturer: part.manufacturer
        })
        setGradeState({
            grade: part.grade
        })
    }

    const handleModelNo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModelNoState({
            modelNo: e.currentTarget.value
        })
    }

    const handleType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTypeState({
            type: e.currentTarget.value
        })
    }

    const handleKind = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setKindState({
            kind: e.currentTarget.value
        })
    }

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameState({
            name: e.currentTarget.value
        })
    }

    const handleColor = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setColorState({
            color: e.currentTarget.value
        })
    }

    const handleCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyState({
            manufacturer: e.currentTarget.value
        })
    }

    const handleGrade = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGradeState({
            grade: e.currentTarget.value
        })
    }

    if (loading) { return <p>Loading...</p> }
    else if (error) {
        return <ErrorView errMsg={error.message} currentLocation={4} />
    }
    else {
        return <Fragment>
            <div className="partContainer">
                <div className="partTopSection">
                    <div className="partSectionTitle">Parts</div>
                </div>
                <div className="partTable">
                    <div className="partTitles">
                        <div className="partNoTitle">PART #</div>
                        <div className="partTypeTitle">TYPE</div>
                        <div className="partKindTitle">KIND</div>
                        <div className="partNameTitle">NAME</div>
                        <div className="partColorTitle">COLOR</div>
                        <div className="partManufacturerTitle">MANUFACTURER</div>
                        <div className="partGradeTitle">GRADE</div>
                    </div>

                    <div className="partList">
                        {
                            data.getParts.map((part: Part) => {
                                return (
                                    <div id={part.id} className={hoverState.currentLocation === Number(part.id) ? "partOverViewOn" : "partOverView"} onClick={viewDetails(part)}>
                                        <div className="partNo">{part.id}</div>
                                        <div className="partType">{part.type}</div>
                                        <div className="partKind">{part.kind}</div>
                                        <div className="partName">{part.name}</div>
                                        <div className="partColor">{part.color}</div>
                                        <div className="partManufacturer">{part.manufacturer}</div>
                                        <div className="partGrade">{part.grade}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            <div className="partController">
                <div className="partDetails">
                    <div className="section">
                        <div className="partInput">
                            <span className="blodeFont">PART # : </span>
                            <span className="flex-item">
                                <input
                                    className="styledInput"
                                    value={modelNoState.modelNo}
                                    onChange={handleModelNo}
                                    type="text"
                                />
                            </span>
                        </div>
                    </div>

                    <div className="section-1">
                        <div className="partInput">
                            <span className="blodeFont">TYPE : </span>
                            <select className="selectPartType" value={typeState.type} onChange={handleType}>
                                <option value="0">Select type...</option>
                                <option value={PartType.Fabric}>FABRIC</option>
                                <option value={PartType.Component}>COMPONENT</option>
                            </select>
                        </div>
                        <div className="partInput">
                            <span className="blodeFont">KIND : </span>
                            <select className="selectPartType" value={kindState.kind} onChange={handleKind}>
                                <option value="0">Select kind...</option>
                                <option value={PartKind.Combi}>COMBI</option>
                                <option value={PartKind.Roll}>ROLL</option>
                                <option value={PartKind.Triple}>TRIPLE</option>
                            </select>
                        </div>
                        <div className="partInput">
                            <span className="blodeFont">NAME : </span>
                            <span className="flex-item">
                                <input
                                    className="styledInput"
                                    value={nameState.name}
                                    onChange={handleName}
                                    type="text"
                                />
                            </span>
                        </div>
                        <div className="partInput">
                            <span className="blodeFont">COLOR : </span>
                            <select className="selectPartType" value={colorState.color} onChange={handleColor}>
                                <option value="0">Select color...</option>
                                <option value="WHITE">WHITE</option>
                                <option value="IVORY">IVORY</option>
                                <option value="CREAM">CREAM</option>
                                <option value="OATMEAL">OATMEAL</option>
                                <option value="GREY">GREY</option>
                                <option value="BLACK">BLACK</option>
                                <option value="BROWN">BROWN</option>

                            </select>
                        </div>
                        <div className="partInput">
                            <span className="blodeFont">COMPANY : </span>
                            <span className="flex-item">
                                <input
                                    className="styledInput"
                                    type="text"
                                    value={companyState.manufacturer}
                                    onChange={handleCompany}
                                />
                            </span>
                        </div>
                        <div className="partInput">
                            <span className="blodeFont">GRADE : </span>
                            <select className="selectPartType" value={gradeState.grade} onChange={handleGrade}>
                                <option value="0">Select grade...</option>
                                <option value="1">$44</option>
                                <option value="2">$55</option>
                                <option value="3">$66</option>
                                <option value="4">$77</option>
                                <option value="5">$88</option>
                                <option value="6">$99</option>
                                <option value="7">$110</option>
                                <option value="8">$130</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="buttonSection">
                    <button className="newBtn" onClick={onNew}>NEW</button>
                    <button className="updateBtn" onClick={onUpdate}>UPDATE</button>
                    <button className="deleteBtn" onClick={onDelete}>DELETE</button>
                </div>
            </div>
            <div className="fillBlank"></div>
            <style jsx>{`
            .fillBlank{
                width: 2vw;
            }

            .partContainer{
                width: 72vw;
                max-height: 81vh;
                display: flex;
                justify-content: flex-start;
                flex-direction: column;
                position: relative;
                align-items: flex-start;
            }

            .partController{
                width: 25vw;
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

            .partTopSection .partSectionTitle{
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

            .partContainer .partTable{
                width: 72vw;
                height: 75vh;
                position: absolute;
                bottom: 0;
            }

            .partContainer .partTable .partTitles{
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

            .partNoTitle{
                width: 20%;
                height: auto;
                font-family: tecnico;
                border-right: 1px solid black;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .partTypeTitle{
                width: 10%;
                height: auto;
                font-family: tecnico;
                border-right: 1px solid black;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .partKindTitle{
                width: 10%;
                height: auto;
                font-family: tecnico;
                border-right: 1px solid black;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .partNameTitle{
                width: 20%;
                height: auto;
                font-family: tecnico;
                border-right: 1px solid black;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .partColorTitle{
                width: 10%;
                height: auto;
                font-family: tecnico;
                border-right: 1px solid black;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .partManufacturerTitle{
                width: 20%;
                height: auto;
                font-family: tecnico;
                border-right: 1px solid black;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .partGradeTitle{
                width: 10%;
                height: auto;
                font-family: tecnico;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .partList{
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

            .partOverView{
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

            .partOverViewOn{
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

            .partNo{
                width: 20%;
                height: 50px;
                border-right: 1px solid grey;
                z-index: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .partType{
                width: 10%;
                height: 50px;
                border-right: 1px solid grey;
                z-index: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .partKind{
                width: 10%;
                height: 50px;
                border-right: 1px solid grey;
                z-index: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .partName{
                width: 20%;
                height: 50px;
                border-right: 1px solid grey;
                z-index: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .partColor{
                width: 10%;
                height: 50px;
                border-right: 1px solid grey;
                z-index: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .partManufacturer{
                width: 20%;
                height: 50px;
                border-right: 1px solid grey;
                z-index: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .partGrade{
                width: 10%;
                height: 50px;
                border-right: 1px solid grey;
                z-index: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .partDetails{
                width: 100%;
                height: 88%;
                font-family: tecnico;
                background: white;
                overflow: scroll;
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

            .section-1 {
                width: 85%;
                min-height: 50px;
                margin-left:10px;
                padding: 10px;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                flex-direction: column;
                font-size: 0.875rem;
            }

            .partInput{
                width:100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;
            }

            .styledInput{
                width: 200px;
                border: none;
                font-family: tecnico;
                font-size: 14px;
                text-align:right;
            }
            
            .selectPartType{
                width: 230px;
                border: 1px solid #dde5ff;
                border-radius: 4px;
                font-family: tecnico;
                font-size: 14px;
                color: #5d647b;
                padding: 10px;
                text-align:right;
            }

            .flex-item {
                width: 210px;
                justify-content: center;
                margin-top:5px;
                border: 1px solid #dde5ff;
                border-radius: 4px;
                color: #5d647b;
                outline: 0;
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

            .newBtn{
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
        
            .updateBtn{
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
        
            .deleteBtn{
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

        `}</style>
        </Fragment>
    }
}