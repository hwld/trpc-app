import { createContext, useContext, useState } from "react";

type LoginModalContext = {
  isLoginModalOpen: boolean;
  closeLoginModal: () => void;
  openLoginModal: () => void;
};
const loginModalContext = createContext<LoginModalContext | undefined>(
  undefined
);

type Props = React.PropsWithChildren;
export const LoginModalContextProvider: React.FC<Props> = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <loginModalContext.Provider
      value={{ isLoginModalOpen, openLoginModal, closeLoginModal }}
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
