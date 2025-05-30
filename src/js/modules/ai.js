
let AI = {
	init() {
		
	},
	async think(seat) {
		// move tile data to Board primary
		Engine.getRack(activePlayer);

		let aiTiles = Board.tiles.filter(e => !!e).slice();
		if (aiTiles.length - 1 == Board.tileLimits[seat]) {
			await this.makeMove(seat);
		} else {
			this.evalDiscarded(seat);

			// if (seat === 3) return;
			// return console.log("AI again");

			// clearTimeout(Engine.timerAI);

			Engine.timerAI = setTimeout(() => {
				if (Engine._gameOver == 1) return 0;
				Engine.arrange(seat);
				this.think(seat);
			}, 1000);
		}
	},
	async makeMove(seat) {
		let aiTiles;
		if (settingsType == 2 || settingsType == 3) { // 51 or 101
			if (openStatusDouble[seat] == 0) {
				Engine.arrange(seat);
				// opens
				await Engine.putToTable(seat, 1);
			}
			if (openStatusSort[seat] == 1 || openStatusDouble[seat] == 1) {
				Engine.getOkeyFromTable(seat);
				Engine.arrange(seat);
				aiTiles = Board.tiles.filter(e => !!e).slice();
				if (aiTiles.length > 1) {
					Engine.checkHandle(seat);
				}
				aiTiles = Board.tiles.filter(e => !!e).slice();
				if (aiTiles.length > 1) {
					Engine.arrange(seat, 2);
				}
				aiTiles = Board.tiles.filter(e => !!e).slice();
				if (aiTiles.length > 1) {
					Engine.checkHandleDouble(seat);
				}
			}
			aiTiles = Board.tiles.filter(e => !!e).slice();
			if (aiTiles.length > 1) {
				Engine.arrange(seat, 2);
			}
			if (aiTiles.length > 1) {
				// opens
				await Engine.putToTable(seat, 1);
			}
			aiTiles = Board.tiles.filter(e => !!e).slice();
			if (aiTiles.length == 3) {
				Engine.putOkeyToTable(seat);
			}
			aiTiles = Board.tiles.filter(e => !!e).slice();
			if (aiTiles.length > 1) {
				// opens
				await Engine.putToTable(seat, 2);
			}
			aiTiles = Board.tiles.filter(e => !!e).slice();
			if (aiTiles.length < 1) {
				console.log("tas bitti - 2");
			}
			Engine.markIt(seat);
		}
		console.log(5, Board.tiles.slice().map(e => e ? e.value : e));
		Engine.arrange(seat, 1, 77);
		// console.log(2222, Board.tiles.slice().map(e => e ? e.value : e));

		aiTiles = Board.tiles.filter(e => !!e).slice();
		let selectedTile = aiTiles[aiTiles.length - 1];
		// if (aiTiles.length > 0) {
		// 	var _0x280b69 = aiTiles.uid - 1;
		// 	if (aiTiles.length > 0) {
		// 		var _0x33ee = 0;
		// 		while ((data[_0x280b69] == Tiles.okey || handleItems.indexOf(Board.tiles[boardPlaces.indexOf(selectedTile) - 1]) > -1) && aiTiles.length - _0x33ee > 0) {
		// 			_0x33ee++;
		// 			selectedTile = aiTiles[aiTiles.length - _0x33ee];
		// 			var _0x280b69 = selectedTile.split('-');
		// 			_0x280b69 = _0x280b69[1] - 1;
		// 		}
		// 	}
		// 	if (seat != 1) {
		// 		var _0x77769 = Math.ceil(Math.random() * 10);
		// 		if (_0x77769 < 2 && settingsGameLevel == 2 || _0x77769 < 4 && settingsGameLevel == 1) {
		// 			console.log("el bozuyor");
		// 			selectedTile = aiTiles[0];
		// 		}
		// 	}
		// } else {
		// 	console.log("tas bitti - 1");
		// }

		// console.log(selectedTile);
		// let index = boardPlaces.indexOf(selectedTile),
		// 	tile = Board.tiles[index - 1];
		APP.game.dispatch({ type: "discard-tile", seat, tile: selectedTile });

		// Engine.checkThrow();
		Engine.arrange(seat);
		Engine.markIt(1);

		activePlayer = (activePlayer + 1) % 4;

		if (Engine._gameOver == 1 && tilesLeft.length > 0) {
			if (settingsType == 1) Engine.gameOver(1);
			if (settingsType == 2 || settingsType == 3) {}
			return 0;
		}

		// stop timeout
		Engine._gameOver = 1;
	},
	evalDiscarded(seat) {
		var discard;
		if (seat == 1) discard = 4;
		if (seat == 2) discard = 1;
		if (seat == 3) discard = 2;
		if (seat == 4) discard = 3;

		if (Engine.checkLeft(discard) == 1) {
			var _0x54fe2a = Board.tiles.lastIndexOf("") * 1 + 1;
			if (seat == 1) {
				var _0x727da6 = area4items[area4items.length - 1].split('-');
				_0x727da6 = data[_0x727da6[1] - 1] % 100;
				_0x727da6 = _0x727da6 * 10;
				if (settingsPunish == 1 && (settingsType == 2 || settingsType == 3)) {
					Engine.changePoint(_0x727da6, 4, 1);
				}
				Engine.place(area4items[area4items.length - 1], _0x54fe2a);
				area4items = Tiles.removeArrayItem(area4items, area4items[area4items.length - 1]);
			}
			if (seat == 2) {
				var _0x727da6 = area1items[area1items.length - 1].split('-');
				_0x727da6 = data[_0x727da6[1] - 1] % 100;
				_0x727da6 = _0x727da6 * 10;
				if (settingsPunish == 1 && (settingsType == 2 || settingsType == 3)) {
					Engine.changePoint(_0x727da6, 1, 1);
				}
				// smooth animation
				APP.game.dispatch({ type: "get-discarded-tile", seat, from: 1 });

				Engine.place(area1items[area1items.length - 1], _0x54fe2a);
				area1items = Tiles.removeArrayItem(area1items, area1items[area1items.length - 1]);
			}
			if (seat == 3) {
				var _0x727da6 = area2items[area2items.length - 1].split('-');
				_0x727da6 = data[_0x727da6[1] - 1] % 100;
				_0x727da6 = _0x727da6 * 10;
				if (settingsPunish == 1 && (settingsType == 2 || settingsType == 3)) {
					Engine.changePoint(_0x727da6, 2, 1);
				}
				// smooth animation
				APP.game.dispatch({ type: "get-discarded-tile", seat, from: 2 });

				Engine.place(area2items[area2items.length - 1], _0x54fe2a);
				area2items = Tiles.removeArrayItem(area2items, area2items[area2items.length - 1]);
			}
			if (seat == 4) {
				var _0x727da6 = area3items[area3items.length - 1].split('-');
				_0x727da6 = data[_0x727da6[1] - 1] % 100;
				_0x727da6 = _0x727da6 * 10;
				if (settingsPunish == 1 && (settingsType == 2 || settingsType == 3)) {
					Engine.changePoint(_0x727da6, 3, 1);
				}
				// smooth animation
				APP.game.dispatch({ type: "get-discarded-tile", seat, from: 3 });

				Engine.place(area3items[area3items.length - 1], _0x54fe2a);
				area3items = Tiles.removeArrayItem(area3items, area3items[area3items.length - 1]);
			}
		} else {
			// var _0x54fe2a = Board.tiles.lastIndexOf("") * 1 + 1;
			// Engine.place('tile-' + tilesLast, _0x54fe2a);
			// Engine.removeStampfromCenter();

			let tile = Tiles.draw();
			Board.tiles.push(tile);
			Engine.updateLeftTiles(tile);

			// UI animation
			APP.game.dispatch({ type: "draw-stack-tile", seat })
		}
	}
};
