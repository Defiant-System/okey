
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
		},
		restore(state) {
			// save state
			this._state = state;
			// restore Tiles object
			Tiles.restore(state);
		},
		updateLeftTiles(item) {
			Tiles.tilesLeft = Tiles.removeArrayItem(Tiles.tilesLeft, item);
			// update table tiles left
			APP.content.find(`.info .tiles.left .tile`).data({ n: Tiles.tilesLeft.length });
		}
	};

	return { Engine, Tiles, AI };

})();
