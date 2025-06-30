import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children,  onSearch, searchTerm }) => {
  return (
    <div className="bg-color bg-gray-100 min-h-screen">
          <Navbar onSearch={onSearch} searchTerm={searchTerm} />
        <div className="container mx-auto py-8">
            {children}
        </div>
    </div>
  );
};

export default Layout;
