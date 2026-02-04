import { Button, Checkbox, ColorPicker, FormLayout, hsbToHex, InlineGrid, Text, TextField } from "@shopify/polaris";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { Announcement } from "../../stores/useAnnouncementsStore";

export const AnnouncementEditor = (props: { method: String, afterSubmission: Function, id: String | null }): React.ReactElement => {
    const [ enabledSubmit, setEnabledSubmit ] = useState<boolean>(false);
    const [ fgColor, setFgColor ] = useState({hue: 0,brightness: 0,saturation: 0,});
    const [ bgColor, setBgColor ] = useState({hue: 0,brightness: 100,saturation: 0,});
    const [ announcement, setAnnouncement ] = useState<Announcement>({
        _id: null, label: "", enabled: false, text: "", fgColor: "#FFFFFF",
        bgColor: "#000000", fontSize: 16, createdAt: null, updatedAt: null
    });

    useEffect(() => {

    }, []);

    const validateData = (data: Announcement) => {
        if (
            data.label.trim().length == 0 ||
            data.text.trim().length == 0
        ) {
            setEnabledSubmit(false);
        } else {
            setEnabledSubmit(true);
        }
    }

    const onSubmit = () => {

        props.afterSubmission();
    }

    return (
        <Form onSubmit={onSubmit}>
            <FormLayout>

                <Checkbox
                    label="Enabled"
                    checked={ announcement.enabled }
                    onChange={ (newValue) => { setAnnouncement({...announcement, enabled: newValue}) }}
                    helpText={
                        <span>Show or hide the announcement bar to visitors</span>
                    }
                />

                
                <FormLayout.Group>
                    <TextField
                        value={announcement.label}
                        onChange={ (newValue) => { setAnnouncement({...announcement, label: newValue}); validateData({...announcement, label: newValue}); }}
                        label="Label"
                        type="text"
                        autoComplete="off"
                        helpText={
                            <span>Label of the announcement bar.</span>
                        }
                    />

                    <TextField
                        value={announcement.text}
                        onChange={ (newValue) => { setAnnouncement({...announcement, text: newValue}); validateData({...announcement, text: newValue});  }}
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
                        value={`${announcement.fontSize}`}
                        onChange={ (newValue) => { setAnnouncement({...announcement, fontSize: parseInt(newValue)}); validateData({...announcement, fontSize: parseInt(newValue)});  }}
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
                            onChange={(newValue) => { setFgColor(newValue); setAnnouncement({...announcement, fgColor: hsbToHex(newValue)}); }}
                        />
                    </FormLayout>
                    <FormLayout>
                        <Text as="p">Background color:</Text>
                        <ColorPicker
                            color={bgColor}
                            onChange={(newValue) => { setBgColor(newValue); setAnnouncement({...announcement, bgColor: hsbToHex(newValue)}); }}
                        />
                    </FormLayout>
                </FormLayout.Group>
              <Button submit={true} variant="primary" disabled={!enabledSubmit}>Save</Button>
            </FormLayout>
        </Form>
    );
};