import { Routes, BrowserRouter, Route } from "react-router-dom";
import LoginForm from "./components/account/login/login";
import { urlLogin } from "./mainRouterPathes";

export default function MainRouter({ isLogged }: { isLogged: boolean }) {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path={urlResetPassword} component={ResetPassword} /> */}
        <Route path={urlLogin} Component={LoginForm} />
      </Routes>
      <p> {isLogged}</p>
    </BrowserRouter>
  );
}
