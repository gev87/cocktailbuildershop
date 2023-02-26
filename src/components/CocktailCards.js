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
import { useNavigate } from "react-router-dom";
import LoginSignUp from "./LoginSignUp";
import CardActionArea from "@material-ui/core/CardActionArea";

export default function CocktailCards() {
	const classes = THEMES();
	const navigate = useNavigate();
	const { onAdd, cartQty } = useContext(CartContext);
	const { currentUser } = useContext(MainContext);
	const [data, setData] = useState([]);
	const [show, setShow] = useState([]);
	const [header, setHeader] = useState("MOST POPULAR COCKTAILS");
	const [popularIngs, setPopularIngs] = useState(true);
	const [popularCocktails, setPopularCocktails] = useState([]);
	const [selectedItem, setSelectedItem] = useState("");
	const [youtubeCocktails, setYoutubeCocktails] = useState([]);
	const [clearFilters, setClearfilters] = useState(false);

	const ingredientArray = (cocktail) => {
		return Object.entries(cocktail).reduce((accum, ing) => {
			if (ing[0].includes("strIngredient") && ing[1]) accum.push(ing[1].toLowerCase());
			return accum;
		}, []);
	};

	const findAlcoholic = (cocktail) => {
		return ingredientArray(cocktail).find((ing) => INGREDIENTS[ing]?.isAlcoholic);
	};

	const handleFilters = (filteredCocktails) => {
		setClearfilters(false);
		setShow(filteredCocktails || data);
		setHeader(
			filteredCocktails 
				? `${filteredCocktails.length} Filtered ${
						filteredCocktails.length < 2 ? "Cocktail" : "Cocktails"
				  }`
				: "All Cocktails"
		);
	};

	function showSearchResult(searchText) {
		if (!searchText.length) {
			showPopularCocktails();
		} else {
			setShow(
				data.filter((item) =>
					item.strDrink.trim().toLowerCase().includes(searchText.trim().toLowerCase())
				)
			);
			setClearfilters(true);
			setHeader(
				`Search result ${
					data.filter((item) =>
						item.strDrink.trim().toLowerCase().includes(searchText.trim().toLowerCase())
					).length
				}`
			);
		}
	}

	useEffect(() => {
		if (data.length) {
			setShow(popularCocktails);
		}
	}, [data, popularCocktails]);

	useEffect(() => {
		const allCocktails = localStorage.getItem("allCocktails");
		if (allCocktails) {
			setData(JSON.parse(allCocktails));
			setPopularCocktails(JSON.parse(localStorage.getItem("popularCocktails")));
			setYoutubeCocktails(JSON.parse(localStorage.getItem("youtubeCocktails")));
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

		let bestCocktails = [];
		let videoCocktails = [];
		cocktails.forEach((cocktail, index) => {
			cocktail.price = ingredientArray(cocktail).reduce(
				(sum, ingredient) => sum + INGREDIENTS[ingredient]?.price,
				0
			);
			if ([47, 51, 66, 84, 96, 228, 236, 237, 256, 268, 275, 405].includes(index))
				bestCocktails.push(cocktail);
			if (cocktail.strVideo) videoCocktails.push(cocktail);
		});
		localStorage.setItem("popularCocktails", JSON.stringify(bestCocktails.reverse()));
		setPopularCocktails(bestCocktails);
		localStorage.setItem("youtubeCocktails", JSON.stringify(videoCocktails));
		setYoutubeCocktails(videoCocktails);
		localStorage.setItem("allCocktails", JSON.stringify(cocktails));
		setData(cocktails);
	}

	const onDouble = (item) => {
		return {
			...item,
			idDrink: item.idDrink + "double",
			strDrink: item.strDrink + " DOUBLE",
			price: item.price + INGREDIENTS[findAlcoholic(item)].price,
		};
	};

	function filterByIngredient(i) {
		setHeader("Cocktails Maid of " + i);
		const result = data.filter((cocktail) => ingredientArray(cocktail).includes(i.toLowerCase()));
		setShow(result);
		setClearfilters(true);
	}

	function showPopularCocktails() {
		setHeader("MOST POPULAR COCKTAILS");
		setShow(popularCocktails);
		setClearfilters(true);
	}

	function showYoutubeCocktails() {
		setHeader("COCKTAILS WITH YOUTUBE VIDEO");
		setShow(youtubeCocktails);
		setClearfilters(true);
	}

	function onClearFilters() {
		showPopularCocktails();
	}
	return (
		<>
			<main>
				<NavBar
					showSearchResult={showSearchResult}
					fetchData={data}
					popularIngsSwitch={() => setPopularIngs(!popularIngs)}
					showPopularCocktails={showPopularCocktails}
					showYoutubeCocktails={showYoutubeCocktails}
					cartQty={cartQty}
					handleFilters={handleFilters}
					removeFilters={clearFilters}
					onClearFilters={onClearFilters}
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
													onClick={() => setSelectedItem(cocktail)}
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
													onClick={() => onAdd(cocktail, onDouble)}
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
															onClick={() => onAdd(cocktail)}
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
					<ImgDialog
						open={!!selectedItem}
						close={() => setSelectedItem(null)}
						data={selectedItem}
					/>
				</div>
			</main>
		</>
	);
}
