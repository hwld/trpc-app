import { Textarea as MTextarea, TextareaProps } from "@mantine/core";
import { useEffect, useState } from "react";

// autosizeとminRowsを指定しても、SSR環境ではminRowsが効いていないっぽいので、
// レイアウトシフトが起きてしまう。
// そのため、クライアント側でのレンダリングでのみautosizeを指定する
// ただ、autosizeするとminRowsで指定した行数よりも少し高くなるので、少しはレイアウトシフトが起こってしまう・・・
export const Textarea: React.FC<TextareaProps> = ({
  autosize = false,
  ...props
}) => {
  const [innerAutoSize, setInnerAutoSize] = useState(false);

  useEffect(() => {
    setInnerAutoSize(autosize);
  }, [autosize]);

  return <MTextarea autosize={innerAutoSize} {...props} />;
};
