import React, { useContext, useEffect } from "react";
import { Button, Container, CardActions, CardContent } from "@material-ui/core";
import { CardMedia, Grid, Typography, Card, Icon } from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import NavBar from "./NavBar";
import Footer from "./Footer";
import THEMES from "../consts/THEMES";
import { readOnceGet, updateAsync, removeAsync } from "../firebase/crudoperations";
import { MainContext } from "../context/MainContext";
import ShopIcon from "@material-ui/icons/Shop";
import RemoveShoppingCartOutlinedIcon from "@material-ui/icons/RemoveShoppingCartOutlined";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Basket() {
	const classes = THEMES();
	const { currentUser } = useContext(MainContext);
	const { cart, setCart, cartQty, setCartQty, getCart, onAdd } = useContext(CartContext);
	const navigate = useNavigate();

	const addItemToCart = async (card) => {
		await onAdd(card, undefined, cart);
		const cartData = await readOnceGet(`users/${currentUser.uid}/orders`);
		setCart(cartData || {});
	};

	const removeItemFromCart = async (card) => {
		const item = Object.entries(cart).find((e) => e[1].order.idDrink === card.idDrink);
		item[1].quantity <= 1
			? removeAsync(`users/${currentUser.uid}/orders/${item[0]}`)
			: await updateAsync(`users/${currentUser.uid}/orders/${item[0]}`, {
					quantity: --item[1].quantity,
			  });

		const cartData = await readOnceGet(`users/${currentUser.uid}/orders`);
		setCart(cartData || {});
		setCartQty((qty) => --qty);
	};

	function clearAll(currentUser) {
		removeAsync(`users/${currentUser.uid}/orders`);
		setCart({});
		setCartQty(null);
	}

	useEffect(() => {
		getCart();
	}, [currentUser]);

	return (
		<React.Fragment>
			<NavBar cartQty={cartQty} showDrawer={false} />
			<main>
				<div className={classes.heroContent}>
					<Container maxWidth="sm">
						<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
							Cocktail Basket
						</Typography>
						<Typography variant="h5" align="center" color="textSecondary" paragraph>
							What is the difference between a blonde and a shopping cart? Sometimes, the shopping
							cart has a mind of its own.
						</Typography>
						{!cartQty ? (
							<img
								alt="cart"
								src="https://www.vinsolutions.com/wp-content/uploads/sites/2/vinsolutions/media/Vin-Images/news-blog/Empty_Shopping_Cart_blog.jpg"
							/>
						) : (
							<div style={{ display: "flex" }}>
								<Button
									onClick={() => clearAll(currentUser)}
									fullWidth
									variant="contained"
									size="small"
									color="secondary"
								>
									Clear Basket
									<RemoveShoppingCartOutlinedIcon size="small" style={{ paddingLeft: "10px" }} />
								</Button>
								<Button
									onClick={() => navigate("/payment")}
									fullWidth
									variant="contained"
									size="small"
									color="primary"
								>
									<ShopIcon
										style={{ paddingRight: "10px", paddingBottom: "5px" }}
										fontSize="small"
									/>
									Order All for $
									{Object.entries(cart).reduce((cur, elem) => {
										return cur + elem[1].quantity * elem[1].order.price;
									}, 0)}
									.00
								</Button>{" "}
							</div>
						)}
					</Container>
				</div>

				<Container className={classes.cardGrid} maxWidth="md">
					<Grid container spacing={4}>
						{Object.entries(cart).map((it) => {
							let card = it[1].order;
							let qty = it[1].quantity;

							return (
								<Grid item key={it[0]} xs={12} sm={6} md={4}>
									<Card className={classes.card}>
										<CardMedia
											className={classes.cardMedia}
											image={card.strDrinkThumb}
											title={card.strDrink}
										/>
										<CardContent className={classes.cardContent}>
											{card.strDrink.split(" ")[card.strDrink.split(" ").length - 1] ===
											"DOUBLE" ? (
												<Typography color="secondary" gutterBottom variant="h5" component="h2">
													{card.strDrink} <Typography>with extra {card.strIngredient1}</Typography>
												</Typography>
											) : (
												<Typography gutterBottom variant="h5" component="h2">
													{card.strDrink}
												</Typography>
											)}
											<Typography>{card.strCategory}</Typography>
										</CardContent>
										<Button
											onClick={() => navigate("/payment")}
											variant="outlined"
											size="small"
											color="primary"
										>
											Order Now
										</Button>
										<CardActions>
											<Button
												onClick={() => removeItemFromCart(card)}
												size="small"
												color="secondary"
												variant="outlined"
											>
												<ShoppingCartIcon style={{ color: "#f50057" }} />
												<Icon size="small" variant="secondary">
													remove_circle
												</Icon>
											</Button>
											<Typography style={{ color: "green" }}>{" " + qty + " "}</Typography>
											<Button
												onClick={() => addItemToCart(card)}
												size="small"
												color="primary"
												variant="outlined"
											>
												<ShoppingCartIcon style={{ paddingLeft: "10px", color: "#6be909" }} />
												<Icon size="small" style={{ color: "#6be909" }}>
													add_circle
												</Icon>
											</Button>
											<Grid item>
												<Typography variant="button">${(qty * card.price).toFixed(2)}</Typography>
											</Grid>
											.
										</CardActions>
									</Card>
								</Grid>
							);
						})}
					</Grid>
				</Container>
			</main>

			<Footer />
		</React.Fragment>
	);
}
