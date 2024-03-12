export interface IApiDetails {
  queryKeyName: string;
  controllerName: string;
  requestMethod?: RequestMethodEnum;
  requestBodyType?: RequestBodyType;
  requestAuthType?: RequestAuthType;
}

export enum RequestMethodEnum {
  GET = "GET",
  DELETE = "DELETE",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  PURGE = "PURGE",
  LINK = "LINK",
  UNLINK = "UNLINK",
}

export enum RequestBodyType {
  QUERYSTRING = "QUERY-STRING",
  FORMDATA = "FORM-DATA",
  FILE = "FILE",
}

export enum RequestAuthType {
  AUTH = "AUTH",
  NOAUTH = "NO-AUTH",
  NOBASICAUTH = "NO-BASIC-AUTH",
}

export interface IApiRequestDetails {
  requestData?: any;
  pathVariables?: { [key: string]: Primitive };
  params?: RequestParam;
}

export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK";

export type Primitive = string | boolean | number;

export interface RequestParam {
  [key: string]: Primitive | undefined;
}
