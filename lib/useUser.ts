import useSWR from 'swr';
import {User} from "../pages/api/user";
import {useEffect} from "react";
import Router from "next/router";
import {localApiFetch} from "./std/apiFetch";

async function userFetcher(): Promise<User> {
    return (await localApiFetch('user')).json()
}

export default function useUser(shouldRedirect: boolean = true) {
    const {data: user, mutate: mutateUser} = useSWR<User>('/api/user', userFetcher);
    useEffect(() => {
        if (!shouldRedirect || user && user.isLoggedIn) return;

        Router.push('/login');
    }, [user, shouldRedirect]);

    return {user, mutateUser};
}