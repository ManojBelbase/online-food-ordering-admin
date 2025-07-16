import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../constants/constant';
// login using RTK Query (currently not used)
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
                    console.log('Login successful:', result.data);
                }catch(error){
                    console.log('Login error:', error);
                }
            }
        })
    })
})

export const {useRegisterUserMutation, useLoginUserMutation} = authApi;