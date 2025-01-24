import { useContext } from "react";
import { SelectedFolderContext } from "./SelectedFolderContext";

export const useSelectedFolder = () => {
  const context = useContext(SelectedFolderContext);
  if (!context) {
    throw new Error(
      "useSelectedFolder must be used within a SelectedFolderProvider"
    );
  }
  return context;
};
