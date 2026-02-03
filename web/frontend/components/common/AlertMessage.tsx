import { Banner, BannerTone } from "@shopify/polaris";
import { Dispatch, SetStateAction, useState } from "react";

export const AlertMessage = (props: {text: String, setActive: Dispatch<SetStateAction<boolean>>, tone: BannerTone}) :React.ReactElement | null  => {
    const [ active, setActive ] = useState<boolean>(true);
    return (active ? <Banner tone={props.tone} onDismiss={() => { props.setActive(false); setActive(false) }}>{props.text}</Banner> : null);
}
