import { AppLayout } from "@/components/AppLayout";
import { useGetAllTickets } from "@/hooks/useTicket";
import { TicketFilters } from "@/services/ticketService";
import { Button, Grid, Pagination, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { CustomTicket } from "./Ticket";
import { useAuth } from "@/store/authStore";
import { Loader } from "lucide-react";
import {
  orderStatusArabicNames,
  orderStatusArray,
} from "@/lib/orderStatusArabicNames";

type TicketScreenProps = {
  forwarded?: boolean;
};

export const TicketScreen = ({ forwarded = false }: TicketScreenProps) => {
  const { role } = useAuth();
  // const [allowedOrderStatus, setAllowedStatus] = useState<OrderStatusItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    keyof typeof orderStatusArabicNames | null
  >(null);

  const [filters, setFilters] = useState<TicketFilters>({
    page: 1,
    size: 10,
    status: selectedStatus ? selectedStatus : undefined,
    userTickets: "false",
    forwarded: forwarded ? "true" : "false",
    closed: "false",
  });

  useEffect(() => {
    if (role === "INQUIRY_EMPLOYEE") {
      setFilters((pre) => ({ ...pre, userTickets: "true" }));
    }
    if (forwarded) {
      setFilters((pre) => ({ ...pre, forwarded: "true" }));
    } else {
      setFilters((pre) => ({ ...pre, forwarded: "false" }));
    }
  }, [forwarded, role]);

  const {
    data: tickets = {
      data: [],
      count: 0,
      pagesCount: 0,
      page: 0,
    },
    isLoading,
  } = useGetAllTickets(filters);

  return (
    <AppLayout>
      <Grid align="center" gutter="lg" className="mb-4">
        <Grid.Col span={{ base: 12, md: 3, lg: 3, sm: 3, xs: 3 }}>
          <Select
            value={selectedStatus}
            allowDeselect
            label="الحاله"
            searchable
            clearable
            onChange={(e) => {
              if (e) {
                setSelectedStatus(e as keyof typeof orderStatusArabicNames);
                setFilters((pre) => ({
                  ...pre,
                  status: e as keyof typeof orderStatusArabicNames,
                }));
              } else {
                setFilters((pre) => ({ ...pre, status: undefined }));
                setSelectedStatus(null);
              }
            }}
            placeholder="اختر الحالة"
            data={orderStatusArray}
            limit={100}
          />
        </Grid.Col>
        {/* {
                    role !=="CLIENT"?
                        <Grid.Col span={{ base: 12, md: 3, lg: 3, sm: 3, xs: 3 }}>
                        <Switch
                            className="mt-8 mb-3"
                            label="التذاكر المحوله"
                            onChange={(e)=>{
                                if(e.target.checked){
                                    setFilters(pre => ({...pre,forwarded:"true"}))
                                }else{
                                    setFilters(pre => ({...pre,forwarded:"false"}))
                                }
                            }}
                        />
                        </Grid.Col>:null

                } */}
      </Grid>
      <Grid align="center" gutter="lg" className="mb-4">
        {role === "INQUIRY_EMPLOYEE" ? (
          <>
            <Grid.Col span={{ base: 12, md: 3, lg: 3, sm: 3, xs: 3 }}>
              <Button
                style={
                  filters.userTickets === "false"
                    ? {
                        width: "100%",
                        backgroundColor: "#f7f7f7",
                        color: "#000",
                      }
                    : { width: "100%" }
                }
                onClick={() => {
                  setFilters((pre) => ({
                    ...pre,
                    closed: "false",
                    userTickets: "true",
                    forwarded: "false",
                  }));
                }}
              >
                التذاكر المستلمه
              </Button>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3, lg: 3, sm: 3, xs: 3 }}>
              <Button
                style={
                  filters.forwarded === "false"
                    ? {
                        width: "100%",
                        backgroundColor: "#f7f7f7",
                        color: "#000",
                      }
                    : { width: "100%" }
                }
                onClick={() => {
                  setFilters((pre) => ({
                    ...pre,
                    closed: "false",
                    userTickets: "false",
                    forwarded: "true",
                  }));
                }}
              >
                التذاكر المحوله
              </Button>
            </Grid.Col>
          </>
        ) : null}
        <Grid.Col
          span={
            role === "INQUIRY_EMPLOYEE"
              ? { base: 12, md: 3, lg: 3, sm: 3, xs: 3 }
              : { base: 12, md: 6, lg: 6, sm: 6, xs: 6 }
          }
        >
          <Button
            style={
              filters.closed === "true" ||
              filters.userTickets === "true" ||
              filters.forwarded === "true"
                ? { width: "100%", backgroundColor: "#f7f7f7", color: "#000" }
                : { width: "100%" }
            }
            onClick={() => {
              setFilters((pre) => ({
                ...pre,
                closed: "false",
                userTickets: "false",
                forwarded: "false",
              }));
            }}
          >
            التذاكر المفتوحه
          </Button>
        </Grid.Col>
        <Grid.Col
          span={
            role === "INQUIRY_EMPLOYEE"
              ? { base: 12, md: 3, lg: 3, sm: 3, xs: 3 }
              : { base: 12, md: 6, lg: 6, sm: 6, xs: 6 }
          }
        >
          <Button
            style={
              filters.closed === "false"
                ? { width: "100%", backgroundColor: "#f7f7f7", color: "#000" }
                : { width: "100%" }
            }
            onClick={() => {
              setFilters((pre) => ({
                ...pre,
                closed: "true",
                userTickets: "false",
                forwarded: "false",
              }));
            }}
          >
            التذاكر المغلقه
          </Button>
        </Grid.Col>
      </Grid>
      {isLoading ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="tickets">
            {tickets.data.map((ticket) => (
              <CustomTicket ticket={ticket} key={ticket.id} />
            ))}
            {tickets.data.length === 0 && <h1>لا يوجد تذاكر</h1>}
          </div>
          <div className="flex justify-center mt-10">
            <Pagination
              total={tickets.pagesCount}
              value={+tickets.page}
              onChange={(page) => {
                setFilters({ ...filters, page });
              }}
            />
          </div>
        </>
      )}
    </AppLayout>
  );
};
