import { Routes, BrowserRouter, Route } from "react-router-dom";
import LoginForm from "./components/account/login/login";
import { urlHome, urlLogin, urlNone, urlProducts } from "./mainRouterPathes";
import ProtectedRoute from "./elements/ProtectedRoute";
import HomePage from "./components/base/home/home";
import Products from "./components/product/products/products";

export default function MainRouter({ isLogged }: { isLogged: boolean }) {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path={urlResetPassword} component={ResetPassword} /> */}
        <Route path={urlLogin} Component={LoginForm} />
        <Route path={urlHome} Component={HomePage} />
        <Route path={urlProducts} Component={Products} />
        <Route element={<ProtectedRoute isAllowed={isLogged} />}>
          <Route path="test" element={<p>test</p>} />
        </Route>
        <Route path={urlNone} element={<p>There is nothing here: 404!</p>} />
      </Routes>
      <p> {isLogged}</p>
    </BrowserRouter>
  );
}
