
let { Engine, Board, Tiles, AI } = (() => {

	let APP;

	let activePlayer = 1;
	let settingsType = 2;
	
	let settingsCont = 0,
		settingsGameLevel = 2,
		settingsSound = 1,
		settingsHelp = 1,
		settingsIndicator = 1,
		settingswithColors = 0,
		settingsIncrease = 0,
		settingsPunish = 0;
	let perFull = [];
	let perHalf = [];

	let Board = {
			tiles: [],
			tiles1: [],
			tiles2: [],
			tiles3: [],
			tiles4: [],
		};

	let boardTilesVir = [];
	let okeyCont = 0;

	
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
		},
		getRack(seat) {
			activePlayer = seat;
			Board.tiles = Board["tiles"+ seat];
		},
		arrange(seat, type=1) {
			this.getRack(seat);

			let arr1 = [];
			let arr2 = [];
			let arr3 = [];
			let arr4 = [];
			let arr5 = [];
			let min = 0;

			okeyCont = 0;
			if (activePlayer == 1) min = 1;
			
			if (settingsGameLevel > 1 || min == 1) {
				let oI = Board.tiles.indexOf(Tiles.okey);
				if (oI != -1) {
					Board.tiles[oI] = "800";
					okeyCont++;
				}
				oI = Board.tiles.indexOf(Tiles.okey);
				if (oI != -1) {
					Board.tiles[oI] = "800";
					okeyCont++;
				}
				oI = Board.tiles.indexOf("000");
				if (oI != -1) {
					Board.tiles[oI] = String(Tiles.okey);
				}
				oI = Board.tiles.indexOf("000");
				if (oI != -1) {
					Board.tiles[oI] = String(Tiles.okey);
				}
			}
			let arr6 = Board.tiles.slice();
			let arr7 = Board.tiles.slice();

			if (type == 1) {
				if (this.checkPer(3) || settingsGameLevel < 3 && min == 0) {
					arr1 = Tiles.sortTiles(3, 1);
					arr2 = arr1.slice();
					Board.tiles = boardTilesVir.slice();
					arr1 = Tiles.sortTilesByColor(3, 1);
					arr3 = arr1.slice();
					Board.tiles = boardTilesVir.slice();
				} else {
					arr1 = Tiles.sortTilesByColor(3, 1);
					arr3 = arr1.slice();
					Board.tiles = boardTilesVir.slice();
					arr1 = Tiles.sortTiles(3, 1);
					arr2 = arr1.slice();
					Board.tiles = boardTilesVir.slice();
				}
				arr2.push.apply(arr2, arr3);
				perFull = arr2.slice();
				this.addFourth();
				if (okeyCont > 0) this.addOkey(1);
				
				arr2 = perFull.slice();
				if (this.checkPer(2) || settingsGameLevel < 3 && min == 0) {
					arr1 = Tiles.sortTiles(2, 1);
					arr4 = arr1.slice();
					Board.tiles = boardTilesVir.slice();
					arr1 = Tiles.sortTilesByColor(2, 1);
					arr5 = arr1.slice();
					Board.tiles = boardTilesVir.slice();
				} else {
					arr1 = Tiles.sortTilesByColor(2, 1);
					arr5 = arr1.slice();
					Board.tiles = boardTilesVir.slice();
					arr1 = Tiles.sortTiles(2, 1);
					arr4 = arr1.slice();
					Board.tiles = boardTilesVir.slice();
				}
				arr4.push.apply(arr4, arr5);
				perHalf = arr4.slice();
				
				if (okeyCont > 0) {
					this.addOkey(2);
				}
				if (okeyCont > 0) {
					this.addOkey(3);
				}
				if (okeyCont > 0) {
					this.addOkey(4);
					arr2 = perFull.slice();
				}
				arr4 = perHalf.slice();
			}
			if (type == 2) {
				arr1 = Tiles.sortDouble(0, 1);
				arr2 = arr1.slice();
				perFull = arr2.slice();
				Board.tiles = boardTilesVir.slice();
				if (okeyCont > 0) this.addOkeyDouble();
				
				Board.tiles = boardTilesVir.slice();
				arr2 = perFull.slice();
			}
			arr2.push.apply(arr2, arr4);
			Board.tiles = Board.tiles.filter(e => e != "");
			let _0x17aa37 = arr2.length;
			let _0x52b171 = arr2.length;
			if (arr2[16] == "") {
				arr2.splice(16, 1);
			}
			let _0x246380 = arr2.length * 1 + Board.tiles.length * 1;
			for (let i=0; i<32 - _0x246380; i++) {
				arr2.push("");
			}
			if (type == 1) {
				this.priority();
			}
			arr2.push.apply(arr2, Board.tiles);
			Board.tiles = arr2.slice();
			let _0x199fea = Board.tiles.length;
			for (let i=32; i<_0x199fea; i++) {
				Board.tiles = this.removeArrayItem(Board.tiles, "", 1);
			}

			arr7 = [];
			let boardPlacesTemp1 = boardPlaces.slice();
			boardPlaces = Array(31).fill(0);
			let _0x3509bd = 0;
			for (let i=0; i<Board.tiles.length; i++) {
				let _0x27d3db = i * 1 + 1;
				if (Board.tiles[i] != '') {
					let _0x545a8b = arr6.indexOf(Board.tiles[i]);
					arr6[_0x545a8b] = '';
					_0x545a8b++;
					if (Board.tiles[i] != '') {
						arr7[_0x3509bd] = Board.tiles[i];
						_0x3509bd++;
					}
					this.place(boardPlacesTemp1[_0x545a8b], _0x27d3db);
				} else {
					boardPlaces[_0x27d3db] = 0;
				}
			}

			if (type == 1 && this.checkWin()) {
				if (AIStatus == 0 && activePlayer == 1) {

				} else {
					console.log("Oyun Bitti: " + users[activePlayer] + " Seri acti");
					winnerPlayer = activePlayer;
					game_over(1);
				}
			}
			
			if (type == 2 && this.checkWinDouble()) {
				if (AIStatus == 0 && activePlayer == 1) {

				} else {
					console.log("Oyun Bitti: " + users[activePlayer] + " cift acti");
					winnerPlayer = activePlayer;
					game_over(1);
				}
			}
		},
		updateRack() {},
		checkPer() {},
		addFourth() {},
		addOkey() {},
		addOkeyDouble() {},
		priority() {},
		checkWin() {},
	};

	return { Engine, Board, Tiles, AI };

})();
