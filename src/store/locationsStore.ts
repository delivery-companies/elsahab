/* eslint-disable no-param-reassign */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface ILocationsStore {
    locations: {
        id: string;
        name: string;
    }[];
}

type Actions = {
    addLocation: (location: { id: string; name: string }) => void;
    deleteLocation: (id: string) => void;
    setAllLocations: (locations: { id: string; name: string }[]) => void;
    deleteAllLocations: () => void;
    isLocationExist: (id: string) => boolean;
};

const locationsStore = create<ILocationsStore & Actions>()(
    immer((set) => ({
        locations: [],
        addLocation: (order) => {
            set((state) => {
                state.locations.push(order);
            });
        },
        deleteLocation: (id) => {
            set((state) => {
                const filteredOrders = state.locations.filter((order) => order.id !== id);
                state.locations = filteredOrders;
            });
        },
        setAllLocations: (orders) => {
            set((state) => {
                state.locations = orders;
            });
        },
        deleteAllLocations: () => {
            set((state) => {
                state.locations = [];
            });
        },
        isLocationExist: (id) => {
            let isLocationExist = false;
            set((state) => {
                const location = state.locations.find((location) => location.id === id);
                isLocationExist = !!location;
            });
            return isLocationExist;
        }
    }))
);

export const useLocationsStore = () => locationsStore((state) => state);
