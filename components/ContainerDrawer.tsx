import React, {useCallback, useEffect} from "react";
import {
    AppBar, Avatar, Button, CssBaseline,
    Divider, Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText, Popover,
    Toolbar, Tooltip
} from "@mui/material";
import Box from "@mui/material/Box";
import Link from "./Link";
import Typography from "@mui/material/Typography";
import {getI18n, LocalizationPartial} from "../lib/std/localization";
import window from "../lib/std/window";
import useUser from "../lib/useUser";
import {primaryColor} from "../lib/themeCreator";
import {LoggedInUser} from "../pages/api/user";

import AboutIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import {useRouter} from "next/router";
import {localApiFetch} from "../lib/std/apiFetch";

const drawerWidth = 200;
export const navLocalized: LocalizationPartial = {
    "zh-CN": {
        "about": "关于",
        "home": "主页",
        "user": "用户",
        "statics": "统计",
        "action-login": "登录",
        "action-logout": "登出",
        "action-settings": "设置"
    },
    "en-US": {
        "about": "About",
        "home": "Home",
        "user": "User",
        "statics": "Statics",
        "action-login": "Login",
        "action-logout": "Logout",
        "action-settings": "Settings"
    }
}

export default function ContainerDrawer(props: { children: React.ReactElement }) {
    const router = useRouter();
    const {user, mutateUser} = useUser(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorEle, setAnchorEle] = React.useState<HTMLElement | null>(null);

    const i18n = getI18n(navLocalized);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);

    };
    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEle(event.currentTarget);

    }

    const handleClose = () => setAnchorEle(null);

    const handleLogout = async () => {
        handleClose();
        await mutateUser(
            await (await localApiFetch('logout')).json()
        )
    }

    const drawer = (
        <div>
            <Toolbar/>
            <Divider/>
            <List>
                {Object.entries(navigation).filter(([_, v]) => v.inDrawer).map(([name, entry]) => (
                    <ListItem key={name} disablePadding>
                        <ListItemButton component={Link}
                                        href={entry.path}
                                        selected={entry.path === router.pathname}
                                        onClick={handleDrawerToggle}>
                            <ListItemIcon>
                                {entry.icon}
                            </ListItemIcon>
                            <ListItemText primary={i18n[name]}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );
    const container = window() !== undefined ? () => window()!!.document.body : undefined;

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                sx={{
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                    ml: {sm: `${drawerWidth}px`},
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
                        OpenCraft
                    </Typography>

                    <Tooltip title={i18n["user"]}>
                        {
                            user?.isLoggedIn === true
                                ? <IconButton
                                    sx={{width: 32, height: 32}}
                                    onClick={handleAvatarClick}>
                                    <Avatar
                                        src={(user as LoggedInUser).avatar}
                                        sx={{width: 32, height: 32, bgcolor: primaryColor}}>
                                        {(user as LoggedInUser).id.charAt(0).toUpperCase()}
                                    </Avatar>
                                </IconButton>
                                : <Button
                                    color="inherit"
                                    component={Link}
                                    href={navigation["home"].path}>
                                    {i18n["action-login"]}
                                </Button>
                        }
                    </Tooltip>

                    <Popover
                        open={anchorEle !== null}
                        anchorEl={anchorEle}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        sx={{
                            marginTop: 1
                        }}
                    >
                        {/* Popover menu for user related operations */}
                        <List disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleLogout}>
                                    <ListItemIcon>
                                        <LogoutIcon/>
                                    </ListItemIcon>
                                    <ListItemText>
                                        {i18n["action-logout"]}
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <SettingsIcon/>
                                    </ListItemIcon>
                                    <ListItemText>
                                        {i18n["action-settings"]}
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Popover>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                aria-label="main drawer"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
            >
                <Toolbar/>
                {props.children}
            </Box>
        </Box>
    );
}

interface NavigationEntry {
    path: string,
    icon: React.ReactElement | null,
    inDrawer: boolean
}

interface NavigationTable {
    [entryName: string]: NavigationEntry
}

export const navigation: NavigationTable = {
    "home": {
        path: "/",
        icon: <HomeIcon/>,
        inDrawer: true
    },
    "user": {
        path: "/user",
        icon: null,
        inDrawer: false
    },
    "statics": {
        path: "/stat",
        icon: <QueryStatsIcon/>,
        inDrawer: true
    },
    "about": {
        path: "/about",
        icon: <AboutIcon/>,
        inDrawer: true
    }
};
