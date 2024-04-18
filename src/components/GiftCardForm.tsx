import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../shared/Button";
import { ZebecCardLeft, ZebecCardRight } from "../assets";
import { useForm } from "react-hook-form";
import { useFormHook } from "../hooks";
import { giftCardForm } from "./gift-card-form-value";
import {
  CustomDropDownSelect,
  CustomInputField,
  CustomVisaCardDropDownSelect,
} from "../shared/inputs/CustomInputForm";

import { useStep } from "../hooks";
import { useAppSelector } from "../hooks";
import { useClickOutside } from "../hooks/useClickOutside";
import socket from "../lib/websocket.service";
export type FormValue = {
  receiver: string;
  country: string;
  amount: string;
  productId: number | string;
  quantity: string;
  promo?: string;
  currency: string;
};

const GiftCardForm = () => {
  const { setFormValues, formValues } = useFormHook();
  const getvalue = (name: any) => {
    return getValues(name);
  };
  const [openCardDescription, setCardDescription] = useState(false);
  const { step, setStep } = useStep();

  const { allCountryList } = useAppSelector((state) => state.common);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormValue>();

  const getGiftCardForm = useMemo(() => {
    return giftCardForm;
  }, []);
  const [visaCardList, setVisaCardList] = useState<any[]>([]);

  const listCards = (message: any) => {
    setVisaCardList(message);
  };

  useEffect(() => {
    if (getvalue("country") && getvalue("currency") && socket) {
      socket.emit("listCards", {
        country: getvalue("country"),
        currency: getvalue("currency"),
      });
    }
  }, [watch("country"), watch("currency")]);

  useEffect(() => {
    if (socket) {
      socket.on("listCards", listCards);
    }
  }, [socket]);
  const selectedCardDetail = useMemo(() => {
    return visaCardList.length > 0
      ? visaCardList.filter((data) => data.productId === getvalue("productId"))
      : [];
  }, [watch("productId"), visaCardList]);

  const onSubmit = async (values: FormValue) => {
    setStep(3);

    const restriction = selectedCardDetail[0]?.valueRestrictions;
    setFormValues((prev) => {
      return {
        ...prev,
        ...values,
        maxValMinVal: {
          maxVal:
            restriction.maxVal > formValues?.maxValMinVal?.maxVal
              ? formValues?.maxValMinVal?.maxVal
              : restriction.maxVal,
          minVal:
            restriction.minVal < formValues?.maxValMinVal?.minVal
              ? formValues?.maxValMinVal?.minVal
              : restriction.minVal,
        },
      };
    });
  };
  const descRef = useRef(null);

  useClickOutside(descRef, {
    onClickOutside: () => {
      setCardDescription(false);
    },
  });

  useEffect(() => {
    setValue("receiver", formValues.receiver);
    setValue("country", formValues.country);
    setValue("currency", formValues.currency);
  }, [formValues]);
  useEffect(() => {
    // if(formValues)
    if (visaCardList.length === 0) {
      setValue("productId", "");
    } else {
      setValue("productId", formValues.productId);
    }
  }, [formValues, visaCardList, step]);

  return (
    <div className="landing-step relative step rounded-[4px] w-full max-w-[572px] p-8 bg-zebec-card-background-primary">
      {/* images section */}
      <div className="absolute left-0 -top-[21px] -z-10 flex items-center gap-2">
        <img src={ZebecCardLeft} alt="Zebec Card Left" className="w-[360px]" />
      </div>
      <div className="absolute right-0 -top-[21px] -z-10 flex items-center gap-2">
        <img
          src={ZebecCardRight}
          alt="Zebec Card Right"
          className="w-[360px]"
        />
      </div>
      <p
        className="
      text-zebec-card-content-primary text-[28px] leading-8 font-semibold"
      >
        Buy a Gift Card
      </p>
      <p className="mt-3 text-zebec-card-content-tertiary text-sm">
        Payments for gift cards are made in USDC deducted from your MetaMask
        wallet. Make sure you have sufficient USDC funds in your MetaMask
        wallet.
      </p>
      <div className="mt-8">
        <form action="" className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            {getGiftCardForm.map((data, index) => {
              const { label, type, name, placeholder, validation, col, after } =
                data;
              return (
                <div className={`${col}`} key={index}>
                  {data.name === "country" || data.name === "currency" ? (
                    <>
                      <CustomDropDownSelect
                        label={label}
                        name={name}
                        validation={validation}
                        register={register}
                        setValue={setValue}
                        value={getvalue(name)}
                        clearErrors={clearErrors}
                        errors={errors}
                        dropdown={
                          data.name === "country"
                            ? allCountryList.length &&
                              allCountryList.map((data) => {
                                return {
                                  name: data,
                                  code: data,
                                };
                              })
                            : [
                                {
                                  name: "USD",
                                  code: "USD",
                                },
                                {
                                  name: "EUR",
                                  code: "EUR",
                                },
                              ]
                        }
                        placeholder={placeholder}
                        after={after}
                        optionPosition={data.name === "country" ? true : false}
                      />
                    </>
                  ) : data.name === "productId" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <CustomVisaCardDropDownSelect
                          label={label}
                          name={name}
                          validation={validation}
                          register={register}
                          setValue={setValue}
                          value={
                            getvalue(name)
                              ? getvalue(name)
                              : formValues.productId
                          }
                          clearErrors={clearErrors}
                          errors={errors}
                          dropdown={
                            visaCardList.length
                              ? visaCardList.map((data) => {
                                  return {
                                    name: data?.brandName,
                                    code: data?.productId,
                                  };
                                })
                              : []
                          }
                          placeholder={placeholder}
                          after={after}
                          optionPosition={
                            data.name === "productId" ? true : false
                          }
                          col="flex-1"
                          cardList={true}
                        />
                        {getvalue("productId") ? (
                          <div
                            className="translate-y-3  relative z-[1000]"
                            ref={descRef}
                          >
                            <div
                              className="absolute z-[1000] flex-shrink max-h-52 overflow-auto transition-all duration-300 ease-in-out p-4 w-[200px] sm:w-[350px] bg-white rounded-xl border border-outline top-6 right-0"
                              dangerouslySetInnerHTML={{
                                __html:
                                  selectedCardDetail[0]?.productDescription,
                              }}
                              style={{
                                display: openCardDescription ? "block" : "none",
                              }}
                            ></div>
                            <button
                              type="button"
                              onClick={() => {
                                setCardDescription((preval) => !preval);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 text-gray-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                />
                              </svg>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <>
                      {
                        <>
                          <CustomInputField
                            label={label}
                            type={type}
                            name={name}
                            validation={validation}
                            register={register}
                            errors={errors}
                            placeholder={placeholder}
                            after={after}
                          />
                        </>
                      }
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <Button title="Continue" className="w-full mt-6" />
        </form>
      </div>

      <Button
        variant="secondary"
        title="Cancel"
        onClick={() => {
          setStep(1);
          setFormValues((prev) => {
            return {
              ...prev,
              receiver: "",
              country: "",
              productId: "",
              currency: "",
              amount: "",
              token: null,
              tokenAmount: "",
              connectedWallet: "",
              maxValMinVal: {
                maxVal: 0,
                minVal: 0,
              },
            };
          });
        }}
        className="w-full mt-3"
      />
    </div>
  );
};

export default GiftCardForm;
