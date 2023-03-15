import React, {useMemo} from "react";
import { Swiper,SwiperSlide } from "swiper/react";
import { Typography } from "@material-ui/core";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "../styles.css";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination,Navigation } from "swiper";

export default function CustomSwiper({filterByIngredient}) {
	const ingredients = useMemo(
		() => [
			"Baileys irish cream",
			"Vodka",
			"Gin",
			"Rum",
			"Whiskey",
			"Absolut Vodka",
			"White Rum",
			"Tequila",
			"Scotch",
			"Amaretto",
			"Absolut Citron",
			"Apricot brandy",
			"Campari",
			"Malibu rum",
		],
		[]
	);

	return (
		<div style={{ backgroundColor: "black", color: "#4052b5" }}>
			<Typography variant="h5" align="center" paragraph>
				POPULAR INGREDIENTS
			</Typography>

			<Swiper
				style={{ backgroundColor: "#4052b5" }}
				loop
				effect={"coverflow"}
				grabCursor
				centeredSlides
				centeredSlidesBounds
				slidesPerView={5}
				spaceBetween={50}
				scrollbar={{
					el: ".swiper-scrollbar",
					draggable: true,
				}}
				coverflowEffect={{
					rotate: 0,
					stretch: 0,
					depth: 200,
					modifier: 1,
					slideShadows: true,
				}}
				pagination={{
					clickable: true,
				}}
				navigation
				modules={[EffectCoverflow, Pagination, Navigation]}
				className="mySwiper"
			>
				{ingredients.map((ingredient, index) => {
					return (
						<SwiperSlide key={ingredient + index}>
								<img
									onClick={() => filterByIngredient(ingredient)}
									alt="background"
									src={`https://thecocktaildb.com/images/ingredients/${ingredient}.png`}
							/>
							</SwiperSlide>
					);
				})}
			</Swiper>
		</div>
	);
}
