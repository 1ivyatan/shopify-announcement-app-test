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

export interface Announcement
{
    _id: string | undefined,
    label: string,
    enabled: boolean,
    text: string,
    fgColor: string,
    bgColor: string,
    fontSize: number,
    createdAt: Date | null,
    updatedAt: Date | null
}

export const nullAnnouncement: Announcement = {
    _id: undefined, label: "", enabled: false, text: "", fgColor: "#FFFFFF",
    bgColor: "#000000", fontSize: 16, createdAt: null, updatedAt: null
};

const useAnnouncementsStore = create((set, get) => ({
    announcementsData: null,
    fetchAnnouncements: async (page: number): Promise<void> => {
        const response = await fetch(`/api/shop/announcement?page=${page}`);
        if (response.ok) {
            const json: IAnnouncementPreview[] = await response.json();
            set({ announcementsData: json});
        }
    },
    fetchAnnouncement: async (id: string): Promise<Announcement | undefined> => {
        const response = await fetch(`/api/shop/announcement/${id}`);
        if (response.ok) {
            const json: Announcement = await response.json();
            return json;
        } else {
            return undefined;
        }
    }
}));

export default useAnnouncementsStore;