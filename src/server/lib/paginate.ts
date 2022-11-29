import { Prisma } from "@prisma/client";

type PaginateArgs<Input, Result> = {
  transactionClient?: Prisma.TransactionClient;
  finder: (
    args: Input & { take: number; skip: number },
    transactionClient?: Prisma.TransactionClient
  ) => Promise<Result>;
  finderInput: Input;
  counter: (args: Input) => Promise<number>;
  pagingData: { page: number; limit: number };
};
type PaginateResult<T> = { data: T; allPages: number };

export const paginate = async <T, K>({
  transactionClient,
  finderInput,
  finder,
  counter,
  pagingData,
}: PaginateArgs<T, K>): Promise<PaginateResult<K>> => {
  const dataCount = await counter(finderInput);
  const allPages = Math.ceil(dataCount / pagingData.limit);

  const { page, limit } = pagingData;

  const data = await finder(
    {
      ...finderInput,
      skip: (page - 1) * limit,
      take: limit,
    },
    transactionClient
  );

  return { data, allPages };
};
