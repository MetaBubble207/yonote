import React from "react";
import "../writer/writer.css";
import Compass from "../_components/writer/Compass";

const dialogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Compass></Compass>
      <div className="h-100vh bg-#f6f6f6 pt-21.5 w-full">{children}</div>
    </div>
  );
};

export default dialogLayout;
