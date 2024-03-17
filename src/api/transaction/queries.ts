import { useMutation, useQuery } from "react-query";

import { makeHttpRequest } from "../../utils/http/make-http-request";
import { makeExcelRequest } from "../../utils/http/make-excel-request";
import transaction from "./query-details";

const {
  fetchActiveTransaction,
  fetchAllTransaction,
  updateTransaction,
  addTransaction,
  deleteTransaction,
  findTransactionById,
  downloadTransaction,
  uploadTransaction,
  mailTransaction,
} = transaction;

export const useFetchAllTransaction = (
  pageNumber: number,
  pageSize: number,
  fromDate: string,
  toDate: string
) => {
  return useQuery([fetchAllTransaction.queryKeyName, pageNumber, pageSize, fromDate, toDate], () => {
    return makeHttpRequest(fetchAllTransaction, {
      params: {
        page: pageNumber,
        pageSize,
        fromDate,
        toDate,
      },
    });
  });
};

export const useFetchTransaction = () => {
  return useQuery([fetchActiveTransaction.queryKeyName], () => {
    return makeHttpRequest(fetchActiveTransaction);
  });
};

export const useAddTransaction = () => {
  return useMutation((requestData) => {
    return makeHttpRequest(addTransaction, {
      requestData,
    });
  });
};

export const useUpdateTransaction = () => {
  return useMutation((requestData) => {
    return makeHttpRequest(updateTransaction, {
      requestData,
    });
  });
};

export const useDeleteTransaction = () => {
  return useMutation((transactionId: number) => {
    return makeHttpRequest(deleteTransaction, {
      params: {
        id: transactionId,
      },
    });
  });
};

export const useDownloadTransaction = () => {
  return useMutation(() => {
    return makeExcelRequest(downloadTransaction);
  });
};

export const useFindTransactionById = () => {
  return useMutation((transactionId: number) => {
    return makeHttpRequest(findTransactionById, {
      params: {
        id: transactionId,
      },
    });
  });
};

export const useUploadTransaction = () => {
  return useMutation((requestData) => {
    return makeExcelRequest(uploadTransaction, {
      requestData,
    });
  });
};

export const useMailTransaction = () => {
    return useMutation( () => {
      return makeHttpRequest(mailTransaction);
    });
  };
  