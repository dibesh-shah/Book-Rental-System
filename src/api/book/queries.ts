import { useMutation, useQuery } from "react-query";

import { makeHttpRequest } from "../../utils/http/make-http-request";
import { makeExcelRequest } from "../../utils/http/make-excel-request";
import book from "./query-details";

const {fetchBook, addBook, editBook, deleteBook, fetchBookById} = book;

export const useFetchBook = () => {
  return useQuery([fetchBook.queryKeyName], () => {
    return makeHttpRequest(fetchBook);
  });
};

export const useAddBook = () => {
   return useMutation((requestData)=> {
    return makeExcelRequest(addBook,{
        requestData
    });
   });
};

export const useEditBook = () => {
   return useMutation((requestData)=> {
    return makeHttpRequest(editBook,{
        requestData
    });
   });
};

export const useDeleteBook = () => {
   return useMutation((bookId:number)=> {
    return makeHttpRequest(deleteBook,{
      params:{
        id:bookId
      }  
    });
   });
};

// export const useDownloadBook = () => {
//   return useMutation(()=> {
//     return makeExcelRequest(downloadBook);
//    });
// };

export const useFetchBookById = () =>{
  return useMutation((bookId:number)=> {
    return makeHttpRequest(fetchBookById,{
      params:{
        id:bookId
      }  
    });
   });
};