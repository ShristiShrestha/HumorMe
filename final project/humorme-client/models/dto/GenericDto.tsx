import { Error } from "./PageableDto";

export type ApiResponse<T> = {
  api_version: string;
  errors: Error[];
  payload: T;
};
