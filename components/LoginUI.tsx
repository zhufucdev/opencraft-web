import {getI18n, LocalizationPartial} from "../lib/std/localization";
import {ChangeEvent, useState} from "react";
import Typography from "@mui/material/Typography";
import {
    Button,
    Card,
    CardActions,
    CardContent, Fade,
    FilledInput,
    FormControl, FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel, LinearProgress, Tooltip
} from "@mui/material";
import VisibilityOn from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "./Link";
import {navigation} from "./ContainerDrawer";
import ContinueIcon from "@mui/icons-material/ArrowForward";
import * as React from "react";
import useUser from "../lib/useUser";
import {localApiFetch} from "../lib/std/apiFetch";
import {LoggedInUser, User} from "../pages/api/user";
import {NextPage} from "next";
import Copyright from "./Copyright";
import Router from "next/router";
import Box from "@mui/material/Box";

const loginLocalized: LocalizationPartial = {
    "zh-CN": {
        "title": "登录OpenCraft账户",
        "title-username": "用户名",
        "title-password": "密码",
        "action-login": "登录",
        "action-register": "注册",
        "action-learn": "什么是OpenCraft？",
        "text-wrong-pwd": "密码不匹配",
        "text-user-not-found": "找不到该用户",
        "text-empty": "该项不能为空"
    },
    "en-US": {
        "title": "Login via OpenCraft Account",
        "title-username": "User ID",
        "title-password": "Password",
        "action-login": "Login",
        "action-register": "Register",
        "action-learn": "So what's OpenCraft?",
        "text-wrong-pwd": "Password mismatch",
        "text-user-not-found": "No such user",
        "text-empty": "This field mustn't be be empty"
    }
};

export default function LoginUI() {
    const i18n = getI18n(loginLocalized);
    const [showPwd, setShowPwd] = useState(false);
    const [form, setForm] = useState({id: '', pwd: ''});
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('idle');
    const [error, setError] = useState('idle');
    const {mutateUser} = useUser();

    function handleVisibilityClick() {
        setShowPwd(!showPwd);
    }

    async function handleSubmit() {
        if (!form.id || !form.pwd) return;

        setLoading(true);
        const res = await localApiFetch('login', {
            id: form.id, pwd: form.pwd
        });
        if (res.ok) {
            await mutateUser(await res.json());
        } else {
            switch (res.status) {
                case 401:
                    setError('mismatch');
                    setQuery('pwd');
                    break;
                case 404:
                    setError('notFound');
                    setQuery('user');
                    break;
            }
        }
        setLoading(false);
    }

    function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
        const id = event.target.value;
        setForm({...form, id});
        if (!id) {
            setError('empty');
            setQuery('user');
        } else {
            setError('idle');
            setQuery('idle');
        }
    }

    function handlePwdChange(event: ChangeEvent<HTMLInputElement>) {
        const pwd = event.target.value;
        setForm({...form, pwd});
        if (!pwd) {
            setError('empty');
            setQuery('pwd');
        } else {
            setError('idle');
            setQuery('idle');
        }
    }

    return (
        <>
            <Typography variant="h4" sx={{marginBottom: 3}}>
                {i18n["title"]}
            </Typography>
            <Card variant="outlined" sx={{marginBottom: 3}}>
                <Fade
                    in={loading}
                    style={{transitionDelay: loading ? '800ms' : '0'}}>
                    <LinearProgress variant="indeterminate"/>
                </Fade>

                <Box sx={{p: 2}}>
                    <CardContent>
                        <FormControl
                            fullWidth variant="filled"
                            sx={{marginBottom: 2}}
                            error={query === 'user'}
                        >
                            <InputLabel htmlFor="username-input">{i18n["title-username"]}</InputLabel>
                            <FilledInput id="username-input" value={form.id}
                                         onChange={handleNameChange}/>
                            <FormHelperText>
                                {
                                    query === "user"
                                        ? (error === "notFound"
                                                ? i18n["text-user-not-found"]
                                                : i18n["text-empty"]
                                        )
                                        : ""
                                }
                            </FormHelperText>
                        </FormControl>
                        <FormControl fullWidth variant="filled">
                            <InputLabel htmlFor="pwd-input">{i18n["title-password"]}</InputLabel>
                            <FilledInput
                                id="pwd-input"
                                type={showPwd ? 'text' : 'password'}
                                value={form.pwd}
                                error={query === 'pwd'}
                                onChange={handlePwdChange}
                                onKeyDown={(ev) => {
                                    if (ev.key == 'Enter') handleSubmit()
                                }}
                                endAdornment={
                                    <InputAdornment
                                        position="end"
                                        aria-label="toggle password visibility">
                                        <IconButton
                                            onClick={handleVisibilityClick}
                                            edge="end">
                                            {showPwd ? <VisibilityOn/> : <VisibilityOff/>}
                                        </IconButton>
                                    </InputAdornment>
                                }/>
                            <FormHelperText>
                                {
                                    query === "pwd"
                                        ? (error === "mismatch"
                                            ? i18n["text-wrong-pwd"]
                                            : i18n["text-empty"])
                                        : ""
                                }
                            </FormHelperText>
                        </FormControl>
                    </CardContent>
                    <CardActions>
                        <Button disabled={loading}>{i18n["action-register"]}</Button>
                        <Button component={Link} href={navigation["about"].path}>{i18n["action-learn"]}</Button>
                        <div style={{marginLeft: "auto"}}>
                            <Tooltip title={i18n["action-login"]}>
                                <IconButton disabled={loading} onClick={handleSubmit}>
                                    <ContinueIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </CardActions>
                </Box>
            </Card>
        </>
    );
}
