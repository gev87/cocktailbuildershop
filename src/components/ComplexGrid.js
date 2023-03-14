import React, { useState } from "react";
import { makeStyles, Grid, Paper } from "@material-ui/core";
import { Typography, ButtonBase } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import PlayerDialog from "./PlayerDialog";
import { Button } from "@mui/material";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(1),
		margin: "0",
		maxWidth: 700,
	},
	image: {
		width: 300,
		height: 300,
	},
	img: {
		margin: "auto",
		display: "block",
		maxWidth: "100%",
		maxHeight: "100%",
	},
	info: {
		maxHeight: 300,
		font: "italic bold 15px monospace",
	},
	category: {
		width: 600,
	},
}));

export default function ComplexGrid({ data, close }) {
	const classes = useStyles();
	const [openDlg1Dialog, setDialog1Open] = useState(false);
	const commonStyle = { margin: 0, color: "black", fontSize: 12 };

	const ingredientProportion = (cocktail) => {
		return Object.entries(cocktail).reduce((accum, ing) => {
			if (ing[0].includes("strIngredient") && ing[1])
				accum.push(
					<Typography key={ing[0]}>
						{ing[1] + " : " + cocktail[`strMeasure${ing[0].at(-1)}`]}
					</Typography>
				);
			return accum;
		}, []);
	};
	return (
		<div className={classes.root}>
			<PlayerDialog
				open={openDlg1Dialog}
				close={() => setDialog1Open(false)}
				videoUrl={data.strVideo}
			/>
			<Paper className={classes.paper}>
				<Grid container spacing={2}>
					<Grid item>
						<ButtonBase className={classes.image}>
							<img
								style={{ cursor: "initial" }}
								className={classes.img}
								alt={data.strDrink}
								src={data.strDrinkThumb}
							/>
						</ButtonBase>
					</Grid>
					<Grid item xs={12} sm container>
						<Grid item xs container direction="column" spacing={2}>
							<Grid item xs className={classes.info}>
								{ingredientProportion(data)}
								{data.strVideo && (
									<YouTubeIcon
										onClick={() => setDialog1Open(true)}
										style={{
											fontSize: 150,
											color: "red",
											position: "absolute",
											right: 75,
											cursor: "pointer",
										}}
									/>
								)}
							</Grid>
						</Grid>
						<Grid item>
							<Typography variant="subtitle1">${data.price}.00</Typography>
						</Grid>
					</Grid>
				</Grid>
				<Grid
					className={classes.category}
					variant="h5"
					style={{ color: "MediumBlue", font: "italic bold 15px monospace" }}
				>
					<h3>
						<p style={commonStyle}>Drink Category.</p> {data.strCategory}
						<p style={commonStyle}>Alcohol.</p> {data.strAlcoholic}
						<p style={commonStyle}>Instructions.</p> {data.strInstructions}
					</h3>
				</Grid>
				<Grid item container>
					<Button
						color="secondary"
						style={{
							marginLeft: "90%",
							padding: 0,
						}}
						onClick={close}
					>
						Close
					</Button>
				</Grid>
			</Paper>
		</div>
	);
}
