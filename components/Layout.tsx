import React, { useState, Fragment } from 'react';
import Link from 'next/link';

interface Props {
    onTaskCreated: string[];
    currentLocation: number;
}

interface dropDownState {
    mouseIn: boolean;
}

const defaultDropDwonState: dropDownState = {
    mouseIn: false
}

export const Layout: React.FunctionComponent<Props> = ({ onTaskCreated, currentLocation }) => {
    const [dropDownState, setDropDownState] = useState<dropDownState>(defaultDropDwonState);

    const onMouseIn = (e: React.MouseEvent) => {
        setDropDownState({
            mouseIn: true
        })
    }

    const onMouseOut = (e: React.MouseEvent) => {
        setDropDownState({
            mouseIn: false
        })
    }

    return <Fragment>
        <div className="pageContainer">
            <header className="appHeader">
                <div className="appHeaderLeft"></div>
                <div className="appHeaderCenter">
                    <Link href='/'>
                        <a className="headerImage">
                            <img src="/static/logo.png" />
                        </a>
                    </Link>
                </div>
                <div className="appHeaderRight"></div>
            </header>

            <div className="secondaryheader">
                {
                    onTaskCreated.map((menu: any, i) => {
                        return <Link href={`${menu === 'DashBoard' ? '/' : menu.toLowerCase()}`}>
                            {
                                menu !== "Update" ?
                                    <a className={i === currentLocation ? 'orders-option orders-option-selected' : 'secondaryheader-option'}>
                                        <div className="sidebar-option-text">{menu}</div>
                                    </a>
                                    :
                                    <div className={i === currentLocation || i + 1 === currentLocation ? 'orders-option orders-option-selected dropDown' : 'secondaryheader-option dropDown'} onMouseEnter={onMouseIn} onMouseLeave={onMouseOut}>
                                        <div>Update</div>
                                        <div className="dropDownContent" style={{ display: dropDownState.mouseIn ? "block" : "none" }}>

                                            <Link href={{ pathname: '/update', query: { subMenu: "Grades" } }}>
                                                <a>
                                                    <div
                                                        key="Grades"
                                                        className={currentLocation === 4 ? "dropHeader-option dropHeader-option-selected" : "dropHeader-option"}>
                                                        Grades
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href={{ pathname: '/update', query: { subMenu: "Parts" } }}>
                                                <a>
                                                    <div
                                                        key="Parts"
                                                        className={currentLocation === 5 ? "dropHeader-option dropHeader-option-selected" : "dropHeader-option"}>
                                                        Parts
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href={{ pathname: '/update', query: { subMenu: "Sales" } }}>
                                                <a>
                                                    <div
                                                        key="Sales"
                                                        className={currentLocation === 6 ? "dropHeader-option dropHeader-option-selected" : "dropHeader-option"}>
                                                        Sales
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                            }
                        </Link>
                    })
                }
            </div>

            <style jsx>{`
        div{
            display: block;
        }
        box-sizing: border-box;
        font-family: tecnico;
        -webkit-tap-highlight-color: transparent;

        .appHeader{
            width: 99vw;
            height: 50px;
            background: #2F3D4C;
            color: white;
            
            font-size: 1.125rem;
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            z-index: 11;
        }

        .appHeader .appHeaderLeft {
            width: 6%;
            height: 100%;
        }

        .appHeader .appHeaderCenter {
            width: 88%;
            height: 100%;
            padding-top: 8px;
        }

        .appHeader .appHeaderCenter .headerImage {
            width: auto;
            height: 50%;
        }

        .appHeader .appHeaderRight {
            width: 6%;
            height: 100%;
            padding-right: 20px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }

        .secondaryheader {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 50px;
            width: 99vw;
            padding: none;
            z-index: 10;
        }

        
        
        .secondaryheader a{
            text-decoration: none;
        }

        .orders-option-selected {
            background: #F1F1F1;
            padding-top: 3px;
            border-bottom: 3px solid #2F3D4C;
            z-index: 1;
        }

        .orders-option {
            width: 25vw;
            height: 50px;
            background: #F1F1F1;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 1px 1px grey;
            z-index: 1;
        }

        .secondaryheader-option {
            width: 25vw;
            height: 50px;
            background: #F1F1F1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 1px 1px grey;
            z-index: 1;
        }

        .dropHeader-option{
            height: 50px;
            background: #F1F1F1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            // box-shadow: 0px 1px 1px grey;
        }

        .dropHeader-option-selected {
            background: #F1F1F1;
            padding-top: 3px;
            border-bottom: 3px solid #2F3D4C;
            z-index: 1;
        }

        .dropDown{
            position: relative;
        }

        .dropDownContent{
            display: block;
            position: absolute;
            margin-top: 78px;
            background-color: #F1F1F1;
            width: 100%;
            box-shadow: 0px 1px 1px grey;
            padding: 12px 16px;
            z-index: 1;
        }

        .sidebar-option-text{
            position: fixed;
        }

        .pageContainer {
            text-align: center;
          }
        `}
            </style>
        </div >
    </Fragment>
}