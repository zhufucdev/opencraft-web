import {defaultLocale, getI18n, LocalizationPartial} from "../lib/std/localization";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {
    Alert,
    Button,
    Card,
    CardActions,
    CardContent, Collapse, Fade,
    FilledInput,
    FormControl, FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel, LinearProgress, Paper, Snackbar, Tooltip
} from "@mui/material";
import VisibilityOn from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "./Link";
import {navigation} from "./ContainerDrawer";
import ContinueIcon from "@mui/icons-material/ArrowForward";
import * as React from "react";
import useUser from "../lib/useUser";
import {localApiFetch} from "../lib/std/apiFetch";
import {useRouter} from "next/router";
import Box from "@mui/material/Box";
import {GoogleReCaptcha, GoogleReCaptchaProvider, useGoogleReCaptcha} from "react-google-recaptcha-v3";

const loginLocalized: LocalizationPartial = {
    "zh-CN": {
        "title": "登录OpenCraft账户",
        "title-username": "用户名",
        "title-password": "密码",
        "title-repeat-pwd": "重复密码",
        "action-login": "登录",
        "action-register": "注册",
        "action-learn": "什么是OpenCraft？",
        "action-captcha": "进行人机验证",
        "text-pwd-mismatch": "密码不匹配",
        "text-user-not-found": "找不到该用户",
        "text-user-invalid": "用户名不合规",
        "text-empty": "该项不能为空",
        "text-captcha-unsolved": "验证码未解决",
        "text-halt": "验证服务器不可用",
        "text-duplicated": "该用户已存在"
    },
    "en-US": {
        "title": "Login via OpenCraft Account",
        "title-username": "User ID",
        "title-password": "Password",
        "title-repeat-pwd": "Repeat Password",
        "action-login": "Login",
        "action-register": "Register",
        "action-learn": "So what's OpenCraft?",
        "action-captcha": "Solve Captcha",
        "text-pwd-mismatch": "Password mismatch",
        "text-user-not-found": "No such user",
        "text-user-invalid": "Invalid username",
        "text-empty": "This field mustn't be be empty",
        "text-captcha-unsolved": "Captcha was unsolved",
        "text-halt": "Captcha service unavailable",
        "text-duplicated": "User already exists"
    }
};

function forReCAPTCHA(code?: string) {
    code = code ?? defaultLocale;
    switch (code) {
        case "en-US":
            return "en";
        default:
            return code;
    }
}

export default function LoginUI(props: {reCaptchaKey: string}) {
    const {locale} = useRouter();
    const i18n = getI18n(loginLocalized);
    const [showPwd, setShowPwd] = useState(false);
    const [form, setForm] = useState({id: '', pwd: '', repeat: ''});
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('idle');
    const [error, setError] = useState('idle');
    const [registering, setRegistering] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string>();
    const {mutateUser} = useUser();

    function handleVisibilityClick() {
        setShowPwd(!showPwd);
    }

    const usernameVerify = /[a-zA-Z0-9_]{3,15}/;
    async function handleSubmit() {
        if (!form.id
            || !form.id.match(usernameVerify)
            || !form.pwd
            || (registering && !form.repeat || form.repeat !== form.pwd)) {
            return;
        }

        setLoading(true);

        if (registering) {
            const res = await localApiFetch('register', {
                id: form.id, pwd: form.pwd, token: captchaToken
            });
            if (res.ok) {
                await mutateUser(await res.json());
            } else {
                switch (res.status) {
                    case 401:
                        setError('duplicated');
                        setQuery('user');
                        break;
                    case 403:
                        setError('unsolved');
                        setQuery('internal');
                        break;
                    case 500:
                        setError('halt');
                        setQuery('internal');
                        break;
                }
            }
        } else {
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
        }
        setLoading(false);
    }

    function idleQuery() {
        setError('idle');
        setQuery('idle');
    }

    function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
        const id = event.target.value;
        setForm({...form, id});
        if (!id) {
            setError('empty');
            setQuery('user');
        } else {
            idleQuery();
        }
    }

    function handlePwdChange(event: ChangeEvent<HTMLInputElement>) {
        const pwd = event.target.value;
        setForm({...form, pwd});
        if (!pwd) {
            setError('empty');
            setQuery('pwd');
        } else if (form.repeat !== pwd) {
            setError('mismatch')
            setQuery('repwd');
        } else {
            idleQuery();
        }
    }

    function handleRepwdChange(event: ChangeEvent<HTMLInputElement>) {
        const repeat = event.target.value;
        setForm({...form, repeat});
        if (!repeat) {
            setError('empty');
            setQuery('repwd');
        } else if (repeat !== form.pwd) {
            setError('mismatch')
            setQuery('repwd');
        } else {
            idleQuery();
        }
    }

    function handleRegisterClick() {
        setRegistering(!registering);
    }

    function handleSnackbarClose() {
        setQuery('idle');
    }

    function handleCaptchaVerification(token: string) {
        setCaptchaToken(token);
    }

    const usernameField =
        <FormControl
            fullWidth variant="filled"
            sx={{marginBottom: 2}}
            error={query === 'user'}>
            <InputLabel htmlFor="username-input">{i18n["title-username"]}</InputLabel>
            <FilledInput id="username-input" value={form.id}
                         onChange={handleNameChange}/>
            <FormHelperText>
                {
                    query === "user"
                        ? i18n[(error === "notFound"
                                ? "text-user-not-found"
                                : (error === "invalid"
                                    ? "text-user-invalid"
                                    : (error === "duplicated"
                                        ? "text-duplicated"
                                        : "text-empty"))
                        )]
                        : ""
                }
            </FormHelperText>
        </FormControl>;
    const passwordField =
        <FormControl fullWidth variant="filled">
            <InputLabel htmlFor="pwd-input">{i18n["title-password"]}</InputLabel>
            <FilledInput
                id="pwd-input"
                type={showPwd ? 'text' : 'password'}
                value={form.pwd}
                error={query === 'pwd'}
                onChange={handlePwdChange}
                onKeyDown={(ev) => {
                    if (ev.key == 'Enter' && !registering) handleSubmit()
                }}
                endAdornment={
                    <Fade in={!registering}>
                        <InputAdornment
                            position="end"
                            aria-label="toggle password visibility">
                            <IconButton
                                onClick={handleVisibilityClick}
                                edge="end">
                                {showPwd ? <VisibilityOn/> : <VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>
                    </Fade>
                }/>
            <FormHelperText>
                {
                    query === "pwd"
                        ? (error === "mismatch"
                            ? i18n["text-pwd-mismatch"]
                            : i18n["text-empty"])
                        : ""
                }
            </FormHelperText>
        </FormControl>;
    const passwordRepeatField =
        <FormControl
            variant="filled"
            error={query === 'repwd'}
            fullWidth
            sx={{marginTop: 2}}>
            <InputLabel htmlFor="repwd-input">{i18n["title-repeat-pwd"]}</InputLabel>
            <FilledInput
                id="repwd-input"
                value={form.repeat}
                error={query === 'repwd'}
                onChange={handleRepwdChange}
                type="password"
                onKeyDown={(ev) => {
                    if (ev.key === 'Enter' && registering)
                        handleSubmit()
                }}/>
            <FormHelperText>
                {
                    query === "repwd"
                        ? (error === "mismatch"
                            ? i18n["text-pwd-mismatch"]
                            : i18n["text-empty"])
                        : ""
                }
            </FormHelperText>
        </FormControl>;
    const primaryBtn =
        <div style={{marginLeft: "auto"}}>
            <Tooltip
                title={i18n[`action-${registering ? "register" : "login"}`]}>
                <IconButton
                    disabled={loading || (registering && !captchaToken)}
                    onClick={handleSubmit}>
                    <ContinueIcon/>
                </IconButton>
            </Tooltip>
        </div>;
    const secondaryBtn =
        <Button disabled={loading} onClick={handleRegisterClick}>
            {i18n[`action-${registering ? "login" : "register"}`]}
        </Button>;
    const learnMoreBtn =
        <Button component={Link} href={navigation["about"].path}>
            {i18n["action-learn"]}
        </Button>;
    const snackbar =
        <Snackbar open={query === 'internal'} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert severity="error" onClose={handleSnackbarClose} sx={{width: '100%'}}>
                {
                    error === "halt" ? i18n["text-halt"] : i18n["text-captcha-unsolved"]
                }
            </Alert>
        </Snackbar>

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={props.reCaptchaKey}
            language={forReCAPTCHA(locale)}
            useRecaptchaNet={true}>
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
                        {usernameField}
                        {passwordField}
                        <Collapse in={registering} unmountOnExit timeout="auto">
                            {passwordRepeatField}
                            <GoogleReCaptcha onVerify={handleCaptchaVerification}/>
                        </Collapse>
                    </CardContent>
                    <CardActions>
                        {secondaryBtn}
                        {learnMoreBtn}
                        {primaryBtn}
                    </CardActions>
                </Box>
            </Card>
            {snackbar}
        </GoogleReCaptchaProvider>
    );
}
