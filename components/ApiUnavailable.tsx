import UnavailableIcon from "@mui/icons-material/PortableWifiOff";
import Typography from "@mui/material/Typography";
import {getI18n, LocalizationPartial} from "../lib/std/localization";
import {Button} from "@mui/material";
import Link from "./Link";
import {navigation} from "./ContainerDrawer";

const apiLocalized: LocalizationPartial = {
    "zh-CN": {
        "title": "OpenCraft API不可达",
        "learn": "了解OpenCraft"
    },
    "en-US": {
        "title": "OpenCraft API Unavailable",
        "learn": "Learn About OpenCraft"
    }
}

export default function ApiUnavailable() {
    const i18n = getI18n(apiLocalized);
    return (
        <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: 20}}>
            <UnavailableIcon style={{fontSize: 120, color: "gray"}}/>
            <Typography variant="h5">{i18n["title"]}</Typography>
            <Button variant="text"
                    component={Link}
                    href={navigation["about"].path}>
                {i18n["learn"]}
            </Button>
        </div>
    )
}