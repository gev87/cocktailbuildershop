import { createContext, useState, useContext, useEffect } from "react";
import { writeAsync, readOnceGet, updateAsync } from "../firebase/crudoperations";
import { MainContext } from "./MainContext";

export const CartContext = createContext();

export const CartProvider = (props) => {
	const [cart, setCart] = useState({});
	const { currentUser } = useContext(MainContext);
	const [cartQty, setCartQty] = useState(null);
	const [loading, setLoading] = useState(false);

	function countCartQuantity(data) {
		return data ? Object.values(data).reduce((amount, cocktail) => amount + cocktail.quantity, 0) : 0;
	}

	async function getCart() {
		if (currentUser) {
			const cartItems = await readOnceGet(`users/${currentUser.uid}/orders`);
			setCart(cartItems || {});
			setCartQty(countCartQuantity(cartItems));
		}
	}

	useEffect(() => {
		getCart();
	}, [currentUser]);

	async function onAdd(card, func, cart) {
		if (currentUser && !loading) {
			setLoading(true);
			const items = cart || (await readOnceGet(`users/${currentUser.uid}/orders`));
			const item =
				items &&
				Object.entries(items).find(
					(cocktail) => cocktail[1].order.idDrink === (func ? func(card).idDrink : card?.idDrink)
				);
			!item
				? await writeAsync(`users/${currentUser.uid}/orders`, {
						order: func ? func(card) : card,
						quantity: 1,
				  })
				: await updateAsync(`users/${currentUser.uid}/orders/${item[0]}`, {
						quantity: ++item[1].quantity,
				  });
			setLoading(false);
			await getCart();
		}
	};


	return (
		<CartContext.Provider value={{ cart, setCart, onAdd, cartQty, setCartQty, getCart }}>
			{props.children}
		</CartContext.Provider>
	);
};
