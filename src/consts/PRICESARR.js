import INGREDIENTS from "./PRICES";

const PRICESARR = [];

for (let key in INGREDIENTS) {
	PRICESARR.push({ ingredient: key, price: INGREDIENTS[key].price });
}

export default PRICESARR;
