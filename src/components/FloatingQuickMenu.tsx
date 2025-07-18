import React from "react";
import QuickMenu from "./QuickMenu"; // Assuming QuickMenu.tsx is in the same directory

const FloatingQuickMenu: React.FC = () => {
  return (
    <div className="fixed right-25 top-1/2 -translate-y-1/2 z-50">
      <QuickMenu />
    </div>
  );
};

export default FloatingQuickMenu;
