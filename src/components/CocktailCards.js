import React, { useState, useEffect, useContext } from "react";
import { Button, Card, CardActions, CardContent } from "@material-ui/core";
import { CardMedia, Grid, Typography, Container } from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PRICES from "../consts/PRICES";
import THEMES from "../consts/THEMES";
import CustomSwiper from "./CustomSwiper";
import { MainContext } from "../context/MainContext";
import NavBar from "./NavBar";
import NONALCOHOLIC from "../consts/NONALCOHOLIC";
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
	const [ing, setIng] = useState();
	const [header, setHeader] = useState("MOST POPULAR COCKTAILS");
	const [popularIngs, setPopularIngs] = useState(true);
	const [popularCocktails, setPopularCocktails] = useState(true);
	const { filteredApi, setFilteredApi, onAdd } = useContext(CartContext);
	const [selectItem, setSelectItem] = useState("");
	const [openDlg1Dialog, setDialog1Open] = useState(false);
	const [searchCocktail, setSearchCocktil] = useState("");
	const [resultSearchCocktail, setResultSearchCocktail] = useState([]);
	const [cartQty, setCartQty] = useState(null);
	const [cartChanged, setCartChanged] = useState(null);
	const navigate = useNavigate();
	const [, setCart] = useState({});

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
		const urls = [];
		for (const letter of letters) {
			urls.push(mainURL + letter);
		}
		const requests = urls.map(async (url) => await fetch(url));
		const response = await Promise.all(requests);
		const allCocktails = await Promise.all(response.map(async (item) => await item.json()));
		const cocktails = allCocktails.reduce(
			(all, cocktail) => (cocktail.drinks ? [...all, ...cocktail.drinks] : all),
			[]
		);

		for (const cocktail of cocktails) {
			const ingredients = [
				cocktail.strIngredient1,
				cocktail.strIngredient2,
				cocktail.strIngredient3,
				cocktail.strIngredient4,
				cocktail.strIngredient5,
				cocktail.strIngredient6,
				cocktail.strIngredient7,
				cocktail.strIngredient8,
				cocktail.strIngredient9,
				cocktail.strIngredient10,
				cocktail.strIngredient11,
				cocktail.strIngredient12,
				cocktail.strIngredient13,
				cocktail.strIngredient14,
				cocktail.strIngredient15,
			];
			cocktail.price = ingredients.reduce((sum, ingredient) => {
				if (ingredient) sum += PRICES[ingredient.toLowerCase()];
				return sum;
			}, 0);
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
			price:
				item.price +
				PRICES[
					!NONALCOHOLIC.hasOwnProperty(item.strIngredient1)
						? item.strIngredient1.toLowerCase()
						: !NONALCOHOLIC.hasOwnProperty(item.strIngredient2)
						? item.strIngredient2.toLowerCase()
						: !NONALCOHOLIC.hasOwnProperty(item.strIngredient3)
						? item.strIngredient3.toLowerCase()
						: !NONALCOHOLIC.hasOwnProperty(item.strIngredient4)
						? item.strIngredient4.toLowerCase()
						: !NONALCOHOLIC.hasOwnProperty(item.strIngredient5)
						? item.strIngredient5.toLowerCase()
						: item.strIngredient6.toLowerCase()
				],
		};
	};

	function filterByIngredient(i) {
		setIng(i);
		setHeader("Cocktails Maid of " + i);
		let filtereddata = [];
		for (let cocktail of data) {
			if (
				[
					cocktail.strIngredient1,
					cocktail.strIngredient2,
					cocktail.strIngredient3,
					cocktail.strIngredient4,
				].includes(i)
			) {
				filtereddata = filtereddata.concat(cocktail);
			}
		}
		setShow(filtereddata);
	}

	function popularIngsSwitch() {
		popularIngs ? setPopularIngs(false) : setPopularIngs(true);
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
					setSearchCocktil={setSearchCocktil}
					mainPage
					fetchData={data}
					popularIngsSwitch={popularIngsSwitch}
					popularCocktailsSwitch={popularCocktailsSwitch}
					cartQty={cartQty}
				/>
				<div style={{ backgroundColor: "#4052b5" }}>
					<img width="100%" alt="background" src="/images/cocktailbackground.jpg" />
				</div>
				{popularIngs && <CustomSwiper filterByIngredient={(i) => filterByIngredient(i)} />}
				<div style={{ backgroundColor: "#4052b5", color: "black" }}>
					<br />
					<Typography variant="h4" align="center" paragraph>
						{header}
					</Typography>
					<Container className={classes.cardGrid} maxWidth="md">
						<Grid container spacing={4}>
							{show.map((cocktail) => (
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
												{ing
													? "Double <<" + ing + ">>  /+$" + PRICES[ing.toLowerCase()] + ".00"
													: !NONALCOHOLIC.hasOwnProperty(cocktail.strIngredient1)
													? "Double <<" +
													  cocktail.strIngredient1 +
													  ">>  /+$" +
													  PRICES[cocktail.strIngredient1.toLowerCase()] +
													  ".00"
													: !NONALCOHOLIC.hasOwnProperty(cocktail.strIngredient2)
													? "Double <<" +
													  cocktail.strIngredient2 +
													  ">>  /+$" +
													  PRICES[cocktail.strIngredient2.toLowerCase()] +
													  ".00"
													: !NONALCOHOLIC.hasOwnProperty(cocktail.strIngredient3)
													? "Double <<" +
													  cocktail.strIngredient3 +
													  ">>  /+$" +
													  PRICES[cocktail.strIngredient3.toLowerCase()] +
													  ".00"
													: !NONALCOHOLIC.hasOwnProperty(cocktail.strIngredient4)
													? "Double <<" +
													  cocktail.strIngredient4 +
													  ">>  /+$" +
													  PRICES[cocktail.strIngredient4.toLowerCase()] +
													  ".00"
													: !NONALCOHOLIC.hasOwnProperty(cocktail.strIngredient5)
													? "Double <<" +
													  cocktail.strIngredient5 +
													  ">>  /+$" +
													  PRICES[cocktail.strIngredient5.toLowerCase()] +
													  ".00"
													: "Double <<" +
													  cocktail.strIngredient6 +
													  ">>  /+$" +
													  PRICES[cocktail.strIngredient6.toLowerCase()] +
													  ".00"}
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
