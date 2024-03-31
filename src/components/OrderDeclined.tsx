import NewFailIcon from "../assets/icons/other-icons/new-fail.svg";
import { ZebecCardLeft, ZebecCardRight } from "../assets";
import { Button } from "../shared/Button";
import * as Images from "../assets";
import { useStep } from "../hooks";
const OrderDeclined = () => {
  const { step, setStep } = useStep();
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

      <div className="flex justify-center items-center gap-1 mt-[320px]">
        <img
          src={NewFailIcon}
          alt={"New Fail"}
          className="w-12 h-12 text-zebec-card-error-content"
        />
      </div>

      <p className="text-zebec-card-content-primary  text-center text-[32px] leading-10 font-semibold">
        Sorry Request Declined!
      </p>
      <p className="text-sm text-zebec-card-content-primary mt-2 text-center">
        Your Gift card ordered has been broken down
      </p>
      <Button
        title="Report a Problem"
        className="w-full mt-6"
        onClick={() => setStep(6)}
      />
      <Button variant="secondary" title="Cancel" className="w-full mt-3" />
    </div>
  );
};

export default OrderDeclined;
