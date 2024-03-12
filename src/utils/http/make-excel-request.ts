import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { BASE_API_ENDPOINT } from "../../config/api.config";
import {
  IApiDetails,
  IApiRequestDetails,
  RequestAuthType,
} from "../../schema/http.schema";
import { sanitizeController } from "./sanitize-controller";

const getToken = () => {
  return localStorage.getItem("bookRental");
};

const token = getToken();

export const makeExcelRequest = async (
  apiDetails: IApiDetails,
  apiRequestDetails: IApiRequestDetails = {}
) => {
  const sanitizedRequestDetails = sanitizeController(
    apiDetails,
    apiRequestDetails.pathVariables
  );
  const { controllerName, requestMethod } = sanitizedRequestDetails;

  let headers: any = {
    "Content-Type": "multipart/form-data",
    "Accept" : "*/*",
  };

  if (apiDetails.requestAuthType === RequestAuthType.AUTH) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let config: AxiosRequestConfig = {
    baseURL: BASE_API_ENDPOINT,
    url: `/${controllerName}`,
    method: requestMethod,
    responseType: "blob",
    headers,
    data: apiRequestDetails.requestData,
  };

  if (apiRequestDetails.params) {
    config = {
      ...config,
      params: apiRequestDetails.params,
    };
  }

  try {
    const res = await axios.request(config);
    return res.data;
  } catch (error) {
    let errorMsg = "";

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      errorMsg = error.response?.data?.message || axiosError.message;
    } else {
      errorMsg = "something went wrong";
    }

    throw new Error(errorMsg);
  }
};
