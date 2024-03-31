import React, { FC } from "react";
import * as Images from "../assets";
import { Button } from "../shared/Button";
import { StepProps } from "../types";
import { useFormHook, useStep } from "../hooks";
const LandingStep = () => {
  const { step, setStep } = useStep();
  const { formValues } = useFormHook();

  return (
    <div className="landing-step step rounded-[4px] w-full max-w-[572px] p-8 bg-zebec-card-background-primary">
      <img
        src={Images.ZebecCardStack}
        className="w-[500px]"
        alt="Cards Stack"
      />

      <p className="mt-[42px] text-zebec-card-content-primary text-[28px] leading-8 font-semibold text-center">
        Offramp your crypto asset with Zebec Instant Card
      </p>
      <p className="mt-3 text-center text-zebec-card-content-primary text-sm">
        Receive prepaid Visa/Mastercard gift cards with zero percent fee
      </p>
      <Button
        title="Get Started"
        className="w-full mt-6"
        disabled={!formValues.available}
        onClick={() => setStep(2)}
      />
    </div>
  );
};

export default LandingStep;
