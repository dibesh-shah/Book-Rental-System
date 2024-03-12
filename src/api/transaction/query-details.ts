import { RequestAuthType, RequestMethodEnum } from "../../schema/http.schema";

const transaction = {
  fetchAllTransaction: {
    controllerName: `lib/transactions/get-transactions-history`,
    queryKeyName: `FETCH_ALL_TRANSACTION`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  fetchActiveTransaction: {
    controllerName: `lib/transactions/get-all-transactions`,
    queryKeyName: `FETCH_TRANSACTION`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  addTransaction: {
    controllerName: `lib/transactions/add-transaction`,
    queryKeyName: `ADD_TRANSACTION`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  deleteTransaction: {
    controllerName: `lib/transactions/delete-transaction`,
    queryKeyName: `DELETE_TRANSACTION`,
    requestMethod: RequestMethodEnum.DELETE,
    requestAuthType: RequestAuthType.AUTH,
  },

  updateTransaction: {
    controllerName: `lib/transactions/update-transaction`,
    queryKeyName: `UPDATE_TRANSACTION`,
    requestMethod: RequestMethodEnum.PUT,
    requestAuthType: RequestAuthType.AUTH,
  },

  findTransactionById: {
    controllerName: `lib/transactions/get-by-id`,
    queryKeyName: `FIND_TRANSACTION`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  downloadTransaction: {
    controllerName: `lib/transactions/download-transactions`,
    queryKeyName: `DOWNLOAD_TRANSACTION`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  uploadTransaction: {
    controllerName: `lib/transactions/export-to-db`,
    queryKeyName: `UPLOAD_TRANSACTION`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  mailTransaction: {
    controllerName: `lib/transactions/send-due-date-mail`,
    queryKeyName: `MAIL_DUE`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },
};

export default transaction;
