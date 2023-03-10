import { createContext, useState, useContext, useEffect } from "react";
import { writeAsync, readOnceGet, updateAsync } from "../firebase/crudoperations";
import { MainContext } from "./MainContext";

export const CartContext = createContext();

export const CartProvider = (props) => {
	const [cart, setCart] = useState({});
	const { currentUser } = useContext(MainContext);
	const [cartQty, setCartQty] = useState(null);

	function countCartQuantity(data) {
		return Object.values(data).reduce((amount, cocktail) => amount + cocktail.quantity, 0);
	}

	function getCart() {
		if (currentUser) {
			readOnceGet(`users/${currentUser.uid}/orders`, (items) => {
				setCart(items || {});
				setCartQty(countCartQuantity(items));
			});
		}
	}

	useEffect(() => {
		getCart();
	}, [currentUser]);

	async function onAdd(card, func, cart) {
		if (currentUser) {
			const items = cart || (await readOnceGet(`users/${currentUser.uid}/orders`));
			const item =
				items &&
				Object.entries(items).find(
					(cocktail) => cocktail[1].order.idDrink === (func ? func(card).idDrink : card.idDrink)
				);
			!item
				? writeAsync(`users/${currentUser.uid}/orders`, {
						order: func ? func(card) : card,
						quantity: 1,
				  })
				: await updateAsync(`users/${currentUser.uid}/orders/${item[0]}`, {
						quantity: ++item[1].quantity,
				  });
			setCartQty((qty) => ++qty);
		}
	};


	return (
		<CartContext.Provider value={{ cart, setCart, onAdd, cartQty, setCartQty, getCart }}>
			{props.children}
		</CartContext.Provider>
	);
};
