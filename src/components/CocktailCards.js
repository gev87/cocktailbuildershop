import React, { useState, useEffect, useContext } from "react";
import { Button, Card, CardActions, CardContent } from "@material-ui/core";
import { CardMedia, Grid, Typography, Container } from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { INGREDIENTS } from "../consts/PRICES";
import THEMES from "../consts/THEMES";
import CustomSwiper from "./CustomSwiper";
import { MainContext } from "../context/MainContext";
import NavBar from "./NavBar";
import ImgDialog from "./ImgDialog";
import { CartContext } from "../context/CartContext";
import { calcItemQty } from "../utils/Commonfuncs";
import { writeAsync, readOnceGet, updateAsync } from "../firebase/crudoperations";
import { useNavigate } from "react-router-dom";
import LoginSignUp from "./LoginSignUp";
import CardActionArea from "@material-ui/core/CardActionArea";

export default function CocktailCards() {
	const classes = THEMES();
	const [data, setData] = useState([]);
	const { currentUser } = useContext(MainContext);
	const [show, setShow] = useState([]);
	const [, setIng] = useState();
	const [header, setHeader] = useState("MOST POPULAR COCKTAILS");
	const [popularIngs, setPopularIngs] = useState(true);
	const [popularCocktails, setPopularCocktails] = useState(true);
	const { filteredApi, setFilteredApi, onAdd } = useContext(CartContext);
	const [selectItem, setSelectItem] = useState("");
	const [openDlg1Dialog, setDialog1Open] = useState(false);
	const [searchCocktail, setSearchCocktail] = useState("");
	const [resultSearchCocktail, setResultSearchCocktail] = useState([]);
	const [cartQty, setCartQty] = useState(null);
	const [cartChanged, setCartChanged] = useState(null);
	const navigate = useNavigate();
	const [, setCart] = useState({});

	const ingredientArray = (cocktail) => {
		return Object.entries(cocktail).reduce((accum, ing) => {
			if (ing[0].includes("strIngredient") && ing[1]) accum.push(ing[1].toLowerCase());
			return accum;
		}, []);
	};

	const findAlcoholic = (cocktail) => {
		return ingredientArray(cocktail).find((ing) => INGREDIENTS[ing]?.isAlcoholic);
	};

	useEffect(() => {
		if (!searchCocktail.length) {
			setResultSearchCocktail([]);
			setFilteredApi([]);
		} else {
			setResultSearchCocktail(
				data.filter((item) =>
					item.strDrink.trim().toLowerCase().includes(searchCocktail.trim().toLowerCase())
				)
			);
		}
	}, [searchCocktail, data, setFilteredApi]);

	useEffect(() => {
		currentUser && setCartQty(calcItemQty(currentUser));
	}, [currentUser, cartChanged]);

	useEffect(() => {
		currentUser &&
			readOnceGet(`users/${currentUser.uid}/orders`, (items) => items).then((value) => {
				setCart(value ? value : {});
				setCartChanged([]);
			});
	}, [currentUser]);

	// useEffect(() => {
	// 	if (filteredApi.length) {
	// 		setShow(filteredApi);
	// 	} else if (data.length) {
	// 		setShow(popularCocktails);
	// 	}
	// }, [data, popularCocktails, filteredApi]);

	useEffect(() => {
		const allCocktails = localStorage.getItem("allCocktails");
		const bestCocktails = localStorage.getItem("popularCocktails");
		if (allCocktails) {
			setData(JSON.parse(allCocktails));
			setPopularCocktails(JSON.parse(bestCocktails));
		} else getAllCocktails();
	}, []);

	async function getAllCocktails() {
		const mainURL = "https://thecocktaildb.com/api/json/v1/1/search.php?f=";
		const letters = "abcdefghijklmnopqrstuvwxyz0123456789";
		const urls = letters.split("").map((letter) => mainURL + letter);
		let allCocktails;
		try {
			const response = urls.map(async (url) => await fetch(url));
			const json = await Promise.all(response);
			allCocktails = await Promise.all(json.map(async (item) => await item.json()));
		} catch {
			return [];
		}
		const cocktails = allCocktails.reduce(
			(all, cocktail) => (cocktail.drinks ? [...all, ...cocktail.drinks] : all),
			[]
		);

		for (const cocktail of cocktails) {
			cocktail.price = ingredientArray(cocktail).reduce(
				(sum, ingredient) => sum + INGREDIENTS[ingredient]?.price,
				0
			);
		}

		const bestCocktails = [
			cocktails[66],
			cocktails[84],
			cocktails[275],
			cocktails[228],
			cocktails[51],
			cocktails[47],
			cocktails[256],
			cocktails[268],
			cocktails[237],
			cocktails[96],
			cocktails[405],
			cocktails[236],
		];
		localStorage.setItem("popularCocktails", JSON.stringify(bestCocktails));
		setPopularCocktails(bestCocktails);
		localStorage.setItem("allCocktails", JSON.stringify(cocktails));
		setData(cocktails);
	}

	useEffect(() => {
		if (filteredApi.length && !resultSearchCocktail.length) {
			setShow(filteredApi);
			setHeader(
				`Filtered ${filteredApi.length < 2 ? "Cocktail" : "Cocktails"} ${filteredApi.length}`
			);
		} else if (
			resultSearchCocktail.length ||
			(!resultSearchCocktail.length && searchCocktail.length)
		) {
			setShow(resultSearchCocktail);
			setHeader(`Search result ${resultSearchCocktail.length}`);
		} else if (data.length && !searchCocktail.length) {
			setShow(popularCocktails);
			setHeader("MOST POPULAR COCKTAILS");
		}
	}, [data, popularCocktails, filteredApi, resultSearchCocktail, searchCocktail.length]);

	const addItemToCart = (cocktail, onDouble) => {
		onAdd(cocktail, onDouble);
		setCartQty(cartQty + 1);
		setCartChanged([]);
	};

	const onDouble = (item) => {
		return {
			...item,
			idDrink: item.idDrink + "double",
			strDrink: item.strDrink + " DOUBLE",
			price: item.price + INGREDIENTS[findAlcoholic(item)].price,
		};
	};

	function filterByIngredient(i) {
		setIng(i);
		setHeader("Cocktails Maid of " + i);
		const result = data.filter((cocktail) => ingredientArray(cocktail).includes(i.toLowerCase()));
		setShow(result);
	}

	function popularCocktailsSwitch() {
		setHeader("MOST POPULAR COCKTAILS");
		setShow(popularCocktails);
	}
	return (
		<>
			<main>
				<NavBar
					searchCocktail={searchCocktail}
					setSearchCocktil={setSearchCocktail}
					mainPage
					fetchData={data}
					popularIngsSwitch={() => setPopularIngs(!popularIngs)}
					popularCocktailsSwitch={popularCocktailsSwitch}
					cartQty={cartQty}
				/>
				<div style={{ backgroundColor: "#4052b5" }}>
					<img width="100%" alt="background" src="/images/cocktailbackground.jpg" />
				</div>
				{popularIngs && <CustomSwiper filterByIngredient={filterByIngredient} />}
				<div style={{ backgroundColor: "#4052b5", color: "black" }}>
					<br />
					<Typography variant="h4" align="center" paragraph>
						{header}
					</Typography>
					<Container className={classes.cardGrid} maxWidth="md">
						<Grid container spacing={4}>
							{Array.isArray(show) &&
								show.map((cocktail) => (
									<Grid item key={cocktail.idDrink} xs={12} sm={6} md={4}>
										<Card className={classes.card}>
											<CardActionArea>
												<CardMedia
													className={classes.cardMedia}
													image={cocktail.strDrinkThumb}
													title={cocktail.strDrink}
													onClick={() => {
														setSelectItem(cocktail);
														setDialog1Open(true);
													}}
												/>
											</CardActionArea>
											<CardContent className={classes.cardContent}>
												<Typography gutterBottom variant="h5" component="h2">
													{cocktail.strDrink}
												</Typography>

												<Typography>{cocktail.strCategory}</Typography>
											</CardContent>
											{currentUser && cocktail.strAlcoholic === "Alcoholic" && (
												<Button
													onClick={() => addItemToCart(cocktail, onDouble)}
													color="primary"
													variant="outlined"
													style={{ marginLeft: "10px", marginRight: "10px" }}
												>
													{`Double <<${findAlcoholic(cocktail)}>>  /+$${
														INGREDIENTS[findAlcoholic(cocktail)]?.price
													}.00`}
												</Button>
											)}
											<CardActions>
												{currentUser ? (
													<>
														<Button
															onClick={() => addItemToCart(cocktail)}
															size="small"
															color="primary"
															variant="outlined"
														>
															ADD TO{" "}
															<ShoppingCartIcon style={{ paddingLeft: "10px", color: "#6be909" }} />
														</Button>
														<Button
															onClick={() => navigate("/payment")}
															variant="outlined"
															size="small"
															color="primary"
														>
															Order Now
														</Button>
													</>
												) : (
													<LoginSignUp />
												)}
												<Grid item>
													<Typography variant="button">${cocktail.price}.00</Typography>{" "}
												</Grid>
											</CardActions>
										</Card>
									</Grid>
								))}
						</Grid>
					</Container>
					<ImgDialog open={openDlg1Dialog} close={() => setDialog1Open(false)} data={selectItem} />
				</div>
			</main>
		</>
	);
}
