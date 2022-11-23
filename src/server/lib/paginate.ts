type PaginateArgs<Input, Result> = {
  finder: (args: Input & { take: number; skip: number }) => Promise<Result>;
  finderInput: Input;
  counter: (args: Input) => Promise<number>;
  pagingData: { page: number; limit: number };
};
type PaginateResult<T> = { data: T; allPages: number };
export const paginate = async <T, K>({
  finderInput,
  finder,
  counter,
  pagingData,
}: PaginateArgs<T, K>): Promise<PaginateResult<K>> => {
  const dataCount = await counter(finderInput);
  const allPages = Math.ceil(dataCount / pagingData.limit);

  const { page, limit } = pagingData;

  const data = await finder({
    ...finderInput,
    skip: (page - 1) * limit,
    take: limit,
  });

  return { data, allPages };
};
