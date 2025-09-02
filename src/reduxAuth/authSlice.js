import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import * as CONSTANTS from "../CONSTANTS";
import axios from "axios";

//Get user from localStorage
const user = JSON.parse(localStorage.getItem(CONSTANTS.SESSION_COOKIE))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}
///////////////////////////
//Register user
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try{
     
        const response = await axios.post(CONSTANTS.API_URL + "auth/register/", user);

        console.log(response);
        localStorage.setItem(CONSTANTS.SESSION_COOKIE, JSON.stringify(response.data));
        return response;
    }catch(error){
        console.log("<-------------  REGISTER ERROR ------------->");
        console.log(error);
        //const message = (error.response && error.response.data && error.data.message) || error.message || error.toString()
        const message = error.response.data
        return thunkAPI.rejectWithValue(message)
    }
})
////////////////////////////////
//Login user 
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try{

        const response = await axios.post(CONSTANTS.API_URL + "auth/login", user);

        console.log("LOGIN ------------->");
        console.log(response);
        localStorage.setItem(CONSTANTS.SESSION_COOKIE, JSON.stringify(response.data));

        return response; 
    }catch(error){
        console.log("ERRRR");
        console.log(error);
       // const message = (error.response && error.response.data && error.data.message) || error.message || error.toString()
       const message = error.response.data 
        return thunkAPI.rejectWithValue(message)
    }
})

//Logout user 
export const logout = createAsyncThunk('auth/logout', async () => {
        console.log("LOGOUT ------------->");
        localStorage.removeItem(CONSTANTS.SESSION_COOKIE);
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
        updateUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload.data
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload.data
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
    }
})

export const { reset, updateUser } = authSlice.actions
export default authSlice.reducer