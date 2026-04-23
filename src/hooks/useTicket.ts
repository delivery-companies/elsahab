import type { APIError } from "@/models";
import { closeTicketService, createTicketService, forwardTicketService, getAllTicketService, sendResponseService, takeTicketService, TicketFilters } from "@/services/ticketService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useGetAllTickets= (filter: TicketFilters, enabled = true) => {
    return useQuery({
        queryKey: [
            "tickets",
            {
                page: filter.page || 1,
                size: 10,
                ...filter
            }
        ],
        queryFn: () =>
            getAllTicketService({
                page: filter.page || 1,
                size: filter.size || 10,
                ...filter
            }),
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        },
        enabled
    });
};

export const useCreateTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FormData) => {
            return createTicketService(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tickets"]
            });
            toast.success("تم انشاء التذكره بنجاح");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};


export const useSendResponse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FormData) => {
            return sendResponseService(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tickets"]
            });
            toast.success("تم ارسال ردك بنجاح");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};
export const useCloseTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FormData) => {
            return closeTicketService(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tickets"]
            });
            toast.success("تم اغلاق التذكره بنجاح");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};

export const useForwardTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FormData) => {
            return forwardTicketService(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tickets"]
            });
            toast.success("تم تحويل التذكره بنجاح");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};

export const useTakeTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:number) => {
            return takeTicketService(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tickets"]
            });
            toast.success("تم استلام التذكره بنجاح");
        },
        onError: (error: AxiosError<APIError>) => {
            toast.error(error.response?.data.message || "حدث خطأ ما");
        }
    });
};
