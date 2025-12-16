import React from 'react';
import { Outlet } from 'react-router-dom';

interface MainContentProps {
  children?: React.ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  return (
    <div className="container-fluid p-2">
      {/* Aqui se renderizaran las rutas hijas */}
      <Outlet />
      {children}
    </div>
  );
};

export default MainContent;