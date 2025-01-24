import React, { createContext, useState } from "react";

export const SelectedFolderContext = createContext<
  | { selectedIndex: number; setSelectedIndex: (index: number) => void }
  | undefined
>(undefined);

export const SelectedFolderProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <SelectedFolderContext.Provider value={{ selectedIndex, setSelectedIndex }}>
      {children}
    </SelectedFolderContext.Provider>
  );
};
