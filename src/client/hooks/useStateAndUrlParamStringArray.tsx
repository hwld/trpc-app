import { useRouter } from "next/router";
import { useState } from "react";

type UseStateAndQueryParamsArgs = {
  paramName: string;
  initialData: string[];
};

// stateとurlのquery paramに状態string[]を持たせる
export const useStateAndUrlParamStringArray = ({
  paramName,
  initialData,
}: UseStateAndQueryParamsArgs) => {
  const router = useRouter();
  const urlParam = router.query[paramName];

  const [state, setState] = useState(
    typeof urlParam === "string"
      ? [urlParam]
      : typeof urlParam === "object"
      ? urlParam
      : initialData
  );

  const setStateAndQueryParams = (values: string[]) => {
    const url = new URL(window.location.href);
    url.searchParams.delete(paramName);
    values.forEach((value) => {
      url.searchParams.append(paramName, value);
    });
    router.replace(url, undefined, { shallow: true });

    setState(values);
  };

  return [state, setStateAndQueryParams] as const;
};
