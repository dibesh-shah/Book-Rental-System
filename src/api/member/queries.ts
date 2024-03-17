import { useMutation, useQuery } from "react-query";
import { MemberAddRequest } from "../../schema/member.schema";


import member from "./query-details";
import { makeHttpRequest } from "../../utils/http/make-http-request";
import { makeExcelRequest } from "../../utils/http/make-excel-request";


const { fetchMember, addMember, editMember, deleteMember, downloadMember, uploadMember, fetchMemberById } = member;

export const useFetchMember = () => {
  return useQuery([fetchMember.queryKeyName], () => {
    return makeHttpRequest(fetchMember);
  });
};

export const useAddMember = () => {
   return useMutation((requestData:MemberAddRequest)=> {
    return makeHttpRequest(addMember,{
        requestData
    });
   });
};

export const useEditMember = () => {
   return useMutation((requestData:MemberAddRequest)=> {
    return makeHttpRequest(editMember,{
        requestData
    });
   });
};

export const useDeleteMember = () => {
   return useMutation((memberId:number)=> {
    return makeHttpRequest(deleteMember,{
      params:{
        id:memberId
      }  
    });
   });
};

export const useDownloadMember = () => {
  return useMutation(()=> {
    return makeExcelRequest(downloadMember);
   });
};

export const useUploadMember = () => {
  return useMutation((requestData:any)=> {
   return makeExcelRequest(uploadMember,{
       requestData
   });
  });
};

export const useFetchMemberById = () =>{
  return useMutation((memberId:number)=> {
    return makeHttpRequest(fetchMemberById,{
      params:{
        id:memberId
      }  
    });
   });
};