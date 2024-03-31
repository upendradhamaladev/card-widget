import { Button } from "../shared/Button";
import React, { FC, useState } from "react";
import { ZebecCardLeft, ZebecCardRight } from "../assets";
import { useForm } from "react-hook-form";
import {
  CustomInputField,
  CustomTextAreaField,
} from "../shared/inputs/CustomInputForm";
import { useStep } from "../hooks";
import api from "../lib/api";
import { useAppDispatch } from "../hooks";
import { toast } from "../features/toasts/toastsSlice";
export type FormValue = {
  subject: string;
  message: string;
  email: string;
};

const ProblemReport = () => {
  const { step, setStep } = useStep();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValue>();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: FormValue) => {
    try {
      setLoading(true);
      const res = await api.post(`/support`, values);
      dispatch(toast.success({ message: "Problem reported successfully" }));
      setLoading(false);
      reset();
    } catch (error) {
      console.log("error during submit", error);
      setLoading(false);
    }
  };
  return (
    <div className="landing-step relative step rounded-[4px] w-full max-w-[572px] p-8 bg-zebec-card-background-primary">
      <div className="absolute left-0 -top-[18px] -z-10 flex items-center gap-2">
        <img src={ZebecCardLeft} alt="Zebec Card Left" className="w-[360px]" />
      </div>
      <div className="absolute right-0 -top-[18px] -z-10 flex items-center gap-2">
        <img
          src={ZebecCardRight}
          alt="Zebec Card Right"
          className="w-[360px]"
        />
      </div>
      <div className="px-2 py-2">
        <p className="text-zebec-card-content-primary text-[28px] leading-8 font-semibold">
          Report a Problem
        </p>
        <p className="mt-3 text-zebec-card-content-tertiary text-sm">
          Payments for gift cards are made in USDC deducted from your wallet.
          Make sure you have suffient USDC funds in your wallet.
        </p>
        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <CustomInputField
            label={"Subject"}
            type={"text"}
            name={"subject"}
            placeholder={"Enter a subject"}
            register={register}
            errors={errors}
            after={true}
            validation={{
              required: {
                value: true,
                message: "Subject is required",
              },
            }}
            disable={loading}
          />
          <div className="mt-5">
            <CustomInputField
              label={"Email"}
              type={"text"}
              name={"email"}
              placeholder={"Enter email"}
              register={register}
              after={true}
              errors={errors}
              validation={{
                required: {
                  value: true,
                  message: "Recipient email address is required",
                },
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi,
                  message: "Invalid email address",
                },
              }}
              disable={loading}
            />
          </div>

          <div className="mt-5">
            <CustomTextAreaField
              label={"Message"}
              type={"text"}
              name={"message"}
              placeholder={"Message Here"}
              register={register}
              after={true}
              errors={errors}
              validation={{
                required: {
                  value: true,
                  message: "Message is required",
                },
              }}
              disable={loading}
            />
          </div>

          <Button
            title="Submit"
            className="w-full mt-6"
            loading={loading}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default ProblemReport;
