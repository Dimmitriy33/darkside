import { Routes, BrowserRouter, Route } from "react-router-dom";
import LoginForm from "./components/account/login/login";
import {
  urlAdminCart,
  urlAdminProducts,
  urlAdminUser,
  urlCart,
  urlHome,
  urlLogin,
  urlNone,
  urlProduct,
  urlProductAdd,
  urlProductUpdate,
  urlProducts,
  urlUser,
} from "./mainRouterPathes";
import ProtectedRoute from "./elements/ProtectedRoute";
import HomePage from "./components/base/home/home";
import Products from "./components/product/products/products";
import Product from "./components/product/product/product";
import AddProduct from "./components/product/addProduct/addProduct";
import UpdateProduct from "./components/product/updateProduct/updateProduct";
import UserPage from "./components/account/userPage/userPage";
import CartsAll from "./components/cart/adminCartsAll/adminCartsAll";
import Cart from "./components/cart/cartMain/cartMain";
import AdminUsers from "./components/account/adminUsers/adminUsers";
import AdminProducts from "./components/product/adminProducts/adminProducts";

export default function MainRouter({ isLogged, isAdmin }: { isLogged: boolean; isAdmin: boolean }) {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path={urlResetPassword} component={ResetPassword} /> */}
        <Route path={urlLogin} Component={LoginForm} />
        <Route path={urlHome} Component={HomePage} />
        <Route path={urlProducts} Component={Products} />
        <Route path={urlProduct} Component={Product} />
        <Route element={<ProtectedRoute isAllowed={isLogged} />}>
          <Route path={urlUser} Component={UserPage} />
          <Route path={urlCart} Component={Cart} />
        </Route>
        <Route element={<ProtectedRoute isAllowed={isLogged && isAdmin} redirectPath={urlHome} />}>
          <Route path={urlProductAdd} Component={AddProduct} />
          <Route path={urlProductUpdate} Component={UpdateProduct} />
          <Route path={urlAdminUser} Component={AdminUsers} />
          <Route path={urlAdminProducts} Component={AdminProducts} />
          <Route path={urlAdminCart} Component={CartsAll} />
        </Route>
        <Route path={urlNone} element={<p>There is nothing here: 404!</p>} />
      </Routes>
    </BrowserRouter>
  );
}
