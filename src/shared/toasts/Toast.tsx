import React, { FC, Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { removeToast } from "../../features/toasts/toastsSlice";
import { twMerge } from "tailwind-merge";
import * as Icons from "../../assets/icons";
import {
  ToastPropertiesProps,
  ToastProps,
} from "../../features/toasts/toastsSlice.d";
import { useAppDispatch } from "../../hooks";

interface ActiveTostProps extends ToastProps {
  position: ToastPropertiesProps["position"];
}
const defaultAutoCloseTime = 5000;

const getPositionStyle = (position: ToastPropertiesProps["position"]) => {
  switch (position) {
    case "bottom-right":
      return `translate-x-full`;
    case "top-right":
      return `translate-x-full`;
    case "bottom-left":
      return `-translate-x-full`;
    case "top-left":
      return `-translate-x-full`;
    default:
      return ``;
  }
};

export const Toast: FC<ActiveTostProps> = ({ position, ...toast }) => {
  const dispatch = useAppDispatch();
  const [showToast, setShowToast] = useState(false);
  const { type, id, title, message, transactionHash, autoClose } = toast;

  useEffect(() => {
    //set showToast to true for animation on load
    setShowToast(true);
  }, []);

  useEffect(() => {
    console.log(
      "here the props values are",
      toast.autoClose,
      defaultAutoCloseTime,
      autoClose
    );
    if (id && toast) {
      const interval = setInterval(() => {
        dispatch(removeToast(id));
      }, toast?.autoClose ?? defaultAutoCloseTime);

      const intervalShowToast = setInterval(
        () => {
          setShowToast(false);
        },
        autoClose ? autoClose - 500 : defaultAutoCloseTime - 500
      );

      return () => {
        clearInterval(interval);
        clearInterval(intervalShowToast);
      };
    }
    // eslint-disable-next-line
  }, [defaultAutoCloseTime, autoClose, id, toast]);

  const positionStyle = getPositionStyle(position);

  const progressBarStyle = {
    animationDuration: `${
      autoClose
        ? (autoClose - 500) / 1000 + "s"
        : (defaultAutoCloseTime - 500) / 1000 + "s"
    }`,
  };

  const typeClasses = {
    background:
      type === "info" ? `bg-zebec-card-primary` : `bg-zebec-card-${type}`,
    color:
      type === "info" ? `text-zebec-card-primary` : `text-zebec-card-${type}`,
  };

  return (
    <>
      <Transition
        as={Fragment}
        show={showToast}
        enter="transition-all ease-out duration-500"
        enterFrom={`transform opacity-100 ${positionStyle}`}
        enterTo="transform opacity-100 translate-x-0"
        leave="transition ease-in duration-500"
        leaveFrom="transform opacity-100 translate-x-0"
        leaveTo={`transform opacity-100 ${positionStyle}`}
      >
        <div className="rounded-t-md shadow-toaster overflow-hidden">
          <div className="px-4 pt-4 pb-5 flex items-center gap-x-3 bg-zebec-card-background-primary backdrop-blur-[120px]">
            <div
              className={twMerge(
                `h-7 w-7 rounded-full text-zebec-card-background-primary grid place-content-center flex-shrink-0`,
                typeClasses.background
              )}
            >
              {type === "success" ? (
                <img src={Icons.CheckIcon} />
              ) : type === "error" ? (
                <img src={Icons.CrossIcon} />
              ) : type === "info" ? (
                <img src={Icons.InformationIcon} />
              ) : (
                ""
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <div
                className={twMerge(
                  `text-zebec-card-content-primary text-subtitle font-semibold`,
                  typeClasses.color
                )}
              >
                {title ?? <div className=" capitalize">{type}</div>}
              </div>
              <div className="text-zebec-card-content-secondary text-body">
                {typeof message === "string" && message}
              </div>
            </div>
          </div>
          <div className="w-full h-0.5 bg-zebec-card-content-contrast relative">
            <div
              className={twMerge(
                `absolute h-full w-0 bg-zebec-card-success animate-progress`,
                typeClasses.background
              )}
              style={progressBarStyle}
            ></div>
          </div>
        </div>
      </Transition>
    </>
  );
};
