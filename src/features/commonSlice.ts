import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//declare types for state
interface CommonState {
  isSigned: boolean;
  connectedChain: null | "solana" | "evm";
  allCountryList: string[];
}

const initialState: CommonState = {
  isSigned: false,
  connectedChain: null,
  allCountryList: [],
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    changeSignState: (
      state,
      action: PayloadAction<{
        isSigned: typeof initialState.isSigned;
        connectedChain: typeof initialState.connectedChain;
      }>
    ) => {
      state.isSigned = !!action.payload.isSigned;
      state.connectedChain = action.payload.connectedChain;
    },
    setCountryList: (state, action: PayloadAction<any[]>) => {
      state.allCountryList = action.payload;
    },
  },
});

export const { changeSignState, setCountryList } = commonSlice.actions;

export default commonSlice.reducer;
