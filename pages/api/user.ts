import {NextApiRequest, NextApiResponse} from "next";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../lib/session";
import {requireToken} from "../../lib/std/requireToken";

export interface User {
    isLoggedIn: boolean,
}

export interface LoggedInUser extends User {
    id: string,
    uuid: string,
}

async function userRouter(req: NextApiRequest, res: NextApiResponse<User>) {
    await requireToken(req);
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        req.session.user = {
            isLoggedIn: false,
        };
        await req.session.save();
        res.json(req.session.user);
    }
}

export default withIronSessionApiRoute(userRouter, sessionOptions);