import React, { useState, useContext } from "react";
import { useNavigate, Link as ReactLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Badge } from "@material-ui/core";
import { IconButton, MenuItem, Menu, InputBase } from "@material-ui/core";
// import TextField from '@material-ui/core/TextField';
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import { MainContext } from "../context/MainContext";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ClearIcon from '@material-ui/icons/Clear';
import MenuDrawer from "./MenuDrawer";
import HomeIcon from "@material-ui/icons/Home";
import THEMES from "../consts/THEMES";

export default function MenuAppBar({
  popularIngsSwitch,
  popularCocktailsSwitch,
  cartQty,
  fetchData,
  showDrawer = true,
	mainPage,
	searchCocktail,
	setSearchCocktil
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
	setSearchCocktil(e.target.value)
}

const onClear = () => {
	setSearchCocktil('')
}
	function mainpageCheck() {
		if (mainPage) {
			setSearchCocktil('');
			popularCocktailsSwitch();
		} else navigate("/");
				
 }
	return (
		<div className={classes.rootnav}>
			<AppBar style={{ backgroundColor: "#4052b5", color: "white",}}>
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
					<IconButton
						className={classes.title}
						onClick={() => {
							navigate("/");
						}}
					>
						<HomeIcon />
						Home
					</IconButton>
					<IconButton
						className={classes.title}
						onClick={mainpageCheck}
						
					>
						<img
							alt="icon"
							style={{ width: "45px", borderRadius: "30%" }}
							src="/images/icon.png"
						/>{" "}
						Popular Cocktails
					</IconButton>
					<IconButton
						className={classes.title}
						onClick={() => {
							mainPage ? popularIngsSwitch() : navigate("/");
						}}
					>
						<img
							alt="icon"
							style={{ width: "60px", borderRadius: "30%" }}
							src="https://thecocktaildb.com/images/ingredients/Baileys irish cream.png"
						/>{" "}
						Popular Ingredients
					</IconButton>
					<IconButton
						style={{ background: "#4052b5" }}
						className={classes.title}
						onClick={() => {
							navigate("/cocktail-builder");
						}}
					>
						<img
							alt="icon"
							style={{ width: "60px", borderRadius: "30%" }}
							src="/images/icon2.jpg"
						/>{" "}
						Cocktail Builder
					</IconButton>
					{showDrawer && <div className={classes.search}>
						<InputBase
						style={{paddingLeft: 10}}
							onChange={onInputValue}
							placeholder='Search...'
							value={searchCocktail}
						/>
						<div className={classes.searchIcon}
						 onClick={onClear}
						 style={{
							 cursor:'pointer',
							 paddingRight: 5
							 }}>
							{searchCocktail.length ? <ClearIcon/> : <SearchIcon />}
						</div>
					</div>}
					<div className={classes.title}>
						<Typography variant="h6" className={classes.title}>
							{currentUser ? (
								<Typography style={{ color: "yellow" }}>
									Welcome to COCKTAILBAR{" "}
								</Typography>
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
										<ReactLink
											style={{ color: "#4052b5" }}
											to="/update-profile"
										>
											Update Profile
										</ReactLink>
									</MenuItem>
									<MenuItem onClick={handleClose}>
										<ReactLink
											style={{ color: "#4052b5" }}
											onClick={handleLogout}
											to="/"
										>
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
			{showDrawer && (<MenuDrawer
				// clearfilterProp={searchCocktail.length}
				itemData={fetchData}
				open={openMenu}
				close={() => setOpenMenu(false)}
			/>)}

		</div>
	);
}
