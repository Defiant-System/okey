
let Engine = (() => {

	let APP;
	let Colors = ["green", "red",  "blue", "yellow", "black"];

	let activePlayer = 1;
	let settingsType = 2;
	let settingsGameLevel = 2;
	let boardTiles = [];
	let boardPlaces = Array(31).fill(0);
	let boardTilesVir;
	let okeyCont = 0;
	let goDouble = 0;
	let perFull = [];
	let perHalf = [];
	let boardLeft;
	let tileW;

	let Tiles = {
		data: [],
		init() {
			for (let j=1; j<=4; j++) {
				for (let i=1; i<=13; i++) {
					let x = String(i);
					if (i < 10) x = "0" + x;
					this.data.push(j + x);
				}
				for (let i=1; i<=13; i++) {
					let x = String(i);
					if (i < 10) x = "0" + x;
					this.data.push(j + x);
				}
			}
			// jokers
			this.data.push("000", "000");
		},
		// suffleArray(arr) {
		// 	arr = arr.sort(() => Math.random() - 0.5);
		// 	return arr;
		// },
		shuffle() {
			let shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
			this.left = this.data.slice();
			this.data = shuffleArray(this.data);
			if (this.data[105] == "000") {
				this.shuffle();
				return 0;
			}
			// remove one tile from tile stack
			this.left = this.removeArrayItem(this.left, this.data[105]);
			// table UI update
			Engine.updateLeft();
		}
	};

	let Engine = {
		init() {
			// reference to application
			APP = okey;
			// init tiles
			Tiles.init();
			// start game
			// this.start();
		},
		start() {
			Tiles.shuffle();
			// reset variables
			activePlayer = 1;
			boardTiles = [];
			boardTilesVir = [];
			okeyCont = 0;
			goDouble = 0;

			tileW = 56;
		},
		updateLeft() {
			// update table tiles left
			APP.content.find(`.info .tiles.left .tile`).data({ n: Tiles.left.length });
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
			let str = [],
				okeyTile = state.table.okey;
			state.player.map(p => {
				if (p.seat === 1) {
					p.rack.map(id => {
						let clr = Colors[+id.slice(0,1)],
							num = new Number(id.slice(1));
						if (+id-1 === okeyTile) clr += " okey";
						if (id) str.push(`<span class="temp tile ${clr}" data-v="${num}" data-id="${id}"></span>`);
						else str.push(`<span class="temp empty"></span>`);
					});
				}
			});
			// add html to rack DOM
			APP.content.find(".player .rack").html(str.join(""));

			// make tiles position absolute
			let tiles = APP.content.find(".player .rack .temp");
			tiles.map(elem => {
				let el = $(elem),
					{ top, left } = el.offset();
				el.css({ top, left });
			});
			tiles.removeClass("temp");

			Tiles.left = state.table.left.slice();

			// table UI update
			this.updateLeft();

			// save state
			this._state = state;

			console.log(state);
		},
		// play(num) {},
		// setCookie(name, value, days) {},
		// getCookie(name) {},
		// boyutla() {},
		sem() {},
		// suffleArray(arr) {},
		// suffle() {},
		deliver() {},
		// updateLeftTiles(item) {},
		moveTile(el, player, _top, _left, type, tableTilePos) {},
		place(_0x5595c5, _0x17c5da, _0x4fcdf3) {
			// var _0x538492;
			// var _0x4f9f29;
			// if (!_0x4fcdf3) {
			// 	_0x4fcdf3 = activePlayer;
			// }
			// let y1 = _0x17c5da;
			// if (_0x17c5da > 16) {
			// 	y1 = _0x17c5da - 16;
			// }
			// _0x538492 = boardLeft + (y1 - 1) * tileW;
			// _0x4f9f29 = boardTop;
			// if (_0x17c5da > 16) {
			// 	_0x4f9f29 = boardTop + boardDiff;
			// }
			// try {
			// 	if (_0x4fcdf3 == 1) {
			// 		$(_0x5595c5).children[0].style.display = "block";
			// 	} else {
			// 		$(_0x5595c5).children[0].style.display = "none";
			// 	}
			// 	var _0x363bc5 = _0x5595c5.split('-');
			// 	_0x363bc5 = _0x363bc5[1] - 1;
			// 	if (markOkey == 1) {
			// 		if (data[_0x363bc5] == okey) {
			// 			$(_0x5595c5).children[0].style.display = "none";
			// 		}
			// 	}
			// 	$(_0x5595c5).style.transition = "all 0.5s";
			// 	$(_0x5595c5).style.zIndex = '1';
			// 	if (_0x4fcdf3 != 1) {
			// 		$(_0x5595c5).style.visibility = "hidden";
			// 	}
			// 	boardPlaces[_0x17c5da] = _0x5595c5;
			// 	boardTiles[_0x17c5da - 1] = data[_0x363bc5];
			// 	if (virtualMove == 0) {
			// 		this.update_boards();
			// 		if (_0x4fcdf3 == 1) {
			// 			$(_0x5595c5).style.left = _0x538492 + 'px';
			// 			$(_0x5595c5).style.top = _0x4f9f29 + 'px';
			// 		}
			// 		if (_0x4fcdf3 == 2) {
			// 			$(_0x5595c5).style.left = boardLeft2 + 'px';
			// 			$(_0x5595c5).style.top = boardTop2 + 'px';
			// 		}
			// 		if (_0x4fcdf3 == 3) {
			// 			$(_0x5595c5).style.left = boardLeft3 + 'px';
			// 			$(_0x5595c5).style.top = boardTop3 + 'px';
			// 		}
			// 		if (_0x4fcdf3 == 4) {
			// 			$(_0x5595c5).style.left = boardLeft4 + 'px';
			// 			$(_0x5595c5).style.top = boardTop4 + 'px';
			// 		}
			// 	}
			// } catch {
			// 	console.log("hata:" + _0x5595c5);
			// 	console.log("Hata-boardTiles");
			// 	console.log(boardTiles);
			// }
		},
		moveBack(el) {},

		getBoard(seat) {
			let rack = this._state.player[seat-1].rack.slice();
			// update "active player"
			activePlayer = seat-1;
			// return rack
			return { rack };
		},

		arrange(seat, type=1) {
			// style 1: serial
			// style 2: double
			var _0x415797 = [];
			var _0x4ace7d = [];
			var _0x8d1441 = [];
			var _0x20d181 = [];
			var _0x163d98 = [];
			let { rack } = this.getBoard(seat);
			
			okeyCont = 0;
			var _0x4d7341 = 0;
			if (activePlayer == 1) _0x4d7341 = 1;
			
			if (settingsGameLevel > 1 || _0x4d7341 == 1) {
				var index = rack.indexOf(this._state.table.okey);
				if (index != -1) {
					rack[index] = "800";
					okeyCont++;
				}
				var index = rack.indexOf(this._state.table.okey);
				if (index != -1) {
					rack[index] = "800";
					okeyCont++;
				}
				var index = rack.indexOf('000');
				if (index != -1) {
					rack[index] = String(this._state.table.okey);
				}
				var index = rack.indexOf('000');
				if (index != -1) {
					rack[index] = String(this._state.table.okey);
				}
			}
			var _0xabd7f7 = rack.slice();
			var _0x4d2aea = rack.slice();
			
			if (type == 1) {
				if (this.checkPer(3) || settingsGameLevel < 3 && _0x4d7341 == 0) {
					_0x415797 = this.sortTiles(3, 1);
					_0x4ace7d = _0x415797.slice();
					rack = boardTilesVir.slice();
					_0x415797 = this.sortTilesByColor(3, 1);
					_0x8d1441 = _0x415797.slice();
					rack = boardTilesVir.slice();
				} else {
					_0x415797 = this.sortTilesByColor(3, 1);
					_0x8d1441 = _0x415797.slice();
					rack = boardTilesVir.slice();
					_0x415797 = this.sortTiles(3, 1);
					_0x4ace7d = _0x415797.slice();
					;
					rack = boardTilesVir.slice();
				}
				_0x4ace7d.push.apply(_0x4ace7d, _0x8d1441);
				perFull = _0x4ace7d.slice();
				this.addFourth();
				if (okeyCont > 0) {
					addOkey(1);
				}
				_0x4ace7d = perFull.slice();
				if (this.checkPer(2) || settingsGameLevel < 3 && _0x4d7341 == 0) {
					_0x415797 = this.sortTiles(2, 1);
					_0x20d181 = _0x415797.slice();
					rack = boardTilesVir.slice();
					_0x415797 = this.sortTilesByColor(2, 1);
					_0x163d98 = _0x415797.slice();
					rack = boardTilesVir.slice();
				} else {
					_0x415797 = this.sortTilesByColor(2, 1);
					_0x163d98 = _0x415797.slice();
					rack = boardTilesVir.slice();
					_0x415797 = this.sortTiles(2, 1);
					_0x20d181 = _0x415797.slice();
					rack = boardTilesVir.slice();
				}
				_0x20d181.push.apply(_0x20d181, _0x163d98);
				perHalf = _0x20d181.slice();
				if (okeyCont > 0) {
					addOkey(2);
				}
				if (okeyCont > 0) {
					addOkey(3);
				}
				if (okeyCont > 0) {
					addOkey(4);
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
					addOkeyDouble();
				}
				boardTiles = boardTilesVir.slice();
				_0x4ace7d = perFull.slice();
			}
			_0x4ace7d.push.apply(_0x4ace7d, _0x20d181);
			boardTiles = rack.filter(e => e != '');
			var _0x17aa37 = 0;
			var _0x1eddbe = 0;
			var _0x52b171 = 0;
			for (let i=0; i<=_0x4ace7d.length; i++) {
				if (_0x4ace7d[i] == '') {
					if (i <= 16) {
						_0x17aa37 = _0x1eddbe;
						_0x1eddbe = i;
					}
					if (i > 16 && _0x52b171 == 0) {
						_0x52b171 = i;
					}
				}
			}
			if (_0x1eddbe) {
				for (let i=0; i<16 - _0x1eddbe; i++) {
					_0x4ace7d.splice(_0x17aa37, 0, '');
				}
			}
			if (_0x4ace7d[16] == '') {
				_0x4ace7d.splice(16, 1);
			}
			var _0x246380 = _0x4ace7d.length * 1 + rack.length * 1;
			for (let i=0; i<32 - _0x246380; i++) {
				_0x4ace7d.push('');
			}
			if (type == 1) {
				this.priority();
			}
			_0x4ace7d.push.apply(_0x4ace7d, boardTiles);
			boardTiles = _0x4ace7d.slice();
			var _0x199fea = rack.length;
			for (let i=32; i<_0x199fea; i++) {
				boardTiles = this.removeArrayItem(boardTiles, '', 1);
			}
			
			_0x4d2aea = [];
			let boardPlacesTemp1 = boardPlaces.slice();
			boardPlaces = Array(31).fill(0);
			var _0x3509bd = 0;
			for (let i=0; i<rack.length; i++) {
				var _0x27d3db = i * 1 + 1;
				if (rack[i] != '') {
					var _0x545a8b = _0xabd7f7.indexOf(rack[i]);
					_0xabd7f7[_0x545a8b] = '';
					_0x545a8b++;
					if (rack[i] != '') {
						_0x4d2aea[_0x3509bd] = rack[i];
						_0x3509bd++;
					}
					this.place(boardPlacesTemp1[_0x545a8b], _0x27d3db);
				} else {
					boardPlaces[_0x27d3db] = 0;
				}
			}

			console.log(rack, _0xabd7f7, _0x4d2aea);

			// if (type == 1 && check_win()) {
			// 	if (AIStatus == 0 && activePlayer == 1) {} else {
			// 		console.log("Oyun Bitti: " + users[activePlayer] + " Seri acti");
			// 		winnerPlayer = activePlayer;
			// 		game_over(1);
			// 	}
			// }
			// if (type == 2 && check_win_double()) {
			// 	if (AIStatus == 0 && activePlayer == 1) {} else {
			// 		console.log("Oyun Bitti: " + users[activePlayer] + " cift acti");
			// 		winnerPlayer = activePlayer;
			// 		game_over(1);
			// 	}
			// }
		},
		game_over(_0x3a9872) {},
		game_over_message() {},
		points_table() {},
		remaining_message() {},
		put_okey_to_table(_0x54d834) {},
		get_okey_from_table(_0x38a670, _0x3f3e09) {},
		put_to_table(_0x139c25, _0x4b4905) {},
		moveToTable(_0x336229, _0x315c85, _0x5f22f9, _0x4693ec, _0x14df73, _0x5486c5) {},
		button_active_passive(_0x282945, _0x106ed0) {},
		collectItBack() {},
		priority() {
			boardTiles.sort();
			boardTiles.sort((a, b) => a - b);
			boardTilesVir = boardTiles.slice();
			for (let i=1; i<boardTiles.length; i++) {
				if (Math.abs(boardTiles[i] - boardTiles[i - 1]) == 2) {
					boardTilesVir = removeArrayItem(boardTilesVir, boardTiles[i]);
					boardTilesVir = removeArrayItem(boardTilesVir, boardTiles[i - 1]);
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
								boardTilesVir = removeArrayItem(boardTilesVir, boardTiles[j]);
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
								boardTilesVir = removeArrayItem(boardTilesVir, boardTiles[j]);
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
								boardTilesVir = removeArrayItem(boardTilesVir, boardTiles[j]);
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
							boardTilesVir = removeArrayItem(boardTilesVir, boardTiles[j]);
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
							boardTilesVir = removeArrayItem(boardTilesVir, boardTiles[j]);
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
							boardTilesVir = removeArrayItem(boardTilesVir, boardTiles[j]);
							boardTilesVir.unshift(boardTiles[j]);
						}
					}
				}
			}
			boardTiles = boardTilesVir.slice();
		},
		addFourth() {
			for (let k=0; k<=1; k++) {
			for (let i=0; i<boardTiles.length; i++) {
				for (let j=0; j<perFull.length; j++) {
					if (perFull[j] == '') {
						var _0x39a913 = boardTiles[i];
						if (settingsType == 1) {
							if (boardTiles[i] % 100 == 1) {
								_0x39a913 = boardTiles[i] * 1 + 13;
							}
						}
						if (perFull[j - 1] * 1 + 1 == _0x39a913 && perFull[j - 2] * 1 + 2 == _0x39a913 && perFull[j - 3] * 1 + 3 == _0x39a913) {
							perFull.splice(j, 0, boardTiles[i]);
							boardTilesVir = removeArrayItem(boardTilesVir, boardTiles[i]);
							boardTiles = removeArrayItem(boardTiles, boardTiles[i]);
							i--;
						}
					}
				}
			}
		}
		for (let i=0; i<boardTiles.length; i++) {
			var _0x12e6a9 = 0;
			for (let j=0; j<perFull.length; j++) {
				_0x12e6a9++;
				if (perFull[j] == '') {
					if (_0x12e6a9 == 4) {
						if (perFull[j - 3] % 100 == boardTiles[i] % 100 && perFull[j - 2] % 100 == boardTiles[i] % 100 && perFull[j - 1] % 100 == boardTiles[i] % 100 && perFull[j - 1] != boardTiles[i] && perFull[j - 2] != boardTiles[i] && perFull[j - 3] != boardTiles[i]) {
							perFull.splice(j, 0, boardTiles[i]);
							boardTilesVir = removeArrayItem(boardTilesVir, boardTiles[i]);
							boardTiles = removeArrayItem(boardTiles, boardTiles[i]);
						}
					}
					_0x12e6a9 = 0;
				}
			}
		}
		},
		addOkey(_0x3d8919) {},
		addOkeyDouble() {},
		checkPer(_0x2e4c90) {
			var _0x2b6616 = boardTiles.slice();
			var _0x29014d = this.sortTiles(_0x2e4c90, 0);
			boardTiles = boardTilesVir.slice();
			var _0x45e4ae = this.sortTilesByColor(_0x2e4c90, 0);
			boardTiles = _0x2b6616.slice();
			var _0x3e5c7a = this.sortTilesByColor(_0x2e4c90, 0);
			boardTiles = boardTilesVir.slice();
			var _0x3bac34 = this.sortTiles(_0x2e4c90, 0);
			boardTiles = _0x2b6616.slice();
			var _0x32fbad = _0x29014d * 1 + _0x45e4ae * 1;
			var _0x5e8490 = _0x3e5c7a * 1 + _0x3bac34 * 1;
			return _0x32fbad >= _0x5e8490 ? 1 : 0;
		},
		sortTiles(_0xc01c42, _0x2808d1) {
			boardTilesVir = boardTiles.slice();
			boardTilesVir.sort();
			boardTiles.sort((_0x3ee0c6, _0x4f1807) => _0x3ee0c6 - _0x4f1807);
			var _0x1a7893 = [];
			var _0x48899e = [];
			var _0x5d9d5b = 0;
			var _0x2bf8f7 = 0;
			var _0x20c641;
			_0x20c641 = parseInt(boardTilesVir[0]);
			_0x1a7893.push(boardTilesVir[0]);
			var _0x134178 = 999;
			for (let i=1; i<boardTilesVir.length; i++) {
				var _0x35e4cc = parseInt(boardTilesVir[i]);
				var _0x1bf143 = 0;
				if (_0x35e4cc - 1 == _0x20c641) {
					_0x1a7893.push(boardTilesVir[i]);
					_0x1bf143 = 1;
				}
				if (settingsType == 1) {
					if (_0x20c641 % 100 == 1) {
						_0x134178 = String(_0x20c641);
					}
					if (_0x20c641 - _0x134178 == 12) {
						_0x1a7893.push(String(_0x134178));
						_0x1bf143 = 2;
						_0x134178 = 999;
					}
				}
				if (_0x1bf143 == 0 && _0x35e4cc != _0x20c641 || _0x35e4cc == _0x20c641 && _0x1a7893.length == 0) {
					_0x1a7893 = [];
					_0x1a7893.push(boardTilesVir[i]);
				}
				if (_0x1a7893.length == _0xc01c42 || _0x1bf143 == 2) {
					if (_0x1a7893.length == _0xc01c42) {
						if (_0x1a7893[0] == String(_0x134178)) {
							_0x134178 = 999;
						}
						_0x48899e.push.apply(_0x48899e, _0x1a7893);
						_0x48899e.push('');
						_0x5d9d5b++;
					}
					_0x1a7893 = [];
				}
				_0x20c641 = parseInt(boardTilesVir[i]);
				if (_0x1bf143 == 2) {
					_0x1a7893.push(boardTilesVir[i]);
				}
			}
			for (let i=0; i<_0x48899e.length; i++) {
				boardTilesVir = this.removeArrayItem(boardTilesVir, _0x48899e[i]);
				_0x2bf8f7 = _0x2bf8f7 * 1 + _0x48899e[i] % 100;
			}
			if (_0x2808d1 == 0) {
				if (settingsType == 1) {
					return _0x5d9d5b;
				}
				if (settingsType == 2 || settingsType == 3) {
					return _0x2bf8f7;
				}
			}
			if (_0x2808d1 == 1) {
				return _0x48899e;
			}
		},
		sortTilesByColor(_0x227ef9, _0x358372) {
			boardTilesVir = boardTiles.slice();
			boardTilesVir.sort();
			boardTilesVir.sort((_0x115327, _0x5cc0ab) => _0x115327 % 100 > _0x5cc0ab % 100 ? 1 : _0x5cc0ab % 100 > _0x115327 % 100 ? -1 : 0);
			var _0x25cfa2 = [];
			var _0x2eb003 = [];
			var _0x2c2e80 = 0;
			var _0x20645b = 0;
			var _0x7880e9;
			_0x7880e9 = parseInt(boardTilesVir[0]);
			_0x25cfa2.push(boardTilesVir[0]);
			for (let i=1; i<=boardTilesVir.length; i++) {
				var _0x38a85b = parseInt(boardTilesVir[i]);
				if (_0x38a85b % 100 == _0x7880e9 % 100 && _0x38a85b != _0x7880e9) {
					_0x25cfa2.push(boardTilesVir[i]);
				} else if (_0x38a85b != _0x7880e9) {
					_0x25cfa2 = [];
					_0x25cfa2.push(boardTilesVir[i]);
				}
				if (_0x25cfa2.length == _0x227ef9) {
					_0x2eb003.push.apply(_0x2eb003, _0x25cfa2);
					_0x2eb003.push('');
					_0x25cfa2 = [];
					_0x2c2e80++;
				}
				_0x7880e9 = parseInt(boardTilesVir[i]);
			}
			for (let i=0; i<=_0x2eb003.length; i++) {
				if (_0x2eb003[i]) {
					boardTilesVir = this.removeArrayItem(boardTilesVir, _0x2eb003[i]);
					_0x20645b = _0x20645b * 1 + _0x2eb003[i] % 100;
				}
			}
			if (_0x358372 == 0) {
				if (settingsType == 1) {
					return _0x2c2e80;
				}
				if (settingsType == 2 || settingsType == 3) {
					return _0x20645b;
				}
			}
			if (_0x358372 == 1) {
				return _0x2eb003;
			}
		},
		check_win_double() {},
		check_win() {},
		countBoard(_0x4a58c3) {},
		markIt(_0x4ff0b3) {},
		check_handle_double(_0x560968) {},
		check_handle(_0x2019da, _0x1c59dd) {},
		go_double() {},
		sortDouble(_0xa76703, _0x5d64f0) {
			if (goDouble == 0) {
				console.log("go double");
			}
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
						_0x71e9d5.push('');
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
		checkLeft(_0x324b05) {},
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
		change_player(_0x2ebcf1) {},
		AI(_0x5abf1f) {},
		autoPlay() {},
		write_point() {},
		changePoint(_0x2b8526, _0x1cee51, _0x3637f4) {},
		checkOkeyHandle(num) {},
		setPoint(num) {},
		AI_ON() {},
		game_type() {},
		game_mode() {},
		point_select() {},
		point_select_close() {},
		message(_0x38e4e2, _0x38f6ec) {},
		message_ok(_0x52a48e) {},
		message_no() {},
		settings(name, value) {},
		drag_stop() {},
		check_throw(_0x225b07, _0x203a47) {},
		update_boards() {},
		checkPosition(_0x317063) {},
		openPlace(_0x1ca1e8, _0x160545, _0x1ff05a) {},
		movetoArea(_0x2f30f1, _0x5255cf, _0x1c04c4) {},
		removeStempfromCenter() {},
		drop_back() {},
		popMessage(_0x528e32, _0x5e23e6, _0x5a5c83) {},
	};

	return Engine;

})();
