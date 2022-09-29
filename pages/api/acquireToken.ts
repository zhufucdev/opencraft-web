import {NextApiRequest, NextApiResponse} from "next";
import {apiFetch} from "../../lib/std/apiFetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const text = await (await apiFetch('token_acquire')).text();
    res.send(text);
}