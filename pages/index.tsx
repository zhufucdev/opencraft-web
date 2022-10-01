import * as React from 'react';
import type {NextPage} from 'next';
import Copyright from "../components/Copyright";
import useUser from "../lib/useUser";
import Typography from "@mui/material/Typography";
import useServer from "../lib/useServer";
import ApiUnavailable from "../components/ApiUnavailable";
import {LoggedInUser} from "./api/user";
import LoginUI from "../components/LoginUI";

function HomeContent(props: { user: LoggedInUser }) {
    const {user} = props;
    return (
        <>
            <Typography variant="h1">{"Logged in as " + user.id}</Typography>
        </>
    );
}

const Home: NextPage = () => {
    const {heartbeat} = useServer();
    const {user} = useUser();
    return (
        <>
            {
                heartbeat?.alive === false ?
                    <ApiUnavailable/>
                    : (user?.isLoggedIn === true ? <HomeContent user={user as LoggedInUser}/> : <LoginUI/>)
            }
            <Copyright/>
        </>
    )
};

export default Home;
