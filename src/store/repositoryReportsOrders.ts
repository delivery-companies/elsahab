/* eslint-disable no-param-reassign */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IRepositoryReportsOrdersStore {
    repositoryReportsOrders: {
        id: string;
        status: string;
    }[];
}

type Actions = {
    addOrder: (order: { id: string; status: string }) => void;
    deleteOrder: (id: string) => void;
    setAllRepositoryReportsOrders: (repositoryReportsOrders: { id: string; status: string }[]) => void;
    deleteAllRepositoryReportsOrders: () => void;
    isOrderExist: (id: string) => boolean;
};

const repositoryReportsOrdersStore = create<IRepositoryReportsOrdersStore & Actions>()(
    immer((set) => ({
        repositoryReportsOrders: [],
        addOrder: (order) => {
            set((state) => {
                state.repositoryReportsOrders.push(order);
            });
        },
        deleteOrder: (id) => {
            set((state) => {
                const filteredRepositoryReportsOrders = state.repositoryReportsOrders.filter(
                    (order) => order.id !== id
                );
                state.repositoryReportsOrders = filteredRepositoryReportsOrders;
            });
        },
        setAllRepositoryReportsOrders: (repositoryReportsOrders) => {
            set((state) => {
                state.repositoryReportsOrders = repositoryReportsOrders;
            });
        },
        deleteAllRepositoryReportsOrders: () => {
            set((state) => {
                state.repositoryReportsOrders = [];
            });
        },
        isOrderExist: (id) => {
            let isOrderExist = false;
            set((state) => {
                const order = state.repositoryReportsOrders.find((order) => order.id === id);
                isOrderExist = !!order;
            });
            return isOrderExist;
        }
    }))
);

export const useRepositoryReportsStore = () => repositoryReportsOrdersStore((state) => state);
