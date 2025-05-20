
let { Engine, Tiles, AI } = (() => {

	let APP;
	let Colors = ["green", "red",  "blue", "yellow", "black"];
	let users = ["", "Hakan", "Adam", "Denise", "Yasmin"];

	let activePlayer = 1;
	let settingsType = 2;

	
	@import "./tiles.js"
	@import "./ai.js"


	let Engine = {
		init() {
			// reference to application
			APP = okey;
			// init sub object
			AI.init();
			Tiles.init();
			// start game
			// this.start();
		},
	};

	return { Engine, Tiles, AI };

})();
