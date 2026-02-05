import { useEffect, useState } from "react";
import useAnnouncementsStore from "../../stores/useAnnouncementsStore";
import { ExtensionPreview } from "../../shared/index";
import { Loader } from "../../components/common/Loader";

export const AnnouncementsPreview = (): React.ReactElement  => {
    const { fetchMetaAnnouncements } = useAnnouncementsStore();
    const [ announcements, setAnnouncements ] = useState<any[]>([]);

    const loadAnns = async () => {
        const response = await fetchMetaAnnouncements();
        
        if (response.ok) {
            const json = await response.json();
            setAnnouncements(json.data);
        }
    }

    useEffect(() => {
        loadAnns();
    });

    return (announcements != null && announcements.length > 0)
        ? <ExtensionPreview contextData={{context: "embed", data: announcements}} />
        : <Loader />;
}