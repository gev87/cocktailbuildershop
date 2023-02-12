import React, { useState, useContext } from "react";
import { useNavigate, Link as ReactLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Badge } from "@material-ui/core";
import { IconButton, MenuItem, Menu, InputBase } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import YouTubeIcon from "@material-ui/icons/YouTube";
import { MainContext } from "../context/MainContext";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ClearIcon from "@material-ui/icons/Clear";
import MenuDrawer from "./MenuDrawer";
import HomeIcon from "@material-ui/icons/Home";
import THEMES from "../consts/THEMES";

export default function MenuAppBar({
	popularIngsSwitch,
	showPopularCocktails,
	showYoutubeCocktails,
	cartQty,
	fetchData,
	showDrawer = true,
	searchCocktail,
	setSearchCocktail,
}) {
	const classes = THEMES();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [, setError] = useState("");
	const { currentUser, logout } = useContext(MainContext);
	const navigate = useNavigate();
	const [openMenu, setOpenMenu] = useState(false);
	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	async function handleLogout() {
		setError("");

		try {
			await logout();
			navigate("/");
		} catch {
			setError("Failed to Log out");
		}
	}
	const onInputValue = (e) => {
		setSearchCocktail(e.target.value);
	};

	const onClear = () => {
		setSearchCocktail("");
	};

	return (
		<div className={classes.rootnav}>
			<AppBar style={{ backgroundColor: "#4052b5", color: "white" }}>
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="menu"
						onClick={() => setOpenMenu(true)}
					>
						<MenuIcon />
					</IconButton>
					{!showPopularCocktails && (
						<IconButton
							className={classes.title}
							onClick={() => {
								navigate("/");
							}}
						>
							<HomeIcon />
							Home
						</IconButton>
					)}
					{window.location.href.endsWith("cocktail-builder") ? (
						<Typography variant="subtitle1" style={{ paddingRight: 50, color: "yellow" }}>
							Here you can challenge yourself by making your own cocktails. Add up to 4 ingredients
							to your cocktail and enjoy !
						</Typography>
					) : (
						<IconButton
							className={classes.title}
							onClick={() => {
								navigate("/cocktail-builder");
							}}
						>
							<img
								alt="icon"
								style={{
									width: "60px",
									borderRadius: "30%",
								}}
								src="/images/icon2.jpg"
							/>{" "}
							Cocktail Builder
						</IconButton>
					)}
					{!!showPopularCocktails && (
						<IconButton className={classes.title} onClick={popularIngsSwitch}>
							<img
								alt="icon"
								style={{ width: "60px", borderRadius: "30%" }}
								src="https://thecocktaildb.com/images/ingredients/Baileys irish cream.png"
							/>{" "}
							Popular Ingredients
						</IconButton>
					)}
					{!!showPopularCocktails && (
						<IconButton className={classes.title} onClick={showPopularCocktails}>
							<img
								alt="icon"
								style={{ width: "45px", borderRadius: "30%" }}
								src="/images/icon.png"
							/>{" "}
							Popular Cocktails
						</IconButton>
					)}
					{!!showYoutubeCocktails && (
						<IconButton className={classes.title} onClick={showYoutubeCocktails}>
							<YouTubeIcon
								style={{
									fontSize: 40,
									color: "red",
								}}
							/>
							Cocktails
							<br />
							in YouTube
						</IconButton>
					)}

					{showDrawer && (
						<div className={classes.search}>
							<InputBase
								style={{ paddingLeft: 10 }}
								onChange={onInputValue}
								placeholder="Search..."
								value={searchCocktail}
							/>
							<div
								className={classes.searchIcon}
								onClick={onClear}
								style={{
									cursor: "pointer",
									paddingRight: 5,
								}}
							>
								{searchCocktail.length ? <ClearIcon /> : <SearchIcon />}
							</div>
						</div>
					)}
					<div className={classes.title}>
						<Typography variant="h6" className={classes.title}>
							{currentUser ? (
								<Typography style={{ color: "yellow" }}>Welcome to COCKTAILBAR </Typography>
							) : (
								"COCKTAILBAR Guest"
							)}
						</Typography>

						{currentUser ? (
							<Typography variant="h6" className={classes.title}>
								{" "}
								{"Email : " + currentUser.email}
							</Typography>
						) : null}
					</div>
					<div>
						{!currentUser ? (
							<>
								<Button
									className={classes.title}
									color="inherit"
									onClick={() => {
										navigate("/login");
									}}
								>
									Login
								</Button>
								<Button
									className={classes.title}
									color="inherit"
									onClick={() => {
										navigate("/signup");
									}}
								>
									Sign up
								</Button>
							</>
						) : (
							<>
								<IconButton
									className={classes.title}
									aria-label="account of current user"
									aria-controls="menu-appbar"
									aria-haspopup="true"
									onClick={handleMenu}
									color="inherit"
								>
									<AccountCircle />
								</IconButton>
								<Menu
									id="menu-appbar"
									anchorEl={anchorEl}
									anchorOrigin={{
										vertical: "top",
										horizontal: "right",
									}}
									keepMounted
									transformOrigin={{
										vertical: "top",
										horizontal: "right",
									}}
									open={open}
									onClose={handleClose}
								>
									<MenuItem onClick={handleClose}>
										<ReactLink style={{ color: "#4052b5" }} to="/update-profile">
											Update Profile
										</ReactLink>
									</MenuItem>
									<MenuItem onClick={handleClose}>
										<ReactLink style={{ color: "#4052b5" }} onClick={handleLogout} to="/">
											Log Out
										</ReactLink>
									</MenuItem>
								</Menu>
							</>
						)}
					</div>
					<div>
						{currentUser ? (
							<IconButton
								className={classes.title}
								onClick={() => {
									navigate("/shoping-card");
								}}
							>
								<Badge
									overlap="rectangular"
									badgeContent={cartQty > 0 ? cartQty : null}
									color="secondary"
								>
									<ShoppingCartIcon />
								</Badge>
							</IconButton>
						) : (
							""
						)}
					</div>
				</Toolbar>
			</AppBar>
			{showDrawer && (
				<MenuDrawer
					// clearfilterProp={searchCocktail.length}
					itemData={fetchData}
					open={openMenu}
					close={() => setOpenMenu(false)}
				/>
			)}
		</div>
	);
}
