import { useMutation, useQuery } from "react-query";

import category from "./query-details";
import { makeHttpRequest } from "../../utils/http/make-http-request";
import { makeExcelRequest } from "../../utils/http/make-excel-request";
import { CategoryAddRequest } from "../../schema/category.schema";


const { fetchCategory, addCategory,editCategory,deleteCategory,downloadCategory,uploadCategory, fetchCategoryById } = category;

export const useFetchCategory = () => {
  return useQuery([fetchCategory.queryKeyName], () => {
    return makeHttpRequest(fetchCategory);
  });
};

export const useAddCategory = () => {
   return useMutation((requestData:CategoryAddRequest)=> {
    return makeHttpRequest(addCategory,{
        requestData
    });
   });
};

export const useEditCategory = () => {
   return useMutation((requestData:CategoryAddRequest)=> {
    return makeHttpRequest(editCategory,{
        requestData
    });
   });
};

export const useDeleteCategory = () => {
   return useMutation((categoryId:number)=> {
    return makeHttpRequest(deleteCategory,{
      params:{
        id:categoryId
      }  
    });
   });
};

export const useDownloadCategory = () => {
  return useMutation(()=> {
    return makeExcelRequest(downloadCategory);
   });
};

export const useUploadCategory = () => {
  return useMutation((requestData:any)=> {
   return makeExcelRequest(uploadCategory,{
       requestData
   });
  });
};

export const useFetchCategoryById = () =>{
  return useMutation((categoryId:number)=> {
    return makeHttpRequest(fetchCategoryById,{
      params:{
        id:categoryId
      }  
    });
   });
};