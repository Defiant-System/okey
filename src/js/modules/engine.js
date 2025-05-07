
let Engine = (() => {

	let APP;
	let Colors = ["green", "red",  "blue", "yellow", "black"];

	let activePlayer = 1;
	let settingsGameLevel = 2;
	let boardTilesVir;

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
			this.left = removeArrayItem(this.left, this.data[105]);
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
			boardTilesVir = [];
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
		place(_0x5595c5, _0x17c5da, _0x4fcdf3) {},
		moveBack(el) {},

		getBoard(seat) {
			let rack = this._state.player[seat].rack.slice();
			// update "active player"
			activePlayer = seat;
			// return rack
			return { rack };
		},

		arrange(seat, style=1) {
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
				var _0x236bec = rack.indexOf(okey);
				if (_0x236bec != -1) {
					rack[_0x236bec] = "800";
					okeyCont++;
				}
				var _0x236bec = rack.indexOf(okey);
				if (_0x236bec != -1) {
					rack[_0x236bec] = "800";
					okeyCont++;
				}
				var _0x236bec = rack.indexOf('000');
				if (_0x236bec != -1) {
					rack[_0x236bec] = String(okey);
				}
				var _0x236bec = rack.indexOf('000');
				if (_0x236bec != -1) {
					rack[_0x236bec] = String(okey);
				}
			}
			var _0xabd7f7 = rack.slice();
			var _0x4d2aea = rack.slice();
			if (type == 1) {
				if (checkPer(3) || settingsGameLevel < 3 && _0x4d7341 == 0) {
					_0x415797 = sortTiles(3, 1);
					_0x4ace7d = _0x415797.slice();
					rack = boardTilesVir.slice();
					_0x415797 = sortTilesByColor(3, 1);
					_0x8d1441 = _0x415797.slice();
					rack = boardTilesVir.slice();
				} else {
					_0x415797 = sortTilesByColor(3, 1);
					_0x8d1441 = _0x415797.slice();
					rack = boardTilesVir.slice();
					_0x415797 = sortTiles(3, 1);
					_0x4ace7d = _0x415797.slice();
					;
					rack = boardTilesVir.slice();
				}
				_0x4ace7d.push.apply(_0x4ace7d, _0x8d1441);
				perFull = _0x4ace7d.slice();
				addFourth();
				if (okeyCont > 0) {
					addOkey(1);
				}
				_0x4ace7d = perFull.slice();
				if (checkPer(2) || settingsGameLevel < 3 && _0x4d7341 == 0) {
					_0x415797 = sortTiles(2, 1);
					_0x20d181 = _0x415797.slice();
					rack = boardTilesVir.slice();
					_0x415797 = sortTilesByColor(2, 1);
					_0x163d98 = _0x415797.slice();
					rack = boardTilesVir.slice();
				} else {
					_0x415797 = sortTilesByColor(2, 1);
					_0x163d98 = _0x415797.slice();
					rack = boardTilesVir.slice();
					_0x415797 = sortTiles(2, 1);
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
				_0x415797 = sortDouble(0, 1);
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
			for (i = 0; i <= _0x4ace7d.length; i++) {
				if (_0x4ace7d[i] == '') {
					if (i <= 15) {
						_0x17aa37 = _0x1eddbe;
						_0x1eddbe = i;
					}
					if (i > 15 && _0x52b171 == 0) {
						_0x52b171 = i;
					}
				}
			}
			if (_0x1eddbe) {
				for (i = 0; i < 15 - _0x1eddbe; i++) {
					_0x4ace7d.splice(_0x17aa37, 0, '');
				}
			}
			if (_0x4ace7d[15] == '') {
				_0x4ace7d.splice(15, 1);
			}
			var _0x246380 = _0x4ace7d.length * 1 + rack.length * 1;
			for (i = 0; i < 30 - _0x246380; i++) {
				_0x4ace7d.push('');
			}
			if (type == 1) {
				priority();
			}
			_0x4ace7d.push.apply(_0x4ace7d, boardTiles);
			boardTiles = _0x4ace7d.slice();
			var _0x199fea = rack.length;
			for (i = 30; i < _0x199fea; i++) {
				boardTiles = removeArrayItem(boardTiles, '', 1);
			}
			_0x4d2aea = [];
			boardPlacesTemp1 = boardPlaces.slice();
			boardPlaces = Array(31).fill(0);
			var _0x3509bd = 0;
			for (i = 0; i < rack.length; i++) {
				var _0x27d3db = i * 1 + 1;
				if (rack[i] != '') {
					var _0x545a8b = _0xabd7f7.indexOf(rack[i]);
					_0xabd7f7[_0x545a8b] = '';
					_0x545a8b++;
					if (rack[i] != '') {
						_0x4d2aea[_0x3509bd] = rack[i];
						_0x3509bd++;
					}
					place(boardPlacesTemp1[_0x545a8b], _0x27d3db);
				} else {
					boardPlaces[_0x27d3db] = 0;
				}
			}
			
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
		priority() {},
		addFourth(_0x4a9fc6) {},
		addOkey(_0x3d8919) {},
		addOkeyDouble() {},
		checkPer(_0x2e4c90) {},
		check_win_double() {},
		check_win() {},
		countBoard(_0x4a58c3) {},
		markIt(_0x4ff0b3) {},
		check_handle_double(_0x560968) {},
		check_handle(_0x2019da, _0x1c59dd) {},
		go_double() {},
		sortDouble(_0xa76703, _0x5d64f0) {},
		sortTiles(_0xc01c42, _0x2808d1) {},
		sortTilesByColor(_0x227ef9, _0x358372) {},
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
