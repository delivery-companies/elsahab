import { api } from "@/api";
import { editBranchEndpoint } from "@/api/apisUrl";

export interface EditBranchPayload {
  name: string;
  governorate: string;
}

export const editBranchService = async ({
  data,
  id,
}: {
  data: EditBranchPayload;
  id: number;
}) => {
  const response = await api.patch<EditBranchPayload>(
    editBranchEndpoint + id,
    data
  );
  return response.data;
};
