import THEMES from "../consts/THEMES";
import { Button } from "@mui/material";

const Pages = ({ itemsPerPage, totalItems, paginate }) => {
	const pageNumbers = [];
	const classes = THEMES();

	for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
		pageNumbers.push(i);
	}
	return (
		<nav>
			<div className={classes.rootpages}>
				{pageNumbers.map((number) => (
					<Button
						key={number}
						onClick={() => paginate(number)}
						href={"!#" + number}
					>
						{number}
					</Button>
				))}
			</div>
		</nav>
	);
};

export default Pages;
