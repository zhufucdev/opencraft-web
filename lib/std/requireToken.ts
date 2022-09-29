import {apiFetch} from "./apiFetch";
import {NextApiRequest} from "next";

export interface Token {
    token: string,
    spoil: Date
}

export async function requireToken(req: NextApiRequest) {
    if (req.session.token && new Date() < req.session.token.spoil) {
        return
    }
    const res = await apiFetch('token_acquire');
    const result = await res.json() as any;
    req.session.token = {
        token: result.token,
        spoil: new Date(result.spoil)
    };
    await req.session.save();
}