export const transactionStepForm = [
  {
    label: "Amount (USD)",
    type: "text",
    name: "amount",
    after: true,
    placeholder: "10",
    validation: {
      required: {
        value: true,
        message: "Card Value is required",
      },
      pattern: {
        value: /^\d*\.?\d+$/gi,
        message: "Amount must be positive.",
      },
    },
  },
  ,
  {
    label: "Token Type",
    type: "text",
    name: "tokenType",
    after: true,
    placeholder: "Choose a Token",
    col: "col-span-2",
  },
  {
    label: "Token Amount",
    type: "text",
    name: "tokenAmount",
    // after: true,
    // placeholder: "10",
    validation: {
      //   required: {
      //     value: true,
      //     message: "Card Value is required",
      //   },
      pattern: {
        value: /^\d*\.?\d+$/gi,
        message: "Amount must be positive.",
      },
    },
  },
];
