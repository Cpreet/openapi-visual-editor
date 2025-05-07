import { useCallback, useState } from "react";
import { STATUS, STATUS_COLORS } from "@/lib/constants";
import type { StatusWithColor } from "@/lib/types";

export const useCheckConnections = () => {
  const [status, setStatus] = useState<StatusWithColor[]>([]);

  const checkStatus = useCallback(async (serversToCheck: string[]) => {
    setStatus(
      serversToCheck.map(() => ({
        status: STATUS.LOADING,
        color: STATUS_COLORS[STATUS.LOADING],
      }))
    );

    serversToCheck.forEach(async (server, idx) => {
      try {
        const res = await fetch(server);
        const newState =
          res.status === 404
            ? {
              status: STATUS.UNREACHABLE,
              color: STATUS_COLORS[STATUS.UNREACHABLE],
            }
            : { status: STATUS.LIVE, color: STATUS_COLORS[STATUS.LIVE] };

        setStatus((prev) => {
          const next = [...prev];
          next[idx] = newState;
          return next;
        });
      } catch {
        setStatus((prev) => {
          const next = [...prev];
          next[idx] = {
            status: STATUS.UNREACHABLE,
            color: STATUS_COLORS[STATUS.UNREACHABLE],
          };
          return next;
        });
      }
    });
  }, []);

  return { status, checkStatus };
};

