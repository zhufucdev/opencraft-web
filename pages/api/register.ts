import {NextApiRequest, NextApiResponse} from "next";
import {requireToken} from "../../lib/std/requireToken";
import {apiFetch} from "../../lib/std/apiFetch";
import {LoggedInUser} from "./user";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../lib/session";

interface RegisterResult {
    success: boolean,
    user?: LoggedInUser
}

async function registerRoute(req: NextApiRequest, res: NextApiResponse) {
    const {id, pwd, token: captchaToken} = req.body;
    const token = await requireToken(req);

    const apiRes = await apiFetch('register', {id, pwd, token, captchaToken});
    if (!apiRes.ok) {
        res.status(apiRes.status).send(apiRes.text());
        return;
    }
    const result = (await apiRes.json()) as RegisterResult;
    if (result.success) {
        const instance: LoggedInUser = {
            ...result.user!!,
            isLoggedIn: true
        }
        req.session.user = instance;
        await req.session.save();
        res.json(instance);
    } else {
        res.status(401).send("User duplicated.");
    }
}

export default withIronSessionApiRoute(registerRoute, sessionOptions);