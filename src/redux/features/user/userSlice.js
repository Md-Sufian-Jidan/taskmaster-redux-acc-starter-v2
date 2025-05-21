import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from '../../../utils/firebase.config';
const initialState = {
  name: '',
  email: '',
  isLoading: true,
  isError: false,
  error: "",
};

export const createUser = createAsyncThunk("userSlice/createUser",
  async ({ email, password, name }) => {
    const data = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, {
      displayName: name,
    })
    return {
      email: data.user.email,
      name: data.user.displayName,
    };
  });

export const loginUser = createAsyncThunk("userSlice/loginUser",
  async ({ email, password }) => {
    const data = await signInWithEmailAndPassword(auth, email, password);
    return {
      name: data.user.displayName,
      email: data.user.email
    }
  });

export const googleLogin = createAsyncThunk("userSlice/googleLogin", async () => {
  const provider = new GoogleAuthProvider();
  const data = await signInWithPopup(auth, provider);
  console.log(data);
  return {
    name: data.user.displayName,
    email: data.user.email,
  }
});

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.name = payload.name,
        state.email = payload.email
    },
    toggleLoading: (state, { payload }) => {
      state.isLoading = payload
    },
    logout: (state) => {
      state.name = "",
        state.email = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.name = "";
        state.email = "";
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        state.name = payload.name;
        state.email = payload.email;
        state.isLoading = false;
        state.isError = false;
        state.error = "";
      })
      .addCase(createUser.rejected, (state, action) => {
        state.name = "";
        state.email = "";
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.name = "";
        state.email = "";
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.name = payload.name;
        state.email = payload.email;
        state.isLoading = false;
        state.isError = false;
        state.error = "";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.name = "";
        state.email = "";
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(googleLogin.pending, (state) => {
        state.name = "";
        state.email = "";
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(googleLogin.fulfilled, (state, { payload }) => {
        state.name = payload.name;
        state.email = payload.email;
        state.isLoading = false;
        state.isError = false;
        state.error = "";
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.name = "";
        state.email = "";
        state.isLoading = false;
        state.isError = true;
        state.error = action?.error.message || "Something went wrong";
      });
  },
});

export const { setUser, toggleLoading, logout } = userSlice.actions;
export default userSlice.reducer;
