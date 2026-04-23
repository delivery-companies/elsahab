import { orderSecondaryStatusArabicNames } from "@/lib/orderSecondaryStatusArabicNames";
import { orderStatusArabicNames, orderStatusColors } from "@/lib/orderStatusArabicNames";
import { Ticket } from "@/services/ticketService";
import { useAuth } from "@/store/authStore";
import { Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TakeTicket } from "../components/TakeTicket";
import { SendResponse } from "../components/SendResponse";
import { CloseTicket } from "../components/closeTicket";
import { ForwardTicket } from "../components/ForwardTicket";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";

type CustomTicketProps = {
    ticket: Ticket;
};

export const CustomTicket=({ ticket }: CustomTicketProps)=>{
    const {role}=useAuth()
    const [takeOpened, { open: openTake, close: closeTake }] = useDisclosure(false);
    const [closeTicketOpened, { open: openCloseTicket, close: closeCloseticket}] = useDisclosure(false);
    const [sendResponseOpened, { open: openSendResponse, close: closeSendResponse }] = useDisclosure(false);
    const [forwardOpened, { open: openForward, close: closeForward }] = useDisclosure(false);
    
    return(
        <div className="ticket">
            <span className="received" style={ticket.Employee ? {color:"red"}:{color:"green"}}>{ticket.Employee ? "مستلمه":"غير مستلمه"}</span>
            <div className="flex">
                <span>تذكره رقم : </span>
                <span>{ticket.id} {ticket.forwarded ? `محوله الى ${ticket.Department.name}`:null}</span>
            </div>
            <div className="flex">
                <span>تم الانشاء بواسطه : </span>
                <span>{ticket.createdBy.name}</span>
            </div>
            <div className="flex">
                <span>وصف المشكله : </span>
                <span>{ticket.content}</span>
            </div>
            {
                ticket.Employee && 
                    <div className="flex">
                        <span>مستلمه بواسطه : </span>
                        <span>{ticket.Employee.user.name}</span>
                    </div>
            }
            <div className="order-details" style={{marginTop:"10px"}}>
                <h3>تفاصيل الطلب</h3>
                <Grid align="center" gutter="lg" className="mb-4">
                    <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                        <div className="flex">
                        <span>رقم الوصل : </span>
                        <span>{ticket.Order.receiptNumber}</span>
                        </div>
                        <div className="flex">
                            <span>الحالة : </span>
                            <span style={{color:orderStatusColors[ticket.Order.status]}}>{orderStatusArabicNames[ticket.Order.status]} - {orderSecondaryStatusArabicNames[ticket.Order.secondaryStatus]}</span>
                        </div>
                        <div className="flex">
                        <span>العنوان : </span>
                        <span>{governorateArabicNames[ticket?.Order?.governorate] +" - " +ticket.Order.location.name+" - "+ticket.Order.recipientAddress}</span>
                        </div>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 5, sm: 12, xs: 12 }}>
                         <div className="flex">
                            <span>رقم الزبون : </span>
                            <span>{ticket.Order.recipientPhones.map((phone,index) => {
                                if (index === ticket.Order.recipientPhones.length -1) {
                                    return phone
                                }else{
                                    return phone + " - "
                                }
                            })}</span>
                        </div>
                        {
                            role !== "DELIVERY_AGENT" ?
                                <div className="flex">
                                    <span>العميل : </span>
                                    <span>{ticket.Client.user.name +"  -  "}{ticket.Client.user.phone} </span>
                                </div>:
                                <div className="flex">
                                    <span>العميل : </span>
                                    <span>{ticket.Client.user.name}</span>
                                </div>
                        }
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                        <div className="flex">
                            <span>الفرع : </span>
                            <span>{ticket.Order.branch.name}</span>
                        </div>
                      
                        {
                            role !== "CLIENT" ?
                            <div className="flex">
                            <span>المندوب : </span>
                                {
                                    ticket.Order.deliveryAgent ? 
                                    <span>{ticket.Order.deliveryAgent.user.name +"  -  "}{ticket.Order.deliveryAgent.user.phone} </span>:
                                    <span>لا يوجد</span>
                                }
                            </div> :
                            <div className="flex">
                                <span>المندوب : </span>
                                {
                                    ticket.Order.deliveryAgent ? 
                                    <span>{ticket.Order.deliveryAgent.user.name} </span>:
                                    <span>لا يوجد</span>
                                }
                            </div> 
                        }
                    </Grid.Col>
                </Grid>
                <h3>الردود</h3>
                {
                    ticket.ticketResponse.map(response => 
                    <div className="response" key={response.id}>
                        <p>{response.content}</p>
                        <span>{response.createdBy.name}</span>
                    </div>)
                }
                {
                    ticket.ticketResponse.length === 0 && <span>لا يوجد ردود</span>
                }
            </div>
            {
                !ticket.closed &&             
                <div className="controls flex mt-3">
                    {
                        role === "INQUIRY_EMPLOYEE" ?
                        <>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-2" disabled={ticket.Employee ? true :false} onClick={openTake}>
                                استلام التذكره
                            </button>
                            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded ml-2" disabled={ticket.Employee ? false :true} onClick={openSendResponse}>
                                الرد على التذكره
                            </button>
                            <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded ml-2" disabled={ticket.Employee ? false :true} onClick={openForward}>
                                تحويل التذكره
                            </button>
                            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" disabled={ticket.Employee ? false :true} onClick={openCloseTicket}>
                                اغلاق التذكره
                            </button>
                        </>:
                        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded ml-2" disabled={ticket.Employee ? false :true} onClick={openSendResponse}>
                            الرد على التذكره
                        </button>
                    }
                </div>
            }
            <TakeTicket opened={takeOpened} close={closeTake} id={ticket.id}/>
            <SendResponse opened={sendResponseOpened} close={closeSendResponse} id={ticket.id}/>
            <CloseTicket opened={closeTicketOpened} close={closeCloseticket} id={ticket.id}/>
            <ForwardTicket opened={forwardOpened} close={closeForward} id={ticket.id}/>
        </div>
    )
}