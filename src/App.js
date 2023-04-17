import Signup from "./components/Signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./context/MainContext";
import Login from "./components/Login";
import ForgotPassWord from "./components/ForgotPassword";
import UpdateProfile from "./components/UpdateProfile";
import { CartProvider } from "./context/CartContext";
import Basket from "./components/Basket";
import CocktailBuilder from "./components/CocktailBuilder";
import Payment from "./components/Payment";
import Home from "./components/Home";

function App() {
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/update-profile", element: <UpdateProfile /> },
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassWord /> },
    { path: "/shoping-card", element: <Basket /> },
    { path: "/cocktail-builder", element: <CocktailBuilder /> },
    { path: "/payment", element: <Payment /> },
  ];
  return (
    <BrowserRouter>
      <Auth>
        <CartProvider>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </CartProvider>
      </Auth>
    </BrowserRouter>
  );
}

export default App;
