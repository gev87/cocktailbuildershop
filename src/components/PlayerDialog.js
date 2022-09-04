import React from "react";
import Dialog from "@material-ui/core/Dialog";
import ReactPlayer from "react-player/youtube";

export default function PlayerDialog({ open, close, videoUrl }) {
	// console.log(open);
	return (
		<div>
			<Dialog
				style={{ zIndex: 1800, width: "100%"}}
				open={open}
				keepMounted
				onClose={close}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
				paperwidthfalse="true"
			>
				<ReactPlayer
					style={{
						// padding: 0,
						// margin: 0,
						maxWidth: "100%"
					}}
					config={{
						youtube: {
							playerVars: { showinfo: 5 },
						},
					}}
					controls
					stopOnUnmount={false}
					url={videoUrl}
				/>
			</Dialog>
		</div>
	);
}
