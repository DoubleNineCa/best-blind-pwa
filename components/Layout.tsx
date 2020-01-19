import React, { useState, Fragment } from 'react';
import Link from 'next/link';

// interface SubHeaderState {
//     currentLocation: number;
// }

// const defaultState: SubHeaderState = {
//     currentLocation: 0
// };

interface Props {
    onTaskCreated: string[];
    currentLocation: number;
}

export const Layout: React.FunctionComponent<Props> = ({ onTaskCreated, currentLocation }) => {
    // const [subHeaderState, setSubHeaderState] = useState<SubHeaderState>(defaultState);
    // const menuClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    //     const { id } = event.currentTarget;
    //     setSubHeaderState({
    //         currentLocation: Number(id)
    //     })
    // }

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
                            <a id={'' + i} className={i === currentLocation ? 'orders-option orders-option-selected' : 'secondaryheader-option'}>
                                <div className="sidebar-option-text">{menu}</div>
                            </a>
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
            align-items: center;
            justify-content: center;
            box-shadow: 0px 1px 1px grey;
            z-index: 1;
        }

        .pageContainer {
            text-align: center;
          }
        `}
            </style>
        </div >
    </Fragment>
}