import React from "react";
import {
    AppBar, CssBaseline,
    Divider, Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {getI8n, LocalizationPartial} from "./std/localization";
import window from "./std/window";
import Link from "./Link";

import AboutIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 200;
export const navLocalized: LocalizationPartial = {
    "zh-CN": {
        "about": "关于",
        "home": "主页",
        "user": "用户",
        "statics": "统计"
    },
    "en-US": {
        "about": "About",
        "home": "Home",
        "user": "User",
        "statics": "Statics"
    }
}

export default function ContainerDrawer(props: { children: React.ReactElement }) {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const i8n = getI8n(navLocalized);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <Toolbar/>
            <Divider/>
            <List>
                {Object.entries(navigation).filter(([_, v]) => v.inDrawer).map(([name, entry]) => (
                    <ListItem key={name} disablePadding>
                        <ListItemButton component={Link} href={entry.path} onClick={handleDrawerToggle}>
                            <ListItemIcon>
                                {entry.icon}
                            </ListItemIcon>
                            <ListItemText primary={i8n[name]}/>
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
                    <Typography variant="h6" noWrap component="div">
                        OpenCraft
                    </Typography>
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
        icon: <HomeIcon />,
        inDrawer: true
    },
    "user": {
        path: "/user",
        icon: null,
        inDrawer: false
    },
    "statics": {
        path: "/stat",
        icon: <QueryStatsIcon />,
        inDrawer: true
    },
    "about": {
        path: "/about",
        icon: <AboutIcon />,
        inDrawer: true
    }
};
