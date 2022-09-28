import * as React from 'react';
import type {NextPage} from 'next';
import LoginUI from "../components/LoginUI";
import Copyright from "../components/Copyright";


const Home: NextPage = () => {
    return (
        <>
            <LoginUI/>
            <Copyright/>
        </>
    )
};

export default Home;
