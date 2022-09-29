import * as React from 'react';
import type {NextPage} from 'next';
import LoginUI from "../components/LoginUI";
import Copyright from "../components/Copyright";
import useUser from "../lib/useUser";
import Typography from "@mui/material/Typography";
import useServer from "../lib/useServer";
import ApiUnavailable from "../components/ApiUnavailable";

function HomeContent() {
    const {user} = useUser(false)
    return (
        <>
            <Typography variant="h1">{"Logged in as" + user}</Typography>
        </>
    )
}

const Home: NextPage = () => {
    const {user} = useUser(false);
    const {heartbeat} = useServer();
    return (
        <>
            {heartbeat?.alive ? (user?.isLoggedIn === true ? <HomeContent/> : <LoginUI/>) : <ApiUnavailable/>}
            <Copyright/>
        </>
    )
};

export default Home;
