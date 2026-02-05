import { Button, Checkbox, ColorPicker, FormLayout, hexToRgb, hsbToHex, InlineGrid, rgbToHsb, Text, TextField } from "@shopify/polaris";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Form } from "react-router-dom";
import useAnnouncementsStore, { Announcement } from "../../stores/useAnnouncementsStore";
import { Loader } from "lucide-react";

export const AnnouncementEditor = (props: { setValid: any, data: Announcement, setData: any}): React.ReactElement => {
    const [ enabledSubmit, setEnabledSubmit ] = useState<boolean>(false);
    const { putAnnouncement, postAnnouncement } = useAnnouncementsStore();
    const [ fgColor, setFgColor ] = useState({hue: 0,brightness: 0,saturation: 0,});
    const [ bgColor, setBgColor ] = useState({hue: 0,brightness: 100,saturation: 0,});

    useEffect(() => {
        if (props.data == null) return;

        if (
            props.data.label.trim().length == 0 ||
            props.data.text.trim().length == 0
        ) {
            props.setValid(false);
        } else {
            props.setValid(true);
        }

        setFgColor(rgbToHsb(hexToRgb(props.data.fgColor)));
        setBgColor(rgbToHsb(hexToRgb(props.data.bgColor)));

    }, [props.data]);

    /*
    const onSubmit = useCallback(async () => {
        let response: Response | undefined = undefined;
        if (!enabledSubmit) {
            props.afterSubmission(false);
        }

        setEnabledSubmit(false);

        switch (props.method) {
            case "PUT":
                response = await putAnnouncement(props.data);
                props.afterSubmission(response);
                break;
            case "POST":
                response = await postAnnouncement(props.data);
                props.afterSubmission(response);
                break;
        }

        setEnabledSubmit(true);
    }, [props.data]);*/

    return (
        props.data ?
        <Form>
            <FormLayout>
                <FormLayout.Group>
                    <Checkbox
                        label="Enabled"
                        checked={ props.data.enabled }
                        onChange={ (newValue) => { props.setData({...props.data, enabled: newValue}) }}
                        helpText={
                            <span>Show or hide the announcement bar to visitors</span>
                        }
                    />
                </FormLayout.Group>

                <FormLayout.Group>
                    <TextField
                        value={props.data.label}
                        onChange={ (newValue) => { props.setData({...props.data, label: newValue});}}
                        label="Label"
                        type="text"
                        autoComplete="off"
                        helpText={
                            <span>Label of the announcement bar.</span>
                        }
                    />

                    <TextField
                        value={props.data.text}
                        onChange={ (newValue) => { props.setData({...props.data, text: newValue}); }}
                        label="Text"
                        type="text"
                        autoComplete="off"
                        helpText={
                            <span>Size of the text</span>
                        }
                    />
                </FormLayout.Group>

                <FormLayout.Group>
                    <TextField
                        value={`${props.data.fontSize}`}
                        onChange={ (newValue) => { props.setData({...props.data, fontSize: parseInt(newValue)});  }}
                        label="Font size"
                        type="number"
                        autoComplete="off"
                        helpText={
                            <span>This text will appear at the top of the store page.</span>
                        }
                    />
                    <FormLayout>
                        <Text as="p">Text color:</Text>
                        <ColorPicker
                            color={fgColor}
                            onChange={(newValue) => { setFgColor(newValue); props.setData({...props.data, fgColor: hsbToHex(newValue)}); }}
                        />
                    </FormLayout>
                    <FormLayout>
                        <Text as="p">Background color:</Text>
                        <ColorPicker
                            color={bgColor}
                            onChange={(newValue) => { setBgColor(newValue); props.setData({...props.data, bgColor: hsbToHex(newValue)}); }}
                        />
                    </FormLayout>
                </FormLayout.Group>
            </FormLayout>
        </Form> : <Loader />
    );
};