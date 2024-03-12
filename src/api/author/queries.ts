import { useMutation, useQuery } from "react-query";
import { AuthorAddRequest } from "../../schema/author.schema";


import author from "./query-details";
import { makeHttpRequest } from "../../utils/http/make-http-request";
import { makeExcelRequest } from "../../utils/http/make-excel-request";


const { fetchAuthor, addAuthor, editAuthor, deleteAuthor, downloadAuthor, uploadAuthor, fetchAuthorById } = author;

export const useFetchAuthor = () => {
  return useQuery([fetchAuthor.queryKeyName], () => {
    return makeHttpRequest(fetchAuthor);
  });
};

export const useAddAuthor = () => {
   return useMutation((requestData:AuthorAddRequest)=> {
    return makeHttpRequest(addAuthor,{
        requestData
    });
   });
};

export const useEditAuthor = () => {
   return useMutation((requestData:AuthorAddRequest)=> {
    return makeHttpRequest(editAuthor,{
        requestData
    });
   });
};

export const useDeleteAuthor = () => {
   return useMutation((authorId:number)=> {
    return makeHttpRequest(deleteAuthor,{
      params:{
        id:authorId
      }  
    });
   });
};

export const useDownloadAuthor = () => {
  return useMutation(()=> {
    return makeExcelRequest(downloadAuthor);
   });
};

export const useUploadAuthor = () => {
  return useMutation((requestData:any)=> {
   return makeExcelRequest(uploadAuthor,{
       requestData
   });
  });
};

export const useFetchAuthorById = () =>{
  return useMutation((authorId:number)=> {
    return makeHttpRequest(fetchAuthorById,{
      params:{
        id:authorId
      }  
    });
   });
};