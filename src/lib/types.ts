import { STATUS } from "./constants";

export type Api = {
  id: number;
  version: string;
  name: string;
  documentation_url: string;
  api_url: string;
  description: string;
  endpoints: number;
  schemas: number;
  schema_doc?: string;
  created_at: string;
  updated_at: string;
};

export type Status = (typeof STATUS)[keyof typeof STATUS];

export type StatusWithColor = {
  status: Status;
  color: string;
}
