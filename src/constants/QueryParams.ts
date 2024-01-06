export interface QueryParams {
  page: number;
  size: number;
}

export const defaultParams: QueryParams = {
  page: 1,
  size: 2,
};
