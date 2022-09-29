import type {IronSessionOptions} from 'iron-session'
import type {User} from '../pages/api/user';
import {Token} from "./std/requireToken";

export const sessionOptions: IronSessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'oc-web',
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}

declare module 'iron-session' {
    interface IronSessionData {
        user: User,
        token: Token
    }
}