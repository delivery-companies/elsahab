enum Permission {
  ADD_STORE = "اضافة متجر",
  ADD_CLIENT = " اضافة عميل",
  ADD_LOCATION = " اضافة منطقة",
  ADD_DELIVERY_AGENT = "اضافة مندوب",
  ADD_ORDER = " اضافة طلب",
  DELETE_ORDER = " مسح طلبية",
  CHANGE_ORDER_STATUS = "تغيير حالة طلبية",
  CHANGE_CLOSED_ORDER_STATUS = "تغيير حالة طلبية مغلقة",
  CHANGE_ORDER_TOTAL_AMOUNT = "تعديل المبلغ الكلي لطلبية",
  LOCK_ORDER_STATUS = "قفل حالة طلبية",

  CHANGE_ORDER_DELIVERY_AGENT = "احالة طلبية من مندوب الي اخر",
  CHANGE_ORDER_BRANCH = "احالة طلبية من فرع الي اخر",
  CHANGE_ORDER_CLIENT = "احالة طلبية من عميل الي اخر",
  CHANGE_ORDER_COMPANY = "احالة طلبية من شركة الي اخرى",

  ADD_ORDERS_TO_REPOSITORY = "إدخال الطلبات للمخزن",
  SEND_ORDER_TO_REPOSITORY = "إرسال الطلبات للأفرع",
  ASSIGN_ORDERS_TO_AGENT = "توزيع الطلبات علي المندوب",

  CREATE_DELIVERY_AGENT_REPORT = "انشاء كشف مندوب",
  CREATE_CLIENT_REPORT = "انشاء كشف عميل",
  CREATE_REPOSITORY_REPORT = "انشاء كشف مخزن",
  CREATE_COMPANY_REPORT = "انشاء كشف شركة",
  CREATE_GOVERNMENT_REPORT = "انشاء كشف محافظة",
  CREATE_BRANCH_REPORT = "انشاء كشف فرع",

  DELETE_COMPANY_REPORT = "مسح كشف شركة",
  DELETE_REPOSITORY_REPORT = "مسح كشف مخزن",
  DELETE_GOVERNMENT_REPORT = "مسح كشف محافظة",
  DELETE_DELIVERY_AGENT_REPORT = "مسح كشف مندوب",
  DELETE_CLIENT_REPORT = "مسح كشف عميل",
  DELETE_BRANCH_REPORT = "مسح كشف فرع",
  CONFIRM_ORDER = "تأكيد طلب",

  CHANGE_ORDER_DATA = "تعديل بيانات طلبية",
  CHANGE_ORDER_PAID_AMOUNT = "تعديل المبلغ المدفوع لطلبية",
  CHANGE_ORDER_RECEIPT_NUMBER = "تعديل رقم الايصال لطلبية",
  CHANGE_ORDER_RECEPIENT_NUMBER = "تعديل رقم الاستلام لطلبية",
}

export const permissionsArabicNames = {
  ADD_STORE: "اضافة متجر",
  ADD_CLIENT: " اضافة عميل",
  ADD_LOCATION: " اضافة منطقة",
  ADD_DELIVERY_AGENT: "اضافة مندوب",
  ADD_ORDER: " اضافة طلبة",
  DELETE_ORDER: " مسح طلبية",
  CHANGE_ORDER_STATUS: "تغيير حالة طلبية",
  CHANGE_CLOSED_ORDER_STATUS: "تغيير حالة طلبية مغلقة",
  CHANGE_ORDER_TOTAL_AMOUNT: "تعديل المبلغ الكلي لطلبية",
  LOCK_ORDER_STATUS: "قفل حالة طلبية",

  CHANGE_ORDER_DELIVERY_AGENT: "احالة طلبية من مندوب الي اخر",
  CHANGE_ORDER_BRANCH: "احالة طلبية من فرع الي اخر",
  CHANGE_ORDER_CLIENT: "احالة طلبية من عميل الي اخر",
  CHANGE_ORDER_COMPANY: "احالة طلبية من شركة الي اخرى",

  ADD_ORDERS_TO_REPOSITORY: "إدخال الطلبات للمخزن",
  SEND_ORDER_TO_REPOSITORY: "إرسال الطلبات للأفرع",
  ASSIGN_ORDERS_TO_AGENT: "توزيع الطلبات علي المندوب",

  CREATE_DELIVERY_AGENT_REPORT: "انشاء كشف مندوب",
  CREATE_CLIENT_REPORT: "انشاء كشف عميل",
  CREATE_REPOSITORY_REPORT: "انشاء كشف مخزن",
  CREATE_COMPANY_REPORT: "انشاء كشف شركة",
  CREATE_GOVERNMENT_REPORT: "انشاء كشف محافظة",
  CREATE_BRANCH_REPORT: "انشاء كشف فرع",

  DELETE_COMPANY_REPORT: "مسح كشف شركة",
  DELETE_REPOSITORY_REPORT: "مسح كشف مخزن",
  DELETE_GOVERNMENT_REPORT: "مسح كشف محافظة",
  DELETE_DELIVERY_AGENT_REPORT: "مسح كشف مندوب",
  DELETE_CLIENT_REPORT: "مسح كشف عميل",
  DELETE_BRANCH_REPORT: "مسح كشف فرع",
  CONFIRM_ORDER: "تأكيد طلب",

  CHANGE_ORDER_DATA: "تعديل بيانات طلبية",
  CHANGE_ORDER_PAID_AMOUNT: "تعديل المبلغ المدفوع لطلبية",
  CHANGE_ORDER_RECEIPT_NUMBER: "تعديل رقم الايصال لطلبية",
  CHANGE_ORDER_RECEPIENT_NUMBER: "تعديل رقم الاستلام لطلبية",
};

const branchManangerPermisions = {
  CHANGE_ORDER_STATUS: "تغيير حالة طلبية",
  CHANGE_ORDER_TOTAL_AMOUNT: "تعديل المبلغ الكلي لطلبية",
  CHANGE_ORDER_DATA: "تعديل بيانات طلبية",
};

const clientAssistantPermissions = {
  ADD_ORDER: "اضافه الطلبات",
  PRINT_ORDER: "طباعه الطلبات",
  SEND_ORDER: "ارسال للشحن",
  MESSAGES: "الرسائل",
  MANAGE_ORDERS: "متابعه الطلبات",
  MANAGE_REPORTS: "اداره الكشوفات",
  MANAGE_TICKETS: "اداره التذاكر",
};

export const permissionsArray: { label: string; value: string }[] =
  Object.entries(Permission).map(([value, label]) => ({
    label,
    value,
  }));

export const clientAssistantPermissionsArray: {
  label: string;
  value: string;
}[] = Object.entries(clientAssistantPermissions).map(([value, label]) => ({
  label,
  value,
}));
export const branchManagerPermissionsArray: { label: string; value: string }[] =
  Object.entries(branchManangerPermisions).map(([value, label]) => ({
    label,
    value,
  }));
