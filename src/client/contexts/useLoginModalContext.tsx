import { OmitStrict } from "@/share/types/OmitStrict";
import { createContext, useContext, useState } from "react";

type LoginModalState = {
  isLoginModalOpen: boolean;
  callbackUrlAfterLogin?: string;
};
type LoginModalContext = LoginModalState & {
  closeLoginModal: () => void;
  openLoginModal: (
    options?: OmitStrict<LoginModalState, "isLoginModalOpen">
  ) => void;
};
const loginModalContext = createContext<LoginModalContext | undefined>(
  undefined
);

type Props = React.PropsWithChildren;
export const LoginModalContextProvider: React.FC<Props> = ({ children }) => {
  const [{ isLoginModalOpen, callbackUrlAfterLogin }, setLoginModalState] =
    useState<LoginModalState>({
      isLoginModalOpen: false,
    });

  const closeLoginModal = () => {
    setLoginModalState((s) => ({ ...s, isLoginModalOpen: false }));
  };
  const openLoginModal: LoginModalContext["openLoginModal"] = (value) => {
    setLoginModalState((s) => ({ ...s, ...value, isLoginModalOpen: true }));
  };

  return (
    <loginModalContext.Provider
      value={{
        isLoginModalOpen,
        callbackUrlAfterLogin,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </loginModalContext.Provider>
  );
};

export const useLoginModal = () => {
  const context = useContext(loginModalContext);
  if (!context) {
    throw new Error("LoginModalContextProviderが必要です");
  }

  return context;
};
