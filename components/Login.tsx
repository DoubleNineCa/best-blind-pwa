import React, { Fragment, useState } from 'react';
import gql from 'graphql-tag';

import { useRouter } from 'next/router';
import { useMutation } from 'react-apollo';

interface idInput {
    id: string
}

const defaultidInputState: idInput = {
    id: ""
}

interface pwInput {
    pw: string
}

const defaultpwInputState: pwInput = {
    pw: ""
}

const LOGIN = gql(`
mutation Login($id: String!, $password: String!){
    login(staffId: $id, password: $password){
      id
      staffId
    }
  }
`);

export const LoginView: React.FC = () => {
    const router = useRouter();
    const [idInput, setIdInput] = useState<idInput>(defaultidInputState);
    const [pwInput, setPwInput] = useState<pwInput>(defaultpwInputState);
    const [login] = useMutation(LOGIN);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await login({
            variables: {
                id: idInput.id,
                password: pwInput.pw
            }
        });

        return router.push("/");
    }

    const idHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIdInput({
            id: e.currentTarget.value
        })
    }

    const pwHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPwInput({
            pw: e.currentTarget.value
        })
    }

    return <Fragment>
        <div className="loginContainer">
            <form
                className="loginForm"
                onSubmit={handleSubmit}
            >
                <div className="loginTitleSection">LOGIN</div>
                <div className="inputRow">
                    <div className="rowTitle">ID</div>
                    <input type="text" className="loginInput" value={idInput.id} onChange={idHandle} />
                </div>
                <div className="inputRow">
                    <div className="rowTitle">PASSWORD</div>
                    <input type="password" className="loginInput" value={pwInput.pw} onChange={pwHandle} />
                </div>

                <div className="inputRow">
                    <button className="customerSubmit" >Register</button>
                </div>
            </form>
        </div>

        <style jsx>{`
        .loginContainer{
            width:99vw;
            height:45vw;
            border-radius: 10pt;
        }

        .loginForm{
            margin-left: auto;
            margin-right: auto;
            width: 80%;
            height: 60%;
            justify-content: center;
            align-items: center;
            display: flex;
            flex-direction:column;
            font-family: tecnico;
        }

        .loginTitleSection{
            min-height: 70px;
            font-size: 2rem;
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

        .loginInput{
            width: 70%;
            margin-top: 0;
        }
        `}</style>
    </Fragment>
}