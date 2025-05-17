
let Engine = (() => {

	let APP;
	let Colors = ["green", "red",  "blue", "yellow", "black"];
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

	let area1Count = 0,
		area1items = [],
		area2Count = 0,
		area2items = [],
		area3Count = 0,
		area3items = [],
		area4Count = 0,
		area4items = [],
		boardTop,
		boardLeft,
		boardDiff,
		boardLeft2 = 0,
		boardTop2 = 0,
		boardLeft3 = 0,
		boardTop3 = 0,
		boardLeft4 = 0,
		boardTop4 = 0;

	let pointLimit = 0,
		points = [0, "10", "20", "30", "2", "5", "11", "21", "31", "41", "51"],
		selectPoint = 2,
		pointMultiplier = 1,
		user1Point,
		user2Point,
		user3Point,
		user4Point,
		leftHandCont = 0,
		leftHandTile = 0,
		leftHandContTemp = 0,
		leftHandTileTemp = 0,
		collect = [],
		collectPlaces = [],
		collectTiles = [],
		gosterge = 0,
		UserTotal = 0,
		User1Total = 0,
		User2Total = 0,
		User3Total = 0,
		User4Total = 0,
		UserTotalDouble = 0,
		User1TotalDouble = 0,
		User2TotalDouble = 0,
		User3TotalDouble = 0,
		User4TotalDouble = 0,
		UserSeri = [],
		UserDouble = [],
		User1Seri = [],
		User2Seri = [],
		User3Seri = [],
		User4Seri = [],
		User1Double = [],
		User2Double = [],
		User3Double = [],
		User4Double = [],
		gameOver = 0;

	let tilesLeft = [],
		tilesLast = 0,
		tileLimit = 0,
		tileLimits = [0, tileLimit, tileLimit, tileLimit, tileLimit],
		tableH = [0, 0, 0, 0, 0],
		tableHdouble = [0, 0, 0, 0, 0],
		tableUser = new Array(7).fill(0).map(() => new Array(13).fill(0)),
		tableUser1 = new Array(7).fill(0).map(() => new Array(13).fill(0)),
		tableUser2 = new Array(7).fill(0).map(() => new Array(13).fill(0)),
		tableUser3 = new Array(7).fill(0).map(() => new Array(13).fill(0)),
		tableUser4 = new Array(7).fill(0).map(() => new Array(13).fill(0)),
		tableUserTiles1 = new Array(7).fill(0).map(() => new Array(13).fill(0)),
		tableUserTiles2 = new Array(7).fill(0).map(() => new Array(13).fill(0)),
		tableUserTiles3 = new Array(7).fill(0).map(() => new Array(13).fill(0)),
		tableUserTiles4 = new Array(7).fill(0).map(() => new Array(13).fill(0)),
		tableDoubleUser1 = new Array(14).fill(0).map(() => new Array(2).fill(0)),
		tableDoubleUser2 = new Array(14).fill(0).map(() => new Array(2).fill(0)),
		tableDoubleUser3 = new Array(14).fill(0).map(() => new Array(2).fill(0)),
		tableDoubleUser4 = new Array(14).fill(0).map(() => new Array(2).fill(0)),
		tableDoubleUserTiles1 = new Array(14)
			.fill(0)
			.map(() => new Array(2).fill(0)),
		tableDoubleUserTiles2 = new Array(14)
			.fill(0)
			.map(() => new Array(2).fill(0)),
		tableDoubleUserTiles3 = new Array(14)
			.fill(0)
			.map(() => new Array(2).fill(0)),
		tableDoubleUserTiles4 = new Array(14)
			.fill(0)
			.map(() => new Array(2).fill(0)),
		sayTableTiles = 0,
		sayTableTilesTemp;

	if (settingsType == 1) tileLimit = 14;
	if (settingsType == 2) tileLimit = 21;
	if (settingsType == 3) tileLimit = 14;

	let clickCont = 1,
		dragCont = 0,
		gameMoveCont = 1,
		timePopMessage = 800,
		timmerAI,
		timmerNextPlayer,
		timmerGameOver,
		contOpen = 0,
		AIcont = 0,
		AIStatus = 0,
		selectedTile = 'tile-1',
		selectedTile1 = '',
		markCont = 0,
		tileDefaultTop,
		tileDefaultLeft,
		pointsGameOver = 0,
		gameRound = 1,
		winWithOkey = 0,
		winWithDouble = 0,
		handleDouble = 0,
		doubleHandleTo = 0,
		handleItems = [],
		getOkeyKont = 0;

	let openLimitG = 101,
		openLimitD = 5,
		punishOffset = 101,
		openStatusSort = [0, 0, 0, 0, 0],
		openStatusDouble = [0, 0, 0, 0, 0],
		openPunish = [0, 0, 0, 0, 0],
		openAllHand = 0,
		PointOkeyCont = 1;

	let data;
	
	let boardTiles = [],
		boardTiles1,
		boardTiles2,
		boardTiles3,
		boardTiles4;

	let boardPlaces = Array(31).fill(0),
		boardPlaces1 = Array(31).fill(0),
		boardPlaces2 = Array(31).fill(0),
		boardPlaces3 = Array(31).fill(0),
		boardPlaces4 = Array(31).fill(0);
	
	let boardTilesVir;
	let markOkey = 0;
	let activePlayerCont = 1,
		winnerPlayer = 1,
		winnerPlayer1 = 0,
		firstOpenCont = 0,
		lastStone,
		laps,
		Indicator = 0;
	let okeyCont = 0;
	let goDouble = 0;
	let perFull = [];
	let perHalf = [];
	let tileW;
	let virtualMove = 0;

	
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
		setEngine(num) {
			settingsType = num + 1;
		},
		start() {
			Tiles.shuffle();
			// reset variables
			activePlayer = 1;
			boardTiles = [];
			boardTilesVir = [];
			markOkey = 0;
			okeyCont = 0;
			goDouble = 0;
			virtualMove = 0;

			tileW = 56;
		},
		discard(tile, num) {
			let target = APP.content.find(`.discard .player-${num}`),
				tgtOffset = target.offset(".board"),
				// srcOffset = tile.offset(),
				tOffset = tile.parent().offset(".board"),
				top = tgtOffset.top - tOffset.top + 5,
				left = tgtOffset.left - tOffset.left + 5;
			// console.log( srcOffset, tOffset, tgtOffset );
			tile.cssSequence("smooth", "transitionend", el => el.removeClass("smooth"))
				.css({ top, left });
		},
		restore(state) {
			// save state
			this._state = state;


			data = this._state.table.data;

			laps = 0;
			virtualMove = 0;
			if (gameRound == 1) {
				this.setPoint(selectPoint);
			}
			pointsGameOver = 0;
			clearTimeout(timmerAI);
			clearTimeout(timmerNextPlayer);
			clearTimeout(timmerGameOver);
			openAllHand = 0;
			settingsCont = 0;
			PointOkeyCont = 0;
			AIStatus = 0;
			AIcont = 0;
			activePlayer = 1;
			winnerPlayer = 1;
			activePlayerCont = 1;
			winnerPlayer1 = 0;
			firstOpenCont = 0;

			let openLimit = openLimitG;
			let openLimitDouble = openLimitD;
			let openLimitLast = openLimitG;
			let openLimitDoubleLast = openLimitD;
			openPunish = [0, 0, 0, 0, 0];
			openStatusSort = [0, 0, 0, 0, 0];
			openStatusDouble = [0, 0, 0, 0, 0];
			getOkeyKont = 0;
			leftHandCont = 0;
			leftHandContTemp = 0;
			leftHandTileTemp = 0;
			contOpen = 0;
			goDouble = 0;
			markCont = 0;
			clickCont = 1;
			tableUser1 = new Array(7).fill(0).map(() => new Array(13).fill(0));
			tableUser2 = new Array(7).fill(0).map(() => new Array(13).fill(0));
			tableUser3 = new Array(7).fill(0).map(() => new Array(13).fill(0));
			tableUser4 = new Array(7).fill(0).map(() => new Array(13).fill(0));
			tableUserTiles1 = new Array(7).fill(0).map(() => new Array(13).fill(0));
			tableUserTiles2 = new Array(7).fill(0).map(() => new Array(13).fill(0));
			tableUserTiles3 = new Array(7).fill(0).map(() => new Array(13).fill(0));
			tableUserTiles4 = new Array(7).fill(0).map(() => new Array(13).fill(0));
			tableDoubleUser1 = new Array(14).fill(0).map(() => new Array(2).fill(0));
			tableDoubleUser2 = new Array(14).fill(0).map(() => new Array(2).fill(0));
			tableDoubleUser3 = new Array(14).fill(0).map(() => new Array(2).fill(0));
			tableDoubleUser4 = new Array(14).fill(0).map(() => new Array(2).fill(0));
			tableDoubleUserTiles1 = new Array(14).fill(0).map(() => new Array(2).fill(0));
			tableDoubleUserTiles2 = new Array(14).fill(0).map(() => new Array(2).fill(0));
			tableDoubleUserTiles3 = new Array(14).fill(0).map(() => new Array(2).fill(0));
			tableDoubleUserTiles4 = new Array(14).fill(0).map(() => new Array(2).fill(0));
			tilesLast = 105;
			tilesLeft = [];
			if (settingsType == 1) tileLimit = 14;
			if (settingsType == 2) tileLimit = 21;
			if (settingsType == 3) tileLimit = 14;
			tileLimits = [0, tileLimit, tileLimit, tileLimit, tileLimit];
			tableH = [0, 0, 0, 0, 0];
			tableHdouble = [0, 0, 0, 0, 0];
			sayTableTiles = 0;
			Tiles.okey = 0;
			gosterge = 0;
			if (settingsHelp == 0) {
				markOkey = 0;
			}
			if (settingsHelp == 1) {
				markOkey = 1;
			}
			winWithOkey = 0;
			winWithDouble = 0;
			Indicator = 0;
			handleDouble = 0;
			okeyCont = 0;
			boardPlaces = Array(31).fill(0);
			boardTiles = [];
			boardPlaces1 = Array(31).fill(0);
			boardTiles1 = [];
			boardPlaces2 = Array(31).fill(0);
			boardTiles2 = [];
			boardPlaces3 = Array(31).fill(0);
			boardTiles3 = [];
			boardPlaces4 = Array(31).fill(0);
			boardTiles4 = [];
			boardTilesVir = [];
			area1Count = 0;
			area1items = [];
			area2Count = 0;
			area2items = [];
			area3Count = 0;
			area3items = [];
			area4Count = 0;
			area4items = [];
			gameOver = 0;
			gameMoveCont = 1;
			handleItems = [];
			let tileW = 100;
			let tileH = tileW * 1.45;
			if (settingsType == 1) {
				tileDefaultTop = tileH * 3.7;
				tileDefaultLeft = tileW * 8.6;
			} else {
				tileDefaultTop = tileH * 4.8;
				tileDefaultLeft = tileW * 10.5;
			}
			boardLeft2 = tileW * 17.2;
			boardTop2 = tileH * 5;
			boardLeft2 = tileW * 17.2;
			boardTop2 = tileH * 5;
			boardLeft3 = tileW * 8;
			boardTop3 = -tileH;
			boardLeft4 = -tileW;
			boardTop4 = tileH * 5;
			var _0x5f031e = 0;
			for (let i=1; i<=8; i++) {
				for (let j=1; j<=13; j++) {
					var _0xf34c82 = " ";
					let stone = parseInt(data[_0x5f031e].substr(1, 2));
					let color1 = data[_0x5f031e].substr(0, 1);
					if (stone == 0) stone = 'R';
					_0x5f031e++;
				}
			}
			for (let j=104; j<=105; j++) {
				var _0xf34c82 = " ";
				let stone = parseInt(data[_0x5f031e].substr(1, 2));
				let color1 = data[_0x5f031e].substr(0, 1);
				if (stone == 0) stone = 'R';
				_0x5f031e++;
			}

			tilesLeft = data.slice();

			// deliver tiles
			this.deliver();

			// assign active players board tiles
			this.getBoard(activePlayer);

			// set okey indicator
			let okeyId = (Tiles.okey-1).toString(),
				clr = Colors[+okeyId.slice(0,1)],
				num = new Number(okeyId.slice(1));
			APP.content.find(`.info .tiles.okey .tile`)
				.removeClass("red yellow blue black green")
				.addClass(clr)
				.data({ v: num });

			// temp for user player
			// boardTiles = state.player[0].board;
			// boardTiles1 = boardTiles.slice();

			// add html to rack DOM
			let htm = this.render(boardTiles);
			APP.game.els.rack.find(".tile").remove();
			APP.game.els.rack.append(htm);

			// make tiles position absolute
			let tiles = APP.content.find(".player .rack .temp");
			tiles.map(elem => {
				let el = $(elem),
					{ top, left } = el.offset();
				el.css({ top, left });
			});
			tiles.removeClass("temp");

			this.sem();

			/* a tile has been "drag and dropped"
			let tiles = Array(32).fill("");
			APP.game.els.rack.find(".tile").map(t => {
				let value = t.getAttribute("data-id"),
					y = parseInt(t.offsetTop / 73),
					x = parseInt(t.offsetLeft / 56),
					index = (y * 16) + x;
				tiles[index] = value;
			});
			*/

			// if (this.checkWin() || this.checkWinDouble()) {
			// 	return console.log("game over");
			// }
		},
		toParts(tile) {
			let id = tile.toString(),
				clr = Colors[+id.slice(0,1)],
				num = new Number(id.slice(1));
			return { id, clr, num };
		},
		drawTile() {
			let { id, clr, num } = this.toParts(tilesLeft[0]);
			this.updateLeftTiles(id);
			return { id, clr, num };
		},
		render(tiles) {
			// console.log(tiles.slice().filter(a => !!a).sort((a, b) => a - b));
			let str = [],
				okeyTile = Tiles.okey;
			tiles.map(id => {
				let clr = Colors[+id.slice(0,1)],
					num = new Number(id.slice(1));
				if (id === okeyTile) clr += " okey";
				if (id === "000") num = "j";
				if (id) str.push(`<span class="temp tile ${clr}" data-v="${num}" data-id="${id}"></span>`);
				else str.push(`<span class="temp empty"></span>`);
			});
			return str.join("");
		},
		updateRack() {
			/* */
			let rack = APP.content.find(".player .rack"),
				sorted = `<div class="re-arranged">${this.render(boardTiles)}</div>`,
				aEl = rack.append(sorted);

			rack.cssSequence("arrange-anim", "transitionend", el => {
				el.removeClass("arrange-anim");
				el.find(".re-arranged, .empty").remove();
				el.find(".placed").removeClass("placed");
			});

			rack.find("> .tile").map(tile => {
				let el = $(tile),
					target = aEl.find(`> .tile[data-id="${el.data("id")}"]:not(.placed)`).get(0);
				if (target.length) {
					let tOffset = target.offset();
					el.css({ top: tOffset.top, left: tOffset.left });
					target.addClass("placed");
				}
			});
		},
		deliver() {
			boardTiles1 = [];
			boardTiles2 = [];
			boardTiles3 = [];
			boardTiles4 = [];
			var _0x2c717f = [1, 2, 3, 4, 12, 13, 14, 15, 16, 17, 18, 27, 28, 29, 30];
			_0x2c717f = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
			var _0x53424a = 0;
			activePlayer = 1;
			boardTiles = [];
			boardPlaces = [];
			for (let i=0; i<=tileLimit; i++) {
				boardTiles.push(data[_0x53424a]);
				this.updateLeftTiles(data[_0x53424a]);
				_0x53424a++;
				this.place("tile-" + _0x53424a, _0x2c717f[i]);
			}
			boardTiles1 = boardTiles.slice();
			boardPlaces1 = boardPlaces.slice();
			activePlayer = 2;
			boardTiles = [];
			boardPlaces = [];
			for (let i=0; i<tileLimit; i++) {
				boardTiles.push(data[_0x53424a]);
				this.updateLeftTiles(data[_0x53424a]);
				_0x53424a++;
				this.place("tile-" + _0x53424a, _0x2c717f[i]);
			}
			boardTiles2 = boardTiles.slice();
			boardPlaces2 = boardPlaces.slice();
			activePlayer = 3;
			boardTiles = [];
			boardPlaces = [];
			for (let i=0; i<tileLimit; i++) {
				boardTiles.push(data[_0x53424a]);
				this.updateLeftTiles(data[_0x53424a]);
				_0x53424a++;
				this.place('tile-' + _0x53424a, _0x2c717f[i]);
			}
			boardTiles3 = boardTiles.slice();
			boardPlaces3 = boardPlaces.slice();
			activePlayer = 4;
			boardTiles = [];
			boardPlaces = [];
			for (let i=0; i<tileLimit; i++) {
				boardTiles.push(data[_0x53424a]);
				this.updateLeftTiles(data[_0x53424a]);
				_0x53424a++;
				this.place("tile-" + _0x53424a, _0x2c717f[i]);
			}
			activePlayer = 1;

			var _0x5f031e = 0;
			for (let i=1; i<=8; i++) {
				for (let j=1; j<=13; j++) {
					var _0xf34c82 = " ";
					var stone = parseInt(data[_0x5f031e].substr(1, 2));
					var color1 = data[_0x5f031e].substr(0, 1);
					if (stone == 0) stone = 'R';
					_0x5f031e++;
				}
			}
			for (let j=104; j<=105; j++) {
				var _0xf34c82 = " ";
				var stone = parseInt(data[_0x5f031e].substr(1, 2));
				var color1 = data[_0x5f031e].substr(0, 1);
				if (stone == 0) stone = 'R';
				_0x5f031e++;
			}
			let x = parseInt(data[_0x5f031e - 1].substr(0, 1));
			let y = parseInt(data[_0x5f031e - 1].substr(1, 2));
			let okey = y * 1 + 1;
			if (okey > 13) okey = 1;
			if (okey < 10) okey = '0' + okey;
			Tiles.okey = String(x) + String(okey);
			// console.log(Tiles.okey);
		},
		updateLeftTiles(item) {
			tilesLeft = this.removeArrayItem(tilesLeft, item);
			// update table tiles left
			APP.content.find(`.info .tiles.left .tile`).data({ n: tilesLeft.length });
		},
		place(tileId, pos, seat) {
			// var boardTop = 0;
			// var boardDiff = 0;
			// var _0x538492;
			// var _0x4f9f29;
			if (!seat) seat = activePlayer;
			
			let y1 = pos;
			if (pos > 16) y1 = pos - 16;
			// _0x538492 = boardLeft + (y1 - 1) * tileW;
			// _0x4f9f29 = boardTop;
			// if (pos > 16) _0x4f9f29 = boardTop + boardDiff;

			try {
				if (seat == 1) {
					// $(tileId).children[0].style.display = "block";
				} else {
					// $(tileId).children[0].style.display = "none";
				}
				var _0x363bc5 = tileId.split("-");
				_0x363bc5 = _0x363bc5[1] - 1;
				if (markOkey == 1) {
					if (data[_0x363bc5] == Tiles.okey) {
						// $(tileId).children[0].style.display = "none";
					}
				}
				// $(tileId).style.transition = "all 0.5s";
				// $(tileId).style.zIndex = '1';
				if (seat != 1) {
					// $(tileId).style.visibility = "hidden";
				}
				boardPlaces[pos] = tileId;
				boardTiles[pos-1] = data[_0x363bc5];
				if (virtualMove == 0) {
					this.updateBoards();
					if (seat == 1) {
						// $(_0x5595c5).style.left = _0x538492 + 'px';
						// $(_0x5595c5).style.top = _0x4f9f29 + 'px';
					}
					if (seat == 2) {
						// console.log("seat 2");
						// $(_0x5595c5).style.left = boardLeft2 + 'px';
						// $(_0x5595c5).style.top = boardTop2 + 'px';
					}
					if (seat == 3) {
						// $(_0x5595c5).style.left = boardLeft3 + 'px';
						// $(_0x5595c5).style.top = boardTop3 + 'px';
					}
					if (seat == 4) {
						// $(_0x5595c5).style.left = boardLeft4 + 'px';
						// $(_0x5595c5).style.top = boardTop4 + 'px';
					}
				}
			} catch {
				console.log("hata:" + tileId);
				console.log("Hata-boardTiles");
				console.log(boardTiles);
			}
		},
		getBoard(seat) {
			if (seat == 1) {
				activePlayer = 1;
				boardTiles = boardTiles1.slice();
				boardPlaces = boardPlaces1.slice();
			}
			if (seat == 2) {
				activePlayer = 2;
				boardTiles = boardTiles2.slice();
				boardPlaces = boardPlaces2.slice();
			}
			if (seat == 3) {
				activePlayer = 3;
				boardTiles = boardTiles3.slice();
				boardPlaces = boardPlaces3.slice();
			}
			if (seat == 4) {
				activePlayer = 4;
				boardTiles = boardTiles4.slice();
				boardPlaces = boardPlaces4.slice();
			}
		},
		arrange(seat, type=1) {
			// type 1: serial
			// type 2: double
			var _0x415797 = [];
			var _0x4ace7d = [];
			var _0x8d1441 = [];
			var _0x20d181 = [];
			var _0x163d98 = [];
			this.getBoard(seat);

			okeyCont = 0;
			var _0x4d7341 = 0;
			if (activePlayer == 1) _0x4d7341 = 1;
			
			if (settingsGameLevel > 1 || _0x4d7341 == 1) {
				var _0x236bec = boardTiles.indexOf(Tiles.okey);
				if (_0x236bec != -1) {
					boardTiles[_0x236bec] = "800";
					okeyCont++;
				}
				var _0x236bec = boardTiles.indexOf(Tiles.okey);
				if (_0x236bec != -1) {
					boardTiles[_0x236bec] = "800";
					okeyCont++;
				}
				var _0x236bec = boardTiles.indexOf("000");
				if (_0x236bec != -1) {
					boardTiles[_0x236bec] = String(Tiles.okey);
				}
				var _0x236bec = boardTiles.indexOf("000");
				if (_0x236bec != -1) {
					boardTiles[_0x236bec] = String(Tiles.okey);
				}
			}
			var _0xabd7f7 = boardTiles.slice();
			var _0x4d2aea = boardTiles.slice();

			if (type == 1) {
				if (this.checkPer(3) || settingsGameLevel < 3 && _0x4d7341 == 0) {
					_0x415797 = this.sortTiles(3, 1);
					_0x4ace7d = _0x415797.slice();
					boardTiles = boardTilesVir.slice();
					_0x415797 = this.sortTilesByColor(3, 1);
					_0x8d1441 = _0x415797.slice();
					boardTiles = boardTilesVir.slice();
				} else {
					_0x415797 = this.sortTilesByColor(3, 1);
					_0x8d1441 = _0x415797.slice();
					boardTiles = boardTilesVir.slice();
					_0x415797 = this.sortTiles(3, 1);
					_0x4ace7d = _0x415797.slice();
					;
					boardTiles = boardTilesVir.slice();
				}
				_0x4ace7d.push.apply(_0x4ace7d, _0x8d1441);
				perFull = _0x4ace7d.slice();
				// console.log("perFull", perFull.slice());
				this.addFourth();
				if (okeyCont > 0) {
					this.addOkey(1);
				}
				_0x4ace7d = perFull.slice();
				if (this.checkPer(2) || settingsGameLevel < 3 && _0x4d7341 == 0) {
					_0x415797 = this.sortTiles(2, 1);
					_0x20d181 = _0x415797.slice();
					boardTiles = boardTilesVir.slice();
					_0x415797 = this.sortTilesByColor(2, 1);
					_0x163d98 = _0x415797.slice();
					boardTiles = boardTilesVir.slice();
				} else {
					_0x415797 = this.sortTilesByColor(2, 1);
					_0x163d98 = _0x415797.slice();
					boardTiles = boardTilesVir.slice();
					_0x415797 = this.sortTiles(2, 1);
					_0x20d181 = _0x415797.slice();
					boardTiles = boardTilesVir.slice();
				}
				_0x20d181.push.apply(_0x20d181, _0x163d98);
				perHalf = _0x20d181.slice();
				// console.log("perHalf", perHalf.slice());
				if (okeyCont > 0) {
					this.addOkey(2);
				}
				if (okeyCont > 0) {
					this.addOkey(3);
				}
				if (okeyCont > 0) {
					this.addOkey(4);
					_0x4ace7d = perFull.slice();
				}
				_0x20d181 = perHalf.slice();
			}
			if (type == 2) {
				_0x415797 = this.sortDouble(0, 1);
				_0x4ace7d = _0x415797.slice();
				perFull = _0x4ace7d.slice();
				boardTiles = boardTilesVir.slice();
				if (okeyCont > 0) {
					this.addOkeyDouble();
				}
				boardTiles = boardTilesVir.slice();
				_0x4ace7d = perFull.slice();
			}
			_0x4ace7d.push.apply(_0x4ace7d, _0x20d181);
			boardTiles = boardTiles.filter(e => e != "");
			var _0x17aa37 = 0;
			var _0x1eddbe = 0;
			var _0x52b171 = 0;
			// for (let i=0; i<=_0x4ace7d.length; i++) {
			// 	if (_0x4ace7d[i] == "") {
			// 		if (i <= 16) {
			// 			_0x17aa37 = _0x1eddbe;
			// 			_0x1eddbe = i;
			// 		}
			// 		if (i > 16 && _0x52b171 == 0) {
			// 			_0x52b171 = i;
			// 		}
			// 	}
			// }
			_0x17aa37 =
			_0x52b171 = _0x4ace7d.length;
			if (_0x1eddbe) {
				for (let i=0; i<16 - _0x1eddbe; i++) {
					_0x4ace7d.splice(_0x17aa37, 0, "");
				}
			}
			if (_0x4ace7d[16] == "") {
				_0x4ace7d.splice(16, 1);
			}
			var _0x246380 = _0x4ace7d.length * 1 + boardTiles.length * 1;
			for (let i=0; i<32 - _0x246380; i++) {
				_0x4ace7d.push("");
			}
			if (type == 1) {
				this.priority();
			}
			_0x4ace7d.push.apply(_0x4ace7d, boardTiles);
			boardTiles = _0x4ace7d.slice();
			var _0x199fea = boardTiles.length;
			for (let i=32; i<_0x199fea; i++) {
				boardTiles = this.removeArrayItem(boardTiles, "", 1);
			}

			_0x4d2aea = [];
			let boardPlacesTemp1 = boardPlaces.slice();
			boardPlaces = Array(31).fill(0);
			var _0x3509bd = 0;
			for (let i=0; i<boardTiles.length; i++) {
				var _0x27d3db = i * 1 + 1;
				if (boardTiles[i] != '') {
					var _0x545a8b = _0xabd7f7.indexOf(boardTiles[i]);
					_0xabd7f7[_0x545a8b] = '';
					_0x545a8b++;
					if (boardTiles[i] != '') {
						_0x4d2aea[_0x3509bd] = boardTiles[i];
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
		moveBack(el) {
			console.log("moveBack", el);
			// clickCont = 0;
			// $(el).style.transition = "all 0.5s";
			// setTimeout(function () {
			// 	$(el).style.zIndex = lastStamZindex;
			// 	clickCont = 1;
			// }, 500);
			// $(el).style.left = lastTileLeft + 'px';
			// $(el).style.top = lastTileTop + 'px';
		},
		putToTable(_0x139c25, _0x4b4905) {
			UserTotal = 0;
			UserTotalDouble = 0;
			let diff = 0;
			if (_0x139c25 == 1) {
				boardTiles = boardTiles1.slice();
				boardPlaces = boardPlaces1.slice();
				if (_0x4b4905 == 1) {
					this.checkWin();
				}
				if (_0x4b4905 == 2) {
					this.checkWinDouble();
				}
				UserSeri = User1Seri.slice();
				UserDouble = User1Double.slice();
				UserTotal = User1Total;
				UserTotalDouble = User1TotalDouble;
			}
			if (_0x139c25 == 2) {
				boardTiles = boardTiles2.slice();
				boardPlaces = boardPlaces2.slice();
				if (_0x4b4905 == 1) {
					this.checkWin();
				}
				if (_0x4b4905 == 2) {
					this.checkWinDouble();
				}
				UserSeri = User2Seri.slice();
				UserDouble = User2Double.slice();
				UserTotal = User2Total;
				UserTotalDouble = User2TotalDouble;
			}
			if (_0x139c25 == 3) {
				boardTiles = boardTiles3.slice();
				boardPlaces = boardPlaces3.slice();
				if (_0x4b4905 == 1) {
					this.checkWin();
				}
				if (_0x4b4905 == 2) {
					this.checkWinDouble();
				}
				UserSeri = User3Seri.slice();
				UserDouble = User3Double.slice();
				UserTotal = User3Total;
				UserTotalDouble = User3TotalDouble;
			}
			if (_0x139c25 == 4) {
				boardTiles = boardTiles4.slice();
				boardPlaces = boardPlaces4.slice();
				if (_0x4b4905 == 1) {
					this.checkWin();
				}
				if (_0x4b4905 == 2) {
					this.checkWinDouble();
				}
				UserSeri = User4Seri.slice();
				UserDouble = User4Double.slice();
				UserTotal = User4Total;
				UserTotalDouble = User4TotalDouble;
			}
			if (UserTotal == 0 && _0x4b4905 == 1 || UserTotalDouble == 0 && _0x4b4905 == 2) {
				if (_0x4b4905 == 1 && _0x139c25 == 1 && AIStatus == 0) {
					this.popMessage("El acabilmeniz icin elinizde en az 1 per olmasi gerkiyor!");
				}
				if (_0x4b4905 == 2 && _0x139c25 == 1 && AIStatus == 0) {
					this.popMessage("El acabilmeniz icin elinizde en az 1 cift olmasi gerkiyor!");
				}
				return 0;
			}
			var _0x488971 = UserSeri.filter(e => e != '').slice();
			var _0x5869f9 = boardTiles.filter(e => e != '').slice();
			if (_0x5869f9.length <= tileLimits[_0x139c25]) {
				if (_0x139c25 == 1) {
					this.popMessage("Önce yerden tas almaniz gerekiyor!");
				}
				return 0;
			}
			if (_0x488971.length > tileLimit) {
				this.popMessage("Istakanizda saqa atacak tas kalmadiqi icin taslarinizi geri toplamaniz gerekiyor");
			}
			if (_0x4b4905 == 1 && openStatusDouble[_0x139c25] == 1) {
				if (_0x139c25 == 1 && AIStatus == 0) {
					this.popMessage("Cift actiqiniz icin, artik seri acamazsiniz!");
					openPunish[_0x139c25] = 0;
				}
				return 0;
			}
			if (_0x4b4905 == 2 && openStatusSort[_0x139c25] == 1 && handleDouble == 0) {
				if (_0x139c25 == 1 && AIStatus == 0) {
					this.popMessage("Seri actiqiniz icin, artik cift acamazsiniz!");
				}
				return 0;
			}
			if (_0x4b4905 == 1 && UserTotal < openLimit && openStatusSort[_0x139c25] == 0) {
				if (_0x139c25 == 1 && AIStatus == 0) {
					this.popMessage("Seri acabilmeniz icin toplam " + openLimit + " puana ulasmasi gerekiyor!");
					openPunish[_0x139c25] = 1;
				}
				if (_0x139c25 != 1 || AIStatus == 1) {
					return 0;
				}
			}
			if (_0x4b4905 == 2 && UserTotalDouble < openLimitDouble && openStatusDouble[_0x139c25] == 0 && handleDouble == 0) {
				if (_0x139c25 == 1 && AIStatus == 0) {
					this.popMessage("Cift acabilmeniz icin toplam en az " + openLimitDouble + " seriniz olmasi gerekiyor!");
					openPunish[_0x139c25] = 1;
				}
				if (_0x139c25 != 1 || AIStatus == 1) {
					return 0;
				}
			}
			if (UserTotalDouble == 0 && _0x4b4905 == 2 && _0x139c25 == 1 && AIStatus == 0) {
				this.popMessage("Cift acabilecek tasiniz yok!");
			}
			var _0x91c7d2;
			if (_0x4b4905 == 1) {
				if (openStatusSort[_0x139c25] == 0) {
					this.popMessage(users[_0x139c25] + " seri acti: " + UserTotal);
					if (settingsIncrease == 1) {
						openLimitLast = openLimit;
						openLimit = UserTotal * 1 + 1;
						$("table-sort-score").innerHTML = openLimit;
					}
				}
				openStatusSort[_0x139c25] = 1;
				_0x91c7d2 = UserSeri.slice();
				if (_0x139c25 == 1 && UserTotal >= openLimitLast) {
					this.buttonActivePassive("handle-sort", 1);
					this.buttonActivePassive("handle-double", 1);
					firstOpenCont = 1;
				}
			}
			if (_0x4b4905 == 2) {
				if (openStatusDouble[_0x139c25] == 0) {
					this.popMessage(users[_0x139c25] + " cift acti : " + UserTotalDouble);
					if (settingsIncrease == 1 && UserTotalDouble >= openLimitDouble) {
						openLimitDoubleLast = openLimitDouble;
						openLimitDouble = UserTotalDouble * 1 + 1;
						if (settingsType == 3) {
							openLimitDouble = openLimitD;
						}
						$("table-double-score").innerHTML = openLimitDouble;
					}
				}
				if (handleDouble == 0) {
					openStatusDouble[_0x139c25] = 1;
					if (_0x139c25 == 1 && UserTotalDouble >= openLimitDoubleLast) {
						this.buttonActivePassive("handle-sort", 1);
						this.buttonActivePassive("handle-double", 1);
						firstOpenCont = 1;
					}
				}
				_0x91c7d2 = UserDouble.slice();
			}
			if (!collect[0]) {
				collect = [];
				collectPlaces = boardPlaces.slice();
				collectTiles = boardTiles.slice();
			}
			var _0x484f1e = _0x139c25;
			if (handleDouble == 1) {
				_0x484f1e = doubleHandleTo;
			}
			for (let i=0; i<_0x91c7d2.length; i++) {
				if (_0x91c7d2[i] != '') {
					var _0x897419 = boardTiles.indexOf(String(_0x91c7d2[i]));
					if (_0x91c7d2[i] - _0x91c7d2[i] % 100 == 900) {
						_0x897419 = boardTiles.indexOf(String(okey));
					}
					if (_0x91c7d2[i] - _0x91c7d2[i] % 100 == 800) {
						_0x897419 = boardTiles.indexOf("000");
					}
					if (_0x897419 !== -1) {
						this.moveToTable(_0x484f1e, _0x91c7d2[i], -1, -1, _0x4b4905);
						tileLimits[_0x139c25]--;
					}
				} else {
					if (_0x4b4905 == 1) {
						tableH[_0x484f1e]++;
					}
					if (_0x4b4905 == 2) {
						tableHdouble[_0x484f1e]++;
					}
					diff = 0;
					lastStone = '';
				}
				var _0x4fe46a = activePlayer;
				activePlayer = _0x139c25;
				this.updateBoards();
				activePlayer = _0x4fe46a;
			}
			var _0x2c9a7e = boardTiles.filter(e => e != '').slice();
			if (_0x2c9a7e.length == 0) {
				if (_0x139c25 != 1 || AIStatus == 1) {
					this.collectItBack();
				} else {
					this.popMessage("Istakanizsa saqa atabiceqiniz tas kalmadi.");
				}
			}
			handleDouble = 0;
			if (_0x139c25 == 1) {
				markIt(1);
				if (_0x4b4905 == 1) {
					this.checkWin();
				}
				if (_0x4b4905 == 2) {
					this.checkWinDouble();
				}
			}
		},
		moveToTable(_0x336229, _0x315c85, _0x5f22f9, _0x4693ec, _0x14df73, _0x5486c5) {
			var _0x2a961e = String(_0x315c85);
			var _0x4295dd;
			stone = parseInt(_0x2a961e.substr(1, 2));
			color1 = _0x2a961e.substr(0, 1);
			var _0xf1fecf = boardTiles.indexOf(String(_0x315c85));
			var _0x5b13d2 = 0;
			if (_0x315c85 - _0x315c85 % 100 == 900) {
				_0xf1fecf = boardTiles.indexOf(String(okey));
			}
			if (_0x315c85 - _0x315c85 % 100 == 800) {
				_0xf1fecf = boardTiles.indexOf("000");
				_0x5b13d2 = 1;
			}
			if (getOkeyKont == 0) {
				_0x4295dd = boardPlaces[_0xf1fecf * 1 + 1];
				boardPlaces[_0xf1fecf * 1 + 1] = 0;
				boardTiles[_0xf1fecf] = '';
			}
			if (_0x5486c5) {
				sayTableTilesTemp = sayTableTiles;
				sayTableTiles = _0x5486c5;
				_0x4295dd = 0;
			} else {
				sayTableTiles++;
			}
			if (_0x315c85 == leftHandCont || leftHandCont == "000" && _0x5b13d2 == 1) {
				var _0x57b199 = leftHandCont % 100;
				_0x57b199 = _0x57b199 * 10;
				leftHandContTemp = leftHandCont;
				leftHandTileTemp = leftHandTile;
				leftHandCont = 0;
				leftHandTile = 0;
				if (activePlayer == 1) {
					if (settingsPunish == 1 && (settingsType == 2 || settingsType == 3)) {
						this.changePoint(_0x57b199, 4, 1);
					}
					$("area-4").innerHTML = '';
					$("area-4").classList.remove("drop");
				}
			}
			if (mobile == 0) {
				var _0x383df0 = tileW * 0.55;
				var _0x3af68e = tileH * 0.55;
			} else {
				var _0x383df0 = tileW * 0.54;
				var _0x3af68e = tileH * 0.54;
			}
			var _0x2378b2 = _0x383df0 * 0.04;
			var _0x29cbcd = _0x3af68e * 0.04;
			if (stone == lastStone) {
				if (stone > 10 && _0x14df73 == 1) {
					diff--;
				} else {
					diff++;
				}
			}
			var _0x51fce2;
			var _0x5a1841;
			if (_0x14df73 == 1) {
				_0x51fce2 = stone - 1 + diff * 1;
				_0x5a1841 = tableH[_0x336229];
			}
			if (_0x14df73 == 2) {
				_0x51fce2 = diff * 1;
				_0x5a1841 = tableHdouble[_0x336229];
			}
			if (_0x5f22f9 > -1) {
				_0x51fce2 = _0x5f22f9;
			}
			if (_0x4693ec > -1) {
				_0x5a1841 = _0x4693ec;
			}
			if (_0x336229 == 1) {
				if (_0x14df73 == 1) {
					tableUser1[_0x5a1841][_0x51fce2] = _0x315c85;
					tableUserTiles1[_0x5a1841][_0x51fce2] = sayTableTiles;
				}
				if (_0x14df73 == 2) {
					tableDoubleUser1[_0x5a1841][_0x51fce2] = _0x315c85;
					tableDoubleUserTiles1[_0x5a1841][_0x51fce2] = sayTableTiles;
				}
			}
			if (_0x336229 == 2) {
				if (_0x14df73 == 1) {
					tableUser2[_0x5a1841][_0x51fce2] = _0x315c85;
					tableUserTiles2[_0x5a1841][_0x51fce2] = sayTableTiles;
				}
				if (_0x14df73 == 2) {
					tableDoubleUser2[_0x5a1841][_0x51fce2] = _0x315c85;
					tableDoubleUserTiles2[_0x5a1841][_0x51fce2] = sayTableTiles;
				}
			}
			if (_0x336229 == 3) {
				if (_0x14df73 == 1) {
					tableUser3[_0x5a1841][_0x51fce2] = _0x315c85;
					tableUserTiles3[_0x5a1841][_0x51fce2] = sayTableTiles;
				}
				if (_0x14df73 == 2) {
					tableDoubleUser3[_0x5a1841][_0x51fce2] = _0x315c85;
					tableDoubleUserTiles3[_0x5a1841][_0x51fce2] = sayTableTiles;
				}
			}
			if (_0x336229 == 4) {
				if (_0x14df73 == 1) {
					tableUser4[_0x5a1841][_0x51fce2] = _0x315c85;
					tableUserTiles4[_0x5a1841][_0x51fce2] = sayTableTiles;
				}
				if (_0x14df73 == 2) {
					tableDoubleUser4[_0x5a1841][_0x51fce2] = _0x315c85;
					tableDoubleUserTiles4[_0x5a1841][_0x51fce2] = sayTableTiles;
				}
			}
			if (getOkeyKont == 0) {
				if (!_0x5486c5) {
					collect.push(_0x336229 + ',' + "tile-mini2-" + sayTableTiles + ',' + _0x5a1841 + ',' + _0x51fce2 + ',' + _0x14df73);
					if (activePlayer == 1) {
						this.buttonActivePassive("collect", 1);
					}
				}
				// console.log(_0x4295dd, _0x336229, _0x383df0 * 0.7 * _0x5a1841, _0x383df0 * 0.49 * _0x51fce2, _0x14df73, "tile-mini2-" + sayTableTiles);
				this.moveTile(_0x4295dd, _0x336229, _0x383df0 * 0.7 * _0x5a1841, _0x383df0 * 0.49 * _0x51fce2, _0x14df73, "tile-mini2-" + sayTableTiles);
			}
			var _0x4d23cf = null;
			if (_0x315c85 - _0x315c85 % 100 == 800) {
				_0x4d23cf = stone;
				stone = 'R';
				color1 = 0;
			}
			var _0x469b85;
			if (_0x14df73 == 1) {
				_0x469b85 = "sort";
			}
			if (_0x14df73 == 2) {
				_0x469b85 = "double";
			}
			if (!_0x5486c5) {
				$("user" + _0x336229 + "-table-" + _0x469b85).innerHTML += "<div id=\"tile-mini2-" + sayTableTiles + "\" class=\"tile " + color[color1] + "\">" + sayTableTiles + "</div>";
			}
			$("tile-mini2-" + sayTableTiles).style.left = _0x2378b2 * 1 + _0x383df0 * 0.49 * _0x51fce2 + 'px';
			$("tile-mini2-" + sayTableTiles).style.top = _0x29cbcd * 1 + _0x383df0 * 0.7 * _0x5a1841 + 'px';
			$("tile-mini2-" + sayTableTiles).style.width = _0x383df0 * 0.45 + 'px';
			$("tile-mini2-" + sayTableTiles).style.height = _0x3af68e * 0.45 + 'px';
			$("tile-mini2-" + sayTableTiles).style.lineHeight = _0x3af68e * 0.28 + 'px';
			$("tile-mini2-" + sayTableTiles).style.fontSize = _0x383df0 * 0.35 + 'px';
			$("tile-mini2-" + sayTableTiles).style.borderRadius = _0x383df0 * 0.05 + 'px';
			;
			if (getOkeyKont == 0) {
				$("tile-mini2-" + sayTableTiles).style.visibility = "hidden";
			}
			$("tile-mini2-" + sayTableTiles).innerHTML = "<div id='face-mini2-" + sayTableTiles + "' style='display:block'><div class='point2-mini'>" + "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" class=\"heart2-mini\" viewBox=\"0 0 16 16\"> <path fill-rule=\"evenodd\" d=\"M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z\"/> </svg>" + "</div><div id='Letter-mini2-" + j + '-' + i + "'>" + stone + "</div></div>";
			if (_0x315c85 - _0x315c85 % 100 == 900) {
				$("face-mini2-" + sayTableTiles).style.display = "none";
			}
			if (_0x4d23cf) {
				stone = _0x4d23cf;
			}
			lastStone = stone;
			if (_0x5486c5) {
				sayTableTiles = sayTableTilesTemp;
			}
		},
		buttonActivePassive(_0x282945, _0x106ed0) {
			console.log("buttonActivePassive");
		},
		collectItBack() {
			// return 0;
			this.buttonActivePassive("collect", 0);
			if (activePlayer == 1 && firstOpenCont == 1) {
				openStatusDouble[1] = 0;
				openStatusSort[1] = 0;
				firstOpenCont = 0;
				this.buttonActivePassive("handle-sort", 0);
				this.buttonActivePassive("handle-double", 0);
			}
			openPunish[1] = 0;
			if (leftHandContTemp) {
				leftHandCont = leftHandContTemp;
				leftHandTile = leftHandTileTemp;
				leftHandContTemp = 0;
				leftHandTileTemp = 0;
				if (activePlayer == 1) {
					$("area-4").innerHTML = "TASI GERI BIRAK";
					$("area-4").classList.add("drop");
				}
			}
			for (let i=0; i<collectTiles.length; i++) {
				boardPlaces[i * 1 + 1] = 0;
				boardTiles[i] = '';
				if (collectTiles[i]) {
					$(collectPlaces[i * 1 + 1]).style.display = "block";
					boardPlaces[i * 1 + 1] = collectPlaces[i * 1 + 1];
					boardTiles[i] = collectTiles[i];
					this.place(collectPlaces[i * 1 + 1], i * 1 + 1);
					$(collectPlaces[i * 1 + 1]).style.visibility = "visible";
					$(collectPlaces[i * 1 + 1]).style.transform = "scale(1)";
				}
			}
			for (let i=0; i<collect.length; i++) {
				tileLimits[activePlayer]++;
				var _0x47c5d3 = collect[i].split(',');
				$(_0x47c5d3[1]).style.display = "none";
				if (_0x47c5d3[4] == 1) {
					console.log("EVAL tableUser" + _0x47c5d3[0] + '[' + _0x47c5d3[2] + '][' + _0x47c5d3[3] + ']=' + 0);
				}
				if (_0x47c5d3[4] == 2) {
					console.log("EVAL tableDoubleUser" + _0x47c5d3[0] + '[' + _0x47c5d3[2] + '][' + _0x47c5d3[3] + ']=' + 0);
				}
			}
			for (let i=1; i<=4; i++) {
				var _0x4fc67e = console.log("EVAL tableUser" + i + ".slice()");
				for (let j=6; j>=0; j--) {
					hh = 0;
					for (let k=0; k<13; k++) {
						if (_0x4fc67e[j][k] != 0) {
							hh = 1;
							break;
						}
					}
					if (hh) {
						break;
					}
				}
				tableH[i] = j;
				tableH[i]++;
			}
			for (let i=1; i<=4; i++) {
				var _0x4fc67e = console.log("EVAL tableDoubleUser" + i + ".slice()");
				for (let j=12; j>=0; j--) {
					hh = 0;
					for (let k=0; k<2; k++) {
						if (_0x4fc67e[j][k] != 0) {
							hh = 1;
							break;
						}
					}
					if (hh) {
						break;
					}
				}
				tableHdouble[i] = j;
				tableHdouble[i]++;
			}
			if (tableHdouble[1] == 0 && tableH[1] == 0) {
				openStatusSort[1] = 0;
				openStatusDouble[1] = 0;
				openLimit = openLimitLast;
				openLimitDouble = openLimitDoubleLast;
				$("table-sort-score").innerHTML = openLimit;
				$("table-double-score").innerHTML = openLimitDouble;
			}
			collect = [];
			collectPlaces = [];
			collectTiles = [];
			this.markIt(1);
		},
		priority() {
			boardTiles.sort();
			boardTiles.sort((a, b) => a - b);
			boardTilesVir = boardTiles.slice();
			for (let i=1; i<boardTiles.length; i++) {
				if (Math.abs(boardTiles[i] - boardTiles[i - 1]) == 2) {
					boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i - 1]);
					boardTilesVir.unshift(boardTiles[i]);
					boardTilesVir.unshift(boardTiles[i - 1]);
				}
			}
			var _0x1fcc79 = 0;
			for (let i=0; i<perFull.length; i++) {
				_0x1fcc79++;
				if (perFull[i] == '') {
					if (_0x1fcc79 > 3) {
						for (let j=0; j<boardTiles.length; j++) {
							if ((boardTiles[j] - perFull[i - 1] == 2 || perFull[i - _0x1fcc79 + 1] - boardTiles[j] == 2) && (Math.abs(perFull[i - 1] - perFull[i - 2]) == 1 || Math.abs(perFull[i - 2] - perFull[i - 3]) == 1)) {
								boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[j]);
								boardTilesVir.unshift(boardTiles[j]);
							}
						}
					}
					_0x1fcc79 = 0;
				}
			}
			var _0x1fcc79 = 0;
			for (let i=0; i<perFull.length; i++) {
				_0x1fcc79++;
				if (perFull[i] == '') {
					if (_0x1fcc79 > 4) {
						for (let j=0; j<boardTiles.length; j++) {
							if (boardTiles[j] - perFull[i - 1] == 1 || perFull[i - _0x1fcc79 + 1] - boardTiles[j] == 1) {
								boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[j]);
								boardTilesVir.unshift(boardTiles[j]);
							}
						}
					}
					_0x1fcc79 = 0;
				}
			}
			var _0x1fcc79 = 0;
			for (let i=0; i<perFull.length; i++) {
				_0x1fcc79++;
				if (perFull[i] == '') {
					if (_0x1fcc79 > 4) {
						for (let j=0; j<boardTiles.length; j++) {
							if (Math.abs(boardTiles[j] - perFull[i - 1]) % 100 == 0 && boardTiles[j] - perFull[i - 1] != 0 || Math.abs(perFull[i - _0x1fcc79 + 1] - boardTiles[j]) % 100 == 0 && perFull[i - _0x1fcc79 + 1] - boardTiles[j] != 0) {
								boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[j]);
								boardTilesVir.unshift(boardTiles[j]);
							}
						}
					}
					_0x1fcc79 = 0;
				}
			}
			var _0x1fcc79 = 0;
			for (let i=0; i<perHalf.length; i++) {
				if (perHalf[i] == '') {
					for (let j=0; j<boardTiles.length; j++) {
						if ((Math.abs(boardTiles[j] - perHalf[i - 1]) % 100 == 0 || Math.abs(boardTiles[j] - perHalf[i - 2]) % 100 == 0) && perHalf[i - 1] != boardTiles[j] && perHalf[i - 2] != boardTiles[j]) {
							boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[j]);
							boardTilesVir.unshift(boardTiles[j]);
						}
					}
				}
			}
			var _0x1fcc79 = 0;
			for (let i=0; i<perHalf.length; i++) {
				if (perHalf[i] == '') {
					for (let j=0; j<boardTiles.length; j++) {
						if ((Math.abs(boardTiles[j] - perHalf[i - 1]) == 1 || Math.abs(perHalf[i - 2] - boardTiles[j]) == 1) && perHalf[i - 1] != boardTiles[j] && perHalf[i - 2] != boardTiles[j]) {
							boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[j]);
							boardTilesVir.unshift(boardTiles[j]);
						}
					}
				}
			}
			var _0x1fcc79 = 0;
			for (let i=0; i<perHalf.length; i++) {
				if (perHalf[i] == '') {
					for (let j=0; j<boardTiles.length; j++) {
						if ((Math.abs(boardTiles[j] - perHalf[i - 1]) == 2 || Math.abs(perHalf[i - 2] - boardTiles[j]) == 2) && perHalf[i - 1] != boardTiles[j] && perHalf[i - 2] != boardTiles[j]) {
							boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[j]);
							boardTilesVir.unshift(boardTiles[j]);
						}
					}
				}
			}
			boardTiles = boardTilesVir.slice();
		},
		addFourth() {
			let bTiles = boardTiles;
			for (let k=0; k<=1; k++) {
				for (let i=0; i<bTiles.length; i++) {
					for (let j=0; j<perFull.length; j++) {
						if (perFull[j] == "") {
							var _0x39a913 = bTiles[i];
							if (settingsType == 1) {
								if (bTiles[i] % 100 == 1) {
									_0x39a913 = bTiles[i] * 1 + 13;
								}
							}
							if (perFull[j - 1] * 1 + 1 == _0x39a913 && perFull[j - 2] * 1 + 2 == _0x39a913 && perFull[j - 3] * 1 + 3 == _0x39a913) {
								perFull.splice(j, 0, bTiles[i]);
								boardTilesVir = this.removeArrayItem(boardTilesVir, bTiles[i]);
								bTiles = this.removeArrayItem(bTiles, bTiles[i]);
								i--;
							}
						}
					}
				}
			}
			for (let i=0; i<bTiles.length; i++) {
				var _0x12e6a9 = 0;
				for (let j=0; j<perFull.length; j++) {
					_0x12e6a9++;
					if (perFull[j] == "") {
						if (_0x12e6a9 == 4) {
							if (perFull[j - 3] % 100 == bTiles[i] % 100 && perFull[j - 2] % 100 == bTiles[i] % 100 && perFull[j - 1] % 100 == bTiles[i] % 100 && perFull[j - 1] != bTiles[i] && perFull[j - 2] != bTiles[i] && perFull[j - 3] != bTiles[i]) {
								perFull.splice(j, 0, bTiles[i]);
								boardTilesVir = this.removeArrayItem(boardTilesVir, bTiles[i]);
								bTiles = this.removeArrayItem(bTiles, bTiles[i]);
							}
						}
						_0x12e6a9 = 0;
					}
				}
			}
			return bTiles;
		},
		addOkey(seat) {
			boardTiles.sort();
			boardTiles.sort((a, b) => a - b);
			boardTilesVir = boardTiles.slice();
			if (seat == 1) {
				var _0x164ff0;
				for (let i=2; i<=boardTiles.length * 1 + 3; i++) {
					if (boardTiles[i - 1] % 100 == 1 && settingsType == 1) {
						_0x164ff0 = i - 1;
					}
					if (_0x164ff0 && boardTiles[i] - boardTiles[i - 1] == 1 && boardTiles[i * 1 + 1] - boardTiles[i] == 2 && boardTiles[i * 1 + 1] - boardTiles[_0x164ff0] == 12 && settingsType == 1) {
						perFull.push(boardTiles[i - 1]);
						perFull.push(boardTiles[i]);
						perFull.push("800");
						perFull.push(boardTiles[i * 1 + 1]);
						perFull.push(boardTiles[_0x164ff0]);
						perFull.push('');
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i - 1]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i * 1 + 1]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[_0x164ff0]);
						boardTiles = boardTilesVir.slice();
						okeyCont--;
						if (okeyCont == 0) {
							return 0;
						}
					}
					if (boardTiles[i - 1] - boardTiles[i - 2] == 2 && boardTiles[i] - boardTiles[i - 1] == 1 && boardTiles[i * 1 + 1] - boardTiles[i] == 1 || boardTiles[i - 1] - boardTiles[i - 2] == 1 && boardTiles[i] - boardTiles[i - 1] == 2 && boardTiles[i * 1 + 1] - boardTiles[i] == 1) {
						perFull.push(boardTiles[i - 2]);
						if (boardTiles[i - 1] - boardTiles[i - 2] > 1) {
							perFull.push("800");
						}
						perFull.push(boardTiles[i - 1]);
						if (boardTiles[i] - boardTiles[i - 1] > 1) {
							perFull.push("800");
						}
						perFull.push(boardTiles[i]);
						perFull.push(boardTiles[i * 1 + 1]);
						perFull.push('');
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i * 1 + 1]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i - 1]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i - 2]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
						boardTiles = boardTilesVir.slice();
						okeyCont--;
						if (okeyCont == 0) {
							return 0;
						}
					}
					if (_0x164ff0 && (boardTiles[i] - boardTiles[i - 1] == 1 && boardTiles[i] - boardTiles[_0x164ff0] == 11 || boardTiles[i] - boardTiles[i - 1] == 2 && boardTiles[i] - boardTiles[_0x164ff0] == 12) && settingsType == 1) {
						perFull.push(boardTiles[i - 1]);
						if (boardTiles[i] - boardTiles[i - 1] == 2) {
							perFull.push("800");
						}
						perFull.push(boardTiles[i]);
						if (boardTiles[i] - boardTiles[i - 1] == 1) {
							perFull.push("800");
						}
						perFull.push(boardTiles[_0x164ff0]);
						perFull.push('');
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i - 1]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[_0x164ff0]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
						boardTiles = boardTilesVir.slice();
						okeyCont--;
						if (okeyCont == 0) {
							return 0;
						}
					}
					if (boardTiles[i - 1] - boardTiles[i - 2] == 2 && boardTiles[i] - boardTiles[i - 1] == 1 || boardTiles[i - 1] - boardTiles[i - 2] == 1 && boardTiles[i] - boardTiles[i - 1] == 2) {
						perFull.push(boardTiles[i - 2]);
						if (boardTiles[i - 1] - boardTiles[i - 2] > 1) {
							perFull.push("800");
						}
						perFull.push(boardTiles[i - 1]);
						if (boardTiles[i] - boardTiles[i - 1] > 1) {
							perFull.push("800");
						}
						perFull.push(boardTiles[i]);
						perFull.push('');
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i - 1]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i - 2]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
						boardTiles = boardTilesVir.slice();
						okeyCont--;
						if (okeyCont == 0) {
							return 0;
						}
					}
				}
			}
			if (seat == 2) {
				var _0x164ff0;
				for (let i=1; i<boardTiles.length; i++) {
					if (boardTiles[i] - boardTiles[i - 1] == 2) {
						perHalf.push(boardTiles[i - 1]);
						perHalf.push("800");
						perHalf.push(boardTiles[i]);
						perHalf.push('');
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i - 1]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
						boardTiles = boardTilesVir.slice();
						okeyCont--;
						if (okeyCont == 0) {
							return 0;
						}
					}
					if (boardTiles[i - 1] % 100 == 1 && settingsType == 1) {
						_0x164ff0 = i - 1;
					}
					if (_0x164ff0 && boardTiles[i] - boardTiles[_0x164ff0] == 11 && settingsType == 1) {
						perHalf.push(boardTiles[i]);
						perHalf.push("800");
						perHalf.push(boardTiles[_0x164ff0]);
						perHalf.push('');
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[_0x164ff0]);
						boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
						boardTiles = boardTilesVir.slice();
						okeyCont--;
						if (okeyCont == 0) {
							return 0;
						}
					}
				}
			}
			if (seat == 3) {
				for (let j=0; j<perHalf.length; j++) {
					if (perHalf[j] == '' && ((settingsType == 2 || settingsType == 3) && perHalf[j - 1] % 100 != 13 || settingsType == 1)) {
						if (perHalf[j - 1] - perHalf[j - 2] == 1) {
							perHalf.splice(j, 0, "800");
							okeyCont--;
							boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
							boardTiles = this.removeArrayItem(boardTiles, "800");
							if (okeyCont == 0) {
								return 0;
							}
						}
						if (perHalf[j - 2] - perHalf[j - 1] == 12 && settingsType == 1) {
							perHalf.splice(j - 2, 0, "800");
							okeyCont--;
							boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
							boardTiles = this.removeArrayItem(boardTiles, "800");
							if (okeyCont == 0) {
								return 0;
							}
						}
					}
				}
				for (let j=0; j<perHalf.length; j++) {
					if (perHalf[j] == '') {
						if (perHalf[j - 1] % 100 == perHalf[j - 2] % 100 && perHalf[j - 1] != perHalf[j - 2]) {
							perHalf.splice(j, 0, "800");
							okeyCont--;
							boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
							boardTiles = this.removeArrayItem(boardTiles, "800");
							if (okeyCont == 0) {
								return 0;
							}
						}
					}
				}
			}
			if (seat == 4) {
				for (let j=0; j<perFull.length; j++) {
					if (perFull[j] == '' && ((settingsType == 2 || settingsType == 3) && perFull[j - 1] % 100 != 13 || settingsType == 1)) {
						if (perFull[j - 1] - perFull[j - 2] == 1) {
							for (let i=0; i<boardTiles.length; i++) {
								if (boardTiles[i] - perFull[j - 1] == 2) {
									perFull.splice(j, 0, "800");
									perFull.splice(j * 1 + 1, 0, boardTiles[i]);
									okeyCont--;
									boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
									boardTiles = this.removeArrayItem(boardTiles, "800");
									boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i]);
									boardTiles = this.removeArrayItem(boardTiles, boardTiles[i]);
									if (okeyCont == 0) {
										return 0;
									}
								}
							}
						}
					}
				}
				for (let j=0; j<perFull.length; j++) {
					if ((perFull[j - 1] == '' || j == 0) && perFull[j * 1 + 1] % 100 != 1) {
						if (perFull[j * 1 + 1] - perFull[j] == 1) {
							for (let i=0; i<boardTiles.length; i++) {
								if (perFull[j] - boardTiles[i] == 2) {
									perFull.splice(j, 0, "800");
									perFull.splice(j, 0, boardTiles[i]);
									okeyCont--;
									boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
									boardTiles = this.removeArrayItem(boardTiles, "800");
									boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i]);
									boardTiles = this.removeArrayItem(boardTiles, boardTiles[i]);
									if (okeyCont == 0) {
										return 0;
									}
								}
							}
						}
					}
				}
				for (let j=0; j<perFull.length; j++) {
					if (perFull[j] == '' && perFull[j - 1] % 100 == 12 && settingsType == 1) {
						if (perFull[j - 1] - perFull[j - 2] == 1) {
							for (let i=0; i<boardTiles.length; i++) {
								if (perFull[j - 1] - boardTiles[i] == 11) {
									perFull.splice(j, 0, boardTiles[i]);
									perFull.splice(j, 0, "800");
									boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
									boardTiles = this.removeArrayItem(boardTiles, '800');
									boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i]);
									boardTiles = this.removeArrayItem(boardTiles, boardTiles[i]);
									okeyCont--;
									if (okeyCont == 0) {
										return 0;
									}
								}
							}
						}
					}
				}
				for (let j=0; j<perFull.length; j++) {
					if (perFull[j] == '' && ((settingsType == 2 || settingsType == 3) && perFull[j - 1] % 100 != 13 || settingsType == 1)) {
						if (perFull[j - 1] - perFull[j - 2] == 1) {
							perFull.splice(j, 0, "800");
							okeyCont--;
							boardTilesVir = this.removeArrayItem(boardTilesVir, '800');
							boardTiles = this.removeArrayItem(boardTiles, "800");
							if (okeyCont == 0) {
								return 0;
							}
						}
					}
				}
				for (let j=0; j<perFull.length; j++) {
					if ((perFull[j - 1] == '' || j == 0) && perFull[j * 1 + 1] % 100 != 1) {
						if (perFull[j * 1 + 2] - perFull[j * 1 + 1] == 1) {
							perFull.splice(j, 0, "800");
							okeyCont--;
							boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
							boardTiles = this.removeArrayItem(boardTiles, "800");
							if (okeyCont == 0) {
								return 0;
							}
						}
					}
				}
				var _0x2c0168 = 0;
				for (let j=0; j<perFull.length; j++) {
					_0x2c0168++;
					if (perFull[j] == '') {
						if (perFull[j - 1] % 100 == perFull[j - 2] % 100 && perFull[j - 1] != perFull[j - 2] && _0x2c0168 < 5) {
							perFull.splice(j, 0, "800");
							okeyCont--;
							boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
							boardTiles = this.removeArrayItem(boardTiles, "800");
							if (okeyCont == 0) {
								return 0;
							}
						}
						_0x2c0168 = 0;
					}
				}
			}
		},
		addOkeyDouble() {
			boardTiles.sort();
			boardTiles.sort((_0x23565a, _0x1c1ef8) => _0x23565a % 100 > _0x1c1ef8 % 100 ? 1 : _0x1c1ef8 % 100 > _0x23565a % 100 ? -1 : 0);
			boardTiles.reverse();
			for (let i=0; i<=boardTiles.length; i++) {
				if (boardTiles[i] != "800") {
					perFull.push(boardTiles[i]);
					perFull.push("800");
					perFull.push('');
					boardTilesVir = this.removeArrayItem(boardTilesVir, boardTiles[i]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
					boardTiles = this.removeArrayItem(boardTiles, boardTiles[i]);
					boardTiles = this.removeArrayItem(boardTiles, "800");
					okeyCont--;
					if (okeyCont == 0) {
						return 0;
					}
				}
			}
		},
		checkPer(num) {
			let tiles = boardTiles.slice();
			var arr = tiles.slice();
			var sort1 = this.sortTiles(num, 0);
			tiles = boardTilesVir.slice();
			var sortC2 = this.sortTilesByColor(num, 0);
			tiles = arr.slice();
			var sortC2 = this.sortTilesByColor(num, 0);
			tiles = boardTilesVir.slice();
			var sort2 = this.sortTiles(num, 0);
			tiles = arr.slice();
			var score1 = sort1 * 1 + sortC2 * 1;
			var score2 = sortC2 * 1 + sort2 * 1;

			return score1 >= score2 ? 1 : 0;
		},
		sortTiles(num, sort) {
			boardTilesVir = boardTiles.slice();
			boardTilesVir.sort();
			boardTiles.sort((a, b) => a - b);
			var asc = [];
			var sorted = [];
			var arr3 = 0;
			var arr4 = 0;
			var min = parseInt(boardTilesVir[0]);

			asc.push(boardTilesVir[0]);
			var max = 999;

			for (let i=1; i<boardTilesVir.length; i++) {
				var _0x35e4cc = parseInt(boardTilesVir[i]);
				var _0x1bf143 = 0;
				if (_0x35e4cc - 1 == min) {
					asc.push(boardTilesVir[i]);
					_0x1bf143 = 1;
				}
				if (settingsType == 1) {
					if (min % 100 == 1) {
						max = String(min);
					}
					if (min - max == 12) {
						asc.push(String(max));
						_0x1bf143 = 2;
						max = 999;
					}
				}
				if (_0x1bf143 == 0 && _0x35e4cc != min || _0x35e4cc == min && asc.length == 0) {
					asc = [];
					asc.push(boardTilesVir[i]);
				}
				if (asc.length == num || _0x1bf143 == 2) {
					if (asc.length == num) {
						if (asc[0] == String(max)) {
							max = 999;
						}
						sorted.push.apply(sorted, asc);
						sorted.push("");
						arr3++;
					}
					asc = [];
				}
				min = parseInt(boardTilesVir[i]);
				if (_0x1bf143 == 2) {
					asc.push(boardTilesVir[i]);
				}
			}
			for (let i=0; i<sorted.length; i++) {
				boardTilesVir = this.removeArrayItem(boardTilesVir, sorted[i]);
				arr4 = arr4 * 1 + sorted[i] % 100;
			}
			if (sort == 0) {
				if (settingsType == 1) {
					return arr3;
				}
				if (settingsType == 2 || settingsType == 3) {
					return arr4;
				}
			}
			if (sort == 1) {
				return sorted;
			}
		},
		sortTilesByColor(num, type) {
			boardTilesVir = boardTiles.slice();
			boardTilesVir.sort();
			boardTilesVir.sort((a, b) => a % 100 > b % 100 ? 1 : b % 100 > a % 100 ? -1 : 0);
			var arr1 = [];
			var arr2 = [];
			var val1 = 0;
			var val2 = 0;
			var min = parseInt(boardTilesVir[0]);
			arr1.push(boardTilesVir[0]);
			for (let i=1; i<=boardTilesVir.length; i++) {
				var tileValue = parseInt(boardTilesVir[i]);
				if (tileValue % 100 == min % 100 && tileValue != min) {
					arr1.push(boardTilesVir[i]);
				} else if (tileValue != min) {
					arr1 = [];
					arr1.push(boardTilesVir[i]);
				}
				if (arr1.length == num) {
					arr2.push.apply(arr2, arr1);
					arr2.push("");
					arr1 = [];
					val1++;
				}
				min = parseInt(boardTilesVir[i]);
			}
			for (let i=0; i<=arr2.length; i++) {
				if (arr2[i]) {
					boardTilesVir = this.removeArrayItem(boardTilesVir, arr2[i]);
					val2 = val2 * 1 + arr2[i] % 100;
				}
			}
			if (type == 0) {
				if ([1].includes(settingsType)) return val1;
				if ([2,3].includes(settingsType)) return val2;
			}
			if (type == 1) return arr2;
		},
		checkWinDouble() {
			var boardTilesVir = boardTiles.slice();
			var User1TotalDouble = 0;
			var User2TotalDouble = 0;
			var User3TotalDouble = 0;
			var User4TotalDouble = 0;
			var UserTotalDouble = 0;
			var _0x481582 = 0;
			var _0x1290e9 = [];
			for (let i=0; i<boardTilesVir.length; i++) {
				var _0x171c8e = parseInt(boardTilesVir[i]);
				if ((boardTilesVir[i] == boardTilesVir[i * 1 + 1] || boardTilesVir[i] == okey || boardTilesVir[i * 1 + 1] == okey) && boardTilesVir[i] != '' && boardTilesVir[i * 1 + 1] != '') {
					_0x481582++;
					var _0xcba5d6;
					var _0x5ad174;
					_0xcba5d6 = boardTilesVir[i];
					_0x5ad174 = boardTilesVir[i * 1 + 1];
					if (boardTilesVir[i] == "000") {
						_0xcba5d6 = okey % 100 + 800;
					}
					if (boardTilesVir[i * 1 + 1] == "000") {
						_0x5ad174 = okey % 100 + 800;
					}
					if (boardTilesVir[i] == okey) {
						_0xcba5d6 = _0x5ad174 % 100 + 900;
					}
					if (boardTilesVir[i * 1 + 1] == okey) {
						_0x5ad174 = _0xcba5d6 % 100 + 900;
					}
					_0x1290e9.push(String(_0xcba5d6));
					_0x1290e9.push(String(_0x5ad174));
					_0x1290e9.push('');
					i++;
					if (settingsType == 1 || settingsType == 2 || settingsType == 3) {
						UserTotalDouble++;
					}
				}
			}
			let User1Double = [];
			let User2Double = [];
			let User3Double = [];
			let User4Double = [];
			for (let i=0; i<_0x1290e9.length; i++) {
				if (activePlayer == 1) {
					User1TotalDouble = UserTotalDouble;
					User1Double.push(_0x1290e9[i]);
				}
				if (activePlayer == 2) {
					User2TotalDouble = UserTotalDouble;
					User2Double.push(_0x1290e9[i]);
				}
				if (activePlayer == 3) {
					User3TotalDouble = UserTotalDouble;
					User3Double.push(_0x1290e9[i]);
				}
				if (activePlayer == 4) {
					User4TotalDouble = UserTotalDouble;
					User4Double.push(_0x1290e9[i]);
				}
			}
			if (activePlayer == 1) {
				let sign = APP.content.find(`.player.user .melded`);
				if (settingsType == 2 || settingsType == 1) {
					sign.removeClass("hidden").find("h4").html(this.countBoard(1));
					sign.addClass("red");
				}
				if (settingsType == 3) {
					if (openStatusSort[1] == 0 && openStatusDouble[1] == 0) {
						sign.removeClass("hidden").find("h4").html(User1TotalDouble);
						sign.toggleClass("red", User1TotalDouble < openLimitDouble);
					}
					if (openStatusSort[1] == 1 || openStatusDouble[1] == 1) {
						sign.removeClass("hidden").find("h4").html(this.countBoard(1));
						sign.addClass("red");
					}
				}
			}
			if (_0x481582 == 7 && settingsType == 1) {
				winWithDouble = 1;
				return 1;
			} else {
				return 0;
			}
		},
		checkWin() {
			let User1Total = 0;
			let User2Total = 0;
			let User3Total = 0;
			let User4Total = 0;
			let UserTotal = 0;
			let boardTilesVir = boardTiles.slice();
			let  _0x5b3924 = 0;
			let  _0x257872 = 0;
			let temp = [];
			let temp1 = [];
			let temp2 = [];
			let  _0x2b6e63 = [];
			let  _0x47dfb5 = null;
			for (let i=0; i<=boardTilesVir.length; i++) {
				var _0x9497e = 0;
				if (boardTilesVir[i] == Tiles.okey && boardTilesVir[i * 1 + 1] && i != 14) {
					_0x9497e = 1;
					if (boardTilesVir[i * 1 + 1] == "000") {
						boardTilesVir[i] = String(Tiles.okey - 1);
					} else {
						if (boardTilesVir[i * 1 + 1] % 100 == 1) {
							boardTilesVir[i] = String(boardTilesVir[i * 1 + 1] * 1 + 12);
						} else {
							boardTilesVir[i] = String(boardTilesVir[i * 1 + 1] - 1);
						}
					}
				}
				if (boardTilesVir[i] == Tiles.okey && boardTilesVir[i - 1] && (boardTilesVir[i - 1] % 100 != 13 && (settingsType == 2 || settingsType == 3) || settingsType == 1)) {
					_0x9497e = 1;
					if (boardTilesVir[i - 1] == "000") {
						boardTilesVir[i] = String(Tiles.okey * 1 + 1);
					} else {
						boardTilesVir[i] = String(boardTilesVir[i - 1] * 1 + 1);
					}
				}
				if (boardTilesVir[i] == "000") {
					boardTilesVir[i] = String(Tiles.okey);
				}
				var _0x3c1af0 = 0;
				var _0x510804 = parseInt(boardTilesVir[i]);
				if (boardTilesVir[i]) {
					temp.push(_0x510804);
					if (_0x9497e == 1) {
						_0x2b6e63.push(temp.length - 1);
					}
					_0x9497e = 0;
					_0x3c1af0 = 1;
				}
				if (_0x3c1af0 == 0 || i == 14) {
					if (temp.length > 2) {
						_0x5b3924 = 1;
						for (let j=0; j<temp.length; j++) {
							if (j > 0) {
								if (temp[j] - temp[j - 1] == 1 || j == temp.length - 1 && (temp[j - 1] - temp[j] == 12 || temp[j - 1] == okey) && settingsType == 1) {
									_0x5b3924++;
								} else {
									_0x5b3924 = 1;
									temp = [];
								}
							}
						}
						if (_0x5b3924 >= 3) {
							_0x257872 += _0x5b3924;
							for (let k=0; k<temp.length; k++) {
								for (let l=0; l<_0x2b6e63.length; l++) {
									if (_0x2b6e63[l] == k) {
										temp[k] = temp[k] % 100 + 900;
									}
								}
								if (temp[k] == Tiles.okey) {
									temp[k] = temp[k] % 100 + 800;
								}
								temp2.push(temp[k]);
								var _0x4b310e = boardTilesVir.indexOf(temp[k]);
								if (_0x4b310e != -1) {
									boardTilesVir[_0x4b310e] = '';
								}
							}
							temp2.push('');
						}
					}
					temp = [];
					_0x2b6e63 = [];
					_0x47dfb5 = null;
					if (i == 15 && boardTilesVir[i]) {
						temp.push(_0x510804);
					}
				}
			}
			boardTilesVir = boardTiles.slice();
			_0x2b6e63 = null;
			_0x47dfb5 = null;
			temp = [];
			temp1 = [];
			for (let i=0; i<=boardTilesVir.length; i++) {
				if (boardTilesVir[i] == Tiles.okey && boardTilesVir[i * 1 + 1] && i != 14) {
					_0x9497e = 1;
					if (boardTilesVir[i * 1 + 1] == "000") {
						boardTilesVir[i] = String(Tiles.okey % 100 + 900);
					} else {
						boardTilesVir[i] = String(boardTilesVir[i * 1 + 1] % 100 + 900);
					}
				}
				if (boardTilesVir[i] == Tiles.okey && boardTilesVir[i - 1]) {
					_0x9497e = 1;
					if (boardTilesVir[i - 1] == "000") {
						boardTilesVir[i] = String(Tiles.okey % 100 + 900);
					} else {
						boardTilesVir[i] = String(boardTilesVir[i - 1] % 100 + 900);
					}
				}
				if (boardTilesVir[i] == "000") {
					boardTilesVir[i] = String(Tiles.okey % 100 + 800);
				}
				var _0x3c1af0 = 0;
				var _0x510804 = parseInt(boardTilesVir[i]);
				if (boardTilesVir[i]) {
					temp.push(_0x510804);
					_0x3c1af0 = 1;
				}
				if (_0x3c1af0 == 0 || i == 14) {
					if (temp.length > 2) {
						temp1 = [];
						_0x5b3924 = 1;
						for (let j=0; j<temp.length; j++) {
							if (j > 0) {
								if (temp[j] % 100 == temp[j - 1] % 100 && (temp[j] != temp[j - 1] || (temp[j] / 900 > 1 && temp[j - 1] / 900) > 1) && (temp[j] != temp[j - 2] || (temp[j] / 900 > 1 && temp[j - 2] / 900) > 1) && temp[j] != temp[j - 3] || (temp[j] / 900 > 1 && temp[j - 3] / 900) > 1) {
									_0x5b3924++;
								} else {
									_0x5b3924 = 1;
									temp = [];
								}
							}
							temp1.push(temp[j]);
						}
						if (_0x5b3924 > 2 && _0x5b3924 < 5) {
							_0x257872 += _0x5b3924;
							for (let k=0; k<temp1.length; k++) {
								temp2.push(temp[k]);
							}
							temp2.push('');
						}
					}
					temp = [];
					_0x2b6e63 = null;
					_0x47dfb5 = null;
					if (i == 15 && boardTilesVir[i]) {
						temp.push(_0x510804);
					}
				}
			}
			let User1Seri = [];
			let User2Seri = [];
			let User3Seri = [];
			let User4Seri = [];
			for (let i=0; i<temp2.length; i++) {
				if (activePlayer == 1) {
					User1Seri.push(temp2[i]);
					if (temp2[i]) {
						User1Total += temp2[i] % 100;
					}
				}
				if (activePlayer == 2) {
					User2Seri.push(temp2[i]);
					if (temp2[i]) {
						User2Total += temp2[i] % 100;
					}
				}
				if (activePlayer == 3) {
					User3Seri.push(temp2[i]);
					if (temp2[i]) {
						User3Total += temp2[i] % 100;
					}
				}
				if (activePlayer == 4) {
					User4Seri.push(temp2[i]);
					if (temp2[i]) {
						User4Total += temp2[i] % 100;
					}
				}
			}
			if (activePlayer == 1) {
				let sign = APP.content.find(`.player.user .melded`);
				if (openStatusSort[1] == 0 && openStatusDouble[1] == 0) {
					sign.removeClass("hidden").find("h4").html(User1Total);
					sign.toggleClass("red", User1Total < openLimitG);
				}
				if (openStatusSort[1] == 1 || openStatusDouble[1] == 1) {
					sign.removeClass("hidden").find("h4").html(countBoard(1));
					sign.addClass("red");
				}
			}
			// console.log( _0x257872 , tileLimit , boardTilesVir.filter(e => e != '').length, tileLimit );
			if (_0x257872 == tileLimit && boardTilesVir.filter(e => e != '').length == tileLimit) {
				return 1;
			} else {
				return 0;
			}
		},
		countBoard(seat) {
			switch (seat) {
				case 1: boardTiles = boardTiles1.slice(); break;
				case 2: boardTiles = boardTiles2.slice(); break;
				case 3: boardTiles = boardTiles3.slice(); break;
				case 4: boardTiles = boardTiles4.slice(); break;
			}
			var val = 0;
			for (let i=0; i<boardTiles.length; i++) {
				if (boardTiles[i]) {
					if (boardTiles[i] == "000") {
						val += parseInt(Tiles.okey % 100);
					} else {
						val += boardTiles[i] % 100;
					}
				}
			}
			return val;
		},
		markIt(seat) {
			markCont = 1;
			this.checkHandle(seat, 2);
			this.getOkeyFromTable(seat);
			markCont = 0;
		},
		checkHandleDouble(_0x560968) {
			// if (activePlayer == 1 && true) {}
			if (_0x560968 == 1) {
				if (this.getOkeyFromTable(1, 2)) {
					return 0;
				}
			}
			var _0x460cd2 = _0x1d32ab = boardTiles.filter(e => e != '').slice();
			if (_0x460cd2.length <= tileLimits[_0x560968]) {
				if (_0x560968 == 1) {
					this.popMessage("Önce yerden tas almaniz gerekiyor!");
				}
				return 0;
			}
			if (openStatusSort[_0x560968] == 0 && openStatusDouble[_0x560968] == 0) {
				if (_0x560968 == 1) {
					this.popMessage("Tas iseleyebilmeniz icin el acmaniz gerekiyor!");
				}
				return 0;
			}
			var _0x1d32ab = boardTiles.filter(e => e != '').slice();
			if (_0x1d32ab.length < 3) {
				this.markIt(_0x560968);
				return 0;
			}
			if (openStatusDouble.indexOf(1) > -1) {
				doubleHandleTo = openStatusDouble.indexOf(1);
				handleDouble = 0;
				this.checkWinDouble();
				if (UserTotalDouble > 0) {
					this.popMessage(users[_0x560968] + " cift isledi!");
					handleDouble = 1;
					this.putToTable(activePlayer, 2);
				}
			}
		},
		checkHandle(_0x2019da, _0x1c59dd) {
			if (!_0x1c59dd) {
				_0x1c59dd = 0;
			}
			if (activePlayer == 1 && true) {}
			var _0x3c5f2e = [];
			handleItems = [];
			if (_0x2019da == 1) {
				boardTiles = boardTiles1.slice();
				boardPlaces = boardPlaces1.slice();
				_0x3c5f2e = User1Seri.slice();
				UserTotal = User1Total;
			}
			if (_0x2019da == 2) {
				boardTiles = boardTiles2.slice();
				boardPlaces = boardPlaces2.slice();
				_0x3c5f2e = User2Seri.slice();
				UserTotal = User2Total;
			}
			if (_0x2019da == 3) {
				boardTiles = boardTiles3.slice();
				boardPlaces = boardPlaces3.slice();
				_0x3c5f2e = User3Seri.slice();
				UserTotal = User3Total;
			}
			if (_0x2019da == 4) {
				boardTiles = boardTiles4.slice();
				boardPlaces = boardPlaces4.slice();
				_0x3c5f2e = User4Seri.slice();
				UserTotal = User4Total;
			}
			var _0x1fc99b = boardTiles.filter(e => e != '').slice();
			if (_0x1fc99b.length <= tileLimits[_0x2019da] && _0x1c59dd == 0) {
				if (_0x2019da == 1 && markCont == 0) {
					this.popMessage("Önce yerden tas almaniz gerekiyor!");
				}
				return 0;
			}
			if (openStatusSort[_0x2019da] == 0 && openStatusDouble[_0x2019da] == 0 && _0x1c59dd == 0) {
				if (_0x2019da == 1) {
					this.popMessage("Tas iseleyebilmeniz icin el acmaniz gerekiyor!");
				}
				return 0;
			}
			if (_0x2019da == 1 && _0x1c59dd == 0) {
				if (this.getOkeyFromTable(1, 1)) {
					return 0;
				}
			}
			if (!collect[0] && _0x1c59dd == 0) {
				collect = [];
				collectPlaces = boardPlaces.slice();
				collectTiles = boardTiles.slice();
			}
			var _0x364dc5 = [0, 0, 0, 0, 0];
			var _0x2bbb42 = 0;
			for (let i=0; i<boardTiles.length; i++) {
				var _0x5e0d4d = boardTiles.filter(e => e != '').slice();
				if (_0x5e0d4d.length == 1 && _0x1c59dd == 0) {
					this.markIt(_0x2019da);
					if (_0x2019da == 1) {
						this.popMessage("Son tasi isleyemezsiniz, saqa atmaniz gerekiyor.");
					}
					return 0;
				}
				if (boardTiles[i]) {
					// $(boardPlaces[i * 1 + 1]).children[0].children[0].classList.remove("marked");
					// $(boardPlaces[i * 1 + 1]).children[0].children[0].innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" class=\"heart\" viewBox=\"0 0 16 16\"> <path fill-rule=\"evenodd\" d=\"M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z\"/> </svg>";
					var _0x1fc99b;
					if (boardTiles[i] == "000") {
						_0x1fc99b = okey;
					} else {
						_0x1fc99b = boardTiles[i];
					}
					for (let j=0; j<7; j++) {
						for (let k=0; k<=13; k++) {
							if (boardTiles[i] && boardTiles[i] != okey) {
								var _0x49f720 = 0;
								var _0x2fc30f = 0;
								var _0x46b158;
								var _0x3a83d2;
								var _0x34dbca;
								var _0x29577e;
								var _0x4935d9;
								if (tableUser1[j][k] > 0) {
									_0x46b158 = tableUser1[j][k];
									_0x3a83d2 = tableUser1[j][k - 1];
									_0x34dbca = tableUser1[j][k * 1 + 1];
									_0x29577e = tableUser1[j][k * 1 + 2];
									_0x4935d9 = tableUser1[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) {
										_0x46b158 = okey;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) {
										_0x3a83d2 = okey;
									}
									if (_0x34dbca - _0x34dbca % 100 == 800) {
										_0x34dbca = okey;
									}
									if (_0x29577e - _0x29577e % 100 == 800) {
										_0x29577e = okey;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 800) {
										_0x4935d9 = okey;
									}
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x3a83d2) {
										_0x46b158 = _0x3a83d2 * 1 + 1;
									}
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x34dbca) {
										_0x46b158 = _0x34dbca - 1;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x46b158) {
										_0x3a83d2 = _0x46b158 - 1;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x34dbca) {
										_0x3a83d2 = _0x34dbca - 2;
									}
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x46b158) {
										_0x34dbca = _0x46b158 * 1 + 1;
									}
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x3a83d2) {
										_0x34dbca = _0x3a83d2 * 1 + 2;
									}
									if (_0x29577e - _0x29577e % 100 == 900 && _0x46b158) {
										_0x29577e = _0x46b158 * 1 + 2;
									}
									if (_0x29577e - _0x29577e % 100 == 900 && _0x3a83d2) {
										_0x29577e = _0x3a83d2 * 1 + 3;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x46b158) {
										_0x4935d9 = _0x46b158 - 2;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x3a83d2) {
										_0x4935d9 = _0x3a83d2 - 1;
									}
									if (_0x46b158 - _0x3a83d2 == 1 && _0x3a83d2 - _0x4935d9 == 1 && _0x34dbca == 0 && _0x1fc99b - _0x46b158 == 1) {
										_0x2fc30f = k * 1 + 1;
										_0x49f720 = 1;
									}
									if (_0x34dbca - _0x46b158 == 1 && _0x29577e - _0x34dbca == 1 && _0x3a83d2 == 0 && _0x46b158 - _0x1fc99b == 1) {
										_0x2fc30f = k - 1;
										_0x49f720 = 1;
									}
									_0x46b158 = tableUser1[j][k];
									_0x3a83d2 = tableUser1[j][k - 1];
									_0x34dbca = tableUser1[j][k * 1 + 1];
									_0x29577e = tableUser1[j][k * 1 + 2];
									_0x4935d9 = tableUser1[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) {
										_0x46b158 = okey;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) {
										_0x3a83d2 = okey;
									}
									if (_0x34dbca - _0x34dbca % 100 == 800) {
										_0x34dbca = okey;
									}
									if (_0x29577e - _0x29577e % 100 == 800) {
										_0x29577e = okey;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 800) {
										_0x4935d9 = okey;
									}
									if (_0x46b158 % 100 == _0x3a83d2 % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && tableUser1[j][k - 3] == 0 && (_0x34dbca == 0 || !_0x34dbca) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x3a83d2 && _0x1fc99b != _0x4935d9) {
										_0x2fc30f = k - 3;
										_0x49f720 = 1;
									}
									if (_0x46b158 % 100 == _0x34dbca % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && tableUser1[j][k * 1 + 3] == 0 && (_0x3a83d2 == 0 || !_0x3a83d2) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x34dbca && _0x1fc99b != _0x29577e) {
										_0x2fc30f = k * 1 + 3;
										_0x49f720 = 1;
									}
								}
								if (tableUser2[j][k] > 0 && _0x49f720 == 0) {
									_0x46b158 = tableUser2[j][k];
									_0x3a83d2 = tableUser2[j][k - 1];
									_0x34dbca = tableUser2[j][k * 1 + 1];
									_0x29577e = tableUser2[j][k * 1 + 2];
									_0x4935d9 = tableUser2[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) {
										_0x46b158 = okey;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) {
										_0x3a83d2 = okey;
									}
									if (_0x34dbca - _0x34dbca % 100 == 800) {
										_0x34dbca = okey;
									}
									if (_0x29577e - _0x29577e % 100 == 800) {
										_0x29577e = okey;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 800) {
										_0x4935d9 = okey;
									}
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x3a83d2) {
										_0x46b158 = _0x3a83d2 * 1 + 1;
									}
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x34dbca) {
										_0x46b158 = _0x34dbca - 1;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x46b158) {
										_0x3a83d2 = _0x46b158 - 1;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x34dbca) {
										_0x3a83d2 = _0x34dbca - 2;
									}
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x46b158) {
										_0x34dbca = _0x46b158 * 1 + 1;
									}
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x3a83d2) {
										_0x34dbca = _0x3a83d2 * 1 + 2;
									}
									if (_0x29577e - _0x29577e % 100 == 900 && _0x46b158) {
										_0x29577e = _0x46b158 * 1 + 2;
									}
									if (_0x29577e - _0x29577e % 100 == 900 && _0x3a83d2) {
										_0x29577e = _0x3a83d2 * 1 + 3;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x46b158) {
										_0x4935d9 = _0x46b158 - 2;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x3a83d2) {
										_0x4935d9 = _0x3a83d2 - 1;
									}
									if (_0x46b158 - _0x3a83d2 == 1 && _0x3a83d2 - _0x4935d9 == 1 && _0x34dbca == 0 && _0x1fc99b - _0x46b158 == 1) {
										_0x2fc30f = k * 1 + 1;
										_0x49f720 = 2;
									}
									if (_0x34dbca - _0x46b158 == 1 && _0x29577e - _0x34dbca == 1 && _0x3a83d2 == 0 && _0x46b158 - _0x1fc99b == 1) {
										_0x2fc30f = k - 1;
										_0x49f720 = 2;
									}
									_0x46b158 = tableUser2[j][k];
									_0x3a83d2 = tableUser2[j][k - 1];
									_0x34dbca = tableUser2[j][k * 1 + 1];
									_0x29577e = tableUser2[j][k * 1 + 2];
									_0x4935d9 = tableUser2[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) {
										_0x46b158 = okey;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) {
										_0x3a83d2 = okey;
									}
									if (_0x34dbca - _0x34dbca % 100 == 800) {
										_0x34dbca = okey;
									}
									if (_0x29577e - _0x29577e % 100 == 800) {
										_0x29577e = okey;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 800) {
										_0x4935d9 = okey;
									}
									if (_0x46b158 % 100 == _0x3a83d2 % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && tableUser2[j][k - 3] == 0 && (_0x34dbca == 0 || !_0x34dbca) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x3a83d2 && _0x1fc99b != _0x4935d9) {
										_0x2fc30f = k - 3;
										_0x49f720 = 2;
									}
									if (_0x46b158 % 100 == _0x34dbca % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && tableUser2[j][k * 1 + 3] == 0 && (_0x3a83d2 == 0 || !_0x3a83d2) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x34dbca && _0x1fc99b != _0x29577e) {
										_0x2fc30f = k * 1 + 3;
										_0x49f720 = 2;
									}
								}
								if (tableUser3[j][k] > 0 && _0x49f720 == 0) {
									_0x46b158 = tableUser3[j][k];
									_0x3a83d2 = tableUser3[j][k - 1];
									_0x34dbca = tableUser3[j][k * 1 + 1];
									_0x29577e = tableUser3[j][k * 1 + 2];
									_0x4935d9 = tableUser3[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) {
										_0x46b158 = okey;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) {
										_0x3a83d2 = okey;
									}
									if (_0x34dbca - _0x34dbca % 100 == 800) {
										_0x34dbca = okey;
									}
									if (_0x29577e - _0x29577e % 100 == 800) {
										_0x29577e = okey;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 800) {
										_0x4935d9 = okey;
									}
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x3a83d2) {
										_0x46b158 = _0x3a83d2 * 1 + 1;
									}
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x34dbca) {
										_0x46b158 = _0x34dbca - 1;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x46b158) {
										_0x3a83d2 = _0x46b158 - 1;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x34dbca) {
										_0x3a83d2 = _0x34dbca - 2;
									}
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x46b158) {
										_0x34dbca = _0x46b158 * 1 + 1;
									}
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x3a83d2) {
										_0x34dbca = _0x3a83d2 * 1 + 2;
									}
									if (_0x29577e - _0x29577e % 100 == 900 && _0x46b158) {
										_0x29577e = _0x46b158 * 1 + 2;
									}
									if (_0x29577e - _0x29577e % 100 == 900 && _0x3a83d2) {
										_0x29577e = _0x3a83d2 * 1 + 3;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x46b158) {
										_0x4935d9 = _0x46b158 - 2;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x3a83d2) {
										_0x4935d9 = _0x3a83d2 - 1;
									}
									if (_0x46b158 - _0x3a83d2 == 1 && _0x3a83d2 - _0x4935d9 == 1 && _0x34dbca == 0 && _0x1fc99b - _0x46b158 == 1) {
										_0x2fc30f = k * 1 + 1;
										_0x49f720 = 3;
									}
									if (_0x34dbca - _0x46b158 == 1 && _0x29577e - _0x34dbca == 1 && _0x3a83d2 == 0 && _0x46b158 - _0x1fc99b == 1) {
										_0x2fc30f = k - 1;
										_0x49f720 = 3;
									}
									_0x46b158 = tableUser3[j][k];
									_0x3a83d2 = tableUser3[j][k - 1];
									_0x34dbca = tableUser3[j][k * 1 + 1];
									_0x29577e = tableUser3[j][k * 1 + 2];
									_0x4935d9 = tableUser3[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) {
										_0x46b158 = okey;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) {
										_0x3a83d2 = okey;
									}
									if (_0x34dbca - _0x34dbca % 100 == 800) {
										_0x34dbca = okey;
									}
									if (_0x29577e - _0x29577e % 100 == 800) {
										_0x29577e = okey;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 800) {
										_0x4935d9 = okey;
									}
									if (_0x46b158 % 100 == _0x3a83d2 % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && tableUser3[j][k - 3] == 0 && (_0x34dbca == 0 || !_0x34dbca) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x3a83d2 && _0x1fc99b != _0x4935d9) {
										_0x2fc30f = k - 3;
										_0x49f720 = 3;
									}
									if (_0x46b158 % 100 == _0x34dbca % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && tableUser3[j][k * 1 + 3] == 0 && (_0x3a83d2 == 0 || !_0x3a83d2) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x34dbca && _0x1fc99b != _0x29577e) {
										_0x2fc30f = k * 1 + 3;
										_0x49f720 = 3;
									}
								}
								if (tableUser4[j][k] > 0 && _0x49f720 == 0) {
									_0x46b158 = tableUser4[j][k];
									_0x3a83d2 = tableUser4[j][k - 1];
									_0x34dbca = tableUser4[j][k * 1 + 1];
									_0x29577e = tableUser4[j][k * 1 + 2];
									_0x4935d9 = tableUser4[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) {
										_0x46b158 = okey;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) {
										_0x3a83d2 = okey;
									}
									if (_0x34dbca - _0x34dbca % 100 == 800) {
										_0x34dbca = okey;
									}
									if (_0x29577e - _0x29577e % 100 == 800) {
										_0x29577e = okey;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 800) {
										_0x4935d9 = okey;
									}
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x3a83d2) {
										_0x46b158 = _0x3a83d2 * 1 + 1;
									}
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x34dbca) {
										_0x46b158 = _0x34dbca - 1;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x46b158) {
										_0x3a83d2 = _0x46b158 - 1;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x34dbca) {
										_0x3a83d2 = _0x34dbca - 2;
									}
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x46b158) {
										_0x34dbca = _0x46b158 * 1 + 1;
									}
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x3a83d2) {
										_0x34dbca = _0x3a83d2 * 1 + 2;
									}
									if (_0x29577e - _0x29577e % 100 == 900 && _0x46b158) {
										_0x29577e = _0x46b158 * 1 + 2;
									}
									if (_0x29577e - _0x29577e % 100 == 900 && _0x3a83d2) {
										_0x29577e = _0x3a83d2 * 1 + 3;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x46b158) {
										_0x4935d9 = _0x46b158 - 2;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x3a83d2) {
										_0x4935d9 = _0x3a83d2 - 1;
									}
									if (_0x46b158 - _0x3a83d2 == 1 && _0x3a83d2 - _0x4935d9 == 1 && _0x34dbca == 0 && _0x1fc99b - _0x46b158 == 1) {
										_0x2fc30f = k * 1 + 1;
										_0x49f720 = 4;
									}
									if (_0x34dbca - _0x46b158 == 1 && _0x29577e - _0x34dbca == 1 && _0x3a83d2 == 0 && _0x46b158 - _0x1fc99b == 1) {
										_0x2fc30f = k - 1;
										_0x49f720 = 4;
									}
									_0x46b158 = tableUser4[j][k];
									_0x3a83d2 = tableUser4[j][k - 1];
									_0x34dbca = tableUser4[j][k * 1 + 1];
									_0x29577e = tableUser4[j][k * 1 + 2];
									_0x4935d9 = tableUser4[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) {
										_0x46b158 = okey;
									}
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) {
										_0x3a83d2 = okey;
									}
									if (_0x34dbca - _0x34dbca % 100 == 800) {
										_0x34dbca = okey;
									}
									if (_0x29577e - _0x29577e % 100 == 800) {
										_0x29577e = okey;
									}
									if (_0x4935d9 - _0x4935d9 % 100 == 800) {
										_0x4935d9 = okey;
									}
									if (_0x46b158 % 100 == _0x3a83d2 % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && tableUser4[j][k - 3] == 0 && (_0x34dbca == 0 || !_0x34dbca) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x3a83d2 && _0x1fc99b != _0x4935d9) {
										_0x2fc30f = k - 3;
										_0x49f720 = 4;
									}
									if (_0x46b158 % 100 == _0x34dbca % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && tableUser4[j][k * 1 + 3] == 0 && (_0x3a83d2 == 0 || !_0x3a83d2) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x34dbca && _0x1fc99b != _0x29577e) {
										_0x2fc30f = k * 1 + 3;
										_0x49f720 = 4;
									}
								}
								if (_0x49f720 > 0) {
									if (_0x1c59dd == 0) {
										if (_0x1fc99b == okey) {
											_0x1fc99b = okey % 100 + 800;
										}
										this.moveToTable(_0x49f720, _0x1fc99b, _0x2fc30f, j, 1);
										this.popMessage(users[_0x2019da] + " seri isledi!");
										tileLimits[_0x2019da]--;
										if (activePlayer != _0x49f720) {
											_0x364dc5[_0x49f720] += _0x1fc99b % 100 * 10;
										}
										var _0xaf41f9 = activePlayer;
										activePlayer = _0x2019da;
										this.updateBoards();
										activePlayer = _0xaf41f9;
										_0x2bbb42 = 1;
									} else {
										handleItems.push(boardTiles[i]);
										// $(boardPlaces[i * 1 + 1]).children[0].children[0].innerHTML = '';
										// $(boardPlaces[i * 1 + 1]).children[0].children[0].classList.add("marked");
									}
								}
							}
						}
					}
				}
			}
			if (_0x2bbb42 == 0 && _0x1c59dd == 0) {
				this.putToTable(_0x2019da);
			}
			if (_0x1c59dd == 0) {
				this.markIt(_0x2019da);
			}
			this.checkWin();
			if (settingsPunish == 1 && (settingsType == 2 || settingsType == 3)) {
				if (_0x364dc5[1] > 0) {
					this.changePoint(_0x364dc5[1], 1, 1);
					_0x364dc5[1] = 0;
				}
				if (_0x364dc5[2] > 0) {
					this.changePoint(_0x364dc5[2], 2, 1);
					_0x364dc5[2] = 0;
				}
				if (_0x364dc5[3] > 0) {
					this.changePoint(_0x364dc5[3], 3, 1);
					_0x364dc5[3] = 0;
				}
				if (_0x364dc5[4] > 0) {
					this.changePoint(_0x364dc5[4], 4, 1);
					_0x364dc5[4] = 0;
				}
			}
		},
		sortDouble(_0xa76703, _0x5d64f0) {
			boardTilesVir = boardTiles.slice();
			boardTilesVir.sort();
			boardTilesVir.sort((_0x24365f, _0x1fee6b) => _0x24365f % 100 > _0x1fee6b % 100 ? 1 : _0x1fee6b % 100 > _0x24365f % 100 ? -1 : 0);
			var _0x23dc07 = [];
			var _0x71e9d5 = [];
			var _0x9eb8f9 = 0;
			var _0x308f35 = 0;
			var _0xe80f11;
			_0xe80f11 = parseInt(boardTilesVir[0]);
			_0x23dc07.push(boardTilesVir[0]);
			for (let i=1; i<=boardTilesVir.length; i++) {
				if (boardTilesVir[i] != "800") {
					var _0x596912 = parseInt(boardTilesVir[i]);
					if (_0x596912 == _0xe80f11) {
						_0x23dc07.push(boardTilesVir[i]);
						_0x71e9d5.push.apply(_0x71e9d5, _0x23dc07);
						_0x71e9d5.push("");
						_0x23dc07 = [];
						_0x9eb8f9++;
					} else {
						if (_0x596912 != _0xe80f11) {
							_0x23dc07 = [];
							_0x23dc07.push(boardTilesVir[i]);
						}
					}
					_0xe80f11 = parseInt(boardTilesVir[i]);
				}
			}
			for (let i=0; i<=_0x71e9d5.length; i++) {
				boardTilesVir = this.removeArrayItem(boardTilesVir, _0x71e9d5[i]);
				_0x308f35 = _0x308f35 * 1 + _0x71e9d5[i] % 100;
			}
			if (_0x5d64f0 == 0) {
				if (settingsType == 1 || settingsType == 2 || settingsType == 3) {
					return _0x9eb8f9;
				}
			}
			if (_0x5d64f0 == 1) {
				return _0x71e9d5;
			}
		},
		checkLeft(_0x324b05) {
			var _0x218c45 = boardTiles.lastIndexOf('') * 1 + 1;
			var _0x4c85fc = perFull.length;
			var _0x14f884 = boardTiles.slice();
			var _0xdcee61 = boardPlaces.slice();
			if (_0x324b05 == 1) {
				if (area1items.length < 1) {
					return 0;
				}
				var _0x5458a2 = area1items[area1items.length - 1];
				var _0x457d5c = 1;
			}
			if (_0x324b05 == 2) {
				if (area2items.length < 1) {
					return 0;
				}
				var _0x5458a2 = area2items[area2items.length - 1];
				var _0x457d5c = 2;
			}
			if (_0x324b05 == 3) {
				if (area3items.length < 1) {
					return 0;
				}
				var _0x5458a2 = area3items[area3items.length - 1];
				var _0x457d5c = 3;
			}
			if (_0x324b05 == 4) {
				if (area4items.length < 1) {
					return 0;
				}
				var _0x5458a2 = area4items[area4items.length - 1];
				var _0x457d5c = 4;
			}
			this.place(_0x5458a2, _0x218c45);
			this.arrange(activePlayer);
			this.checkWin();
			var _0x224a9d = 0;
			if (_0x324b05 == 1) {
				_0x224a9d = User2Total;
			}
			if (_0x324b05 == 2) {
				_0x224a9d = User3Total;
			}
			if (_0x324b05 == 3) {
				_0x224a9d = User4Total;
			}
			if (_0x324b05 == 4) {
				_0x224a9d = User1Total;
			}
			var _0x19ab28 = _0x5458a2.split('-');
			_0x19ab28 = _0x19ab28[1] - 1;
			_0x19ab28 = data[_0x19ab28];
			if (perFull.length > _0x4c85fc && (openStatusSort[activePlayer] == 0 && _0x224a9d > openLimit || openStatusSort[activePlayer] == 1 || settingsType == 1) || _0x19ab28 == okey && settingsType == 1) {
				boardTiles = _0x14f884.slice();
				boardPlaces = _0xdcee61.slice();
				this.updateBoards();
				this.arrange(activePlayer);
				return 1;
			} else {
				this.movetoArea(_0x5458a2, _0x457d5c, 1);
				boardTiles = _0x14f884.slice();
				boardPlaces = _0xdcee61.slice();
				this.updateBoards();
				this.arrange(activePlayer);
				return 0;
			}
		},
		removeArrayItem(arr, item, add) {
			let index;
			if (add != 1) index = arr.indexOf(item);
			if (add == 1) index = arr.lastIndexOf(item);
			if (index > -1) {
				arr.splice(index, 1);
				return arr;
			}
			return arr;
		},
		changePlayer(_0x2ebcf1) {
			activePlayer = _0x2ebcf1;
			if (activePlayer == 4) {
				activePlayerCont = 1;
			}
			// $("user-1").classList.remove("active");
			// $("user-2").classList.remove('active');
			// $("user-3").classList.remove("active");
			// $("user-4").classList.remove("active");
			// $("user-" + activePlayer).classList.add("active");

			APP.game.els.el.find(`.seat.highlight`).removeClass("highlight");
			APP.game.els.el.find(`.seat[data-seat="${activePlayer}"]`).addClass("highlight");

			collect = [];
			collectPlaces = [];
			collectTiles = [];
		},
		AI(seat) {
			if (gameOver == 1) return 0;
	
			AIcont = 1;
			this.changePlayer(seat);
			this.arrange(seat);
			var aiTiles = boardTiles.filter(e => e != '').slice();
			if (aiTiles.length - 1 == tileLimits[seat]) {
				if (settingsType == 2 || settingsType == 3) { // 51 or 101
					if (openStatusDouble[seat] == 0) {
						this.arrange(seat);
						this.putToTable(seat, 1);
					}
					if (openStatusSort[seat] == 1 || openStatusDouble[seat] == 1) {
						this.getOkeyFromTable(seat);
						this.arrange(seat);
						aiTiles = boardTiles.filter(e => e != '').slice();
						if (aiTiles.length > 1) {
							this.checkHandle(seat);
						}
						aiTiles = boardTiles.filter(e => e != '').slice();
						if (aiTiles.length > 1) {
							this.arrange(seat, 2);
						}
						aiTiles = boardTiles.filter(e => e != '').slice();
						if (aiTiles.length > 1) {
							this.checkHandleDouble(seat);
						}
					}
					aiTiles = boardTiles.filter(e => e != '').slice();
					if (aiTiles.length > 1) {
						this.arrange(seat, 2);
					}
					if (aiTiles.length > 1) {
						this.putToTable(seat, 1);
					}
					aiTiles = boardTiles.filter(e => e != '').slice();
					if (aiTiles.length == 3) {
						this.putOkeyToTable(seat);
					}
					aiTiles = boardTiles.filter(e => e != '').slice();
					if (aiTiles.length > 1) {
						this.putToTable(seat, 2);
					}
					aiTiles = boardTiles.filter(e => e != '').slice();
					if (aiTiles.length < 1) {
						console.log("tas bitti - 2");
					}
					this.markIt(seat);
				}
				this.arrange(seat);
				aiTiles = boardPlaces.filter(e => e != 0).slice();
				if (aiTiles.length > 0) {
					selectedTile1 = aiTiles[aiTiles.length - 1];
					var _0x280b69 = selectedTile1.split('-');
					_0x280b69 = _0x280b69[1] - 1;
					if (aiTiles.length > 0) {
						var _0x33ee = 0;
						while ((data[_0x280b69] == okey || handleItems.indexOf(boardTiles[boardPlaces.indexOf(selectedTile1) - 1]) > -1) && aiTiles.length - _0x33ee > 0) {
							_0x33ee++;
							selectedTile1 = aiTiles[aiTiles.length - _0x33ee];
							var _0x280b69 = selectedTile1.split('-');
							_0x280b69 = _0x280b69[1] - 1;
						}
					}
					if (seat != 1) {
						var _0x77769 = Math.ceil(Math.random() * 10);
						if (_0x77769 < 2 && settingsGameLevel == 2 || _0x77769 < 4 && settingsGameLevel == 1) {
							console.log("el bozuyor");
							selectedTile1 = aiTiles[0];
						}
					}
				} else {
					console.log("tas bitti - 1");
				}

				let index = boardPlaces.indexOf(selectedTile1),
					tile = boardTiles[index - 1];
				APP.game.dispatch({ type: "discard-tile", seat, tile });

				this.checkThrow(seat, selectedTile1);
				this.arrange(seat);
				this.markIt(1);
				if (gameOver == 1 && tilesLeft.length > 0) {
					if (settingsType == 1) {
						this.gameOver(1);
					}
					if (settingsType == 2 || settingsType == 3) {}
					return 0;
				}
			} else {
				var discard;
				if (seat == 1) discard = 4;
				if (seat == 2) discard = 1;
				if (seat == 3) discard = 2;
				if (seat == 4) discard = 3;

				// if (this.checkLeft(discard) == 1) {
				if (1 == 1) {
					var _0x54fe2a = boardTiles.lastIndexOf('') * 1 + 1;
					if (seat == 1) {
						var _0x727da6 = area4items[area4items.length - 1].split('-');
						_0x727da6 = data[_0x727da6[1] - 1] % 100;
						_0x727da6 = _0x727da6 * 10;
						if (settingsPunish == 1 && (settingsType == 2 || settingsType == 3)) {
							this.changePoint(_0x727da6, 4, 1);
						}
						this.place(area4items[area4items.length - 1], _0x54fe2a);
						area4items = this.removeArrayItem(area4items, area4items[area4items.length - 1]);
					}
					if (seat == 2) {
						var _0x727da6 = area1items[area1items.length - 1].split('-');
						_0x727da6 = data[_0x727da6[1] - 1] % 100;
						_0x727da6 = _0x727da6 * 10;
						if (settingsPunish == 1 && (settingsType == 2 || settingsType == 3)) {
							this.changePoint(_0x727da6, 1, 1);
						}
						// smooth animation
						APP.game.dispatch({ type: "get-discarded-tile", seat, from: 1 });

						this.place(area1items[area1items.length - 1], _0x54fe2a);
						area1items = this.removeArrayItem(area1items, area1items[area1items.length - 1]);
					}
					if (seat == 3) {
						var _0x727da6 = area2items[area2items.length - 1].split('-');
						_0x727da6 = data[_0x727da6[1] - 1] % 100;
						_0x727da6 = _0x727da6 * 10;
						if (settingsPunish == 1 && (settingsType == 2 || settingsType == 3)) {
							this.changePoint(_0x727da6, 2, 1);
						}
						// smooth animation
						APP.game.dispatch({ type: "get-discarded-tile", seat, from: 2 });

						this.place(area2items[area2items.length - 1], _0x54fe2a);
						area2items = this.removeArrayItem(area2items, area2items[area2items.length - 1]);
					}
					if (seat == 4) {
						var _0x727da6 = area3items[area3items.length - 1].split('-');
						_0x727da6 = data[_0x727da6[1] - 1] % 100;
						_0x727da6 = _0x727da6 * 10;
						if (settingsPunish == 1 && (settingsType == 2 || settingsType == 3)) {
							this.changePoint(_0x727da6, 3, 1);
						}
						// smooth animation
						APP.game.dispatch({ type: "get-discarded-tile", seat, from: 3 });

						this.place(area3items[area3items.length - 1], _0x54fe2a);
						area3items = this.removeArrayItem(area3items, area3items[area3items.length - 1]);
					}
				} else {
					var _0x54fe2a = boardTiles.lastIndexOf('') * 1 + 1;
					this.place('tile-' + tilesLast, _0x54fe2a);
					this.removeStampfromCenter();
					// UI animation
					APP.game.dispatch({ type: "draw-stack-tile", seat })
				}
				timmerAI = setTimeout(() => {
					if (gameOver == 1) return 0;
					this.arrange(seat);
					this.AI(seat);
				}, 1000);
			}
		},
		changePoint(_0x2b8526, _0x1cee51, _0x3637f4) {
			var _0x4a9d88 = [0, 0, 0, 0, 0];
			if (settingsType == 1) {
				var _0x3af9e7 = ['', "<span class=\"sign\">", "<span class=\"sign\">", "<span class=\"sign\">", "<span class=\"sign\">"];
				if (!_0x2b8526) {
					_0x2b8526 = 2;
				}
				if (winWithOkey == 1) {
					_0x2b8526 = _0x2b8526 * 2;
				}
				if (winWithDouble == 1) {
					_0x2b8526 = _0x2b8526 * 2;
				}
				if (Math.floor(okey / 100) == 4 || Math.floor(okey / 100) == 1) {
					_0x2b8526 = _0x2b8526 * pointMultiplier;
				}
				if (winnerPlayer != 1) {
					user1Point = user1Point - _0x2b8526;
					_0x3af9e7[1] = '<span>';
				}
				if (winnerPlayer != 2) {
					user2Point = user2Point - _0x2b8526;
					_0x3af9e7[2] = '<span>';
				}
				if (winnerPlayer != 3) {
					user3Point = user3Point - _0x2b8526;
					_0x3af9e7[3] = '<span>';
				}
				if (winnerPlayer != 4) {
					user4Point = user4Point - _0x2b8526;
					_0x3af9e7[4] = '<span>';
				}
				if (user1Point <= 0 || user2Point <= 0 || user3Point <= 0 || user4Point <= 0) {
					var _0x161ed2 = 0;
					if (user1Point > _0x161ed2) {
						_0x161ed2 = user1Point;
						winnerPlayer1 = 1;
					}
					if (user2Point > _0x161ed2) {
						_0x161ed2 = user2Point;
						winnerPlayer1 = 2;
					}
					if (user3Point > _0x161ed2) {
						_0x161ed2 = user3Point;
						winnerPlayer1 = 3;
					}
					if (user4Point > _0x161ed2) {
						_0x161ed2 = user4Point;
						winnerPlayer1 = 4;
					}
				}
				_0x4a9d88 = [0, user1Point, user2Point, user3Point, user4Point];
				if (winnerPlayer1 > 0) {
					$("points-title").innerHTML = '&nbsp';
					$("points-button-ok").innerHTML = "YENI OYUN";
					var _0x8471d4 = [Math.abs(user1Point) * 1 + 0.1, Math.abs(user2Point) * 1 + 0.2, Math.abs(user3Point) * 1 + 0.3, Math.abs(user4Point) * 1 + 0.4];
					if (user1Point < 0) {
						_0x8471d4[0] *= -1;
					}
					if (user2Point < 0) {
						_0x8471d4[1] *= -1;
					}
					if (user3Point < 0) {
						_0x8471d4[2] *= -1;
					}
					if (user4Point < 0) {
						_0x8471d4[3] *= -1;
					}
					_0x8471d4.sort((_0x198e6f, _0x2129fc) => _0x198e6f - _0x2129fc);
					_0x8471d4.reverse();
					var _0xffbe75 = [];
					_0xffbe75.push(Math.abs((_0x8471d4[0] % 1 * 10).toFixed(0)));
					_0xffbe75.push(Math.abs((_0x8471d4[1] % 1 * 10).toFixed(0)));
					_0xffbe75.push(Math.abs((_0x8471d4[2] % 1 * 10).toFixed(0)));
					_0xffbe75.push(Math.abs((_0x8471d4[3] % 1 * 10).toFixed(0)));
					winnerPlayer1 = _0xffbe75[0];
					if (winnerPlayer1 == 1) {
						this.playAudio(6);
					} else {
						this.playAudio(7);
					}
					$("points-line-" + _0xffbe75[0]).children[0].setAttribute("class", '');
					$("points-line-" + _0xffbe75[0]).children[0].classList.add("rank-1");
					$("points-line-" + _0xffbe75[1]).children[0].setAttribute('class', '');
					$("points-line-" + _0xffbe75[1]).children[0].classList.add("rank-2");
					$("points-line-" + _0xffbe75[2]).children[0].setAttribute("class", '');
					$("points-line-" + _0xffbe75[2]).children[0].classList.add("rank-3");
					$("points-line-" + _0xffbe75[3]).children[0].setAttribute("class", '');
					$("points-line-" + _0xffbe75[3]).children[0].classList.add('rank-4');
				}
			}
			if (settingsType == 2 || settingsType == 3) {
				var _0x3af9e7 = ['', '<span>', '<span>', '<span>', '<span>'];
				var _0x421496 = 'sign';
				if (_0x3637f4 == 1) {
					_0x421496 = "sign-red";
				}
				if (_0x1cee51 == 1) {
					_0x4a9d88[1] = _0x2b8526;
					user1Point += _0x4a9d88[1];
					_0x3af9e7[1] = "<span class=\"" + _0x421496 + "\">";
				}
				if (_0x1cee51 == 2) {
					_0x4a9d88[2] = _0x2b8526;
					user2Point += _0x4a9d88[2];
					_0x3af9e7[2] = "<span class=\"" + _0x421496 + "\">";
				}
				if (_0x1cee51 == 3) {
					_0x4a9d88[3] = _0x2b8526;
					user3Point += _0x4a9d88[3];
					_0x3af9e7[3] = "<span class=\"" + _0x421496 + "\">";
				}
				if (_0x1cee51 == 4) {
					_0x4a9d88[4] = _0x2b8526;
					user4Point += _0x4a9d88[4];
					_0x3af9e7[4] = "<span class=\"" + _0x421496 + "\">";
				}
				if (!_0x1cee51) {
					var _0x8b561a = 1;
					if (gameOver == 1) {
						var _0x4dd40d = 0;
						if (openStatusDouble[1] == 1 || openStatusSort[1] == 1) {
							_0x4dd40d++;
						}
						if (openStatusDouble[2] == 1 || openStatusSort[2] == 1) {
							_0x4dd40d++;
						}
						if (openStatusDouble[3] == 1 || openStatusSort[3] == 1) {
							_0x4dd40d++;
						}
						if (openStatusDouble[4] == 1 || openStatusSort[4] == 1) {
							_0x4dd40d++;
						}
						if (_0x4dd40d == 1) {
							_0x8b561a = _0x8b561a * 2;
						}
						if (openAllHand == 1) {
							_0x8b561a = 4;
						}
					}
					if (PointOkeyCont == 1) {
						_0x8b561a = _0x8b561a * 2;
					}
					if (openStatusDouble[1] == 0 && openStatusSort[1] == 0) {
						_0x4a9d88[1] = punishOffset * _0x8b561a * 2;
						user1Point += _0x4a9d88[1];
					} else {
						_0x4a9d88[1] = this.countBoard(1) * _0x8b561a;
						if (this.countBoard(1) == 0) {
							_0x4a9d88[1] = punishOffset * _0x8b561a * -2;
						} else {
							if (openStatusDouble[1] == 1) {
								_0x4a9d88[1] = _0x4a9d88[1] * 2;
							}
							if (this.checkOkeyHandle(1) > 0) {
								_0x4a9d88[1] = (_0x4a9d88[1] - okey % 100) * 1 + punishOffset * this.checkOkeyHandle(1);
							}
						}
						user1Point += _0x4a9d88[1];
					}
					if (openStatusDouble[2] == 0 && openStatusSort[2] == 0) {
						_0x4a9d88[2] = punishOffset * _0x8b561a * 2;
						user2Point += _0x4a9d88[2];
					} else {
						_0x4a9d88[2] = this.countBoard(2) * _0x8b561a;
						if (this.countBoard(2) == 0) {
							_0x4a9d88[2] = punishOffset * _0x8b561a * -2;
						} else {
							if (openStatusDouble[2] == 1) {
								_0x4a9d88[2] = _0x4a9d88[2] * 2;
							}
							if (this.checkOkeyHandle(2) > 0) {
								_0x4a9d88[2] = (_0x4a9d88[2] - okey % 100) * 1 + punishOffset * this.checkOkeyHandle(2);
							}
						}
						user2Point += _0x4a9d88[2];
					}
					if (openStatusDouble[3] == 0 && openStatusSort[3] == 0) {
						_0x4a9d88[3] = punishOffset * _0x8b561a * 2;
						user3Point += _0x4a9d88[3];
					} else {
						_0x4a9d88[3] = this.countBoard(3) * _0x8b561a;
						if (this.countBoard(3) == 0) {
							_0x4a9d88[3] = punishOffset * _0x8b561a * -2;
						} else {
							if (openStatusDouble[3] == 1) {
								_0x4a9d88[3] = _0x4a9d88[3] * 2;
							}
							if (this.checkOkeyHandle(3) > 0) {
								_0x4a9d88[3] = (_0x4a9d88[3] - okey % 100) * 1 + punishOffset * this.checkOkeyHandle(3);
							}
						}
						user3Point += _0x4a9d88[3];
					}
					if (openStatusDouble[4] == 0 && openStatusSort[4] == 0) {
						_0x4a9d88[4] = punishOffset * _0x8b561a * 2;
						user4Point += _0x4a9d88[4];
					} else {
						_0x4a9d88[4] = this.countBoard(4) * _0x8b561a;
						if (this.countBoard(4) == 0) {
							_0x4a9d88[4] = punishOffset * _0x8b561a * -2;
						} else {
							if (openStatusDouble[4] == 1) {
								_0x4a9d88[4] = _0x4a9d88[4] * 2;
							}
							if (this.checkOkeyHandle(4) > 0) {
								_0x4a9d88[4] = (_0x4a9d88[4] - okey % 100) * 1 + punishOffset * this.checkOkeyHandle(4);
							}
						}
						user4Point += _0x4a9d88[4];
					}
					if (gameOver == 1) {
						var _0x161ed2 = 0;
						var _0x8471d4 = [Math.abs(user1Point) * 1 + 0.1, Math.abs(user2Point) * 1 + 0.2, Math.abs(user3Point) * 1 + 0.3, Math.abs(user4Point) * 1 + 0.4];
						if (user1Point < 0) {
							_0x8471d4[0] *= -1;
						}
						if (user2Point < 0) {
							_0x8471d4[1] *= -1;
						}
						if (user3Point < 0) {
							_0x8471d4[2] *= -1;
						}
						if (user4Point < 0) {
							_0x8471d4[3] *= -1;
						}
						_0x8471d4.sort((_0xa2c5f9, _0x3173d2) => _0xa2c5f9 - _0x3173d2);
						var _0xffbe75 = [];
						_0xffbe75.push(Math.abs((_0x8471d4[0] % 1 * 10).toFixed(0)));
						_0xffbe75.push(Math.abs((_0x8471d4[1] % 1 * 10).toFixed(0)));
						_0xffbe75.push(Math.abs((_0x8471d4[2] % 1 * 10).toFixed(0)));
						_0xffbe75.push(Math.abs((_0x8471d4[3] % 1 * 10).toFixed(0)));
						winnerPlayer1 = _0xffbe75[0];
						if (winnerPlayer1 == 1) {
							this.playAudio(6);
						} else {
							this.playAudio(7);
						}
						$("points-line-" + _0xffbe75[0]).children[0].setAttribute("class", '');
						$("points-line-" + _0xffbe75[0]).children[0].classList.add("rank-1");
						$("points-line-" + _0xffbe75[1]).children[0].setAttribute("class", '');
						$("points-line-" + _0xffbe75[1]).children[0].classList.add("rank-2");
						$("points-line-" + _0xffbe75[2]).children[0].setAttribute("class", '');
						$("points-line-" + _0xffbe75[2]).children[0].classList.add("rank-3");
						$("points-line-" + _0xffbe75[3]).children[0].setAttribute("class", '');
						$("points-line-" + _0xffbe75[3]).children[0].classList.add("rank-4");
					}
					var _0x47d568;
					_0x47d568 = _0x421496;
					if (_0x4a9d88[1] < 0) {
						_0x421496 = "sign-green";
					}
					_0x3af9e7[1] = "<span class=\"" + _0x421496 + "\">";
					_0x421496 = _0x47d568;
					if (_0x4a9d88[2] < 0) {
						_0x421496 = "sign-green";
					}
					_0x3af9e7[2] = "<span class=\"" + _0x421496 + "\">";
					_0x421496 = _0x47d568;
					if (_0x4a9d88[3] < 0) {
						_0x421496 = "sign-green";
					}
					_0x3af9e7[3] = "<span class=\"" + _0x421496 + "\">";
					_0x421496 = _0x47d568;
					if (_0x4a9d88[4] < 0) {
						_0x421496 = "sign-green";
					}
					_0x3af9e7[4] = "<span class=\"" + _0x421496 + "\">";
				}
			}
			this.writePoint();
			$("points-detail").innerHTML = $("points-detail").innerHTML + _0x3af9e7[1] + _0x4a9d88[1] + "</span>" + _0x3af9e7[2] + _0x4a9d88[2] + "</span>" + _0x3af9e7[3] + _0x4a9d88[3] + '</span>' + _0x3af9e7[4] + _0x4a9d88[4] + "</span>";
			$("points-last").innerHTML = '<span>' + user1Point + "</span>" + "<span>" + user2Point + "</span>" + '<span>' + user3Point + "</span>" + '<span>' + user4Point + '</span>';
		},
		checkOkeyHandle(seat) {
			var val = 0;
			if (seat == 1) {
				boardTiles = boardTiles1.slice();
			}
			if (seat == 2) {
				boardTiles = boardTiles2.slice();
			}
			if (seat == 3) {
				boardTiles = boardTiles3.slice();
			}
			if (seat == 4) {
				boardTiles = boardTiles4.slice();
			}
			for (let i=0; i<boardTiles.length; i++) {
				if (boardTiles[i]) {
					if (boardTiles[i] == okey) {
						val++;
					}
				}
			}
			return val;
		},
		setPoint(num) {
			selectPoint = num;
			if (settingsType == 1) {
				pointLimit = points[selectPoint];
				user1Point = pointLimit;
				user2Point = pointLimit;
				user3Point = pointLimit;
				user4Point = pointLimit;
			}
			if (settingsType == 2 || settingsType == 3) {
				pointLimit = 0;
				user1Point = pointLimit;
				user2Point = pointLimit;
				user3Point = pointLimit;
				user4Point = pointLimit;
			}
			this.writePoint();
			for (let i=1; i<points.length; i++) {
				// $('point-' + i).innerHTML = points[i];
				// $("point-" + i).classList.remove("point-active");
				// $('point-' + i).classList.add("point-passive");
			}
			// $('point-' + num).classList.remove("point-passive");
			// $('point-' + num).classList.add("point-active");
			if (settingsType == 1) {
				// $("points-first").innerHTML = "<span>" + pointLimit + '</span>' + "<span>" + pointLimit + "</span>" + "<span>" + pointLimit + "</span>" + "<span>" + pointLimit + '</span>';
			}
			// $("points-detail").innerHTML = '';
			// $("points-last").innerHTML = "<span>" + pointLimit + '</span>' + "<span>" + pointLimit + '</span>' + "<span>" + pointLimit + '</span>' + "<span>" + pointLimit + '</span>';
			if (settingsType != 1) {
				// $("points-first").innerHTML = '';
			}
		},
		message(num, _0x38f6ec) {
			if (!_0x38f6ec) {
				_0x38f6ec = 0;
			}
			msgCont = 1;
			msgValue = num;
			$("messageBack").style.display = 'block';
			$("close").style.display = "none";
			$("button-no").style.display = "inline-block";
			$("button-ok").style.display = "inline-block";
			$("button-ok").innerHTML = 'TAMAM';
			$("button-no").innerHTML = "IPTAL";
			if (num == 1) {
				$("message-box").style.opacity = '0';
				$("message-box").style.visibility = "visible";
				$("message-box").style.transition = "all 0.5s";
				$("message-box").style.opacity = '1';
				$('title').innerHTML = "OYUN BITTI";
				$("body").innerHTML = activePlayer + ". Oyuncu Kazandi!";
				$("button-ok").style.display = "inline-block";
				if (settingsGameMode == 1) {
					$("button-ok").innerHTML = "YENI OYUN";
				}
				if (settingsGameMode == 2) {
					$("button-ok").innerHTML = "DEVAM";
				}
			}
			if (num == 2) {
				$("message-box").style.opacity = '0';
				$("message-box").style.visibility = "visible";
				$("message-box").style.transition = "all 0.5s";
				$("message-box").style.opacity = '1';
				$('title').innerHTML = "OYUN BITTI";
				$("body").innerHTML = "Yerde tas kalmadi!";
				$("button-ok").style.display = "inline-block";
				$("button-no").style.display = 'none';
				$("button-ok").innerHTML = "YENI OYUN";
				$("button-no").innerHTML = "IPTAL";
			}
			if (num == '10' || num == '11' || num == '12' || num == '13' || num == '14') {
				$("message-box").style.opacity = '0';
				$("message-box").style.visibility = "visible";
				$("message-box").style.transition = "all 0.5s";
				$("message-box").style.opacity = '1';
				$('title').innerHTML = "YENI OYUN";
				$("body").innerHTML = "Bu ayar deqisirse oyun yeniden baslayaca emin misiniz?";
			}
			if (num == "new") {
				$("message-box").style.opacity = '0';
				$("message-box").style.visibility = "visible";
				$("message-box").style.transition = "all 0.5s";
				$("message-box").style.opacity = '1';
				$('title').innerHTML = "YENI OYUN";
				$("body").innerHTML = "Oyun yeniden baslayacak!<br /> Emin misiniz?";
			}
			if (num == "end") {
				$("message-box").style.opacity = '0';
				$("message-box").style.visibility = "visible";
				$("message-box").style.transition = "all 0.5s";
				$("message-box").style.opacity = '1';
				$('title').innerHTML = "TEBRIKLER";
				$("body").innerHTML = "Tebrikler!<br />Bulmacayi basariyla tamamladiniz.";
			}
			if (num == "goDouble") {
				$("message-box").style.opacity = '0';
				$("message-box").style.visibility = "visible";
				$("message-box").style.transition = "all 0.5s";
				$("message-box").style.opacity = '1';
				$("title").innerHTML = "CIFT GIT";
				$("body").innerHTML = "Cift gitmek istediqinize emin misiniz?";
				;
				$("button-ok").innerHTML = "CIFT GIT";
				$("button-no").innerHTML = "IPTAL";
			}
			if (num == "solve") {
				$("message-box").style.opacity = '0';
				$("message-box").style.visibility = "visible";
				$("message-box").style.transition = "all 0.5s";
				$("message-box").style.opacity = '1';
				$("title").innerHTML = 'CÖZÃœM';
				$("body").innerHTML = "Bulmaca cözumunu görmek istediqinize emin misiniz?";
			}
			if (num == 'mode') {
				var _0x5054f7 = '';
				$("message-box").style.opacity = '0';
				$("message-box").style.visibility = "visible";
				$("message-box").style.transition = "all 0.5s";
				$("message-box").style.opacity = '1';
				$('title').innerHTML = "UYARI!";
				if (settingsGameMode == 1) {
					_0x5054f7 = "Puan dusmeli oyun moduna geciliyor.";
				}
				if (settingsGameMode == 2) {
					_0x5054f7 = "Tek oyun moduna geciliyor.";
					$("point-select").style.transition = "all 0s";
					$("point-select").style.visibility = "hidden";
				}
				$("body").innerHTML = _0x5054f7;
			}
			if (num == 0) {
				if (settingsCont == 1) {
					return 0;
				}
				if (settingsGameMode == 2 && contOpen == 1 && _0x38f6ec == 1) {
					return 0;
				}
				if (settingsGameMode == 2 && _0x38f6ec == 1) {
					return 0;
				}
				if (_0x38f6ec == 1 && gameOver == 0 || _0x38f6ec != 1) {
					$("points-table").style.transition = "all 0s";
					$("points-table").style.visibility = "hidden";
				}
				if (gameOver == 0) {
					$("complete").style.transition = "all 0s";
					$("complete").style.visibility = "hidden";
					$("messageBack").style.display = 'none';
					$("message-box").style.visibility = "hidden";
					$("message-box").style.transition = "all 0.5s";
					$("message-box").style.opacity = '0';
				} else {
					$("button-no").style.display = "none";
					$("button-ok").innerHTML = "YENI OYUN";
				}
				if ((settingsType == 2 || settingsType == 3) && gameOver == 1 && _0x38f6ec != 1) {
					start();
				}
				msgCont = 0;
				if (contOpen == 1 && !winnerPlayer1) {
					message_ok('complete');
					contOpen = 0;
				}
				if (winnerPlayer1 && settingsType == 1) {
					game_over_message();
				}
			}
		},
		messageOk(_0x52a48e) {
			var _0x28a1a3 = msgValue;
			settingsCont = 0;
			$("settings-close").style.display = "block";
			if (msgValue == "mode") {
				settings("gameMode", 2);
			}
			if (msgValue == 10) {
				lastLevel = lastLevelTemp;
			}
			if (msgValue == 'new' || msgValue == 10) {
				gameRound = 1;
			}
			if (settingsGameMode == 2 && _0x52a48e == "complete") {
				gameRound++;
				changePoint();
			}
			if (msgValue == "goDouble") {
				goDouble = 1;
				$("go-double").style.display = "none";
				$("sort-order").style.display = "none";
				$("show-tiles").style.display = 'block';
				$("message-box").style.visibility = 'hidden';
				$("message-box").style.transition = "all 0.5s";
				$("message-box").style.opacity = '0';
				$("messageBack").style.display = "none";
			} else {
				if (!winnerPlayer1) {
					start();
				}
			}
			if (settingsGameMode == 2 && _0x52a48e == "complete") {
				if (pointsGameOver == 0) {
					if (settingsType == 1) {
						points_table();
					}
				}
				if (pointsGameOver == 1) {
					gameRound = 1;
					start();
				}
			}
			if (settingsType != 1) {
				message(0);
			}
			msgValue = 0;
			if (_0x28a1a3 > 9 && _0x28a1a3 < 15) {
				$("messageBack").style.display = 'block';
			}
		},
		dragStop(seat, tile) {
			// if (dragCont == 1) {
			// 	dragCont = 0;
				boardTiles = boardTiles1.slice();
				boardPlaces = boardPlaces1.slice();
				var _0x5e26b1 = activePlayer;
				activePlayer = 1;
				var _0x13e5a0 = $(selectedTile).offsetLeft * 1 + $(selectedTile).offsetWidth / 2;
				var _0x4a8d3c = $(selectedTile).offsetTop * 1;
				var _0x542afe = $(selectedTile).offsetHeight;
				var _0x382b44 = $("area-1").offsetLeft;
				var _0x510c78 = $("area-1").offsetTop;
				var _0x3b7da6 = $("area-4").offsetLeft;
				var _0x4a828f = $('area-4').offsetTop;
				// if (_0x13e5a0 > tileDefaultLeft - tileW * 2 && _0x13e5a0 < tileDefaultLeft * 1 + tileW * 2 && _0x4a8d3c > tileDefaultTop - _0x542afe && _0x4a8d3c < tileDefaultTop * 1 + _0x542afe * 2) {
				// 	if (settingsType != 1) {
				// 		this.popMessage("Bitmek icin istakada kalan son tasinizi saq tarafa atmalisiniz!");
				// 	} else {
				// 		var _0x158c19 = boardPlaces.indexOf(selectedTile);
				// 		if (gameOver == 0) {
				// 			var _0x158c19 = boardPlaces.indexOf(selectedTile);
				// 			if (_0x158c19 !== -1) {
				// 				var _0x511d04 = boardPlaces[_0x158c19];
				// 				var _0x4871b4 = boardTiles[_0x158c19 - 1];
				// 				boardPlaces[_0x158c19] = 0;
				// 				boardTiles[_0x158c19 - 1] = '';
				// 			}
				// 			var _0x2c402d = selectedTile.split('-');
				// 			_0x2c402d = _0x2c402d[1];
				// 			if ((this.checkWin() || this.checkWinDouble()) && _0x158c19 > -1) {
				// 				if (data[_0x2c402d - 1] == okey && winWithDouble == 1) {
				// 					this.playAudio(4);
				// 					winWithOkey = 1;
				// 					this.popMessage(users[activePlayer] + " Cifte Giderken Okey Atarak Bitti!", 0, 2);
				// 				} else {
				// 					if (data[_0x2c402d - 1] == okey) {
				// 						this.playAudio(4);
				// 						this.popMessage(users[activePlayer] + " Okey Atarak Bitti!", 0, 2);
				// 						winWithOkey = 1;
				// 					} else {
				// 						if (winWithDouble == 1) {
				// 							this.playAudio(4);
				// 							this.popMessage(users[activePlayer] + " Cifte Giderek Bitti!", 0, 2);
				// 						}
				// 					}
				// 				}
				// 				boardPlaces[_0x158c19] = 0;
				// 				boardTiles[_0x158c19 - 1] = '';
				// 				this.updateBoards();
				// 				winnerPlayer = activePlayer;
				// 				this.gameOver(1);
				// 				return 0;
				// 			} else {
				// 				if (data[_0x2c402d - 1] == gosterge) {
				// 					var _0x18ae24 = 0;
				// 					if (Indicator != 0) {
				// 						this.popMessage("Gösterge Zaten Yapildi!");
				// 						_0x18ae24 = 1;
				// 					}
				// 					if (laps != 0 && _0x18ae24 == 0) {
				// 						this.popMessage("Gösterge Sadece Oyunun Basinda Yapilabilir!");
				// 						_0x18ae24 = 1;
				// 					}
				// 					if (settingsGameMode == 2) {
				// 						if (_0x18ae24 == 0) {
				// 							if (settingsIndicator == 1) {
				// 								this.popMessage(users[activePlayer] + " Gösterge Yapti!", 0, 2);
				// 								Indicator = 1;
				// 								this.changePoint(1);
				// 								this.playAudio(4);
				// 								setTimeout(() => {
				// 									this.pointsTable();
				// 								}, 1000);
				// 							} else {
				// 								this.popMessage("Gösterge Kapali! Ayarlardan acabilirsiniz.");
				// 							}
				// 						}
				// 					} else {
				// 						this.popMessage("Sadece Puanli Oyunda Gösterge Yapabilirsiniz!");
				// 					}
				// 				} else {
				// 					if (_0x158c19 > -1) {
				// 						this.popMessage("Henuz bitemediniz!");
				// 					}
				// 				}
				// 			}
				// 			if (_0x511d04) {
				// 				boardPlaces[_0x158c19] = _0x511d04;
				// 				boardTiles[_0x158c19 - 1] = _0x4871b4;
				// 			}
				// 		}
				// 	}
				// }
				if (_0x13e5a0 > boardLeft && _0x4a8d3c + _0x542afe > boardTop) {
					var _0x5534d2 = Math.ceil((_0x13e5a0 - boardLeft) / tileW);
					if (_0x5534d2 < 1) {
						_0x5534d2 = 1;
					}
					if (_0x5534d2 > 15) {
						_0x5534d2 = 15;
					}
					if (_0x4a8d3c * 1 + _0x542afe / 1.5 > boardTop * 1 + boardDiff * 1) {
						_0x5534d2 = 15 + _0x5534d2 * 1;
					}
					var _0xd7d3e9 = boardTiles.filter(e => e != '').slice();
					if (_0xd7d3e9.length > tileLimits[1] && boardPlaces.indexOf(selectedTile) < 0) {
						this.popMessage("Istakanizda " + (tileLimits[1] * 1 + 1) + " tas var. Önce tas atmaniz gerekiyor.");
						this.moveBack(selectedTile);
						activePlayer = _0x5e26b1;
						this.getBoard(activePlayer);
						return 0;
					}
					var _0x2c402d = selectedTile.split('-');
					_0x2c402d = _0x2c402d[1];
					if (_0x2c402d == tilesLast) {
						this.removeStampfromCenter();
					}
					if (area4items.indexOf(selectedTile) != -1) {
						area4items = this.removeArrayItem(area4items, selectedTile);
						if (settingsType == 2 || settingsType == 3) {
							var _0x2c402d = selectedTile.split('-');
							_0x2c402d = _0x2c402d[1];
							_0x2c402d = data[_0x2c402d - 1];
							if (_0x2c402d > 0 || _0x2c402d == "000") {
								leftHandCont = _0x2c402d;
								leftHandTile = selectedTile;
								leftHandContTemp = 0;
								leftHandTileTemp = 0;
								$('area-4').innerHTML = "TASI GERI BIRAK";
								$('area-4').classList.add("drop");
							}
						}
					}
					var _0x158c19 = boardPlaces.indexOf(selectedTile);
					if (_0x158c19 !== -1) {
						var _0x47abc7 = boardPlaces[_0x158c19];
						var _0x5d197b = boardTiles[_0x158c19 - 1];
						boardPlaces[_0x158c19] = 0;
						boardTiles[_0x158c19 - 1] = '';
						this.updateBoards();
					}
					if (this.checkPosition(_0x5534d2)) {
						this.place(selectedTile, _0x5534d2, 1);
						this.playAudio(3);
					} else {
						boardPlaces[_0x158c19] = _0x47abc7;
						boardTiles[_0x158c19 - 1] = _0x5d197b;
						this.updateBoards();
						this.moveBack(selectedTile);
					}
				} else {
					// if (_0x13e5a0 > _0x382b44 - tileW * 3 && _0x4a8d3c + _0x542afe > _0x510c78 - _0x542afe * 1.5 && boardPlaces.indexOf(selectedTile) > -1) {
						this.checkThrow(1, selectedTile);
					// } else {
						// if (_0x13e5a0 > _0x3b7da6 - tileW * 3 && _0x4a8d3c + _0x542afe > _0x4a828f - _0x542afe * 1.5 && boardPlaces.indexOf(selectedTile) > -1) {
							// if ((leftHandCont > 0 || leftHandCont == '000') && leftHandTile == selectedTile) {
								// this.dropBack();
							// } else {
								// this.moveBack(selectedTile);
							// }
						// } else {
							// this.moveBack(selectedTile);
						// }
					// }
				}
				this.checkWin();
				activePlayer = _0x5e26b1;
				this.getBoard(activePlayer);
				this.markIt(1);
			// }
		},
		checkThrow(seat, tile) {
			if (leftHandCont) {
				this.popMessage("Soldan aldiqiniz tasi kullanmadan tas atamazsiniz.");
				this.moveBack(tile);
				return;
			}
			var _0x335bad = boardTiles.filter(e => e != '').slice();
			if (_0x335bad.length <= tileLimits[seat]) {
				this.popMessage("Istakanizda " + tileLimits[seat] + " tas var, önce tas almaniz gerekiyor.");
				this.moveBack(tile);
				return;
			}
			if (openPunish[seat] == 2) {
				this.popMessage("Elinizi acmaniz ya da taslarinizi toplamaniz gerekiyor.");
				this.moveBack(tile);
				return;
			}
			if (openPunish[seat] == 1 && _0x335bad.length > 1) {
				openPunish[seat] = 2;
				this.changePoint(punishOffset, seat, 1);
				this.popMessage("Yanlis el actiniz " + punishOffset + " puan ceza yediniz.");
				this.moveBack(tile);
				return;
			}
			var _0x17313c = boardPlaces.indexOf(tile);
			if (_0x17313c !== -1) {
				if (activePlayer == 1) {
					activePlayerCont = 0;
					this.buttonActivePassive("collect", 0);
					firstOpenCont = 0;
				}
				boardPlaces[_0x17313c] = 0;
				boardTiles[_0x17313c - 1] = '';
				this.movetoArea(tile, seat);
			}
			var _0x335bad = boardTiles.filter(e => e != '').slice();
			if (_0x335bad.length == 0) {
				if (collect.length == 21) {
					console.log("Oyuncu elden bitti!");
					openAllHand = 1;
				} else {
					console.log("Oyun Bitti: Istakada Tas kalmadi");
				}
				winnerPlayer = activePlayer;
				this.gameOver(1);
			}
		},
		updateBoards() {
			if (activePlayer == 1) {
				boardTiles1 = boardTiles.slice();
				boardPlaces1 = boardPlaces.slice();
			}
			if (activePlayer == 2) {
				boardTiles2 = boardTiles.slice();
				boardPlaces2 = boardPlaces.slice();
			}
			if (activePlayer == 3) {
				boardTiles3 = boardTiles.slice();
				boardPlaces3 = boardPlaces.slice();
			}
			if (activePlayer == 4) {
				boardTiles4 = boardTiles.slice();
				boardPlaces4 = boardPlaces.slice();
			}
		},
		checkPosition(_0x317063) {
			if (boardPlaces[_0x317063]) {
				if (_0x317063 <= 15) {
					for (let i=_0x317063; i<=15; i++) {
						if (boardPlaces[i] == 0) {
							this.openPlace(_0x317063, i, 1);
							this.playAudio(2);
							return 1;
						}
					}
					for (let i=_0x317063; i>=0; i--) {
						if (boardPlaces[i] == 0) {
							this.openPlace(_0x317063, i, 2);
							this.playAudio(2);
							return 1;
						}
					}
				}
				if (_0x317063 > 15) {
					for (let i=_0x317063; i<=30; i++) {
						if (boardPlaces[i] == 0) {
							this.openPlace(_0x317063, i, 1);
							this.playAudio(2);
							return 1;
						}
					}
					for (let i=_0x317063; i>=15; i--) {
						if (boardPlaces[i] == 0) {
							this.openPlace(_0x317063, i, 2);
							this.playAudio(2);
							return 1;
						}
					}
				}
				return 0;
			}
			return 1;
		},
		movetoArea(tile, seat, _0x1c04c4) {
			// $(tile).style.visibility = "visible";
			var _0x10dd5c = boardTiles.filter(e => e != '').slice();
			var _0x536f0b = tile.split('-');
			if (handleItems.indexOf(data[_0x536f0b[1] - 1]) > -1 && _0x10dd5c.length > 0 && _0x1c04c4 != 1) {
				this.popMessage(users[activePlayer] + " islek tas atti, " + punishOffset + " ceza puani yedi!");
				this.changePoint(punishOffset, activePlayer, 1);
			}
			if (okey == data[_0x536f0b[1] - 1] && _0x1c04c4 != 1) {
				if (_0x10dd5c.length > 0 && (settingsType == 2 || settingsType == 3)) {
					this.popMessage(users[activePlayer] + " yana okey atti, " + punishOffset + " ceza puani yedi!");
					this.changePoint(punishOffset, activePlayer, 1);
				} else {
					this.popMessage(users[activePlayer] + " yana OKEY atti!");
					PointOkeyCont = 1;
				}
			}
			var _0x2cd34c = 0;
			if (seat == 1) {
				area1Count++;
				_0x2cd34c = area1items.length;
				_0x2cd34c = area1Count;
			}
			if (seat == 2) {
				area2Count++;
				_0x2cd34c = area2items.length;
				_0x2cd34c = area2Count;
			}
			if (seat == 3) {
				area3Count++;
				_0x2cd34c = area3items.length;
				_0x2cd34c = area3Count;
			}
			if (seat == 4) {
				area4Count++;
				_0x2cd34c = area4items.length;
				_0x2cd34c = area4Count;
			}
			var _0x150c8a = $("area-" + seat).offsetLeft;
			var _0x10c455 = $("area-" + seat).offsetTop;
			var _0x4025c6 = $("area-" + seat).offsetHeight;
			var _0x22e686 = $("area-" + seat).offsetWidth;
			// $(tile).style.transition = "all 0.5s";
			// $(tile).style.zIndex = _0x2cd34c * 1 + 1;
			// $(tile).style.left = _0x150c8a * 1 + _0x22e686 * 0.09 + 'px';
			// $(tile).style.top = _0x10c455 * 1 + _0x4025c6 * 0.09 + 'px';
			// $(tile).style.display = "block";
			// $(tile).children[0].style.display = 'block';
			if (tilesLeft.length == 0) {
				console.log("Oyun Bitti: Ortada Cekecek Tas kalmadi");
				gameOver = 1;
				if (settingsType == 1) {
					this.message(2);
				}
				if (settingsType == 2 || settingsType == 3) {
					this.gameOver(1);
				}
			}
			if (seat == 1 && _0x1c04c4 != 1) {
				laps++;
				if (area1items.length == 0) {
					this.playAudio(3);
				} else {
					this.playAudio(1);
				}
				area1items.push(tile);
			}
			if (seat == 2 && _0x1c04c4 != 1) {
				area2items.push(tile);
			}
			if (seat == 3 && _0x1c04c4 != 1) {
				area3items.push(tile);
			}
			if (seat == 4 && _0x1c04c4 != 1) {
				area4items.push(tile);
			}
			if (_0x1c04c4 != 1 && gameOver == 0) {
				gameMoveCont = 0;
				timmerNextPlayer = setTimeout(() => {
					if (gameOver == 1) {
						return 0;
					}
					if (seat == 1) {
						this.AI(2);
					}
					if (seat == 2) {
						this.AI(3);
					}
					if (seat == 3) {
						this.AI(4);
					}
					if (seat == 4) {
						activePlayer = 1;
						this.getBoard(activePlayer);
						if (AIStatus == 1) {
							this.AI(1);
						} else {
							AIcont = 0;
							this.changePlayer(1);
						}
					}
					gameMoveCont = 1;
					return 0;
				}, 1000);
			}
			this.updateBoards();
			if (gameOver == 1 && settingsType == 1) {
				this.gameOver(1);
			}
		},
		openPlace(_0x1ca1e8, _0x160545, _0x1ff05a) {
			if (_0x1ff05a == 1) {
				for (let i=_0x160545; i>=_0x1ca1e8; i--) {
					if (boardPlaces[i]) {
						var _0x11d831 = i * 1 + 1;
						this.place(boardPlaces[i], _0x11d831);
						boardPlaces[_0x11d831] = boardPlaces[i];
						boardPlaces[i] = selectedTile;
					}
				}
			}
			if (_0x1ff05a == 2) {
				for (let i=_0x160545; i<=_0x1ca1e8; i++) {
					if (boardPlaces[i]) {
						var _0x11d831 = i * 1 - 1;
						this.place(boardPlaces[i], _0x11d831);
						boardPlaces[_0x11d831] = boardPlaces[i];
						boardPlaces[i] = selectedTile;
					}
				}
			}
		},
		dropBack() {
			boardTiles = boardTiles1.slice();
			boardPlaces = boardPlaces1.slice();
			var _0x301d0e = boardPlaces.indexOf(leftHandTile);
			if (_0x301d0e !== -1 && leftHandTile) {
				boardPlaces[_0x301d0e] = 0;
				boardTiles[_0x301d0e - 1] = '';
				this.movetoArea(leftHandTile, 4);
				leftHandCont = 0;
				leftHandTile = 0;
				leftHandContTemp = 0;
				leftHandTileTemp = 0;
				// $("area-4").innerHTML = '';
				// $("area-4").classList.remove("drop");
			}
		},
		sem() {
			var _0x5f031e = 0;
			for (let i=1; i<=8; i++) {
				for (let j=1; j<=13; j++) {
					var _0xf34c82 = " ";
					var stone = parseInt(data[_0x5f031e].substr(1, 2));
					var color1 = data[_0x5f031e].substr(0, 1);
					if (stone == 0) {
						stone = 'R';
					}
					_0x5f031e++;
					
					//$("game-items").innerHTML += "<div id=\"tile-" + _0x5f031e + "\" class=\"tile " + color[color1] + "\">" + _0xf34c82 + "</div>";
					if (_0x5f031e <= tilesLast) {
						//$("tile-" + _0x5f031e).style.left = tileDefaultLeft + 'px';
						//$("tile-" + _0x5f031e).style.top = tileDefaultTop + 'px';
					} else {
						//$("tile-" + _0x5f031e).style.left = '-1000px';
						//$("tile-" + _0x5f031e).style.top = "-1000px";
					}
					//$("tile-" + _0x5f031e).style.width = tileW * 0.95 + 'px';
					//$("tile-" + _0x5f031e).style.height = tileH * 0.95 + 'px';
					//$("tile-" + _0x5f031e).style.lineHeight = tileH * 0.6 + 'px';
					//$("tile-" + _0x5f031e).style.fontSize = tileW * 0.75 + 'px';
					//$("tile-" + _0x5f031e).innerHTML = '';
					//$("tile-" + _0x5f031e).innerHTML = "<div id='face-" + _0x5f031e + "' style='display:none'><div class='point'>" + "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" class=\"heart\" viewBox=\"0 0 16 16\"> <path fill-rule=\"evenodd\" d=\"M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z\"/> </svg>" + "</div><div id='Letter-" + j + '-' + i + "'>" + stone + "</div></div>";
				}
			}
			for (let j=104; j<=105; j++) {
				var _0xf34c82 = " ";
				var stone = parseInt(data[_0x5f031e].substr(1, 2));
				var color1 = data[_0x5f031e].substr(0, 1);
				if (stone == 0) {
					stone = 'R';
				}
				_0x5f031e++;
				
				//$("game-items").innerHTML += "<div id=\"tile-" + _0x5f031e + "\" class=\"tile " + color[color1] + "\">" + _0xf34c82 + "</div>";
				if (_0x5f031e <= tilesLast) {
					//$("tile-" + _0x5f031e).style.left = tileDefaultLeft + 'px';
					//$("tile-" + _0x5f031e).style.top = tileDefaultTop + 'px';
				} else {
					//$("tile-" + _0x5f031e).style.left = "-1000px";
					//$("tile-" + _0x5f031e).style.top = "-1000px";
				}
				//$("tile-" + _0x5f031e).style.width = tileW * 0.95 + 'px';
				//$("tile-" + _0x5f031e).style.height = tileH * 0.95 + 'px';
				//$("tile-" + _0x5f031e).style.lineHeight = tileH * 0.6 + 'px';
				//$("tile-" + _0x5f031e).style.fontSize = tileW * 0.75 + 'px';
				//$("tile-" + _0x5f031e).innerHTML = '';
				//$("tile-" + _0x5f031e).innerHTML = "<div id='face-" + _0x5f031e + "' style='display:none'><div class='point'>" + "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" class=\"heart\" viewBox=\"0 0 16 16\"> <path fill-rule=\"evenodd\" d=\"M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z\"/> </svg>" + "</div><div id='Letter-" + j + '-' + i + "'>" + stone + "</div></div>";
			}
			let x = parseInt(data[_0x5f031e - 1].substr(0, 1));
			let y = parseInt(data[_0x5f031e - 1].substr(1, 2));
			Tiles.okey = y * 1 + 1;
			if (Tiles.okey > 13) {
				Tiles.okey = 1;
			}
			if (Tiles.okey < 10) {
				Tiles.okey = '0' + Tiles.okey;
			}
			Tiles.okey = String(x) + String(Tiles.okey);
			gosterge = data[_0x5f031e - 1];
			if (settingsType == 1) {
				//$("tile-" + _0x5f031e).style.left = tileDefaultLeft - tileW * 1.1 + 'px';
				//$("tile-" + _0x5f031e).style.top = tileDefaultTop + 'px';
			} else {
				//$("tile-" + _0x5f031e).style.left = tileDefaultLeft + 'px';
				//$("tile-" + _0x5f031e).style.top = tileDefaultTop - tileH * 1.15 + 'px';
			}
			//$("face-" + _0x5f031e).style.display = "block";
			//$("game-items").innerHTML += "<div id=\"board\"></div>";
			//boardTop = $("board").offsetTop * 1 + //$("board").offsetHeight * 0.07;
			//boardDiff = $("board").offsetHeight * 0.45;
			//boardLeft = $("board").offsetHeight * 0.3;

			// Real SEM
			var _0x4e8fe0 = activePlayer;
			for (let j=1; j<=4; j++) {
				this.getBoard(j);
				for (let i=1; i<boardPlaces.length; i++) {
					if (boardPlaces[i] != 0) {
						this.place(boardPlaces[i], i, j);
					}
				}
			}
			activePlayer = _0x4e8fe0;
			this.getBoard(activePlayer);
			let areaitems = area1items.slice();
			area1items = [];
			for (let i=0; i<areaitems.length; i++) {
				this.movetoArea(areaitems[i], 1, 1);
				area1items.push(areaitems[i]);
			}
			areaitems = area2items.slice();
			area2items = [];
			for (let i=0; i<areaitems.length; i++) {
				this.movetoArea(areaitems[i], 2, 1);
				area2items.push(areaitems[i]);
			}
			areaitems = area3items.slice();
			area3items = [];
			for (let i=0; i<areaitems.length; i++) {
				this.movetoArea(areaitems[i], 3, 1);
				area3items.push(areaitems[i]);
			}
			areaitems = area4items.slice();
			area4items = [];
			for (let i=0; i<areaitems.length; i++) {
				this.movetoArea(areaitems[i], 4, 1);
				area4items.push(areaitems[i]);
			}
			for (let i=0; i<13; i++) {
				for (let j=0; j<7; j++) {
					if (tableUser1[j][i]) {
						this.moveToTable(1, tableUser1[j][i], i, j, 1, tableUserTiles1[j][i]);
					}
					if (tableUser2[j][i]) {
						this.moveToTable(2, tableUser2[j][i], i, j, 1, tableUserTiles2[j][i]);
					}
					if (tableUser3[j][i]) {
						this.moveToTable(3, tableUser3[j][i], i, j, 1, tableUserTiles3[j][i]);
					}
					if (tableUser4[j][i]) {
						this.moveToTable(4, tableUser4[j][i], i, j, 1, tableUserTiles4[j][i]);
					}
				}
			}
			for (let i=0; i<2; i++) {
				for (let j=0; j<14; j++) {
					if (tableDoubleUser1[j][i]) {
						this.moveToTable(1, tableDoubleUser1[j][i], i, j, 2, tableDoubleUserTiles1[j][i]);
					}
					if (tableDoubleUser2[j][i]) {
						this.moveToTable(2, tableDoubleUser2[j][i], i, j, 2, tableDoubleUserTiles2[j][i]);
					}
					if (tableDoubleUser3[j][i]) {
						this.moveToTable(3, tableDoubleUser3[j][i], i, j, 2, tableDoubleUserTiles3[j][i]);
					}
					if (tableDoubleUser4[j][i]) {
						this.moveToTable(4, tableDoubleUser4[j][i], i, j, 2, tableDoubleUserTiles4[j][i]);
					}
				}
			}
		},
		popMessage(msg, timer, type) {
			console.log(msg, timer, type);
		},
		playAudio(num) {
			console.log("play audio", num);
		},
		removeStampfromCenter() {
			tilesLast--;
			this.updateLeftTiles(data[tilesLast]);
		},
		AI_ON() {},
		gameType() {},
		gameMode() {},
		pointSelect() {},
		pointSelectClose() {},
		autoPlay() {},
		writePoint() {},
		moveTile(el, player, _top, _left, type, tableTilePos) {},
		gameOver(_0x3a9872) {},
		gameOverMessage() {},
		pointsTable() {},
		remainingMessage() {},
		putOkeyToTable(_0x54d834) {},
		getOkeyFromTable(_0x38a670, _0x3f3e09) {},
		// play(num) {},
		// setCookie(name, value, days) {},
		// getCookie(name) {},
		// boyutla() {},
		// suffleArray(arr) {},
		// suffle() {},
		// messageNo() {},
		// settings(name, value) {},
	};

	return Engine;

})();
