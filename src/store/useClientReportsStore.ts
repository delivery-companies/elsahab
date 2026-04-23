/* eslint-disable no-param-reassign */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IClientReportStore {
    reports: {
        id: string;
        name: string;
    }[];
}

type Actions = {
    addClientReport: (order: { id: string; name: string }) => void;
    deleteClientReport: (id: string) => void;
    setAllClientReport: (reports: { id: string; name: string }[]) => void;
    deleteAllClientReport: () => void;
    isClientReportExist: (id: string) => boolean;
};

const clientReportStore = create<IClientReportStore & Actions>()(
    immer((set) => ({
        reports: [],
        addClientReport: (report) => {
            set((state) => {
                state.reports.push(report);
            });
        },
        deleteClientReport: (id) => {
            set((state) => {
                const filteredOrders = state.reports.filter((report) => report.id !== id);
                state.reports = filteredOrders;
            });
        },
        setAllClientReport: (reports) => {
            set((state) => {
                state.reports = reports;
            });
        },
        deleteAllClientReport: () => {
            set((state) => {
                state.reports = [];
            });
        },
        isClientReportExist: (id) => {
            let isOrderExist = false;
            set((state) => {
                const report = state.reports.find((report) => report.id === id);
                isOrderExist = !!report;
            });
            return isOrderExist;
        }
    }))
);

export const useClientReportStoreStore = () => clientReportStore((state) => state);
