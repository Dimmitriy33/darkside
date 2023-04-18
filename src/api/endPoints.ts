const endPoints = {
  // user
  signInUser: "/api/user/login",
  signUpUser: "/api/user/register",
  currentUser: "/api/user/info",
  logout: "/api/user/logout",
  balance: "/api/user/balance",
  resetPassword: "/api/user/resetPass",
  getAllUsers: "/api/user/all",

  // product
  product: "/api/product",
  productsByIds: "/api/product/list",
  productMainImg: "/api/product/image",
  getCategories: "/api/product/categories",
  getCreators: "/api/product/creators",
  getProducts: "/api/product/search",

  // taste
  taste: "/api/taste",
  getTastes: "/api/taste/all",

  // cart
  getPurchases: "/api/purchase/all",
  createPurchase: "/api/purchase/create",
};

export default endPoints;
