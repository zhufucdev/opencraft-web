import {NextApiRequest, NextApiResponse} from "next";
import fetch from "node-fetch";
import {apiUrl} from "../../lib/std/apiFetch";

export interface Heartbeat {
    alive: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Heartbeat>) {
    let alive;
    try {
        const f = await fetch(apiUrl + '/heartbeat');
        alive = f.ok;
    } catch (e) {
        alive = false;
    }
    res.json({alive});
}