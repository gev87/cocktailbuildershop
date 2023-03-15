import React, { forwardRef } from 'react';
import { makeStyles, Slide, Dialog } from '@material-ui/core';
import ComplexGrid from './ComplexGrid'
const useStyles = makeStyles({
	root: {
		fullWidth: true,
	},
});

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ open, close, data }) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Dialog
				style={{ zIndex: 1700, }}
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={close}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				{data && <ComplexGrid
					close={close}
					data={data}
				/>}
			</Dialog>
		</div>
	);
}
