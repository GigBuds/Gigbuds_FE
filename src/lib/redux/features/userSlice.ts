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
            state.roles = action.payload.roles || [];
        },
        setMemberships: (state, action: PayloadAction<Membership[]>) => {
            const memberships = action.payload;
            console.log(memberships);
            state.memberships = memberships;
            
        },
        setUserWithMemberships: (state, action: PayloadAction<{user: User, memberships: Membership[]}>) => {
            const { user, memberships } = action.payload;
            
            // Set user info
            state.id = user.id;
            state.firstName = user.firstName;
            state.lastName = user.lastName;
            state.phone = user.phone;
            state.birthDate = user.birthDate;
            state.isMale = user.isMale;
            state.name = user.name;
            state.email = user.email;
            state.roles = user.roles || [];
            
            // Set membership info
            state.memberships = memberships;
            
        },
        clearUserState(state) {
            state.id = null;
            state.firstName = null;
            state.lastName = null;
            state.phone = null;
            state.birthDate = null;
            state.isMale = null;
            state.name = null;
            state.email = null;
            state.roles = null;
            state.memberships = [];
        }
    },
})

export const { setUser, setMemberships, setUserWithMemberships, clearUserState } = userSlice.actions;
export const selectUser = (store: RootState) => store.persistedReducer.user;
export const selectUserId = (store: RootState) => store.persistedReducer.user.id;
export const selectMemberships = (store: RootState) => store.persistedReducer.user.memberships;
export const selectMembershipInfo = (store: RootState) => ({

    memberships: store.persistedReducer.user.memberships,
});
export default userSlice.reducer;
