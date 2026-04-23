/* eslint-disable no-param-reassign */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IConfirmClientOrdersStore {
    clientOrders: {
        id: string;
        name: string;
    }[];
}

type Actions = {
    addClientOrder: (order: { id: string; name: string }) => void;
    deleteClientOrder: (id: string) => void;
    setAllClientOrders: (orders: { id: string; name: string }[]) => void;
    deleteAllClientOrders: () => void;
    isClientOrderExist: (id: string) => boolean;
};

const clientOrdersStore = create<IConfirmClientOrdersStore & Actions>()(
    immer((set) => ({
        clientOrders: [],
        addClientOrder: (order) => {
            set((state) => {
                state.clientOrders.push(order);
            });
        },
        deleteClientOrder: (id) => {
            set((state) => {
                const filteredOrders = state.clientOrders.filter((order) => order.id !== id);
                state.clientOrders = filteredOrders;
            });
        },
        setAllClientOrders: (orders) => {
            set((state) => {
                state.clientOrders = orders;
            });
        },
        deleteAllClientOrders: () => {
            set((state) => {
                state.clientOrders = [];
            });
        },
        isClientOrderExist: (id) => {
            let isOrderExist = false;
            set((state) => {
                const order = state.clientOrders.find((order) => order.id === id);
                isOrderExist = !!order;
            });
            return isOrderExist;
        }
    }))
);

export const useClientOrdersStore = () => clientOrdersStore((state) => state);
