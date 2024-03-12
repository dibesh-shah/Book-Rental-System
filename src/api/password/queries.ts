import { useMutation} from "react-query";
import { makeHttpRequest } from "../../utils/http/make-http-request";
import password from "./query-details";

const { generateOTP, resetPassword } = password;

export const useGenerateOTP = () => {
  return useMutation((requestData: any) => {
    return makeHttpRequest(generateOTP, {
      requestData,
    });
  });
};


export const useResetPassword = () => {
  return useMutation((requestData: any) => {
    return makeHttpRequest(resetPassword, {
      requestData,
    });
  });
};

