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
    nickname?: string,
    avatar?: string
}

async function userRouter(req: NextApiRequest, res: NextApiResponse<User>) {
    async function noUser() {
        req.session.user = {
            isLoggedIn: false,
        };
        await req.session.save();
        res.json(req.session.user);
    }
    try {
        await requireToken(req);
    } catch (e) {
        await noUser();
        return;
    }
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        await noUser();
    }
}

export default withIronSessionApiRoute(userRouter, sessionOptions);