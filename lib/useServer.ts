import {Heartbeat} from "../pages/api/heartbeat";
import useSWR from "swr";

async function heartbeatFetcher(): Promise<Heartbeat> {
    return (await fetch('/api/heartbeat')).json()
}

export default function useServer() {
    const {data: heartbeat} = useSWR<Heartbeat>('/api/heartbeat', heartbeatFetcher);
    return {heartbeat};
}