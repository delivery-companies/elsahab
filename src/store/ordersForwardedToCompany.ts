/* eslint-disable no-param-reassign */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IOrdersStore {
    orders: {
        id: string;
        name: string;
    }[];
}

type Actions = {
    addOrder: (order: { id: string; name: string }) => void;
    deleteOrder: (id: string) => void;
    setAllOrders: (orders: { id: string; name: string }[]) => void;
    deleteAllOrders: () => void;
    isOrderExist: (id: string) => boolean;
};

const ordersForwardedToCompany = create<IOrdersStore & Actions>()(
    immer((set) => ({
        orders: [],
        addOrder: (order) => {
            set((state) => {
                state.orders.push(order);
            });
        },
        deleteOrder: (id) => {
            set((state) => {
                const filteredOrders = state.orders.filter((order) => order.id !== id);
                state.orders = filteredOrders;
            });
        },
        setAllOrders: (orders) => {
            set((state) => {
                state.orders = orders;
            });
        },
        deleteAllOrders: () => {
            set((state) => {
                state.orders = [];
            });
        },
        isOrderExist: (id) => {
            let isOrderExist = false;
            set((state) => {
                const order = state.orders.find((order) => order.id === id);
                isOrderExist = !!order;
            });
            return isOrderExist;
        }
    }))
);

export const useOrdersForwardedToCompany = () => ordersForwardedToCompany((state) => state);
