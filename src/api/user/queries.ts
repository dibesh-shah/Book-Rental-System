import { useMutation, useQuery } from "react-query";
import { AuthorAddRequest } from "../../schema/author.schema";

import { makeHttpRequest } from "../../utils/http/make-http-request";
import user from "./query-details";

const { addUser, fetchUser, reactivateUser, deactivateUser, resetUser } = user;

export const useFetchUser = () => {
  return useQuery([fetchUser.queryKeyName], () => {
    return makeHttpRequest(fetchUser);
  });
};

export const useAddUser = () => {
  return useMutation((requestData: AuthorAddRequest) => {
    return makeHttpRequest(addUser, {
      requestData,
    });
  });
};

export const useReactivateUser = () => {
  return useMutation((userId: number) => {
    return makeHttpRequest(reactivateUser, {
      params: {
        id: userId,
      },
    });
  });
};

export const useDeactivateUser = () => {
  return useMutation((userId: number) => {
    return makeHttpRequest(deactivateUser, {
      params: {
        id: userId,
      },
    });
  });
};

export const useResetUser = () => {
  return useMutation((requestData) => {
    return makeHttpRequest(resetUser, {
      requestData,
    });
  });
};
