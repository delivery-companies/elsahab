import { api } from "@/api";
import { createOrdersDocumentationEndpoint } from "@/api/apisUrl";
import { getReportParam } from "@/lib/getReportParam";
import { AxiosError, type AxiosResponse } from "axios";
import FileSaver from "file-saver";
import type { ManifestFilters } from "./getDeliveryAgentManifest";
import type { OrdersFilter } from "./getOrders";

type CreateAllOrdersDocumentationPDFPayload = {
  ordersIDs: string[] | "*";
  type: "GENERAL";
  params: OrdersFilter;
};

export type CreateOrdersDocumentationPDFByIDsPayload = {
  ordersIDs: "*";
  type: "DELIVERY_AGENT_MANIFEST";
  params: CreateDeliveryAgentManifestPDFFilters;
};

export type CreateOrdersDocumentationReportPDFPayload =
  | CreateAllOrdersDocumentationPDFPayload
  | CreateOrdersDocumentationPDFByIDsPayload;

export type CreateDeliveryAgentManifestPDFFilters = {
  delivery_agent_id: number;
} & ManifestFilters;

export const createOrdersDocumentationService = async (
  data: CreateOrdersDocumentationReportPDFPayload
) => {
  try {
    const response = await api.post<
      CreateOrdersDocumentationReportPDFPayload,
      AxiosResponse<never>
    >(
      createOrdersDocumentationEndpoint,
      {
        type: data.type,
        ordersIDs: data.ordersIDs,
      },
      {
        responseType: "arraybuffer",
        params:
          data.type === "GENERAL"
            ? {
                page: data.params.page,
                size: data.params.size,
                search: data.params.search || undefined,
                sort: data.params.sort || undefined,
                start_date: data.params.start_date || undefined,
                end_date: data.params.end_date || undefined,
                delivery_start_date:
                  data.params.delivery_start_date || undefined,
                delivery_end_date: data.params.delivery_end_date || undefined,
                delivery_date: data.params.delivery_date || undefined,
                governorate: data.params.governorate || undefined,
                status: data.params.status || undefined,
                delivery_type: data.params.delivery_type || undefined,
                delivery_agent_id: data.params.delivery_agent_id || undefined,
                client_id: data.params.client_id || undefined,
                store_id: data.params.store_id || undefined,
                product_id: data.params.product_id || undefined,
                location_id: data.params.location_id || undefined,
                receipt_number: data.params.receipt_number || undefined,
                recipient_name: data.params.recipient_name || undefined,
                recipient_phone: data.params.recipient_phone || undefined,
                recipient_address: data.params.recipient_address || undefined,
                deleted: data.params.deleted,
                statuses: data.params.statuses?.join(",") || undefined,
                client_report: getReportParam(data.params.client_report),
                repository_report: getReportParam(
                  data.params.repository_report
                ),
                branch_report: getReportParam(data.params.branch_report),
                delivery_agent_report: getReportParam(
                  data.params.delivery_agent_report
                ),
                governorate_report: getReportParam(
                  data.params.governorate_report
                ),
                company_report: getReportParam(data.params.company_report),
                branch_id: data.params.branch_id || undefined,
                automatic_update_id:
                  data.params.automatic_update_id || undefined,
                confirmed: data.params.confirmed || false,
              }
            : data.params,
      }
    );

    const contentType = response.headers["content-type"];

    if (contentType === "application/pdf") {
      const blob = new Blob([response.data], { type: "application/pdf" });
      FileSaver.saveAs(blob, "تقرير.pdf");
      return;
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const data = JSON.parse(new TextDecoder().decode(error.response?.data));
      throw data;
    }
  }
};

export const createRepositoryOrdersDocumentationService = async (
  data: CreateOrdersDocumentationReportPDFPayload
) => {
  try {
    const response = await api.post<
      CreateOrdersDocumentationReportPDFPayload,
      AxiosResponse<never>
    >(
      "/repository-orders/pdf",
      {
        type: data.type,
        ordersIDs: data.ordersIDs,
      },
      {
        responseType: "arraybuffer",
        params:
          data.type === "GENERAL"
            ? {
                client_id: data.params.client_id || undefined,
                store_id: data.params.store_id || undefined,
                governorate: data.params.governorate || undefined,
                repository_id: data.params.repository_id || undefined,
                to_repository_id: data.params.to_repository_id || undefined,
                forwardedToGov: data.params.forwardedToGov || undefined,
                forwarded: data.params.forwarded || undefined,
                secondaryStatus: data.params.secondaryStatus,
                status: data.params.status || undefined,
                getIncoming: data.params.getIncoming || undefined,
                getOutComing: data.params.getOutComing || undefined,
                branchId: data.params.branch_id || undefined,
              }
            : data.params,
      }
    );

    const contentType = response.headers["content-type"];

    if (contentType === "application/pdf") {
      const blob = new Blob([response.data], { type: "application/pdf" });
      FileSaver.saveAs(blob, "تقرير.pdf");
      return;
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const data = JSON.parse(new TextDecoder().decode(error.response?.data));
      throw data;
    }
  }
};
