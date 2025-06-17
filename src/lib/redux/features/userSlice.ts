import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User } from "@/types/sidebar.types";

export interface Membership {
    Id: number;
    Title: string;
    Type: string;
    StartDate: string;
    EndDate: string;
    Status: string;
    MembershipId: number;
}

export interface UserState {
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    birthDate: Date | null;
    isMale: boolean | null;
    name: string | null;
    email: string | null;
    roles: string[] | null;
    memberships: Membership[] | null; // Add this line
}

const initialState: UserState = {
    id: null,
    firstName: null,
    lastName: null,
    phone: null,
    birthDate: null,
    isMale: null,
    name: null,
    email: null,
    roles: null,
    memberships: null, // Add this line
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.id = action.payload.id;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.phone = action.payload.phone;
            state.birthDate = action.payload.birthDate;
            state.isMale = action.payload.isMale;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.roles = action.payload.roles;
            state.memberships = action.payload.memberships; // Add this line
        },
        clearUserState: (state) => {
            return initialState;
        },
    },
})

export const { setUser, clearUserState } = userSlice.actions;
export const selectUser = (store: RootState) => store.persistedReducer.user;
export default userSlice.reducer;
