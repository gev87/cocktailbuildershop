import { alpha,makeStyles } from "@material-ui/core";
import SELECTEDPICTURES from "./SELECTEDPICTURES";

const THEMES = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	paper1: {
		margin: theme.spacing(8, 4),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatarblue: {
		margin: theme.spacing(1),
		backgroundColor: " #303f9f",
	},
	avatarred: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},

	root: {
		width: "100%",
		"& > * + *": {
			marginTop: theme.spacing(2),
		},
	},
	rootpages: {
		display: "block",
		"& > *": {
			marginTop: theme.spacing(2),
		},
	},
	rootnav: {
		flexGrow: 1,
		marginTop: 70,
		color: "red",
	},

	menuButton: {
		color: "black",
		marginRight: theme.spacing(2),
		"&:hover": {
			color: "white",
		},
	},
	title: {
		flexGrow: 1,
		color: "black",
		fontFamily: "Georgia, serif",
		fontSize: "17px",
		"&:hover": {
			color: "white",
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 0),
		height: "100%",
		position: "static",
		// pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	search: {
		position: "relative",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: alpha(theme.palette.common.white, 0.15),
		color: "black",
		"&:hover": {
			backgroundColor: alpha(theme.palette.common.white, 0.25),
			color: "white",
		},
		marginRight: theme.spacing(2),
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(2),
			width: "auto",
		},
	},
	inputRoot: {
		color: "inherit",
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
	rootlog: {
		height: "100vh",
	},
	image: {
		backgroundImage: SELECTEDPICTURES,
		backgroundRepeat: "no-repeat",
		backgroundColor:
			theme.palette.type === "light"
				? theme.palette.grey[50]
				: theme.palette.grey[900],
		backgroundSize: "cover",
		backgroundPosition: "center",
	},
	form1: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	footer: {
		backgroundColor: theme.palette.background.paper,
	},
	icon: {
		marginRight: theme.spacing(2),
	},
	heroContent: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(10,0,6),
	},
	cardGrid: {
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8),
	},
	card: {
		height: "100%",
		display: "flex",
		flexDirection: "column",
	},
	cardMedia: {
		paddingTop: "95%", // 16:9
	},
	cardContent: {
		flexGrow: 1,
	},
	heroButtons: {
		marginTop: theme.spacing(4),
	},
	input: {
		color: "#ac5b01",
	},
	list: {
		elevation: 105,
		width: 210,
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
	},
	accord: {
		margin: 0,
		padding: 0,
		backgroundColor: "#303f9f",
		color: "#ffffff",
		width: "100%",
	},
	listDrower: {
		width: 250,
	},
	fullListDrower: {
		width: "auto",
	},
}));

export default THEMES;
