import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import YouTubeIcon from "@material-ui/icons/YouTube";
import PlayerDialog from './PlayerDialog'
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
		// marginTop: "20%",
		font: "italic bold 15px monospace",
	},
	category: {
		width: 600,
	},
}));

export default function ComplexGrid({ data, close }) {
	const classes = useStyles();
	const [openDlg1Dialog, setDialog1Open] = useState(false);
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
								style={{ cursor: 'initial' }}
								className={classes.img}
								alt={data.strDrink}
								src={data.strDrinkThumb}
							/>
						</ButtonBase>
					</Grid>
					<Grid item xs={12} sm container>
						<Grid item xs container direction="column" spacing={2}>
							<Grid item xs className={classes.info}>
								{data.strIngredient1 ? (
									<Typography>
										{data.strIngredient1} : {data.strMeasure1}
									</Typography>
								) : (
									""
								)}
								{data.strIngredient2 ? (
									<Typography>
										{data.strIngredient2} : {data.strMeasure2}
									</Typography>
								) : (
									""
								)}
								{data.strIngredient3 ? (
									<Typography>
										{data.strIngredient3} : {data.strMeasure3}
									</Typography>
								) : (
									""
								)}
								{data.strIngredient4 ? (
									<Typography>
										{data.strIngredient4} : {data.strMeasure4}
									</Typography>
								) : (
									""
								)}
								{data.strIngredient5 ? (
									<Typography>
										{data.strIngredient5} : {data.strMeasure5}
									</Typography>
								) : (
									""
								)}
								{data.strIngredient6 ? (
									<Typography>
										{data.strIngredient6} : {data.strMeasure6}
									</Typography>
								) : (
									""
								)}
								{data.strIngredient7 ? (
									<Typography>
										{data.strIngredient7} : {data.strMeasure7}
									</Typography>
								) : (
									""
								)}
								{data.strIngredient8 ? (
									<Typography>
										{data.strIngredient8} : {data.strMeasure8}
									</Typography>
								) : (
									""
								)}
								{data.strIngredient9 ? (
									<Typography>
										{data.strIngredient9} : {data.strMeasure9}
									</Typography>
								) : (
									""
								)}
								{data.strIngredient10 ? (
									<Typography>
										{data.strIngredient10} : {data.strMeasure10}
									</Typography>
								) : (
									""
								)}
								{data.strIngredient11 ? (
									<Typography>
										{data.strIngredient11} : {data.strMeasure11}
									</Typography>
								) : (
									""
								)}
							</Grid>
						</Grid>
						<Grid item>
							<Typography variant="subtitle1">${data.price}.00</Typography>
							{data.strVideo ? (
								<YouTubeIcon
									onClick={() => setDialog1Open(true)}
									style={{
										fontSize: 53,
										color: "red",
										margin: "230px 0px 0 0px",
										cursor: "pointer",
									}}
								/>
							) : (
								""
							)}
						</Grid>
					</Grid>
				</Grid>
				<Grid
					className={classes.category}
					variant="h5"
					style={{ color: "MediumBlue", font: "italic bold 15px monospace" }}
				>
					<h3>
						<p style={{ margin: 0, color: "black", fontSize: 12 }}>
							Drink Category.
						</p>{" "}
						{data.strCategory}
					</h3>
					<h3>
						<p style={{ margin: 0, color: "black", fontSize: 12 }}>Alcohol.</p>{" "}
						{data.strAlcoholic}
					</h3>
					<h3>
						<p style={{ margin: 0, color: "black", fontSize: 12 }}>
							Instructions.
						</p>{" "}
						{data.strInstructions}
					</h3>
				</Grid>
				<Grid item container>
					<Button color='secondary'
						style={{
							// cursor: "pointer",
							marginLeft: '90%',
							padding: 0
							// BorderStyle: 
						}}
						onClick={close}>
						Close
					</Button>
				</Grid>
			</Paper>
		</div>
	);
}
