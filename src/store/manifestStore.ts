import { create } from "zustand";

interface IManifestStoreFilters {
  branch_id: number | undefined;
  orders_start_date: string | undefined | null;
  orders_end_date: string | undefined | null;
  deliveryAgentId: number | undefined;
}

type Actions = {
  setBranchId: (branchId: number | undefined) => void;
  setOrdersStartDate: (startDate: string | undefined | null) => void;
  setOrdersEndDate: (endDate: string | undefined | null) => void;
  setDeliveryAgentId: (deliveryAgentId: number | undefined) => void;
  resetFilters: () => void;
};

const manifestStore = create<IManifestStoreFilters & Actions>((set) => ({
  branch_id: 0,
  orders_start_date: "",
  orders_end_date: "",
  deliveryAgentId: 0,
  setBranchId: (branchId) => {
    set(() => ({
      branch_id: branchId,
    }));
  },
  setOrdersStartDate: (startDate) => {
    set(() => ({
      orders_start_date: startDate,
    }));
  },
  setOrdersEndDate: (endDate) => {
    set(() => ({
      orders_end_date: endDate,
    }));
  },
  setDeliveryAgentId: (deliveryAgentId) => {
    set(() => ({
      deliveryAgentId,
    }));
  },
  resetFilters: () => {
    set(() => ({
      branch_id: undefined,
      orders_start_date: "",
      orders_end_date: "",
      deliveryAgentId: undefined,
    }));
  },
}));

export const useManifestStore = () => manifestStore((state) => state);
