import {NextApiRequest, NextApiResponse} from "next";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../lib/session";
import {LoggedInUser} from "./user";
import {apiFetch} from "../../lib/std/apiFetch";
import {requireToken} from "../../lib/std/requireToken";

interface LoginResult {
    success: boolean,
    user?: LoggedInUser
}

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const {id, pwd} = req.body;
    await requireToken(req);
    const apiRes = await apiFetch('login', {id, pwd, token: req.session.token.token});
    if (!apiRes.ok) {
        res.status(apiRes.status).send(apiRes.text());
        return;
    }
    const result = (await apiRes.json()) as LoginResult;
    if (result.success) {
        const instance: LoggedInUser = {
            ...result.user!!,
            isLoggedIn: true
        }
        req.session.user = instance;
        await req.session.save();
        res.json(instance);
    } else {
        res.status(401).send("Login failed")
    }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);