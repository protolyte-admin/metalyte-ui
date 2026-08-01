import { LayoutActionsContext } from "./LayoutActionsContext";

export function LayoutActionsProvider({ value, children }) {
  return (
    <LayoutActionsContext.Provider value={value}>
      {children}
    </LayoutActionsContext.Provider>
  );
}