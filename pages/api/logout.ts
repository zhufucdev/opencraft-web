import {NextApiRequest, NextApiResponse} from "next";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../lib/session";
import {apiFetch} from "../../lib/std/apiFetch";

interface LogoutResult {
    success: boolean
}

async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    if (!req.session.token) {
        res.status(403).send("No token acquired.");
        return
    }

    const result = await apiFetch('logout', {token: req.session.token.token});
    if (result.ok) {
        const newStatus = {
            isLoggedIn: false
        };
        req.session.user = newStatus;
        await req.session.save();
        const logoutResult = (await result.json()) as LogoutResult;
        if (logoutResult.success) {
            res.json(newStatus);
        } else {
            res.status(201).json(newStatus);
        }
    } else {
        res.status(result.status).send(await result.text());
    }
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);