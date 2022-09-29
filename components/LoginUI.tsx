import {getI8n, LocalizationPartial} from "../lib/std/localization";
import {useState} from "react";
import Typography from "@mui/material/Typography";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    FilledInput,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel, Tooltip
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

const loginLocalized: LocalizationPartial = {
    "zh-CN": {
        "title": "登录OpenCraft账户",
        "title-username": "用户名",
        "title-password": "密码",
        "action-login": "登录",
        "action-register": "注册",
        "action-learn": "什么是OpenCraft？"
    },
    "en-US": {
        "title": "Login via OpenCraft Account",
        "title-username": "User ID",
        "title-password": "Password",
        "action-login": "Login",
        "action-register": "Register",
        "action-learn": "So what's OpenCraft?"
    }
};

export default function LoginUI() {
    const i18n = getI8n(loginLocalized);
    const [showPwd, setShowPwd] = useState(false);
    const [form] = useState({id: '', pwd: ''});
    const {mutateUser} = useUser();

    function handleVisibilityClick() {
        setShowPwd(!showPwd);
    }

    async function handleSubmit() {
        mutateUser(
            await (await localApiFetch('login', {
                id: form.id, pwd: form.pwd
            })).json() as User
        );
    }

    return (
        <>
            <Typography variant="h4" sx={{marginBottom: 3}}>
                {i18n["title"]}
            </Typography>
            <Card variant="outlined" sx={{p: 2, marginBottom: 3}}>
                <CardContent>
                    <FormControl fullWidth variant="filled"
                                 sx={{marginBottom: 2}}>
                        <InputLabel htmlFor="username-input">{i18n["title-username"]}</InputLabel>
                        <FilledInput id="username-input" value={form.id}/>
                    </FormControl>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="pwd-input">{i18n["title-password"]}</InputLabel>
                        <FilledInput
                            id="pwd-input"
                            type={showPwd ? 'text' : 'password'}
                            value={form.pwd}
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
                    </FormControl>
                </CardContent>

                <CardActions>
                    <Button>{i18n["action-register"]}</Button>
                    <Button component={Link} href={navigation["about"].path}>{i18n["action-learn"]}</Button>
                    <div style={{marginLeft: "auto"}}>
                        <Tooltip title={i18n["action-login"]}>
                            <IconButton onClick={handleSubmit}>
                                <ContinueIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </CardActions>
            </Card>
        </>
    );
}