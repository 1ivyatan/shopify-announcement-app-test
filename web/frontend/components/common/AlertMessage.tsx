import { Banner, BannerTone } from "@shopify/polaris";
import { Dispatch, SetStateAction, useState } from "react";

export type AlertMessageData = {text: String, setActive: Dispatch<SetStateAction<boolean>>, tone: BannerTone};

export const AlertMessage = (props: { data: AlertMessageData }) :React.ReactElement | null  => {
    const [ active, setActive ] = useState<boolean>(true);
    return (active ? <Banner tone={props.data.tone} onDismiss={() => { props.data.setActive(false); setActive(false) }}>{props.data.text}</Banner> : null);
}
