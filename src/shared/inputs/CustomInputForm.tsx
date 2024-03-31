import { Transition } from "@headlessui/react";
import { ApplePayIcon, CheckIcon, CrossIcon } from "../../assets/icons";
import { useClickOutside } from "../../hooks/useClickOutside";
import Cookies from "js-cookie";
import { FC } from "react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { getUserCountry } from "../../utils/getUserCountry";
import {
  allCountriesWithFlags,
  allCountryPhoneCode,
} from "../../common/allCountryList";
import { InputField } from "../InputField";
import CopyButton from "../CopyButton";
import { useStep } from "../../hooks";
import { TokenProps } from "../../types";

type Props = {
  countryCode?: string;
  phone_code?: string;
  label?: any;
  type?: any;
  name?: any;
  validation?: any;
  register?: any;
  errors?: any;
  after?: any;
  col?: any;
  min?: any;
  defaultvalue?: any;
  disableCurrentDate?: any;
  registration?: any;
  cpass?: any;
  watch?: any;
  clearErrors?: any;
  reset?: any;
  dropdown?: any;
  placeholder?: any;
  setValue?: any;
  value?: any;
  disable?: any;
  message?: any;
  bg?: any;
  active?: boolean;
  optionPosition?: boolean;
  cardList?: boolean;
  onKeyDown?: (e: any) => void;
  onChange?: (e: any) => void;
  valueIs?: any;
  symbol?: string;
};

export interface OptionRenderPropArg {
  active: boolean;
  value?: any;
  // selected: boolean
  // disabled: boolean
}

export const disablePastDate = (current: string | boolean) => {
  const today = new Date();
  const dd = current
    ? String(today.getDate() + 1).padStart(2, "0")
    : String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  return yyyy + "-" + mm + "-" + dd;
};

export const CustomInputField: FC<Props> = ({
  label,
  type,
  name,
  validation,
  register,
  errors,
  placeholder,
  after,
  disable,
  col,
  min,
  defaultvalue,
  disableCurrentDate,
  onKeyDown,
  onChange,
  valueIs,
  symbol,
}) => {
  return (
    <div className={`mb-2 w-full ${col}`}>
      <div
        className={`${
          after && "after"
        } relative text-zebec-card-content-primary`}
      >
        <label htmlFor="">{label}</label>
        <div className="relative">
          {name === "connectedWallet" ? (
            <span className="absolute left-5 top-1/2 -translate-y-1/2 ">
              <CopyButton content={valueIs} />
            </span>
          ) : (
            <></>
          )}
          <input
            type={type}
            className={`${errors?.[name]?.message && "error"} ${
              errors?.[name]?.type === "greaterThanFifty" && "error"
            } ${
              errors?.[name]?.type === "lessThanTenThousand" && "error"
            } text-zebec-card-content-primary ${
              name === "connectedWallet" ? "!pl-10" : ""
            }`}
            placeholder={placeholder}
            disabled={disable}
            readOnly={disable}
            defaultValue={defaultvalue}
            min={min ? disablePastDate(disableCurrentDate ? true : false) : ""}
            {...register(name, validation)}
            // onKeyDown={onKeyDown ? onkeydown : register.onKeyDown}
            onChange={onChange ? onChange : register().onChange}
          />
          {name === "tokenAmount" && symbol ? (
            <span className="absolute right-5 px-2 py-1 rounded-[4px] border-[0.5px] border-zebec-card-primary top-1/2 -translate-y-1/2 bg-zebec-card-primary-light text-xs !leading-[14px] font-medium">
              {symbol}
            </span>
          ) : (
            <></>
          )}
        </div>
        <div className="error text-red-500 text-xs mt-1 mb-0.5">
          {errors?.[name]?.message}
        </div>
      </div>
    </div>
  );
};
export const CustomTextAreaField: FC<Props> = ({
  label,
  type,
  name,
  validation,
  register,
  errors,
  placeholder,
  after,
  disable,
  col,
  min,
  defaultvalue,
  disableCurrentDate,
}) => {
  return (
    <div className={`mb-2 w-full ${col}`}>
      <div
        className={`${
          after && "after"
        } relative text-zebec-card-content-primary -space-y-[0.01rem] flex flex-col`}
      >
        <label htmlFor="">{label}</label>
        <textarea
          type={type}
          className={`h-[84px] ${errors?.[name]?.message && "error"} ${
            errors?.[name]?.type === "greaterThanFifty" && "error"
          } ${
            errors?.[name]?.type === "lessThanTenThousand" && "error"
          } text-zebec-card-content-primary resize-none textarea`}
          placeholder={placeholder}
          disabled={disable}
          readOnly={disable}
          defaultValue={defaultvalue}
          min={min ? disablePastDate(disableCurrentDate ? true : false) : ""}
          {...register(name, validation)}
        />
      </div>
      <div className="error text-red-500 text-xs mt-1 mb-0.5">
        {errors?.[name]?.message}
      </div>
    </div>
  );
};
export const CustomPasswordField: FC<Props> = ({
  label,
  name,
  validation,
  register,
  registration,
  cpass,
  watch,
  clearErrors,
  errors,
  placeholder,
  after,
  disable,
  col,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`${col} mb-2`}>
      <div className={`${after && "after"} relative`}>
        <label htmlFor="">{label}</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={`${errors?.[name]?.message && "error"}`}
            {...register(
              name,
              cpass
                ? {
                    required: {
                      value: true,
                      message: "Field is required",
                    },
                    validate: (val: string) => {
                      if (watch("password") !== val) {
                        return "";
                      }
                    },
                  }
                : registration
                ? {
                    ...validation,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.value === watch("newPasswordConfirmation")) {
                        clearErrors("newPasswordConfirmation");
                      }
                      if (e.target.value === watch("password_confirmation")) {
                        clearErrors("password_confirmation");
                      }
                    },
                  }
                : validation
            )}
            placeholder={placeholder}
            disabled={disable}
            readOnly={disable}
          />
          {!disable ? (
            <span
              className={`absolute top-0 translate-y-1/2 ${
                showPassword
                  ? "text-primary-accessible"
                  : "text-zebec-card-content-contrast"
              }  right-3 cursor-pointer`}
              onClick={() => setShowPassword(!showPassword)}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
            </span>
          ) : null}
        </div>
        <div className="error text-red-600 text-xs mt-1">
          {errors?.[name]?.message}
        </div>
      </div>
    </div>
  );
};
type CountryProps = {
  code: string;
  name: string;
  flag: string;
};

export const CustomDropDownSelect: FC<Props> = ({
  label,
  name,
  validation,
  register,
  clearErrors,
  errors,
  dropdown,
  placeholder,
  setValue,
  value,
  disable,
  message,
  bg,
  col,
  after,
  optionPosition,
}) => {
  const [selectedItem, setSelectedItem] = useState<CountryProps>();
  const dropDownWrapperRef = useRef<HTMLDivElement>(null);
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const findFlag = (countryName: string) => {
    if (countryName) {
      const countryWithFlag = allCountriesWithFlags.find(
        (item: any) => item.name === countryName
      );
      if (countryWithFlag) {
        return countryWithFlag.emoji;
      }
      return "";
    }
  };
  const handleChange = (data: any) => {
    setValue(name, data.name);
    clearErrors(name);
    setSelectedItem(data);
  };

  const filteredCountries = useMemo(() => {
    if (search !== "") {
      const newCountries = dropdown.filter(
        (cty: any) =>
          cty?.name?.toLowerCase().includes(search?.toLowerCase()) ||
          cty?.code?.toLowerCase().includes(search?.toLowerCase())
      );
      return newCountries;
    }
    return dropdown;
    // eslint-disable-next-line
  }, [dropdown, search]);

  useEffect(() => {
    if (value) {
      const val = dropdown.find((data: any) => data.name === value);
      setSelectedItem(val ?? "");
    }
  }, [value]);

  useClickOutside(dropDownWrapperRef, {
    onClickOutside: () => {
      setToggleDropdown(false);
    },
  });
  // select-error

  return (
    <div className={`${col} ${after && "after"}`}>
      <label className="">{label}</label>
      <input
        type="text"
        defaultValue={value}
        name={name}
        {...register(name, validation)}
        className="!hidden"
      />
      <div className={`font-inter`} ref={dropDownWrapperRef}>
        <div className="relative">
          <div
            className={`relative  ${
              errors[name] ? "select-error" : ""
            }  px-5 py-3 w-full rounded-lg 2xl:rounded-xl  border-outline placeholder-gray-500 focus:outline-none 
               border cursor-pointer text-left dropdown-focus bg-zebec-card-background-primary flex space-x-1 items-center mt-1`}
            onClick={() => setToggleDropdown(!toggleDropdown)}
          >
            {selectedItem ? (
              <span
                className={`text-left whitespace-nowrap ${
                  disable
                    ? "text-zebec-card-content-contrast"
                    : "text-zebec-card-content-primary"
                }`}
              >
                {findFlag(selectedItem.name)} {selectedItem.name}
              </span>
            ) : (
              <span className="text-left text-gray-500 line-clamp">
                {placeholder}
              </span>
            )}

            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              {/* icon  */}
              <span>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </span>
          </div>
          <Transition
            show={toggleDropdown}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-75"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-75"
          >
            <div className="absolute w-full top-[55px] z-10 max-h-60 bg-white overflow-auto border border-outline-border rounded-lg">
              <div className="px-1 sticky top-0">
                {name !== "currency" ? (
                  <InputField
                    placeholder="Search country here..."
                    className={` w-full !px-4 !drop-shadow-none !focus:right-0`}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                ) : null}
              </div>
              <div className="flex flex-col select-country p-2">
                {filteredCountries && filteredCountries.length > 0 ? (
                  filteredCountries.map((country: any, index: number) => {
                    const selected = filteredCountries.find((cty: any) =>
                      selectedItem !== undefined
                        ? cty.code === selectedItem.code
                        : ""
                    );
                    const indexOfCountryDetail = filteredCountries.indexOf(
                      selected as any
                    );
                    const indexOfCountry = filteredCountries.indexOf(country);

                    return (
                      <div
                        key={index}
                        className={`cursor-pointer text-body-sm text-zebec-card-content-secondary hover:bg-content-tertiary/30 rounded p-3 animation ${
                          indexOfCountryDetail === indexOfCountry
                            ? "bg-content-tertiary/20"
                            : ""
                        } `}
                        onClick={() => {
                          handleChange(country);
                          setToggleDropdown(false);
                          setSearch("");
                        }}
                      >
                        <div className="flex justify-between items-center">
                          {findFlag(country.name)} {country.name}
                          {indexOfCountryDetail === indexOfCountry ? (
                            <img src={CheckIcon} className="w-4 h-4" />
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-body-sm text-zebec-card-content-primary p-2">
                    No Countries found
                  </div>
                )}
              </div>
            </div>
          </Transition>
        </div>
      </div>
      <div className="error text-red-600 text-xs mt-1">
        {errors?.[name]?.message}
      </div>
    </div>
  );
};

export const CustomVisaCardDropDownSelect: FC<Props> = ({
  label,
  name,
  validation,
  register,
  clearErrors,
  errors,
  dropdown,
  placeholder,
  setValue,
  value,
  disable,
  message,
  bg,
  col,
  after,
  optionPosition,
  cardList,
}) => {
  const { step } = useStep();
  const [selectedItem, setSelectedItem] = useState("");

  const dropDownWrapperRef = useRef<HTMLDivElement>(null);
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [search, setSearch] = useState("");

  const handleChange = (data: any) => {
    setValue(name, data.code);
    clearErrors(name);
    setSelectedItem(data.name);
  };

  const filteredCountries = useMemo(() => {
    if (search !== "") {
      const newCountries = dropdown.filter(
        (cty: any) =>
          cty?.name?.toLowerCase().includes(search?.toLowerCase()) ||
          cty?.code?.toLowerCase().includes(search?.toLowerCase())
      );
      return newCountries;
    }
    return dropdown;
    // eslint-disable-next-line
  }, [dropdown, search]);

  useEffect(() => {
    if (value) {
      const val = dropdown.find((data: any) => data.code === value);
      setSelectedItem(val?.name ?? "");
    } else {
      setSelectedItem("");
    }
  }, [value, dropdown]);

  useClickOutside(dropDownWrapperRef, {
    onClickOutside: () => {
      setToggleDropdown(false);
    },
  });

  return (
    <div className={`${col} ${after && "after"}`}>
      <label className="">{label}</label>
      <input
        type="text"
        defaultValue={value}
        name={name}
        {...register(name, validation)}
        className="!hidden"
      />
      <div className={`font-inter`} ref={dropDownWrapperRef}>
        <div className="relative">
          <div
            className={`relative ${
              errors[name] ? "select-error" : ""
            } px-5 py-3 w-full rounded-lg 2xl:rounded-xl  border-outline placeholder-gray-500 focus:outline-none 
               border cursor-pointer text-left dropdown-focus bg-zebec-card-background-primary flex space-x-1 items-center mt-1`}
            onClick={() => setToggleDropdown(!toggleDropdown)}
          >
            {selectedItem ? (
              <span
                className={`text-left whitespace-nowrap ${
                  disable
                    ? "text-zebec-card-content-contrast"
                    : "text-zebec-card-content-primary"
                }`}
              >
                {selectedItem}
              </span>
            ) : (
              <span className="text-left text-gray-500 line-clamp">
                {placeholder}
              </span>
            )}

            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              {/* icon  */}
              <span>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </span>
          </div>
          <Transition
            show={toggleDropdown}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-75"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-75"
          >
            <div className="absolute w-full top-[55px] max-h-60 bg-white overflow-auto border border-outline-border rounded-lg">
              <div className="flex flex-col gap-y-1 select-country p-2">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country: any) => {
                    const selected = filteredCountries.find((cty: any) =>
                      selectedItem !== "" ? cty.code === selectedItem : ""
                    );
                    const indexOfCountryDetail = filteredCountries.indexOf(
                      selected as any
                    );
                    const indexOfCountry = filteredCountries.indexOf(country);

                    return (
                      <div
                        key={country.code}
                        className={`cursor-pointer text-body-sm text-zebec-card-content-secondary hover:bg-content-tertiary/30 rounded p-3 animation ${
                          indexOfCountryDetail === indexOfCountry
                            ? "bg-content-tertiary/20"
                            : ""
                        } `}
                        onClick={() => {
                          handleChange(country);
                          setToggleDropdown(false);
                          setSearch("");
                        }}
                      >
                        <div className="flex justify-between items-center">
                          {country.name}
                          {cardList ? (
                            <div className="flex items-center gap-1">
                              <img src={ApplePayIcon} className="w-6 h-6" />
                              {country.name?.includes(
                                "Global Mobile Wallet"
                              ) ? (
                                <img
                                  src={CheckIcon}
                                  className="text-green-500"
                                />
                              ) : (
                                <img src={CrossIcon} className="text-red-500" />
                              )}
                            </div>
                          ) : null}
                          {indexOfCountryDetail === indexOfCountry ? (
                            <img src={CheckIcon} className="w-4 h-4" />
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-body-sm text-zebec-card-content-primary p-2">
                    No Card found
                  </div>
                )}
              </div>
            </div>
          </Transition>
        </div>
      </div>
      <div className="error text-red-600 text-xs mt-1">
        {errors?.[name]?.message}
      </div>
    </div>
  );
};
export const CustomPhoneInputField: FC<Props> = ({
  label,
  type,
  name,
  validation,
  register,
  errors,
  placeholder,
  after,
  disable,
  col,
  min,
  defaultvalue,
  watch,
  setValue,
  disableCurrentDate,
  optionPosition,
  phone_code,
  countryCode,
}) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [search, setSearch] = useState("");
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const dropDownWrapperRef = useRef<HTMLDivElement>(null);

  const handleChange = (data: any) => {
    setSelectedItem(data.dialCode);
    setSelectedCountry(data.code);
    Cookies.set("country_code", data.code);
  };

  useEffect(() => {
    setValue("phone_code", selectedItem);
  }, [selectedItem]);

  useEffect(() => {
    setSelectedItem(phone_code ? phone_code : allCountryPhoneCode[0]?.dialCode);
    setSelectedCountry(
      countryCode ? countryCode : allCountryPhoneCode[0]?.code
    );
  }, [allCountryPhoneCode, phone_code, countryCode]);

  useEffect(() => {
    const country: any = getUserCountry();
    if (allCountryPhoneCode.length > 0) {
      allCountryPhoneCode.forEach((data) => {
        if (data.code === country.id) {
          setSelectedItem(data.dialCode);
          setSelectedCountry(data.code);
        }
      });
    }
  }, []);

  const filteredCountries = useMemo(() => {
    if (search !== "") {
      const newCountries = allCountryPhoneCode.filter(
        (cty) =>
          cty.name.toLowerCase().includes(search.toLowerCase()) ||
          cty.code.toLowerCase().includes(search.toLowerCase())
      );
      return newCountries;
    }
    return allCountryPhoneCode;
    // eslint-disable-next-line
  }, [allCountryPhoneCode, search]);
  useClickOutside(dropDownWrapperRef, {
    onClickOutside: () => {
      setToggleDropdown(false);
    },
  });

  return (
    <div className={`mb-2 w-full ${col}`}>
      <div
        className={`${
          after && "after"
        } relative text-zebec-card-content-primary`}
      >
        <label htmlFor="">{label}</label>
        <div className="relative ">
          <input
            type="text"
            defaultValue={watch("phone_code")}
            name="phone_code"
            {...register("phone_code")}
            className="!hidden"
          />
          <div className={`font-inter flex`} ref={dropDownWrapperRef}>
            <div className="relative ">
              <div
                className={`w-24 absolute  top-4.5 left-0 text-zebec-card-content-secondary`}
                onClick={() => setToggleDropdown(!toggleDropdown)}
              >
                <div className="flex pl-4 pr-2 justify-between items-center text-xs">
                  <span
                    className={`text-left whitespace-nowrap text-zebec-card-content-secondary`}
                  >
                    {selectedItem}({selectedCountry})
                  </span>

                  {/* icon  */}
                  <span>
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <Transition
                show={toggleDropdown}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-75"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-200"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-75"
              >
                <div className="absolute w-64 bottom-1 max-h-60 bg-white overflow-auto border border-outline-border rounded-lg">
                  <div className="px-1 sticky top-0">
                    <InputField
                      placeholder="Search country here..."
                      className={` w-full !px-4 !drop-shadow-none  !focus:right-0`}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 select-country p-2">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => {
                        const selected = filteredCountries.find((cty) =>
                          selectedItem !== ""
                            ? cty.dialCode === selectedItem
                            : ""
                        );
                        const indexOfCountryDetail = filteredCountries.indexOf(
                          selected as any
                        );
                        const indexOfCountry =
                          filteredCountries.indexOf(country);

                        return (
                          <div
                            key={country.code}
                            className={`cursor-pointer text-body-sm text-zebec-card-content-secondary hover:bg-content-tertiary/30 rounded p-3 animation ${
                              indexOfCountryDetail === indexOfCountry
                                ? "bg-content-tertiary/20"
                                : ""
                            } `}
                            onClick={() => {
                              handleChange(country);
                              setToggleDropdown(false);
                              setSearch("");
                            }}
                          >
                            <div className="flex justify-between items-center">
                              {country.name} {`(${country.code})`}
                              {indexOfCountryDetail === indexOfCountry ? (
                                <img src={CheckIcon} className="w-4 h-4" />
                              ) : null}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-body-sm text-zebec-card-content-primary p-2">
                        No Countries found
                      </div>
                    )}
                  </div>
                </div>
                {/* <Listbox.Options
                    className={`absolute w-64 ${
                      optionPosition ? "-bottom-1" : "top-10"
                    } text-zebec-card-content-primary bg-zebec-card-background-primary rounded-xl
              ring-1 ring-black ring-opacity-5  left-0
               focus:outline-none sm:text-sm px-2 border border-outline z-10 `}
                  >
                    <div className="max-h-60 flex flex-col relative">
                      <div className="flex-1 overflow-auto">
                        <InputField
                          placeholder="Search country here..."
                          className={` w-full !px-4 drop-shadow-none sticky top-0.5 bg-white z-[100]`}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        {filteredCountries.map((data: any, index: number) => (
                          <Listbox.Option
                            key={index}
                            className={({ active }) =>
                              `${
                                selectedItem === data.dialCode
                                  ? "bg-zebec-card-background-secondary"
                                  : "text-text"
                              } cursor-pointer select-none relative py-2 px-4 rounded-xl`
                            }
                            value={data.dialCode}
                          >
                            <span
                              className={`${
                                selectedItem === data.dialCode
                                  ? "font-medium"
                                  : "font-normal"
                              } block truncate`}
                            >
                              {data.name}
                            </span>
                          </Listbox.Option>
                        ))}
                      </div>
                    </div>
                  </Listbox.Options> */}
              </Transition>
            </div>
          </div>
          <input
            type={type}
            className={`${
              errors?.[name]?.message && "error"
            } text-zebec-card-content-primary !pl-[6rem] !pr-5`}
            placeholder={placeholder}
            disabled={disable}
            readOnly={disable}
            defaultValue={defaultvalue}
            min={min ? disablePastDate(disableCurrentDate ? true : false) : ""}
            {...register(name, validation)}
          />
        </div>
        <div className="error text-red-500 text-xs mt-1 mb-0.5">
          {errors?.[name]?.message}
        </div>
      </div>
    </div>
  );
};

// custom tokens select
export const CustomTokensDropDownSelect: FC<Props> = ({
  label,
  name,
  validation,
  register,
  clearErrors,
  errors,
  dropdown,
  placeholder,
  setValue,
  value,
  disable,
  message,
  bg,
  col,
  after,
  optionPosition,
}) => {
  const [selectedItem, setSelectedItem] = useState<TokenProps>();
  const dropDownWrapperRef = useRef<HTMLDivElement>(null);
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [search, setSearch] = useState("");

  const handleChange = (data: any) => {
    setValue(name, data.symbol);
    clearErrors(name);
    setSelectedItem(data);
  };

  const filteredTokens = useMemo(() => {
    if (search !== "") {
      const newTokens = dropdown.filter(
        (tkn: any) =>
          tkn?.name?.toLowerCase().includes(search?.toLowerCase()) ||
          tkn?.symbol?.toLowerCase().includes(search?.toLowerCase())
      );
      return newTokens;
    }
    return dropdown;
    // eslint-disable-next-line
  }, [dropdown, search]);

  useEffect(() => {
    if (value) {
      const val = dropdown.find((data: any) => data.symbol === value);
      setSelectedItem(val ?? "");
    }
  }, [value, dropdown]);

  useClickOutside(dropDownWrapperRef, {
    onClickOutside: () => {
      setToggleDropdown(false);
    },
  });
  // select-error

  return (
    <div className={`${col} ${after && "after"}`}>
      <label className="">{label}</label>
      <input
        type="text"
        defaultValue={value}
        name={name}
        {...register(name, validation)}
        className="!hidden"
      />
      <div className={`font-inter`} ref={dropDownWrapperRef}>
        <div className="relative">
          <div
            className={`relative  ${
              errors[name] ? "select-error" : ""
            }  px-5 py-3 w-full rounded-lg 2xl:rounded-xl  border-outline placeholder-gray-500 focus:outline-none 
               border cursor-pointer text-left dropdown-focus bg-zebec-card-background-primary flex space-x-1 items-center mt-1`}
            onClick={() => setToggleDropdown(!toggleDropdown)}
          >
            {selectedItem ? (
              <span
                className={`text-left whitespace-nowrap flex gap-2 items-center ${
                  disable
                    ? "text-zebec-card-content-contrast"
                    : "text-zebec-card-content-primary"
                }`}
              >
                <img
                  src={selectedItem.icon}
                  className="w-4 h-4 flex-shrink-0"
                  alt={selectedItem.name}
                />
                <span>{selectedItem.name}</span>
              </span>
            ) : (
              <span className="text-left text-gray-500 line-clamp">
                {placeholder}
              </span>
            )}

            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              {/* icon  */}
              <span>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </span>
          </div>
          <Transition
            show={toggleDropdown}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-75"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-75"
          >
            <div className="absolute w-full top-[55px] z-10 max-h-60 bg-white overflow-auto border border-outline-border rounded-lg">
              <div className="px-1 sticky top-0">
                <InputField
                  placeholder="Search tokens here..."
                  className={` w-full !px-4 !drop-shadow-none !focus:right-0`}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-col select-country p-2">
                {filteredTokens.length > 0 ? (
                  filteredTokens.map((token: any, index: number) => {
                    const selected = filteredTokens.find((cty: any) =>
                      selectedItem !== undefined
                        ? cty.code === selectedItem.symbol
                        : ""
                    );
                    const indexOfTokenDetail = filteredTokens.indexOf(
                      selected as any
                    );
                    const indexOfToken = filteredTokens.indexOf(token);

                    return (
                      <div
                        key={index}
                        className={`cursor-pointer text-body-sm text-zebec-card-content-secondary hover:bg-content-tertiary/30 rounded p-3 animation ${
                          indexOfTokenDetail === indexOfToken
                            ? "bg-content-tertiary/20"
                            : ""
                        } `}
                        onClick={() => {
                          handleChange(token);
                          setToggleDropdown(false);
                          setSearch("");
                        }}
                      >
                        <div className="flex gap-2 items-center">
                          <img
                            src={token.icon}
                            className="w-4 h-4 flex-shrink-0"
                            alt={token.name}
                          />{" "}
                          <span>{token.name}</span>
                          {indexOfTokenDetail === indexOfToken ? (
                            <img src={CheckIcon} className="w-4 h-4" />
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-body-sm text-zebec-card-content-primary p-2">
                    No Tokens found
                  </div>
                )}
              </div>
            </div>
          </Transition>
        </div>
      </div>
      <div className="error text-red-600 text-xs mt-1">
        {errors?.[name]?.message}
      </div>
    </div>
  );
};
