import React from "react";
import { CopyButtonProps } from "./index.d";
import CopyIcon from "../../assets/icons/other-icons/copy.svg";
import CheckIcon from "../../assets/icons/other-icons/check.svg";

const CopyButton: React.FC<CopyButtonProps> = ({
  content,
  className = "",
  disabled = false,
}) => {
  const [isClicked, setIsClicked] = React.useState<boolean>(false);

  return (
    <span className="grid place-content-center   w-4 h-4 text-sm">
      {isClicked ? (
        <img
          src={CheckIcon}
          alt="Check Icon"
          onClick={(e: any) => {
            e.stopPropagation();
          }}
          className={`text-base cursor-pointer text-success transition ease-in-out delay-150 w-4 h-4 ${className}`}
        />
      ) : (
        <img
          src={CopyIcon}
          alt="Copy Icon"
          onClick={(e: any) => {
            if (disabled) return;
            e.stopPropagation();
            setIsClicked(true);
            setTimeout(() => {
              setIsClicked(false);
            }, 800);
            navigator.clipboard.writeText(content);
          }}
          className={`text-base cursor-pointer  w-4 h-4 ${className}`}
        />
      )}
    </span>
  );
};

export default CopyButton;
