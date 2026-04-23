enum Role {
  ADMIN = "ادمن",
  COMPANY_MANAGER = "مدير شركة",
  ACCOUNT_MANAGER = "مدير حسابات",
  ACCOUNTANT = "محاسب",
  DELIVERY_AGENT = "مندوب توصيل",
  RECEIVING_AGENT = "مندوب استلام",
  BRANCH_MANAGER = "مدير فرع",
  EMERGENCY_EMPLOYEE = "موظف متابعة",
  MAIN_EMERGENCY_EMPLOYEE = "موظف متابعة رئيسي",
  DATA_ENTRY = "مدخل بيانات",
  REPOSITORIY_EMPLOYEE = "موظف مخزن",
  INQUIRY_EMPLOYEE = "موظف دعم",
  ADMIN_ASSISTANT = "مساعد ادمن",
  EMPLOYEE_CLIENT_ASSISTANT = "موظف مساعد للعميل",
  CLIENT_ASSISTANT = "مساعد عميل",
}

export const rolesArabicNames = {
  ADMIN: "مدير عام",
  COMPANY_MANAGER: "مدير شركة",
  ACCOUNT_MANAGER: "مدير حسابات", // need to clarify
  ACCOUNTANT: "محاسب",
  DELIVERY_AGENT: "مندوب توصيل", // won't use the dashboard
  RECEIVING_AGENT: "مندوب استلام", // won't use the dashboard
  BRANCH_MANAGER: "مدير فرع",
  EMERGENCY_EMPLOYEE: "موظف متابعة", // need to clarify
  MAIN_EMERGENCY_EMPLOYEE: "موظف متابعة رئيسي",
  DATA_ENTRY: "مدخل بيانات",
  REPOSITORIY_EMPLOYEE: "موظف مخزن",
  INQUIRY_EMPLOYEE: "موظف دعم", // need to clarify
  ADMIN_ASSISTANT: "مساعد ادمن",
  CLIENT_ASSISTANT: "مساعد عميل",
  EMPLOYEE_CLIENT_ASSISTANT: "موظف مساعد للعميل",
  CLIENT: "عميل",
};

enum branchRole {
  DELIVERY_AGENT = "مندوب توصيل", // won't use the dashboard
  RECEIVING_AGENT = "مندوب استلام", // won't use the dashboard
  REPOSITORIY_EMPLOYEE = "موظف مخزن",
  DATA_ENTRY = "مدخل بيانات",
  ACCOUNTANT = "محاسب",
}

export const ROLE_CONFIG: Record<
  string,
  { permissions: string[]; orderStatus: string[] }
> = {
  DELIVERY_AGENT: {
    permissions: ["CHANGE_ORDER_STATUS", "CHANGE_ORDER_DATA"],
    orderStatus: [
      "DELIVERED",
      "REPLACED",
      "PARTIALLY_RETURNED",
      "RETURNED",
      "POSTPONED",
      "CHANGE_ADDRESS",
      "PROCESSING",
      "RESEND",
    ],
  },

  RECEIVING_AGENT: {
    permissions: ["CHANGE_ORDER_STATUS", "CHANGE_ORDER_DATA", "CONFIRM_ORDER"],
    orderStatus: ["READY_TO_SEND", "WITH_DELIVERY_AGENT", "RETURNED"],
  },

  REPOSITORIY_EMPLOYEE: {
    permissions: [
      "CHANGE_ORDER_DATA",
      "CONFIRM_ORDER",
      "ADD_ORDERS_TO_REPOSITORY",
      "SEND_ORDER_TO_REPOSITORY",
      "ASSIGN_ORDERS_TO_AGENT",
      "CREATE_REPOSITORY_REPORT",
      "DELETE_REPOSITORY_REPORT",
    ],
    orderStatus: ["DELIVERED"],
  },

  DATA_ENTRY: {
    permissions: [
      "CHANGE_ORDER_DATA",
      "CONFIRM_ORDER",
      "ADD_ORDER",
      "ADD_STORE",
    ],
    orderStatus: ["READY_TO_SEND", "WITH_DELIVERY_AGENT", "RETURNED"],
  },

  ACCOUNTANT: {
    permissions: ["CREATE_DELIVERY_AGENT_REPORT", "CREATE_CLIENT_REPORT"],
    orderStatus: ["DELIVERED", "REPLACED", "PARTIALLY_RETURNED", "RETURNED"],
  },
};

export const rolesArray: { label: string; value: string }[] = Object.entries(
  Role,
).map(([value, label]) => ({
  label,
  value,
}));

export const branchRolesArray: { label: string; value: string }[] =
  Object.entries(branchRole).map(([value, label]) => ({
    label,
    value,
  }));
