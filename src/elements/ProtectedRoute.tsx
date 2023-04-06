import { urlLogin } from "@/mainRouterPathes";
import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({
  isAllowed,
  children,
  redirectPath = urlLogin,
}: IProtectedRoute): React.ReactElement {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
}

interface IProtectedRoute {
  isAllowed: boolean;
  redirectPath?: string;
  children?: ReactElement | null;
}

ProtectedRoute.defaultProps = {
  redirectPath: urlLogin,
  children: null,
};
