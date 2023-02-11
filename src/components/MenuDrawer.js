import React, { useContext, useEffect, useState } from "react";
import { Drawer, Accordion, AccordionSummary } from "@material-ui/core";
import { AccordionDetails, Checkbox, Typography } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { CartContext } from "../context/CartContext";
import THEMES from "../consts/THEMES";

export default function MenuDrawer({ open, close, itemData, clearfilterProp }) {
	const classes = THEMES();
	const { filteredApi, setFilteredApi } = useContext(CartContext);
	const objForMap = {
		alcoholic: ["Alcoholic", "Non alcoholic", "Optional alcohol"],
		category: [
			"Shot",
			"Cocktail",
			"Ordinary Drink",
			"Beer",
			"Other/Unknown",
			"Punch / Party Drink",
			"Coffee / Tea",
			"Soft Drink",
			"Homemade Liqueur",
			"Cocoa",
			"Shake",
		],
		stateYoutube: ["YoutubeVideo"],
	};
	const [checkedValue, setCheckedValue] = useState([]);
	const transitionDuration = 1000;

	useEffect(() => {
		console.log("checkedValue", checkedValue, filteredApi);
		const result = [];
		let youtube = "YoutubeVideo";
		for (const objElem of itemData) {
			if (checkedValue.includes("YoutubeVideo")) {
				youtube = objElem.strVideo;
			}
			for (let i = 0; i < checkedValue.length; i++) {
				if (
					(checkedValue.includes("Alcoholic") ||
						checkedValue.includes("Non alcoholic") ||
						checkedValue.includes("Optional alcohol")) &&
					((youtube === "YoutubeVideo" && checkedValue.length === 1) ||
						(Boolean(objElem.strVideo) && checkedValue.length === 2 && youtube !== "YoutubeVideo"))
				) {
					if (
						(Object.values(objElem).includes(checkedValue[i]) && youtube === "YoutubeVideo") ||
						(Object.values(objElem).includes(checkedValue[i]) &&
							youtube !== "YoutubeVideo" &&
							youtube)
					) {
						if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
							result.push(objElem);
						}
					}
				}
				if (
					!checkedValue.includes("Alcoholic") &&
					!checkedValue.includes("Non alcoholic") &&
					!checkedValue.includes("Optional alcohol") &&
					checkedValue.length
				) {
					if (youtube !== "YoutubeVideo") {
						if (
							(Object.values(objElem).includes(checkedValue[i]) && objElem.strVideo) ||
							(objElem.strVideo && checkedValue.length === 1)
						) {
							if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
								result.push(objElem);
							}
						}
					} else if (Object.values(objElem).includes(checkedValue[i])) {
						if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
							result.push(objElem);
						}
					}
				}
				if (
					checkedValue.includes("Alcoholic") &&
					checkedValue.includes("Non alcoholic") &&
					checkedValue.includes("Optional alcohol") &&
					((youtube === "YoutubeVideo" && checkedValue.length === 3) ||
						(Boolean(objElem.strVideo) && checkedValue.length === 4 && youtube !== "YoutubeVideo"))
				) {
					if (youtube !== "YoutubeVideo") {
						if (Object.values(objElem).includes(checkedValue[i]) && objElem.strVideo)
							if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
								result.push(objElem);
							}
					}
					if (checkedValue.length === 3) {
						setFilteredApi(itemData);
						return;
					}
				}
				if (
					((checkedValue.includes("Alcoholic") && checkedValue.includes("Non alcoholic")) ||
						(checkedValue.includes("Alcoholic") && checkedValue.includes("Optional alcohol")) ||
						(checkedValue.includes("Non alcoholic") &&
							checkedValue.includes("Optional alcohol"))) &&
					((youtube === "YoutubeVideo" && checkedValue.length === 2) ||
						(Boolean(objElem.strVideo) && checkedValue.length === 3 && youtube !== "YoutubeVideo"))
				) {
					if (youtube !== "YoutubeVideo") {
						if (Object.values(objElem).includes(checkedValue[i]) && objElem.strVideo) {
							if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
								result.push(objElem);
							}
						}
					} else {
						if (Object.values(objElem).includes(checkedValue[i]) && checkedValue[i] !== youtube) {
							if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
								result.push(objElem);
							}
						}
					}
				}

				if (
					(checkedValue.includes("Alcoholic") &&
						!checkedValue.includes("Non alcoholic") &&
						!checkedValue.includes("Optional alcohol")) ||
					(!checkedValue.includes("Alcoholic") &&
						checkedValue.includes("Non alcoholic") &&
						!checkedValue.includes("Optional alcohol")) ||
					(!checkedValue.includes("Alcoholic") &&
						!checkedValue.includes("Non alcoholic") &&
						checkedValue.includes("Optional alcohol"))
				) {
					if (Object.values(objElem).includes("Alcoholic") && checkedValue.includes("Alcoholic")) {
						if (youtube !== "YoutubeVideo") {
							if (
								Object.values(objElem).includes(checkedValue[i]) &&
								checkedValue[i] !== "Alcoholic" &&
								objElem.strVideo
							) {
								if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
									result.push(objElem);
								}
							}
						} else if (
							Object.values(objElem).includes(checkedValue[i]) &&
							checkedValue[i] !== "Alcoholic" &&
							youtube === "YoutubeVideo"
						) {
							if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
								result.push(objElem);
							}
						}
					}

					if (
						Object.values(objElem).includes("Non alcoholic") &&
						checkedValue.includes("Non alcoholic")
					) {
						if (youtube !== "YoutubeVideo") {
							if (
								Object.values(objElem).includes(checkedValue[i]) &&
								checkedValue[i] !== "Non alcoholic" &&
								objElem.strVideo
							) {
								if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
									result.push(objElem);
								}
							}
						} else if (
							Object.values(objElem).includes(checkedValue[i]) &&
							checkedValue[i] !== "Non alcoholic"
						) {
							if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
								result.push(objElem);
							}
						}
					}

					if (
						Object.values(objElem).includes("Optional alcohol") &&
						checkedValue.includes("Optional alcohol")
					) {
						if (youtube !== "YoutubeVideo") {
							if (
								Object.values(objElem).includes(checkedValue[i]) &&
								checkedValue[i] !== "Optional alcohol" &&
								objElem.strVideo
							) {
								if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
									result.push(objElem);
								}
							}
						} else if (
							Object.values(objElem).includes(checkedValue[i]) &&
							checkedValue[i] !== "Optional alcohol"
						) {
							if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
								result.push(objElem);
							}
						}
					}
				}
				if (
					((checkedValue.includes("Alcoholic") &&
						checkedValue.includes("Non alcoholic") &&
						!checkedValue.includes("Optional alcohol")) ||
						(checkedValue.includes("Alcoholic") &&
							!checkedValue.includes("Non alcoholic") &&
							checkedValue.includes("Optional alcohol")) ||
						(!checkedValue.includes("Alcoholic") &&
							checkedValue.includes("Non alcoholic") &&
							checkedValue.includes("Optional alcohol"))) &&
					((youtube === "YoutubeVideo" && checkedValue.length > 2) ||
						(Boolean(objElem.strVideo) && checkedValue.length > 3 && youtube !== "YoutubeVideo"))
				) {
					if (checkedValue.includes("Alcoholic") && checkedValue.includes("Non alcoholic")) {
						if (youtube !== "YoutubeVideo") {
							if (
								(Object.values(objElem).includes("Alcoholic") ||
									Object.values(objElem).includes("Non alcoholic")) &&
								objElem.strVideo
							) {
								if (
									Object.values(objElem).includes(checkedValue[i]) &&
									checkedValue[i] !== "Alcoholic" &&
									Object.values(objElem).includes(checkedValue[i]) &&
									checkedValue[i] !== "Non alcoholic" &&
									objElem.strVideo
								) {
									if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
										result.push(objElem);
									}
								}
							}
						} else if (
							Object.values(objElem).includes("Alcoholic") ||
							Object.values(objElem).includes("Non alcoholic")
						) {
							if (
								Object.values(objElem).includes(checkedValue[i]) &&
								checkedValue[i] !== "Alcoholic" &&
								Object.values(objElem).includes(checkedValue[i]) &&
								checkedValue[i] !== "Non alcoholic"
							) {
								if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
									result.push(objElem);
								}
							}
						}
					}
					if (checkedValue.includes("Alcoholic") && checkedValue.includes("Optional alcohol")) {
						if (youtube !== "YoutubeVideo") {
							if (
								(Object.values(objElem).includes("Alcoholic") ||
									Object.values(objElem).includes("Optional alcohol")) &&
								objElem.strVideo
							) {
								if (
									Object.values(objElem).includes(checkedValue[i]) &&
									checkedValue[i] !== "Alcoholic" &&
									Object.values(objElem).includes(checkedValue[i]) &&
									checkedValue[i] !== "Optional alcohol" &&
									objElem.strVideo
								) {
									if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
										result.push(objElem);
									}
								}
							}
						} else if (
							Object.values(objElem).includes("Alcoholic") ||
							Object.values(objElem).includes("Optional alcohol")
						) {
							if (
								Object.values(objElem).includes(checkedValue[i]) &&
								checkedValue[i] !== "Alcoholic" &&
								Object.values(objElem).includes(checkedValue[i]) &&
								checkedValue[i] !== "Optional alcohol"
							) {
								if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
									result.push(objElem);
								}
							}
						}
					}
					if (checkedValue.includes("Non alcoholic") && checkedValue.includes("Optional alcohol")) {
						if (youtube !== "YoutubeVideo") {
							if (
								(Object.values(objElem).includes("Non alcoholic") ||
									Object.values(objElem).includes("Optional alcohol")) &&
								objElem.strVideo
							) {
								if (
									Object.values(objElem).includes(checkedValue[i]) &&
									checkedValue[i] !== "Non alcoholic" &&
									Object.values(objElem).includes(checkedValue[i]) &&
									checkedValue[i] !== "Optional alcohol" &&
									objElem.strVideo
								) {
									if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
										result.push(objElem);
									}
								}
							}
						} else if (
							Object.values(objElem).includes("Non alcoholic") ||
							Object.values(objElem).includes("Optional alcohol")
						) {
							console.log(objElem);
							if (
								Object.values(objElem).includes(checkedValue[i]) &&
								checkedValue[i] !== "Non alcoholic" &&
								Object.values(objElem).includes(checkedValue[i]) &&
								checkedValue[i] !== "Optional alcohol"
							) {
								if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
									result.push(objElem);
								}
							}
						}
					}
				}
				if (
					checkedValue.includes("Alcoholic") &&
					checkedValue.includes("Non alcoholic") &&
					checkedValue.includes("Optional alcohol") &&
					((youtube === "YoutubeVideo" && checkedValue.length > 3) ||
						(Boolean(objElem.strVideo) && checkedValue.length > 4 && youtube !== "YoutubeVideo"))
				) {
					if (youtube !== "YoutubeVideo") {
						if (
							(Object.values(objElem).includes("Alcoholic") ||
								Object.values(objElem).includes("Non alcoholic") ||
								Object.values(objElem).includes("Optional alcohol")) &&
							objElem.strVideo
						) {
							if (
								Object.values(objElem).includes(checkedValue[i]) &&
								checkedValue[i] !== "Alcoholic" &&
								Object.values(objElem).includes(checkedValue[i]) &&
								checkedValue[i] !== "Non alcoholic" &&
								Object.values(objElem).includes(checkedValue[i]) &&
								checkedValue[i] !== "Optional alcohol" &&
								objElem.strVideo
							) {
								if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
									result.push(objElem);
								}
							}
						}
					} else if (
						Object.values(objElem).includes("Alcoholic") ||
						Object.values(objElem).includes("Non alcoholic") ||
						Object.values(objElem).includes("Optional alcohol")
					) {
						if (
							Object.values(objElem).includes(checkedValue[i]) &&
							checkedValue[i] !== "Alcoholic" &&
							Object.values(objElem).includes(checkedValue[i]) &&
							checkedValue[i] !== "Non alcoholic" &&
							Object.values(objElem).includes(checkedValue[i]) &&
							checkedValue[i] !== "Optional alcohol"
						) {
							if (!Boolean(result.find((element) => element.idDrink === objElem.idDrink))) {
								result.push(objElem);
							}
						}
					}
				}
			}
		}
		setFilteredApi(result);
	}, [checkedValue, itemData, setFilteredApi]);

	useEffect(() => {
		setCheckedValue([]);
	}, [clearfilterProp]);

	const handleChange = (event) => {
		if (!checkedValue.includes(event.target.name)) {
			setCheckedValue(checkedValue.concat(event.target.name));
		} else {
			setCheckedValue(checkedValue.filter((elem) => elem !== event.target.name));
		}
	};
	const filterResult = () => (
		<div className={classes.list} style={{ height: 20 }}>
			<Accordion className={classes.accord}>
				<Typography
					className={classes.heading}
					style={{
						color: "rgb(240, 150, 210)",
						textAlign: "right",
						paddingRight: 5,
					}}
				>
					Filtered {filteredApi.length === 1 || filteredApi.length === 0 ? "item" : "items"}{" "}
					{filteredApi.length} in {itemData.length}.
				</Typography>
			</Accordion>
		</div>
	);
	const clearFilter = () => (
		<div>
			<AccordionSummary
				style={{
					padding: 0,
					position: "fixed",
					left: "120px",
				}}
			>
				<Typography className={classes.heading} onClick={() => setCheckedValue([])}>
					Clear Filter
				</Typography>
			</AccordionSummary>
		</div>
	);
	const list = () => (
		<div className={classes.list}>
			<Accordion className={classes.accord}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography className={classes.heading}>Alcoholic</Typography>
				</AccordionSummary>
				{objForMap.alcoholic.map((elem) => (
					<AccordionDetails style={{ margin: 3, padding: 1 }} key={elem}>
						<Accordion className={classes.accord}>
							<FormControlLabel
								control={
									<Checkbox
										checked={checkedValue.includes(elem)}
										onChange={handleChange}
										name={elem}
										style={{ color: "white" }}
									/>
								}
								label={elem}
								style={{ margin: 0, padding: 0 }}
							/>
						</Accordion>
					</AccordionDetails>
				))}
			</Accordion>
			<Accordion className={classes.accord}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon style={{}} />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography className={classes.heading}>Category</Typography>
				</AccordionSummary>
				{objForMap.category.map((elem) => (
					<AccordionDetails style={{ margin: 3, padding: 1 }} key={elem}>
						<Accordion className={classes.accord}>
							<FormControlLabel
								aria-label="Acknowledge"
								onClick={(event) => event.stopPropagation()}
								onFocus={(event) => event.stopPropagation()}
								control={
									<Checkbox
										checked={checkedValue.includes(elem)}
										onChange={handleChange}
										name={elem}
										style={{ color: "white" }}
									/>
								}
								label={elem}
								style={{ margin: 0, padding: 0 }}
							/>
						</Accordion>
					</AccordionDetails>
				))}
			</Accordion>
			<AccordionDetails style={{ margin: 3, padding: 1 }}>
				<Accordion className={classes.accord}>
					<FormControlLabel
						control={
							<Checkbox
								checked={checkedValue.includes("YoutubeVideo")}
								onChange={handleChange}
								name="YoutubeVideo"
								style={{ color: "white" }}
							/>
						}
						label={"YoutubeVideo"}
						style={{ margin: 0, padding: 0 }}
					/>
				</Accordion>
			</AccordionDetails>
		</div>
	);

	// function f() {
	// 	let temp = []
	// 	for (let item of itemData) {
	// 		if (item.strIngredient1) {
	// 			if (!temp.includes(item.strIngredient1)) {
	// 				temp.push(item.strIngredient1)
	// 			}
	// 		}
	// 		if (item.strIngredient2) {
	// 			if (!temp.includes(item.strIngredient2)) {
	// 				temp.push(item.strIngredient2)
	// 			}
	// 		}
	// 		if (item.strIngredient3) {
	// 			if (!temp.includes(item.strIngredient3)) {
	// 				temp.push(item.strIngredient3)
	// 			}
	// 		}
	// 		if (item.strIngredient4) {
	// 			if (!temp.includes(item.strIngredient4)) {
	// 				temp.push(item.strIngredient4)
	// 			}
	// 		}
	// 		if (item.strIngredient5) {
	// 			if (!temp.includes(item.strIngredient5)) {
	// 				temp.push(item.strIngredient5)
	// 			}
	// 		}
	// 		if (item.strIngredient6) {
	// 			if (!temp.includes(item.strIngredient6)) {
	// 				temp.push(item.strIngredient6)
	// 			}
	// 		}
	// 		if (item.strIngredient7) {
	// 			if (!temp.includes(item.strIngredient7)) {
	// 				temp.push(item.strIngredient7)
	// 			}
	// 		}
	// 		if (item.strIngredient8) {
	// 			if (!temp.includes(item.strIngredient8)) {
	// 				temp.push(item.strIngredient8)
	// 			}
	// 		}
	// 		if (item.strIngredient9) {
	// 			if (!temp.includes(item.strIngredient9)) {
	// 				temp.push(item.strIngredient9)
	// 			}
	// 		}
	// 		if (item.strIngredient10) {
	// 			if (!!temp.includes(item.strIngredient10)) {
	// 				temp.push(item.strIngredient10)
	// 			}
	// 		}
	// 		if (item.strIngredient11 ) {
	// 			if (!temp.includes(item.strIngredient11 )) {
	// 				temp.push(item.strIngredient11 )
	// 			}
	// 		}
	// 	}
	// 	return temp
	// }

	return (
		<div className={classes.root}>
			<React.Fragment>
				<Drawer
					open={open}
					onClose={close}
					transitionDuration={{
						enter: transitionDuration,
						exit: transitionDuration,
					}}
					variant="temporary"
					PaperProps={{
						style: { marginTop: 84.4, backgroundColor: "#303f9f" },
					}}
				>
					{checkedValue.length ? filterResult() : ""}
					{list()}
					{checkedValue.length ? clearFilter() : ""}
				</Drawer>
			</React.Fragment>
		</div>
	);
}
