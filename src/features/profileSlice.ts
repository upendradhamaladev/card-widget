import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProfileProps = {
  session_expiry: boolean;
  walletModal: boolean;
  showTransactionProcessing: boolean;
  step?: number;
};
const initialState: ProfileProps = {
  session_expiry: false,
  walletModal: false,
  showTransactionProcessing: false,
  step: 1,
};
interface TransactionProcessingProps {
  showTransactionProcessingModal: boolean;
  step?: number;
}
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setSessionExpiry: (state, action: PayloadAction<boolean>) => {
      state.session_expiry = action.payload;
    },

    setWalletModal: (state, action: PayloadAction<boolean>) => {
      state.walletModal = action.payload;
    },

    showTransactionProcessingModal: (
      state,
      action: PayloadAction<TransactionProcessingProps>
    ) => {
      state.showTransactionProcessing =
        action.payload.showTransactionProcessingModal;
      state.step = action.payload.step ? action.payload.step : 1;
    },
  },
});

export const {
  setSessionExpiry,

  setWalletModal,
  showTransactionProcessingModal,
} = profileSlice.actions;

export default profileSlice.reducer;
