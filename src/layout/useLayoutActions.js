import { useContext } from "react";

import { LayoutActionsContext } from "./LayoutActionsContext";

export function useLayoutActions() {
  const context = useContext(LayoutActionsContext);
  if (!context) {
    throw new Error("useLayoutActions must be used within AntdLayout");
  }
  return context;
}