import { api } from "@/api";

export interface AddTransactionRequest {
  type: "DEPOSIT" | "WITHDRAW";
  for: string;
  employeeId?: number;
  createdById?: number;
}

export interface AddTransactionResponse {
  status: string;
  data: {
    id: number;
    paidAmount: number;
    type: "DEPOSIT" | "WITHDRAW";
    for: string;
    employeeId?: number;
  };
}

/**
 * @desc Create a new transaction
 */
export const addTransactionService = async (transactionData: FormData) => {
  const response = await api.post<FormData>("/transactions", transactionData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
