export interface RepositoryEntry {
    id: number;
    receiptNumber: number;
    deliveryAgent: string;
    client: string;
    store: string;
    recipientNumber: string;
    recipientAddress: string;
    status: string;
}

export const repositoryEntriesMockup: RepositoryEntry[] = [
    {
        id: 1,
        receiptNumber: 1212,
        deliveryAgent: "John Doe",
        client: "Jane Client",
        store: "Store 1",
        recipientNumber: "1234",
        recipientAddress: "1234 Main St",
        status: "Delivered"
    },
    {
        id: 2,
        receiptNumber: 2323,
        deliveryAgent: "Alice Smith",
        client: "Bob Customer",
        store: "Store 2",
        recipientNumber: "5678",
        recipientAddress: "5678 Elm St",
        status: "In Transit"
    },
    {
        id: 3,
        receiptNumber: 3434,
        deliveryAgent: "Emily Johnson",
        client: "Chris Consumer",
        store: "Store 3",
        recipientNumber: "91011",
        recipientAddress: "91011 Oak St",
        status: "Pending"
    },
    {
        id: 4,
        receiptNumber: 4545,
        deliveryAgent: "Mark Davis",
        client: "David Buyer",
        store: "Store 4",
        recipientNumber: "121314",
        recipientAddress: "121314 Pine St",
        status: "Out for Delivery"
    },
    {
        id: 5,
        receiptNumber: 5656,
        deliveryAgent: "Sarah Brown",
        client: "Emma Shopper",
        store: "Store 5",
        recipientNumber: "151617",
        recipientAddress: "151617 Maple St",
        status: "Delayed"
    }
];
