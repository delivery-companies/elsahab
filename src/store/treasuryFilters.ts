/* eslint-disable no-param-reassign */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IRepositoryReportsOrdersStore {
    treasuryReports: {
        id: string;
        status: string;
    }[];
}

type Actions = {
    addTreasuryReport: (report: { id: string; status: string }) => void;
    deleteTreasuryReport: (id: string) => void;
    setAllTreasuryReportsOrders: (repositoryReportsOrders: { id: string; status: string }[]) => void;
    deleteAllTreasuryReportsOrders: () => void;
    isReportExist: (id: string) => boolean;
};

const treasuryReportsOrdersStore = create<IRepositoryReportsOrdersStore & Actions>()(
    immer((set) => ({
        treasuryReports: [],
        addTreasuryReport: (order) => {
            set((state) => {
                state.treasuryReports.push(order);
            });
        },
        deleteTreasuryReport: (id) => {
            set((state) => {
                const filteredTreasuryReportsOrders = state.treasuryReports.filter(
                    (order) => order.id !== id
                );
                state.treasuryReports = filteredTreasuryReportsOrders;
            });
        },
        setAllTreasuryReportsOrders: (repositoryReportsOrders) => {
            set((state) => {
                state.treasuryReports = repositoryReportsOrders;
            });
        },
        deleteAllTreasuryReportsOrders: () => {
            set((state) => {
                state.treasuryReports = [];
            });
        },
        isReportExist: (id) => {
            let isReportExist = false;
            set((state) => {
                const report = state.treasuryReports.find((order) => order.id === id);
                isReportExist = !!report;
            });
            return isReportExist;
        }
    }))
);

export const useTreasuryReportsStore = () => treasuryReportsOrdersStore((state) => state);
