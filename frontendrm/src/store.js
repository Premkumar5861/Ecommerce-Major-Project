import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";

import {
  productCreateReducers,
  productDetailsReducers,
  productListReducers,
  productUpdateReducers,
  // productDeleteReducers import pannanum (if separate reducer irundha)
} from "./reducers/productReducers";

import { 
  getDetailsReducers, 
  userDeleteReducers, 
  userListReducer, 
  userLoginReducers, 
  userSignupReducers, 
  userUpdateProfileReducer, 
  userUpdateReducers 
} from "./reducers/userReducers";

import { cartReducer } from "./reducers/cartReducers";

import {
  orderCreateReducer,
  orderDetailsReducer,
  orderDeliverReducer,
  orderListReducers,
  orderListMyReducers
} from "./reducers/orderReducers";

const reducer = combineReducers({
  productsList: productListReducers,
  productDetails: productDetailsReducers,
  userSignup: userSignupReducers,
  userLogin: userLoginReducers,
  cart: cartReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderDeliver: orderDeliverReducer,

  // Admin
  productCreate: productCreateReducers,
  productUpdate: productUpdateReducers,
  // productDelete: productDeleteReducers,   ← Comment panni or correct reducer use pannu

  orderList: orderListReducers,

  // User CRUD
  userList: userListReducer,
  userUpdate: userUpdateReducers,
  userDelete: userDeleteReducers,
  userDetails: getDetailsReducers,

  userUpdateProfile: userUpdateProfileReducer,
  myOrderList: orderListMyReducers,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;