import { useRouter } from "next/router";
import { useState } from "react";

type UseStateAndUrlParamStringArgs = {
  paramName: string;
  initialData: string;
};

// stateとurlのquery paramに状態stringを持たせる
export const useStateAndUrlParamString = ({
  paramName,
  initialData,
}: UseStateAndUrlParamStringArgs) => {
  const router = useRouter();
  const urlParam = router.query[paramName];

  const [state, setState] = useState<string>(
    typeof urlParam === "string" ? urlParam : initialData
  );

  const setStateAndQueryParams = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(paramName, value);
    if (value === "") {
      url.searchParams.delete(paramName);
    }
    router.replace(url, undefined, { shallow: true });

    setState(value);
  };

  return [state, setStateAndQueryParams] as const;
};
