export const giftCardForm = [
  {
    label: "Email Address",
    type: "text",
    name: "receiver",
    after: true,
    placeholder: "email@example.com",
    validation: {
      required: {
        value: true,
        message: "Recipient email address is required",
      },
      pattern: {
        value:
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi,
        message: "Invalid email address",
      },
    },
  },
  {
    label: "Country",
    type: "text",
    after: true,
    name: "country",
    placeholder: "",
    col: "hidden",
    validation: {
      required: {
        value: true,
        message: "Country is required.",
      },
    },
  },
  {
    label: "Country",
    type: "text",
    name: "country",
    after: true,
    placeholder: "Choose a country",
    col: "col-span-2",
  },

  {
    label: "Currency",
    type: "text",
    after: false,
    name: "currency",
    placeholder: "",
    col: "hidden",
    validation: {
      required: {
        value: true,
        message: "Currency is required.",
      },
    },
  },
  {
    label: "Select Currency",
    type: "text",
    name: "currency",
    after: true,
    placeholder: "Choose a currency",
    col: "col-span-2",
    validation: {
      required: {
        value: true,
        message: "Currency is required.",
      },
    },
  },

  {
    label: "Card Type",
    type: "text",
    after: true,
    name: "productId",
    placeholder: "",
    col: "hidden",
    validation: {
      required: {
        value: true,
        message: "Card Type is required.",
      },
    },
  },
  {
    label: "Card Type",
    type: "text",
    name: "productId",
    after: true,
    placeholder: "Select Card Type",
    validation: {
      required: {
        value: true,
        message: "Card Type is required.",
      },
    },
    col: "col-span-2",
  },
];
