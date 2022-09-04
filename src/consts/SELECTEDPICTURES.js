const pictureArray = [
	"url(/images/dog-holding-martini-glass1.jpg)",
	// "url(/images/login.jpg)",
	"url(/images/dog.jpg)",
];
const randomIndex = Math.floor(Math.random() * pictureArray.length);
const SELECTEDPICTURES = pictureArray[randomIndex];

export default SELECTEDPICTURES;