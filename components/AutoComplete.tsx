import React, { Fragment, useState, Component, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { Part } from '../generated/graphql';

interface Props {
    options: Part[],
    blindId: string,
    blindHandle: (blinds: string) => void;

}

interface activeOptionState {
    activeOption: number;
}

const defaultActiveOptionState: activeOptionState = {
    activeOption: 0
}

interface filteredOptionState {
    filteredOption: any[];
}

const defaultFilteredOptionState: filteredOptionState = {
    filteredOption: []
}

interface showOptionsState {
    showOptions: boolean;
}

const defaultShowOptionsState: showOptionsState = {
    showOptions: false
}

interface userInputState {
    userInput: string;
}

const defaultUserInputState: userInputState = {
    userInput: ''
}

export const AutoComplete: React.FC<Props> = ({ options, blindId, blindHandle }) => {
    const [activeOptionState, setActiveOptionState] = useState<activeOptionState>(defaultActiveOptionState);
    const [filteredOptionState, setFilteredOptionState] = useState<filteredOptionState>(defaultFilteredOptionState);
    const [showOptionsState, setShowOptionsState] = useState<showOptionsState>(defaultShowOptionsState);
    const [userInputState, setUserInputState] = useState<userInputState>(defaultUserInputState);
    const selectedPart = options.filter(part => part.id === blindId)[0];

    const initiate = () => {
        if (selectedPart) {
            setUserInputState({
                userInput: `[${selectedPart.id}] ${selectedPart.name} ${selectedPart.color !== "0" && selectedPart.color !== "NONE" ? "(" + selectedPart.color + ")" : ""}`
            })

        }
    }

    useEffect(initiate, [blindId]);

    const _onClick = (e: React.MouseEvent) => {
        setActiveOptionState({
            activeOption: 0
        });

        setFilteredOptionState({
            filteredOption: []
        });

        setShowOptionsState({
            showOptions: false
        });

        setUserInputState({
            userInput: e.currentTarget.innerHTML
        })

        blindHandle(e.currentTarget.innerHTML);
    }

    const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filtered = options.filter(part => part.name.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) > -1);

        setActiveOptionState({
            activeOption: 0
        })

        setFilteredOptionState({
            filteredOption: filtered
        })

        setShowOptionsState({
            showOptions: true
        })

        setUserInputState({
            userInput: e.currentTarget.value
        })

    }

    const _onKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === 13) {   // enter
            setActiveOptionState({
                activeOption: 0
            })

            setShowOptionsState({
                showOptions: false
            })

            setUserInputState({
                userInput:
                    "[" + filteredOptionState.filteredOption[activeOptionState.activeOption].id + "] " +
                    filteredOptionState.filteredOption[activeOptionState.activeOption].name + " (" +
                    filteredOptionState.filteredOption[activeOptionState.activeOption].color + ")"
            })

            e.preventDefault();

            blindHandle("[" + filteredOptionState.filteredOption[activeOptionState.activeOption].id + "] " +
                filteredOptionState.filteredOption[activeOptionState.activeOption].name + " (" +
                filteredOptionState.filteredOption[activeOptionState.activeOption].color + ")");
        } else if (e.keyCode === 38) { // up
            if (activeOptionState.activeOption === 0) {
                return;
            }
            setActiveOptionState({
                activeOption: activeOptionState.activeOption - 1
            })
        } else if (e.keyCode === 40) { // down
            if (activeOptionState.activeOption === filteredOptionState.filteredOption.length - 1) {
                return;
            }
            setActiveOptionState({
                activeOption: activeOptionState.activeOption + 1
            })
        } else if (e.keyCode === 27) {  // esc
            setActiveOptionState({
                activeOption: 0
            })

            setShowOptionsState({
                showOptions: false
            })
            setUserInputState({
                userInput: ""
            })
        }
    }

    return <Fragment>
        <div className="search">
            <input
                type="text"
                className="search-box"
                onChange={_onChange}
                onKeyDown={_onKeyDown}
                onClick={_onClick}
                value={userInputState.userInput}
                placeholder="Input part name here"
            />
        </div>
        {
            showOptionsState.showOptions && userInputState.userInput ?
                filteredOptionState.filteredOption.length ?
                    <ul className="options">
                        {
                            filteredOptionState.filteredOption.map((part, index) => {
                                let className;
                                if (index === activeOptionState.activeOption) {
                                    className = "option-active";
                                }
                                return (<li className={className} key={part.id} onClick={_onClick}>
                                    [{part.id}] {part.name} {part.color !== "0" && part.color !== "NONE" ? "(" + part.color + ")" : ""}
                                </li>);
                            })
                        }
                    </ul>
                    :
                    <ul className="no-options">
                        <li>No Option!</li>
                    </ul>

                : <Fragment></Fragment>
        }

        <style jsx>{`
        .search {
            border: 1px solid #dde5ff;
            border-radius: 4px;
            color: #5d647b;
            outline: 0;
            padding: 14px;
            width: 60%;
            position: relative;
          }
          .search-box {
            border: 4px solid transparent;
            border-radius: 2px;
            // font-size: 2rem;
            width: 100%;
            // padding: 1rem;
            transition: width 0.3s;
          }
          .search-box:focus {
            width: 100%;
            outline: none;
            border: 4px solid #08a1b6;
          }
          
          .options {
            display: block;
            list-style: none;
            transition: width 0.3s;
            margin-top: 5vw;
            margin-left: 3vw;
            position: absolute;
            overflow:scroll;
          }
          
          .options li {
            display: block;
            background: white;
          }
          ul.options li:hover {
            font-weight: bold;
            color: #00b4cc;
            cursor: pointer;
            transition: 0.3s all;
          }
          
          ul.options li.option-active {
            background: whitesmoke;
            font-size: 1.5rem;
            color: #00b4cc;
          }
          .no-options {
            display: block;
            list-style: none;
            margin-top: 3vw;
            margin-left: 3vw;
            position: absolute;
          }
          .no-options li{
            background: whitesmoke;
            font-size: 1.5rem;
            color: #00b4cc;
          }
        `}</style>
    </Fragment>
}