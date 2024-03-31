import React, { FC, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
// import { IconButton } from "./IconButton"
// import * as Icons from "assets/icons"
import * as Icons from "../assets/icons";
import { IconButton } from "./IconButton";
// import { ZebecCard } from "assets/images"
// import ZebecCard
type ModalSize = "small" | "medium" | "large" | "extra-large";

interface ModalProps {
  show: boolean;
  size?: ModalSize;
  className?: string;
  toggleModal: () => void;
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
  hasCloseIcon?: boolean;
  bg?: string;
  giftCardModal?: boolean;
}

export const Modal: FC<ModalProps> = (props) => {
  const {
    show,
    size = "large",
    className,
    toggleModal,
    children,
    bg,
    closeOnOutsideClick = false,
    hasCloseIcon = false,
    giftCardModal,
  } = props;

  const sizeStyle =
    size === "extra-large"
      ? "max-w-[736px]"
      : size === "large"
      ? "max-w-[548px]"
      : size === "medium"
      ? "max-w-[420px]"
      : size === "small"
      ? "max-w-[338px]"
      : "max-w-md";

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          className="relative z-10"
          onClose={closeOnOutsideClick ? toggleModal : () => false}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-zebec-card-background-backdrop backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center relative p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className={`flex justify-center relative`}>
                  {/* {giftCardModal ? (
                    <div className="w-[90%] z-[-1] absolute -top-5 left-[5%] rotate-[5deg] floating ">
                      <img src={ZebecCard} className="" alt="" />
                    </div>
                  ) : null} */}
                  <div
                    className={twMerge(
                      `w-full transform overflow-visible relative z-[10] ${
                        bg
                          ? bg
                          : "rounded-2xl bg-zebec-card-background-secondary"
                      } px-6 pt-6 pb-10 text-left shadow-backdrop align-middle transition-all ${sizeStyle}`,
                      className
                    )}
                  >
                    {hasCloseIcon && (
                      <IconButton
                        className="w-10 h-10 absolute -top-14 md:top-0 -right-5 md:-right-20"
                        icon={<img src={Icons.CrossIcon} />}
                        onClick={toggleModal}
                        shape="round"
                      />
                    )}
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
