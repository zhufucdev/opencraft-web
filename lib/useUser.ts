import useSWR from 'swr';
import {User} from "../pages/api/user";
import {useEffect} from "react";
import Router from "next/router";

export default function useUser(shouldRedirect: boolean = true) {
    const {data: user, mutate: mutateUser} = useSWR<User>('/api/user');

    useEffect(() => {
        if (!shouldRedirect || user && user.isLoggedIn) return;

        Router.push('/');
    }, [user]);

    return {user, mutateUser};
}