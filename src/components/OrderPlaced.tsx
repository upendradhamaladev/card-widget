import NewCheckIcon from "../assets/icons/other-icons/new-check.svg";
import WalletIcon from "../assets/icons/other-icons/new-wallet.svg";
import { ZebecCardLeft, ZebecCardRight } from "../assets";
import * as Images from "../assets";
import { toSubstring } from "../utils/toSubstring";
import CopyButton from "../shared/CopyButton";
import { useFormHook, useStep } from "../hooks";
import { Button } from "../shared/Button";

const OrderPlaced = () => {
  const { step, setStep } = useStep();
  const { setFormValues, formValues } = useFormHook();

  return (
    <div className="landing-step relative step rounded-[4px] w-full max-w-[572px] p-8 bg-zebec-card-background-primary">
      {/* images section */}
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
      <div className="relative ">
        <img
          src={Images.ZebecCardFront}
          className="w-[217px] h-[137px] absolute top-[30px] left-[130px] z-10 card-moving-clockwise"
          alt="Zebec Card Front"
        />
        <img
          src={Images.ZebecCardBack}
          className="w-[217px] absolute h-[137px] left-[200px] top-[120px] card-moving-anticlockwise "
          alt="Zebec Card Back"
        />
      </div>

      <div className="flex justify-center items-center gap-1  mt-[320px]">
        <img
          src={NewCheckIcon}
          alt="New Check Icon"
          className="w-[69px] h-[69px] text-zebec-card-primary"
        />
      </div>

      <p className="text-zebec-card-content-primary  text-center text-[32px] leading-10 font-semibold">
        Congratulations !!
      </p>
      <p className="text-sm text-zebec-card-content-primary mt-2 text-center">
        Your Gift card ordered successfully
      </p>
      <div className="bg-zebec-card-background-secondary flex items-center justify-between mt-5 p-2 text-content-secondary rounded-sm text-xs">
        <div className="flex gap-1">
          <img src={WalletIcon} alt="Wallet Icon" className="w-4 h-4" />
          <span className="text-zebec-card-content-tertiary text-xs">
            Transaction Id
          </span>
        </div>
        <div className="text-zebec-card-content-primary text-sm !leading-4 font-medium">
          {toSubstring(formValues?.transactionHash ?? "", 14, true)}
        </div>
        <CopyButton
          content={formValues?.transactionHash ?? ""}
          className="text-zebec-card-content-secondary"
        />
      </div>
      <div className="rounded-lg flex items-center justify-between mt-6 px-5 py-2.5 border border-zebec-card-outline">
        <div className="text-content-primary font-normal text-sm text-zebec-card-content-primary">
          {toSubstring(formValues.voucherUrl ?? "", 55, false)}
        </div>
        <CopyButton
          content={formValues.voucherUrl ?? ""}
          className="w-5 h-5 text-zebec-card-primary-dark"
        />
      </div>
      <Button
        title="Done"
        className="w-full mt-6"
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
              voucherUrl: "",
              transactionHash: "",
            };
          });
        }}
      />
    </div>
  );
};

export default OrderPlaced;
