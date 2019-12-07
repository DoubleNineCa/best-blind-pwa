import React from 'react';
import Link from 'next/link';

export const Layout: React.FunctionComponent = ({ children }) => {
    return <div className="pageContainer">
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
            <Link href='/'>
                <a className="orders-option orders-option-selected">
                    <div className="sidebar-option-text">Dashboard</div>
                </a>
            </Link>
            <Link href='/'>
                <a className="secondaryheader-option">
                    <div className="sidebar-option-text">Orders</div>
                </a>
            </Link>
            <Link href='/'>
                <a className="secondaryheader-option">
                    <div className="sidebar-option-text">Customer</div>
                </a>
            </Link>
            <Link href='/'>
                <a className="secondaryheader-option">
                    <div className="sidebar-option-text">Outsource</div>
                </a>
            </Link>
            <Link href='/'>
                <a className="secondaryheader-option">
                    <div className="sidebar-option-text">Updates</div>
                </a>
            </Link>
        </div>

        {children}
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
            padding-top: 0px;
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
}