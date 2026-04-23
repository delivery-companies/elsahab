import { downloadExcelSheet } from "@/services/downloadExcelSheet";
import { useMutation } from "@tanstack/react-query";

export const useOrderSheet = () => {
  return useMutation({
    mutationFn: () => downloadExcelSheet(),
  });
};
