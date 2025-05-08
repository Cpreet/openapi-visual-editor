export const STATUS = {
  LOADING: "checking",
  LIVE: "live",
  UNREACHABLE: "unreachable",
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

export const STATUS_COLORS: Record<Status, string> = {
  [STATUS.LOADING]:
    "dark:bg-blue-800 dark:text-blue-200 bg-blue-200 text-blue-800",
  [STATUS.LIVE]:
    "dark:bg-green-800 dark:text-green-200 bg-green-200 text-green-800",
  [STATUS.UNREACHABLE]:
    "dark:bg-red-800 dark:text-red-200 bg-red-200 text-red-800",
};

export const HTTP_METHOD_COLORS = {
  GET: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  POST: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  PUT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  PATCH:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  HEAD: "bg-gray-100 text-gray-800 0 dark:text-gray-200",
  OPTIONS: "bg-gray-100 text-gray-800 0 dark:text-gray-200",
};
