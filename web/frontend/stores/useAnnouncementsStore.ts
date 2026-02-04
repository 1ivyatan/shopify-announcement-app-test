import { create } from "zustand";

interface AnnouncementPreview
{
    _id: string,
    shop: string,
    enabled: boolean,
    text: string,
    createdAt: Date,
    updatedAt: Date
}

const useAnnouncementsStore = create((set, get) => ({
    fetchAnnouncements: async (): Promise<AnnouncementPreview[]> => {
        const response = await fetch("/api/shop/announcement");
        const json = await response.json();
        console.log(json)
        return json;
    }
}));

export default useAnnouncementsStore;