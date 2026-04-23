export interface Employee {
    id: number;
    name: string;
    role: string;
    branch: string;
    location: string;
    phone: string;
}

export interface Client {
    id: number;
    name: string;
    branch: string;
    phone: string;
    type: "customer" | "cleint_helper";
    createdAt: Date;
}

export interface APIError {
    message: string;
    status: string;
}

export interface Branch {
    id: number;
    location: string;
    name: string;
    email: string;
    phone: string;
    createdAt: Date;
}
