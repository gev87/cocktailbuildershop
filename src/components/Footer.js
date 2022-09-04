import { Link, Typography } from "@material-ui/core";
import THEMES from "../consts/THEMES";

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright © "}
			<Link color="inherit" href="/">
				Cocktail Menu
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}


export default function Footer() {
	const classes = THEMES();
	return (
		<div>
				<footer className={classes.footer}>
				<Copyright />
			</footer>
		</div>
	)
}