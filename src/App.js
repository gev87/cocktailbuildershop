import Signup from "./components/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  return (
		<BrowserRouter>
			<Auth>
				<CartProvider>
					<Routes>
						<Route exact path="/" element={<Home />} />
						{/* <Route path="/!" element={<Demo />} /> */}
						<Route path="/update-profile" element={<UpdateProfile />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/login" element={<Login />} />
						<Route path="/forgot-password" element={<ForgotPassWord />} />
						<Route path="/shoping-card" element={<Basket />} />
						<Route path="/cocktail-builder" element={<CocktailBuilder />} />
						<Route path="/payment" element={<Payment />} />
					</Routes>
				</CartProvider>
			</Auth>
		</BrowserRouter>
	);
}

export default App;
