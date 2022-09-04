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
import {
	writeAsync,
	readOnceGet,
	updateAsync,
} from "../firebase/crudoperations";
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
	const { filteredApi, setFilteredApi } = useContext(CartContext);
	const [selectItem, setSelectItem] = useState("");
	const [openDlg1Dialog, setDialog1Open] = useState(false);
	const [searchCocktail, setSearchCocktil] = useState('')
	const [resultSearchCocktail, setResultSearchCocktail] = useState([])
	const [cartQty, setCartQty] = useState(null);
	const [cartChanged, setCartChanged] = useState(null);
	const navigate = useNavigate();
	const [, setCart] = useState({});
	// console.log(resultSearchCocktail)

	useEffect(() => {
		if (!searchCocktail.length) {
			setResultSearchCocktail([])
			setFilteredApi([])
		} else {
			setResultSearchCocktail(
				data.filter(
					(item) => item.strDrink.trim().toLowerCase().includes(searchCocktail.trim().toLowerCase()))
			)
		}

	}, [searchCocktail,data,setFilteredApi])

	useEffect(() => {
		currentUser && setCartQty(calcItemQty(currentUser));
	},[currentUser,cartChanged]);
	
	useEffect(() => {
		currentUser &&
			readOnceGet(`users/${currentUser.uid}/orders`, (items) => items).then(
				(value) => {
					setCart(value ? value : {});
					setCartChanged([]);
				}
			);
	}, [currentUser]);


	useEffect(() => {
		if (filteredApi.length) {
			setShow(filteredApi);
		} else if (data.length) {
			setShow(popularCocktails);
		}
	}, [data, popularCocktails, filteredApi]);

	useEffect(() => {
		let each = [];
		let letters = "abcdefghijklmnopqrstuvwxyz0123456789";
		let urls = [];
		for (let letter of letters) {
			urls.push(
				"https://thecocktaildb.com/api/json/v1/1/search.php?f=" + letter
			);
		}
		let requests = urls.map((url) => fetch(url));
		Promise.all(requests)
			.then((responses) => Promise.all(responses.map((item) => item.json())))
			.then((items) => {
				items.forEach((item) => {
					if (item.drinks !== null) each = each.concat(item.drinks);
				});
				for (let cocktail of each) {
					let ingPrice1 = PRICES.hasOwnProperty(cocktail.strIngredient1)
						? PRICES[cocktail.strIngredient1]
						: 3;
					let ingPrice2 = PRICES.hasOwnProperty(cocktail.strIngredient2)
						? PRICES[cocktail.strIngredient2]
						: 3;
					let ingPrice3 = PRICES.hasOwnProperty(cocktail.strIngredient3)
						? PRICES[cocktail.strIngredient3]
						: cocktail.strIngredient3 === null
							? 0
							: 3;
					let ingPrice4 = PRICES.hasOwnProperty(cocktail.strIngredient4)
						? PRICES[cocktail.strIngredient4]
						: cocktail.strIngredient4 === null
							? 0
							: 3;
					let ingPrice5 = PRICES.hasOwnProperty(cocktail.strIngredient5)
						? PRICES[cocktail.strIngredient5]
						: cocktail.strIngredient5 === null
							? 0
							: 3;
					let ingPrice6 = PRICES.hasOwnProperty(cocktail.strIngredient6)
						? PRICES[cocktail.strIngredient6]
						: cocktail.strIngredient6 === null
							? 0
							: 3;
					cocktail.price =
						ingPrice1 +
						ingPrice2 +
						ingPrice3 +
						ingPrice4 +
						ingPrice5 +
						ingPrice6;
				}
				setPopularCocktails([
					each[66],
					each[84],
					each[275],
					each[228],
					each[51],
					each[47],
					each[256],
					each[268],
					each[237],
					each[96],
					each[405],
					each[236],
				]);
				setData(each);
			});
	}, []);


	useEffect(() => {
		if (filteredApi.length && !resultSearchCocktail.length) {
			setShow(filteredApi);
			setHeader(
				`Filtered ${filteredApi.length < 2 ? "Cocktail" : "Cocktails"} ${
					filteredApi.length
				}`
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
	}, [
		data,
		popularCocktails,
		filteredApi,
		resultSearchCocktail,
		searchCocktail.length,
	]);

	const addItemToCart = (card, func) => {
		currentUser &&
			readOnceGet(`users/${currentUser.uid}/orders`, (items) => items).then(
				(value) => {
					const item =
						value &&
						Object.entries(value).find(
							(e) =>
								e[1].order.idDrink ===
								(func ? func(card).idDrink : card.idDrink)
						);
					!item
						? writeAsync(`users/${currentUser.uid}/orders`, {
							order: func ? func(card) : card,
							quantity: 1,
						})
						: updateAsync(`users/${currentUser.uid}/orders/${item[0]}`, {
								quantity: ++item[1].quantity,
						  });
				}
			);
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
					? item.strIngredient1
					: !NONALCOHOLIC.hasOwnProperty(item.strIngredient2)
						? item.strIngredient2
						: !NONALCOHOLIC.hasOwnProperty(item.strIngredient3)
							? item.strIngredient3
							: !NONALCOHOLIC.hasOwnProperty(item.strIngredient4)
								? item.strIngredient4
								: !NONALCOHOLIC.hasOwnProperty(item.strIngredient5)
									? item.strIngredient5
									: item.strIngredient6
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
					mainPage={true}
					fetchData={data}
					popularIngsSwitch={popularIngsSwitch}
					popularCocktailsSwitch={popularCocktailsSwitch}
					cartQty={cartQty}
				/>
				<div style={{ backgroundColor: "#4052b5" }}>
					<img
						width="100%"
						alt="background"
						src="/images/cocktailbackground.jpg"
					/>
				</div>
				{popularIngs && (
					<CustomSwiper filterByIngredient={(i) => filterByIngredient(i)} />
				)}
				<div style={{ backgroundColor: "#4052b5", color: "black" }}>
					<br />
					<Typography variant="h4" align="center" paragraph>
						{header}
					</Typography>
					<Container className={classes.cardGrid} maxWidth="md">
						<Grid container spacing={4}>
							{show.map((card) => (
								<Grid item key={card.idDrink} xs={12} sm={6} md={4}>
									<Card className={classes.card}>
										<CardActionArea>
											<CardMedia
												className={classes.cardMedia}
												image={card.strDrinkThumb}
												title={card.strDrink}
												onClick={() => {
													setSelectItem(card);
													setDialog1Open(true);
												}}
											/>
										</CardActionArea>
										<CardContent className={classes.cardContent}>
											<Typography gutterBottom variant="h5" component="h2">
												{card.strDrink}
											</Typography>

											<Typography>{card.strCategory}</Typography>
										</CardContent>
										{currentUser && card.strAlcoholic === "Alcoholic" && (
											<Button
												onClick={() => addItemToCart(card, onDouble)}
												color="primary"
												variant="outlined"
												style={{ marginLeft: "10px", marginRight: "10px" }}
											>
												{ing
													? "Double <<" + ing + ">>  /+$" + PRICES[ing] + ".00"
													: !NONALCOHOLIC.hasOwnProperty(card.strIngredient1)
														? "Double <<" +
														card.strIngredient1 +
														">>  /+$" +
														PRICES[card.strIngredient1] +
														".00"
														: !NONALCOHOLIC.hasOwnProperty(card.strIngredient2)
															? "Double <<" +
															card.strIngredient2 +
															">>  /+$" +
															PRICES[card.strIngredient2] +
															".00"
															: !NONALCOHOLIC.hasOwnProperty(card.strIngredient3)
																? "Double <<" +
																card.strIngredient3 +
																">>  /+$" +
																PRICES[card.strIngredient3] +
																".00"
																: !NONALCOHOLIC.hasOwnProperty(card.strIngredient4)
																	? "Double <<" +
																	card.strIngredient4 +
																	">>  /+$" +
																	PRICES[card.strIngredient4] +
																	".00"
																	: !NONALCOHOLIC.hasOwnProperty(card.strIngredient5)
																		? "Double <<" +
																		card.strIngredient5 +
																		">>  /+$" +
																		PRICES[card.strIngredient5] +
																		".00"
																		: "Double <<" +
																		card.strIngredient6 +
																		">>  /+$" +
																		PRICES[card.strIngredient6] +
																		".00"}
											</Button>
										)}
										<CardActions>
											{currentUser ? (
												<>
													<Button
														onClick={() => addItemToCart(card)}
														size="small"
														color="primary"
														variant="outlined"
													>
														ADD TO{" "}
														<ShoppingCartIcon
															style={{ paddingLeft: "10px", color: "#6be909" }}
														/>
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
													<LoginSignUp/>
											)}
											<Grid item>
												<Typography variant="button">
													${card.price}.00
												</Typography>{" "}
											</Grid>
										</CardActions>
									</Card>
								</Grid>
							))}
						</Grid>
					</Container>
					<ImgDialog
						open={openDlg1Dialog}
						close={() => setDialog1Open(false)}
						data={selectItem}
					/>
				</div>
			</main>
		</>
	);
}
