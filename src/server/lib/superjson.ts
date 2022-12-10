import { dehydrate } from "@tanstack/react-query";
import s from "superjson";
export const superjson = s;

export const stringifyDehydrate = (...params: Parameters<typeof dehydrate>) =>
  superjson.stringify(dehydrate(...params));
