
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios'
 interface initialStateProps{
    user:{
        email:string | null,
        id:string| null,

    },
    error: string | null,
    isLoading:boolean,
    isAuthenticated:boolean
 }
const initialState:initialStateProps={
    user:{
        email:null,
        id:null,

    },
    error: null,
    isLoading:false,
    isAuthenticated:false
}

type loginProps={
email:string,
password:string,

}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: loginProps, thunkAPI) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      // Reject with a custom error message
      return thunkAPI.rejectWithValue(error.response.data.message);
}}
); 

const authSlice = createSlice({
name:"auth",
initialState,
reducers:{
    logout(state){
        state.isAuthenticated=false,
        state.user.email= null,
        state.user.id= null,
        state.error=null,
        state.isLoading=false
    },


},
extraReducers:(builder)=>{
builder.addCase(loginUser.pending, (state)=>{
    state.isLoading=true,
    state.error=null
}).addCase(loginUser.fulfilled, (state,action)=>{
    state.isAuthenticated= true,
    state.error= null
    state.user.email=action.payload.user.email
    state.user.id= action.payload.user.id

} ).addCase(loginUser.rejected, (state, action)=>{
    state.isAuthenticated=false,
    state.error =action.payload as string | null
})
}
})