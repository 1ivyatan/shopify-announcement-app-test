import { create } from "zustand";

export interface IAnnouncementPreview
{
    _id: string,
    shop: string,
    label: string,
    enabled: boolean,
    text: string,
    createdAt: Date,
    updatedAt: Date
}

const useAnnouncementsStore = create((set, get) => ({
    announcementsData: null,
    fetchAnnouncements: async (): Promise<void> => {
        const response = await fetch("/api/shop/announcement");
        const json: IAnnouncementPreview[] = await response.json();
        set({ announcementsData: json});
    }
}));

export default useAnnouncementsStore;