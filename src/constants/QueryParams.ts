export interface QueryParams {
  page: number;
  size: number;
}

export const defaultParams: QueryParams = {
  page: 1,
  size: 3,
};

export const defaultParamsAdmin: QueryParams = {
  page: 1,
  size: 5,
};
