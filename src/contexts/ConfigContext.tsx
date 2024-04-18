import React, { ReactNode, createContext, useState } from "react";
import { ConfigContextType } from "../types";

export const ConfigContext = createContext<ConfigContextType | undefined>(
  undefined
);
export const ConfigProvider: React.FC<ConfigContextType> = ({
  children,

  rpcUrl,
  slippagePercent,
}) => {
  return (
    <ConfigContext.Provider value={{ rpcUrl, slippagePercent }}>
      {children}
    </ConfigContext.Provider>
  );
};
