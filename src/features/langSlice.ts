import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

interface langg {
  ilk: string;
  son: string;
}

export const translateText = createAsyncThunk(
  "login/getLoginAsync",
  async ({ dil, text }: { dil: langg; text: string }) => {
    const url = "https://text-translator2.p.rapidapi.com/translate";

    const headers = {
      "x-rapidapi-key": "00d41e70a2mshe65f808187f1a2cp117c6cjsn6b27cfecc6c3",
      "x-rapidapi-host": "text-translator2.p.rapidapi.com",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const params = new URLSearchParams();
    params.append("source_language", `${dil.ilk}`);
    params.append("target_language", `${dil.son}`);
    params.append("text", `${text}`);

    try {
      const response = await axios.post(url, params, { headers });
      // console.log(response.headers["x-ratelimit-characters-remaining"]);
      // console.log(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
);

export interface UserState {
  sonuc: string;
  karakter: number | string;
  loading: boolean;
  error: boolean;
}

const initialState: UserState = {
  sonuc: "",
  karakter: "?",
  loading: false,
  error: false,
};

const textSlice = createSlice({
  name: "text",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(translateText.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(
        translateText.fulfilled,
        (state, { payload }: { payload: AxiosResponse<any, any> | any }) => {
          state.sonuc = payload.data.data.translatedText;
          state.karakter = payload.headers["x-ratelimit-characters-remaining"];
          state.loading = false;
          state.error = true;
        }
      )
      .addCase(translateText.rejected, (state) => {
        state.loading = false;
        state.error = false;
      });
  },
});

export default textSlice.reducer;
