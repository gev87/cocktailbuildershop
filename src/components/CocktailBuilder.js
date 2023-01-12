import React, { useState, useContext, useEffect } from "react";
import { Container, Typography, Button, TextField } from "@material-ui/core";
import NavBar from "./NavBar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PRICESARR from "../consts/PRICESARR";
import PRICES from "../consts/PRICES";
import { Alert } from "@mui/material";
import { MainContext } from "../context/MainContext";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ShopIcon from "@material-ui/icons/Shop";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Footer from "./Footer";
import THEMES from "../consts/THEMES";
import { calcItemQty } from "../utils/Commonfuncs";
import { writeAsync, readOnceGet, updateAsync } from "../firebase/crudoperations";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function CustomCocktail() {
	const [ingredient1, setIngredient1] = useState("");
	const [ingredient2, setIngredient2] = useState("");
	const [ingredient3, setIngredient3] = useState("");
	const [ingredient4, setIngredient4] = useState("");
	const [cocktailName, setCocktailName] = useState("");
	const [cartQty, setCartQty] = useState(null);
	const [cartChanged, setCartChanged] = useState(null);
	const [error, setError] = useState("");
	const { currentUser } = useContext(MainContext);
	const classes = THEMES();
	const navigate = useNavigate();
	const { onAdd } = useContext(CartContext);
	


	useEffect(() => {
		currentUser && setCartQty(calcItemQty(currentUser));
	}, [currentUser, cartChanged]);

	const obj = {
		idDrink: ingredient1 + ingredient2 + ingredient3 + ingredient4 + cocktailName,
		price:
			PRICES[ingredient1.toLowerCase()] +
			PRICES[ingredient2.toLowerCase()] +
			(PRICES[ingredient3.toLowerCase()] || 0) +
			(PRICES[ingredient4.toLowerCase()] || 0) +
			3,
		strDrink: cocktailName,
		strCategory: currentUser?.displayName + "'s Creation",
		strDrinkThumb: "/images/cocktail1.jpg",
		strIngredient1: ingredient1,
		strIngredient2: ingredient2,
		strIngredient3: ingredient3,
		strIngredient4: ingredient4,
	};

	const addItemToCart = (card, func) => {
		onAdd(card, func);
		setCartQty(cartQty + 1);
		setCartChanged([]);
	};

	function handleSubmit(event) {
		if (!currentUser) {
			return setError("Please Sign In");
		}
		const name = cocktailName ? "" : "COCkTAIL NAME";
		const ing1 = ingredient1 ? "" : "INGREDIENT 1";
		const ing2 = ingredient2 ? "" : "INGREDIENT 2";
		const isOrAre = [name, ing1, ing2].filter((elem) => elem).length > 1 ? "ARE" : "IS";
		if (!ingredient1 || !ingredient2 || !cocktailName) {
			return setError(`${name} ${ing1} ${ing2} ${isOrAre} REQUIRED`);
		}
		setError("Congratulations! You have made a new cocktail");
		event.target.innerText === "ADD TO CART"
			? addItemToCart(obj)
			: setTimeout(() => navigate("/payment"), 2000);
	}

	function onClean() {
		setIngredient1("");
		setIngredient2("");
		setIngredient3("");
		setIngredient4("");
		setCocktailName("");
		setError("");
	}

	return (
		<div>
			<NavBar showDrawer={false} cartQty={cartQty} />
			<Container maxWidth="sm">
				{error[2] === "n" ? (
					<div>
						<Alert variant="filled">{error}</Alert>
					</div>
				) : (
					error && (
						<Alert variant="filled" severity="error">
							{error}
						</Alert>
					)
				)}
			</Container>
			<div
				style={{
					display: "flex",
					minWidth: "300px",
					paddingLeft: "300px",
					flexDirection: "row",
					flexWrap: "wrap",
				}}
			>
				<div style={{ paddingTop: "20px" }}>
					<TextField
						inputProps={{ className: classes.input }}
						onChange={(e) => setCocktailName(e.target.value)}
						variant="outlined"
						label="COCKTAIL NAME"
						value={cocktailName}
						style={{ width: 250, padding: "15px 0px" }}
						color="secondary"
					/>

					<Autocomplete
						classes={{ inputRoot: classes.input }}
						onInputChange={(event, newInputvalue) => {
							setIngredient1(newInputvalue);
						}}
						inputValue={ingredient1}
						id="controllable-states-demo"
						options={PRICESARR}
						getOptionLabel={(option) => option.ingredient}
						style={{ width: 250, padding: "15px 0px" }}
						renderInput={(params) => (
							<TextField {...params} label="INGREDIENT 1" variant="outlined" color="secondary" />
						)}
					/>
					<Autocomplete
						classes={{ inputRoot: classes.input }}
						inputValue={ingredient2}
						onInputChange={(event, newInputvalue) => {
							setIngredient2(newInputvalue);
						}}
						id="controllable-states-demo"
						options={PRICESARR}
						getOptionLabel={(option) => option.ingredient}
						style={{ width: 250, padding: "15px 0px" }}
						renderInput={(params) => (
							<TextField {...params} label="INGREDIENT 2" variant="outlined" color="secondary" />
						)}
					/>
					<Autocomplete
						classes={{ inputRoot: classes.input }}
						inputValue={ingredient3}
						onInputChange={(event, newInputvalue) => {
							setIngredient3(newInputvalue);
						}}
						id="controllable-states-demo"
						options={PRICESARR}
						getOptionLabel={(option) => option.ingredient}
						style={{ width: 250, padding: "15px 0px" }}
						renderInput={(params) => (
							<TextField {...params} label="INGREDIENT 3" variant="outlined" />
						)}
					/>
					<Autocomplete
						classes={{ inputRoot: classes.input }}
						inputValue={ingredient4}
						onInputChange={(event, newInputvalue) => {
							setIngredient4(newInputvalue);
						}}
						id="controllable-states-demo"
						options={PRICESARR}
						getOptionLabel={(option) => option.ingredient}
						style={{ width: 250, padding: "15px 0px" }}
						renderInput={(params) => (
							<TextField {...params} label="INGREDIENT 4" variant="outlined" />
						)}
					/>
				</div>
				<img width="30%" style={{ padding: "0px 50px" }} src="/images/cocktail1.jpg" alt="custom" />

				<div style={{ padding: "0px 50px", width: "150px" }}>
					<Button
						style={{ height: "150px", background: "#ec0000", color: "#6be909" }}
						variant="contained"
						fullWidth
						onClick={handleSubmit}
					>
						ADD To Cart
						<ShoppingCartIcon fontSize="large" />
					</Button>
					<Button
						variant="contained"
						fullWidth
						style={{ height: "150px", background: "yellow", color: "#6e280b" }}
						onClick={onClean}
					>
						CLEAR ALL FIELDS
						<HighlightOffIcon fontSize="large" />
					</Button>
					<Button
						onClick={handleSubmit}
						color="primary"
						variant="contained"
						fullWidth
						style={{ height: "150px" }}
					>
						ORDER NOW <ShopIcon fontSize="large" />
					</Button>
				</div>
			</div>
		</div>
	);
}
export default function CocktailBuilder() {
	const classes = THEMES();

	return (
		<div className={classes.heroContent}>
			<Container maxWidth="sm">
				<Typography
					component="h1"
					variant="h2"
					align="center"
					color="textPrimary"
					gutterBottom
					style={{ color: "#ac5b01" }}
				>
					Cocktail Builder
				</Typography>
			</Container>
			<CustomCocktail />
			<Container maxWidth="sm">
				<Typography
					variant="h5"
					align="center"
					color="textSecondary"
					paragraph
					style={{ color: "#ac5b01" }}
				>
					Here you can challenge yourself by making your own cocktails. Add up to 4 ingredients to
					your cocktail and enjoy.
				</Typography>
				<Footer />
			</Container>
		</div>
	);
}
