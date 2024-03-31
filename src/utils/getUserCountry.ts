import moment from "moment-timezone";
import ct from "countries-and-timezones";
import {  getContinentName } from "@brixtol/country-continent";
import lookup from "country-code-lookup";
export const getUserCountry = () => {
  return ct.getCountryForTimezone(moment.tz.guess());
};

export const getUserContinet = (country: string) => {
  if (country === "Vatican City") {
    return `Europe`;
  } else {
    const countryCode: any = lookup.byCountry(country);
    if (countryCode) {
      const continent = getContinentName(countryCode?.internet);
      return continent;
    } else {
      return null;
    }
  }
};
