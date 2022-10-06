import {apiFetch} from "./apiFetch";
import {NextApiRequest} from "next";

export interface Token {
    token: string,
    spoil: number
}

export async function requireToken(req: NextApiRequest): Promise<string> {
    if (req.session.token && new Date().getUTCDate() < req.session.token.spoil) {
        return req.session.token.token;
    }
    const res = await apiFetch('token_acquire', {remote: req.socket.remoteAddress});
    const result = await res.json() as any;
    const newToken = {
        token: result.token,
        spoil: result.spoil
    };
    req.session.token = newToken;
    await req.session.save();
    return newToken.token;
}