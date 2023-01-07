import { createContext, useState, useContext } from "react";
import PRICES from "../consts/PRICES";
import { writeAsync, readOnceGet, updateAsync } from "../firebase/crudoperations";
import { MainContext } from "./MainContext";
import { calcItemQty } from "../utils/Commonfuncs";

export const CartContext = createContext();

export const CartProvider = (props) => {
	const [cart, setCart] = useState([]);
	const [filteredApi, setFilteredApi] = useState([]);
	const { currentUser } = useContext(MainContext);

	// const onAdd = (item) => {
	// 	const exist = cart.find((x) => x.idDrink === item.idDrink);
	// 	if (exist) {
	// 		setCart(cart.map((x) => (x.idDrink === item.idDrink ? { ...exist, qty: exist.qty + 1 } : x)));
	// 	} else {
	// 		setCart([...cart, { ...item, qty: 1 }]);
	// 	}
	// };
	const onAdd = (card, func) => {
		currentUser &&
			readOnceGet(`users/${currentUser.uid}/orders`, (items) => items).then((value) => {
				const item =
					value &&
					Object.entries(value).find(
						(e) => e[1].order.idDrink === (func ? func(card).idDrink : card.idDrink)
					);
				!item
					? writeAsync(`users/${currentUser.uid}/orders`, {
							order: func ? func(card) : card,
							quantity: 1,
					  })
					: updateAsync(`users/${currentUser.uid}/orders/${item[0]}`, {
							quantity: ++item[1].quantity,
					  });
			});
	};

	const onRemove = (item) => {
		const exist = cart.find((x) => x.idDrink === item.idDrink);
		if (exist.qty === 1) {
			setCart(cart.filter((x) => x.idDrink !== item.idDrink));
		} else {
			setCart(cart.map((x) => (x.idDrink === item.idDrink ? { ...exist, qty: exist.qty - 1 } : x)));
		}
	};

	const onDouble = (item) => {
		let obj = {
			...item,
			idDrink: item.idDrink + "double",
			strDrink: item.strDrink + " DOUBLE",
			price: item.price + PRICES[item.strIngredient1],
		};

		const exist = cart.find((x) => x.idDrink === obj.idDrink);
		if (exist) {
			setCart(cart.map((x) => (x.idDrink === obj.idDrink ? { ...exist, qty: exist.qty + 1 } : x)));
		} else {
			setCart([...cart, { ...obj, qty: 1 }]);
		}
	};

	return (
		<CartContext.Provider value={{ cart, setCart, onAdd, onRemove, filteredApi, setFilteredApi }}>
			{props.children}
		</CartContext.Provider>
	);
}
