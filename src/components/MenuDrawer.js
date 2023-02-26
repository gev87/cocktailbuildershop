import React, { useEffect, useState } from "react";
import { Drawer, Accordion, AccordionSummary } from "@material-ui/core";
import { AccordionDetails, Checkbox, Typography } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import THEMES from "../consts/THEMES";

export default function MenuDrawer({
	open,
	close,
	itemData,
	handleFilters,
	removeFilters,
	onClear,
	onClearFilters,
}) {
	const classes = THEMES();
	const [checkedCategory, setCheckedCategory] = useState([]);
	const [checkedValue, setCheckedValue] = useState([]);
	const [filteredCocktails, setFilteredCocktails] = useState([]);
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
	};
	const transitionDuration = 1000;

	function showFilteredData() {
		let categoryFilter;
		if ([1, 2].includes(checkedCategory.length)) {
			categoryFilter = itemData.filter((item) => checkedCategory.includes(item.strAlcoholic));
		}
		const filterResult =
			checkedValue.length &&
			(categoryFilter || itemData).filter((item) => checkedValue.includes(item.strCategory));
		handleFilters(filterResult || categoryFilter);
		setFilteredCocktails(filterResult || categoryFilter);
		onClear();
	}

	useEffect(() => {
		if (open) showFilteredData();
	}, [checkedValue.length, checkedCategory.length]);

	function handleChange(event, checkedItems) {
		return checkedItems.includes(event.target.name)
			? checkedItems.filter((elem) => elem !== event.target.name)
			: checkedItems.concat(event.target.name);
	}

	function filterHeader() {
		return (
			<div className={classes.list} style={{ height: 20 }}>
				<Accordion className={classes.accord}>
					<Typography
						className={classes.heading}
						style={{
							color: "yellow",
							textAlign: "right",
							paddingRight: 5,
						}}
					>
						Filtered {filteredCocktails?.length || "no"}
						{[0, 1].includes(filteredCocktails?.length) ? " item " : " items "}
						from {itemData.length}.
					</Typography>
				</Accordion>
			</div>
		);
	}

	const clearFilter = () => {
		setCheckedValue([]);
		setCheckedCategory([]);
		onClearFilters();
	};

	// useEffect(() => {
	// 	console.log("removeFilters", removeFilters);
	// 	if (removeFilters) clearFilter();
	// }, [removeFilters]);

	const list = () => (
		<div className={classes.list}>
			<Accordion className={classes.accord}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography className={classes.heading}>Category</Typography>
				</AccordionSummary>
				{objForMap.alcoholic.map((elem) => (
					<AccordionDetails style={{ margin: 3, padding: 1 }} key={elem}>
						<Accordion className={classes.accord}>
							<FormControlLabel
								control={
									<Checkbox
										checked={checkedCategory.includes(elem)}
										onChange={(event) => setCheckedCategory(handleChange(event, checkedCategory))}
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
					<Typography className={classes.heading}>Filters</Typography>
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
										onChange={(event) => setCheckedValue(handleChange(event, checkedValue))}
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
		</div>
	);

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
					{!!(checkedCategory.length || checkedValue.length) && filterHeader()}
					{list()}
					{!!(checkedCategory.length || checkedValue.length) && (
						<div>
							<AccordionSummary
								style={{
									paddingBottom: 50,
									position: "relative",
									left: "100px",
								}}
							>
								<Typography
									className={classes.heading}
									style={{ color: "yellow" }}
									onClick={clearFilter}
								>
									Clear Filter
								</Typography>
							</AccordionSummary>
						</div>
					)}
				</Drawer>
			</React.Fragment>
		</div>
	);
}
