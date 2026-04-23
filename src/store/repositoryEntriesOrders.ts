/* eslint-disable no-param-reassign */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IOrdersStore {
    repositoryOrders: {
        id: string;
        name: string;
    }[];
}

type Actions = {
    addRepositoryOrder: (order: { id: string; name: string }) => void;
    deleteRepositoryOrder: (id: string) => void;
    setAllRepositoryOrders: (repositoryOrders: { id: string; name: string }[]) => void;
    deleteAllRepositoryOrders: () => void;
    isRepositoryOrderExist: (id: string) => boolean;
};

const repositoryOrdersStore = create<IOrdersStore & Actions>()(
    immer((set) => ({
        repositoryOrders: [],
        addRepositoryOrder: (order) => {
            set((state) => {
                state.repositoryOrders.push(order);
            });
        },
        deleteRepositoryOrder: (id) => {
            set((state) => {
                const filteredOrders = state.repositoryOrders.filter((order) => order.id !== id);
                state.repositoryOrders = filteredOrders;
            });
        },
        setAllRepositoryOrders: (repositoryOrders) => {
            set((state) => {
                state.repositoryOrders = repositoryOrders;
            });
        },
        deleteAllRepositoryOrders: () => {
            set((state) => {
                state.repositoryOrders = [];
            });
        },
        isRepositoryOrderExist: (id) => {
            let isOrderExist = false;
            set((state) => {
                const order = state.repositoryOrders.find((order) => order.id === id);
                isOrderExist = !!order;
            });
            return isOrderExist;
        }
    }))
);

export const useRepositoryOrdersStore = () => repositoryOrdersStore((state) => state);
