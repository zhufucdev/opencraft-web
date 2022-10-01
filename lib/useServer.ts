import {Heartbeat} from "../pages/api/heartbeat";
import useSWR from "swr";
import {localApiFetch} from "./std/apiFetch";

async function heartbeatFetcher(): Promise<Heartbeat> {
    return (await localApiFetch('heartbeat')).json()
}

export default function useServer() {
    const {data: heartbeat} = useSWR<Heartbeat>('/api/heartbeat', heartbeatFetcher);
    return {heartbeat};
}