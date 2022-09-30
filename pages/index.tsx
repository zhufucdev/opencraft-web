import * as React from 'react';
import type {NextPage} from 'next';
import Copyright from "../components/Copyright";
import useUser from "../lib/useUser";
import Typography from "@mui/material/Typography";
import useServer from "../lib/useServer";
import ApiUnavailable from "../components/ApiUnavailable";
import {LoggedInUser} from "./api/user";

function HomeContent() {
    const {user} = useUser();
    return (
        <>
            <Typography variant="h1">{"Logged in as" + (user as LoggedInUser).id}</Typography>
        </>
    )
}

const Home: NextPage = () => {
    const {heartbeat} = useServer();
    return (
        <>
            {heartbeat?.alive ? <HomeContent/> : <ApiUnavailable/>}
            <Copyright/>
        </>
    )
};

export default Home;
