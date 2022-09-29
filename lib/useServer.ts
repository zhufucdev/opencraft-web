import {useEffect, useState} from "react";
import {localApiFetch} from "./std/apiFetch";
import {Heartbeat} from "../pages/api/heartbeat";

export default function useServer(interval: number = 30000) {
    const [heartbeat, setHeartbeat] = useState({alive: true});
    const check = async () => {
        const res = await localApiFetch('heartbeat');
        const beat = await res.json() as Heartbeat;
        if (heartbeat.alive !== beat.alive)
            setHeartbeat(beat);
    };
    useEffect(() => {
        check();
        setInterval(check, interval);
    }, [interval]);
    return {heartbeat, check};
}