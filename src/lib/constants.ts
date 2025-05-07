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
