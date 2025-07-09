import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../constant/constant';
export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
    baseUrl:API_BASE_URL,
    credentials:"include",
    }),
    endpoints:(builder)=>({
        registerUser:builder.mutation({
            query:(userData)=>({
                url:"auth/register",
                method:"POST",
                body:userData,
            })
        }),
        loginUser:builder.mutation({
            query:(userData)=>({
                url:"auth/login",
                method:"POST",
                body:userData,
            }),
            async onQueryStarted(_,{queryFulfilled}){
                try{
                    const result = await queryFulfilled;
                    // Since you're using loginUser thunk, you don't need to dispatch here
                    // The thunk handles the state updates automatically
                    console.log('Login successful:', result.data);
                }catch(error){
                    console.log('Login error:', error);
                }
            }
        })
    })
})

export const {useRegisterUserMutation, useLoginUserMutation} = authApi;