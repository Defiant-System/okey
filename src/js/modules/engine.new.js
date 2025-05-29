
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

	let openLimitG = 101,
		openLimitD = 5,
		punishOffset = 101,
		openLimit = openLimitG,
		openLimitDouble = openLimitD,
		openLimitLast = openLimitG,
		openLimitDoubleLast = openLimitD,
		openStatusSort = [0, 0, 0, 0, 0],
		openStatusDouble = [0, 0, 0, 0, 0];

	let Board = {
			tiles: [],
			tiles1: [],
			tiles2: [],
			tiles3: [],
			tiles4: [],
			area1Count: 0,
			area2Count: 0,
			area3Count: 0,
			area4Count: 0,
			area1items: [],
			area2items: [],
			area3items: [],
			area4items: [],
			User1Total: 0,
			User2Total: 0,
			User3Total: 0,
			User4Total: 0,
			User1TotalDouble: 0,
			User2TotalDouble: 0,
			User3TotalDouble: 0,
			User4TotalDouble: 0,
		};

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

			this.checkThrow();
		},
		updateLeftTiles(item) {
			if (item) Tiles.tilesLeft = Tiles.removeArrayItem(Tiles.tilesLeft, item);
			// update table tiles left
			APP.content.find(`.info .tiles.left .tile`).data({ n: Tiles.tilesLeft.length });
		},
		updateRack(rack) {
			Board.virtualTiles = [...Array(32)].map(e => "");
			// console.log(Board.tiles);
			rack.find(".tile").map(elem => {
				let el = $(elem),
					uid = +el.data("uid"),
					value = el.data("id"),
					offset = el.offset(),
					y = (offset.top - 5) / 78,
					x = (offset.left - 21) / 56,
					i = (y * 16) + x;
				Board.virtualTiles[i] = { uid, value };
				if (value === "000") Board.virtualTiles[i]._value = "000";
				if (!Board.tiles.find(tile => tile.uid == uid)) throw "Rack is tampered with";
			});
			// console.log( Board.virtualTiles );
			Board.tiles = Board.virtualTiles;
		},
		getRack(seat) {
			activePlayer = seat;
			Board.tiles = Board["tiles"+ seat];
		},
		updateBoard() {
			let seat = activePlayer;
			Board["tiles"+ seat] = Board.tiles.slice();
		},
		dragStop(Drag) {
			this.updateRack(Drag.rack);

			if (Drag.isThrow) {
				activePlayer = (activePlayer + 1) % 4;
				this.checkThrow();
			} else {
				// if not throw tile, anything to do?
			}

			// update value
			this.checkWin();
		},
		checkThrow() {
			switch (activePlayer) {
				case 1:
					// user
					break;
				case 2:
				case 3:
				case 4:
					AI.think(activePlayer);
					break;
			}
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

			// back value of "replacement"
			Board.tiles.map(tile => (tile.value === "000") ? tile._value = tile.value : void(0));
			
			if (settingsGameLevel > 1 || min == 1) {
				let oI = Board.tiles.findIndex(e => (e._value || e.value) == Tiles.okey);
				if (oI != -1) {
					Board.tiles[oI].value = "800";
					okeyCont++;
				}
				oI = Board.tiles.findIndex(e => (e._value || e.value) == Tiles.okey);
				if (oI != -1) {
					Board.tiles[oI].value = "800";
					okeyCont++;
				}
				oI = Board.tiles.findIndex(e => (e._value || e.value) == "000");
				if (oI != -1) {
					Board.tiles[oI].value = String(Tiles.okey);
				}
				oI = Board.tiles.findIndex(e => (e._value || e.value) == "000");
				if (oI != -1) {
					Board.tiles[oI].value = String(Tiles.okey);
				}
			}
			let arr6 = Board.tiles.slice();
			
			if (type == 1) {
				if (Tiles.checkPer(3) || settingsGameLevel < 3 && min == 0) {
					arr1 = Tiles.sortTiles(3, 1);
					arr2 = arr1.slice();
					Board.tiles = Board.virtualTiles.slice();
					arr1 = Tiles.sortTilesByColor(3, 1);
					arr3 = arr1.slice();
					Board.tiles = Board.virtualTiles.slice();
				} else {
					arr1 = Tiles.sortTilesByColor(3, 1);
					arr3 = arr1.slice();
					Board.tiles = Board.virtualTiles.slice();
					arr1 = Tiles.sortTiles(3, 1);
					arr2 = arr1.slice();
					Board.tiles = Board.virtualTiles.slice();
				}
				arr2.push.apply(arr2, arr3);
				perFull = arr2.slice();
				Tiles.addFourth();
				if (okeyCont > 0) Tiles.addOkey(1);
				
				arr2 = perFull.slice();
				if (Tiles.checkPer(2) || settingsGameLevel < 3 && min == 0) {
					arr1 = Tiles.sortTiles(2, 1);
					arr4 = arr1.slice();
					Board.tiles = Board.virtualTiles.slice();
					arr1 = Tiles.sortTilesByColor(2, 1);
					arr5 = arr1.slice();
					Board.tiles = Board.virtualTiles.slice();
				} else {
					arr1 = Tiles.sortTilesByColor(2, 1);
					arr5 = arr1.slice();
					Board.tiles = Board.virtualTiles.slice();
					arr1 = Tiles.sortTiles(2, 1);
					arr4 = arr1.slice();
					Board.tiles = Board.virtualTiles.slice();
				}
				arr4.push.apply(arr4, arr5);
				perHalf = arr4.slice();
				
				if (okeyCont > 0) {
					Tiles.addOkey(2);
				}
				if (okeyCont > 0) {
					Tiles.addOkey(3);
				}
				if (okeyCont > 0) {
					Tiles.addOkey(4);
					arr2 = perFull.slice();
				}
				arr4 = perHalf.slice();
			}
			if (type == 2) {
				arr1 = Tiles.sortDouble(0, 1);
				arr2 = arr1.slice();
				perFull = arr2.slice();
				Board.tiles = Board.virtualTiles.slice();
				if (okeyCont > 0) Tiles.addOkeyDouble();
				Board.tiles = Board.virtualTiles.slice();
				arr2 = perFull.slice();
			}

			arr2.push.apply(arr2, arr4);
			Board.tiles = Board.tiles.filter(e => e != "");
			let _0x17aa37 = arr2.length;
			let _0x52b171 = arr2.length;
			if (arr2[16] == "") {
				arr2.splice(16, 1);
			}
			for (let i=0, il=arr2.length + Board.tiles.length; i<32-il; i++) {
				arr2.push("");
			}
			if (type == 1) {
				Tiles.priority();
			}
			arr2.push.apply(arr2, Board.tiles);
			
			Board.tiles = arr2.slice();
			for (let i=32, il=Board.tiles.length; i<il; i++) {
				Board.tiles = Tiles.removeArrayItem(Board.tiles, "", 1);
			}

			/* */
			let arr7 = [];
			let _0x3509bd = 0;
			for (let i=0; i<Board.tiles.length; i++) {
				let pos = i + 1;
				if (Board.tiles[i] != "") {
					let index = arr6.indexOf(Board.tiles[i]);
					arr6[index] = "";
					index++;
					if (Board.tiles[i] != "") {
						arr7[_0x3509bd] = Board.tiles[i];
						_0x3509bd++;
					}
				}
			}

			this.updateBoard();

			/* */
			if (type == 1 && this.checkWin()) {
				if (AIStatus == 0 && activePlayer == 1) {} else {
					console.log("Oyun Bitti: " + users[activePlayer] + " Seri acti");
					winnerPlayer = activePlayer;
					this.gameOver(1);
				}
			}
			
			if (type == 2 && this.checkWinDouble()) {
				if (AIStatus == 0 && activePlayer == 1) {} else {
					console.log("Oyun Bitti: " + users[activePlayer] + " cift acti");
					winnerPlayer = activePlayer;
					this.gameOver(1);
				}
			}
		},
		checkWin() {
			Board.virtualTiles = Board.tiles.slice();
			Tiles.User1Total = 0;
			Tiles.User2Total = 0;
			Tiles.User3Total = 0;
			Tiles.User4Total = 0;
			Tiles.UserTotal = 0;
			let  _0x5b3924 = 0;
			let  _0x257872 = 0;
			let temp = [];
			let temp2 = [];
			let  _0x2b6e63 = [];
			let  _0x47dfb5 = null;
			for (let i=0; i<=Board.virtualTiles.length; i++) {
				var _0x9497e = 0;
				let t1v = Board.virtualTiles[i]; t1v = t1v ? t1v.value : "";
				let t2v = Board.virtualTiles[i+1]; t2v = t2v ? t2v.value : "";
				if (t1v == Tiles.okey && t2v && i != 15) {
					_0x9497e = 1;
					if (t2v == "000") {
						t1v = String(Tiles.okey - 1);
					} else {
						if (t2v % 100 == 1) {
							t1v = String(t2v * 1 + 12);
						} else {
							t1v = String(t2v - 1);
						}
					}
				}
				if (t1v == Tiles.okey && Board.virtualTiles[i - 1].value && (Board.virtualTiles[i - 1].value % 100 != 13 && (settingsType == 2 || settingsType == 3) || settingsType == 1)) {
					_0x9497e = 1;
					if (Board.virtualTiles[i - 1].value == "000") {
						t1v = String(Tiles.okey * 1 + 1);
					} else {
						t1v = String(Board.virtualTiles[i - 1].value * 1 + 1);
					}
				}
				if (t1v == "000") {
					t1v = String(Tiles.okey);
				}
				var _0x3c1af0 = 0;
				var _0x510804 = parseInt(t1v);
				if (Board.virtualTiles[i]) {
					temp.push(_0x510804);
					if (_0x9497e == 1) {
						_0x2b6e63.push(temp.length - 1);
					}
					_0x9497e = 0;
					_0x3c1af0 = 1;
				}
				if (_0x3c1af0 == 0 || i == 15) {
					if (temp.length > 2) {
						_0x5b3924 = 1;
						for (let j=0; j<temp.length; j++) {
							if (j > 0) {
								if (temp[j] - temp[j - 1] == 1 || j == temp.length - 1 && (temp[j - 1] - temp[j] == 12 || temp[j - 1] == Tiles.okey) && settingsType == 1) {
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
								var _0x4b310e = Board.virtualTiles.findIndex(e => (e._value || e.value) == temp[k]);
								if (_0x4b310e != -1) {
									Board.virtualTiles[_0x4b310e] = "";
								}
							}
							temp2.push("");
						}
					}
					temp = [];
					_0x2b6e63 = [];
					_0x47dfb5 = null;
					if (i == 15 && Board.virtualTiles[i]) {
						temp.push(_0x510804);
					}
				}
			}
			Board.virtualTiles = Board.tiles.slice();
			_0x2b6e63 = null;
			_0x47dfb5 = null;
			temp = [];
			let temp1 = [];
			for (let i=0; i<=Board.virtualTiles.length; i++) {
				let t1v = Board.virtualTiles[i]; t1v = t1v ? t1v.value : "";
				let t2v = Board.virtualTiles[i+1]; t2v = t2v ? t2v.value : "";
				if (t1v == Tiles.okey && t2v && i != 15) {
					_0x9497e = 1;
					if (t2v == "000") {
						t1v = String(Tiles.okey % 100 + 900);
					} else {
						t1v = String(t2v % 100 + 900);
					}
				}
				if (t1v == Tiles.okey && Board.virtualTiles[i - 1].value) {
					_0x9497e = 1;
					if (Board.virtualTiles[i - 1].value == "000") {
						t1v = String(Tiles.okey % 100 + 900);
					} else {
						t1v = String(Board.virtualTiles[i - 1].value % 100 + 900);
					}
				}
				if (t1v == "000") {
					t1v = String(Tiles.okey % 100 + 800);
				}
				var _0x3c1af0 = 0;
				var _0x510804 = parseInt(t1v);
				if (Board.virtualTiles[i]) {
					temp.push(_0x510804);
					_0x3c1af0 = 1;
				}
				if (_0x3c1af0 == 0 || i == 15) {
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
							temp2.push("");
						}
					}
					temp = [];
					_0x2b6e63 = null;
					_0x47dfb5 = null;
					if (i == 15 && Board.virtualTiles[i]) {
						temp.push(_0x510804);
					}
				}
			}
			Tiles.User1Seri = [];
			Tiles.User2Seri = [];
			Tiles.User3Seri = [];
			Tiles.User4Seri = [];
			for (let i=0; i<temp2.length; i++) {
				switch (activePlayer) {
					case 1:
						Tiles.User1Seri.push(temp2[i]);
						if (temp2[i]) Tiles.User1Total += temp2[i] % 100;
						break;
					case 2:
						Tiles.User2Seri.push(temp2[i]);
						if (temp2[i]) Tiles.User2Total += temp2[i] % 100;
						break;
					case 3:
						Tiles.User3Seri.push(temp2[i]);
						if (temp2[i]) Tiles.User3Total += temp2[i] % 100;
						break;
					case 4:
						Tiles.User4Seri.push(temp2[i]);
						if (temp2[i]) Tiles.User4Total += temp2[i] % 100;
						break;
				}
			}
			if (activePlayer == 1) {
				let sign = APP.content.find(`.player.user .melded`);
				if (openStatusSort[1] == 0 && openStatusDouble[1] == 0) {
					sign.removeClass("hidden").find("h4").html(Tiles.User1Total);
					sign.toggleClass("red", Tiles.User1Total < openLimitG);
				}
				if (openStatusSort[1] == 1 || openStatusDouble[1] == 1) {
					sign.removeClass("hidden").find("h4").html(countBoard(1));
					sign.addClass("red");
				}
			}
			return (_0x257872 == Tiles.tileLimit && Board.virtualTiles.filter(e => e != "").length == Tiles.tileLimit) ? 1 : 0;
		},
		checkWinDouble() {
			Board.virtualTiles = Board.tiles.slice();
			Tiles.User1TotalDouble = 0;
			Tiles.User2TotalDouble = 0;
			Tiles.User3TotalDouble = 0;
			Tiles.User4TotalDouble = 0;
			Tiles.UserTotalDouble = 0;
			var _0x481582 = 0;
			var _0x1290e9 = [];
			for (let i=0; i<Board.virtualTiles.length; i++) {
				var _0x171c8e = parseInt(Board.virtualTiles[i].value);
				let t1v = Board.virtualTiles[i]; t1v = t1v ? t1v.value : "";
				let t2v = Board.virtualTiles[i+1]; t2v = t2v ? t2v.value : "";
				if ((t1v == t2v || t1v == Tiles.okey || t2v == Tiles.okey) && t1v != "" && t2v != "") {
					_0x481582++;
					var _0xcba5d6;
					var _0x5ad174;
					_0xcba5d6 = t1v;
					_0x5ad174 = t2v;
					if (t1v == "000") {
						_0xcba5d6 = Tiles.okey % 100 + 800;
					}
					if (t2v == "000") {
						_0x5ad174 = Tiles.okey % 100 + 800;
					}
					if (t1v == Tiles.okey) {
						_0xcba5d6 = _0x5ad174 % 100 + 900;
					}
					if (t2v == Tiles.okey) {
						_0x5ad174 = _0xcba5d6 % 100 + 900;
					}
					_0x1290e9.push(String(_0xcba5d6));
					_0x1290e9.push(String(_0x5ad174));
					_0x1290e9.push("");
					i++;
					if (settingsType == 1 || settingsType == 2 || settingsType == 3) {
						Tiles.UserTotalDouble++;
					}
				}
			}
			Tiles.User1Double = [];
			Tiles.User2Double = [];
			Tiles.User3Double = [];
			Tiles.User4Double = [];
			for (let i=0; i<_0x1290e9.length; i++) {
				if (activePlayer == 1) {
					Tiles.User1TotalDouble = Tiles.UserTotalDouble;
					Tiles.User1Double.push(_0x1290e9[i]);
				}
				if (activePlayer == 2) {
					Tiles.User2TotalDouble = Tiles.UserTotalDouble;
					Tiles.User2Double.push(_0x1290e9[i]);
				}
				if (activePlayer == 3) {
					Tiles.User3TotalDouble = Tiles.UserTotalDouble;
					Tiles.User3Double.push(_0x1290e9[i]);
				}
				if (activePlayer == 4) {
					Tiles.User4TotalDouble = Tiles.UserTotalDouble;
					Tiles.User4Double.push(_0x1290e9[i]);
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
						sign.removeClass("hidden").find("h4").html(Tiles.User1TotalDouble);
						sign.toggleClass("red", Tiles.User1TotalDouble < openLimitDouble);
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
		countBoard(seat) {
			switch (seat) {
				case 1: Board.tiles = Board.tiles1.slice(); break;
				case 2: Board.tiles = Board.tiles2.slice(); break;
				case 3: Board.tiles = Board.tiles3.slice(); break;
				case 4: Board.tiles = Board.tiles4.slice(); break;
			}
			var val = 0;
			for (let i=0; i<Board.tiles.length; i++) {
				if (Board.tiles[i]) {
					if (Board.tiles[i].value == "000") {
						val += parseInt(Tiles.okey % 100);
					} else {
						val += Board.tiles[i].value % 100;
					}
				}
			}
			return val;
		},
		checkLeft(seat) {
			let tiles = Board.tiles.lastIndexOf('') * 1 + 1;
			let pfl = perFull.length;
			let tilesCopy = Board.tiles.slice();
			
			if (Board[`area${seat}items`].length < 1) return 0;
			let areaItemLast = Board[`area${seat}items`][Board[`area${seat}items`].length - 1];
			let areaSeat = seat;

			this.place(areaItemLast, tiles);
			this.arrange(activePlayer);
			this.checkWin();
			
			var seatTotal = Board[`User${seat}Total`];
			var _0x19ab28 = areaItemLast.split('-');
			_0x19ab28 = _0x19ab28[1] - 1;
			_0x19ab28 = data[_0x19ab28];

			if (perFull.length > pfl && (openStatusSort[activePlayer] == 0 && seatTotal > openLimit || openStatusSort[activePlayer] == 1 || settingsType == 1) || _0x19ab28 == Tiles.okey && settingsType == 1) {
				Board.tiles = tilesCopy.slice();
				this.updateBoard();
				this.arrange(activePlayer);
				return 1;
			} else {
				this.movetoArea(areaItemLast, areaSeat, 1);
				Board.tiles = tilesCopy.slice();
				this.updateBoard();
				this.arrange(activePlayer);
				return 0;
			}
		},
		putToTable(seat, sortType) {
			Tiles.UserTotal = 0;
			Tiles.UserTotalDouble = 0;
			let diff = 0;
			if (seat == 1) {
				Board.tiles = Board.tiles1.slice();
				// boardPlaces = boardPlaces1.slice();
				if (sortType == 1) this.checkWin();
				if (sortType == 2) this.checkWinDouble();
				Tiles.UserSeri = Tiles.User1Seri.slice();
				Tiles.UserDouble = Tiles.User1Double.slice();
				Tiles.UserTotal = Tiles.User1Total;
				Tiles.UserTotalDouble = Tiles.User1TotalDouble;
			}
			if (seat == 2) {
				Board.tiles = Board.tiles2.slice();
				// boardPlaces = boardPlaces2.slice();
				if (sortType == 1) this.checkWin();
				if (sortType == 2) this.checkWinDouble();
				Tiles.UserSeri = Tiles.User2Seri.slice();
				Tiles.UserDouble = Tiles.User2Double.slice();
				Tiles.UserTotal = Tiles.User2Total;
				Tiles.UserTotalDouble = Tiles.User2TotalDouble;
			}
			if (seat == 3) {
				Board.tiles = Board.tiles3.slice();
				// boardPlaces = boardPlaces3.slice();
				if (sortType == 1) this.checkWin();
				if (sortType == 2) this.checkWinDouble();
				Tiles.UserSeri = Tiles.User3Seri.slice();
				Tiles.UserDouble = Tiles.User3Double.slice();
				Tiles.UserTotal = Tiles.User3Total;
				Tiles.UserTotalDouble = Tiles.User3TotalDouble;
			}
			if (seat == 4) {
				Board.tiles = Board.tiles4.slice();
				// boardPlaces = boardPlaces4.slice();
				if (sortType == 1) this.checkWin();
				if (sortType == 2) this.checkWinDouble();
				Tiles.UserSeri = Tiles.User4Seri.slice();
				Tiles.UserDouble = Tiles.User4Double.slice();
				Tiles.UserTotal = Tiles.User4Total;
				Tiles.UserTotalDouble = Tiles.User4TotalDouble;
			}

			if (Tiles.UserTotal == 0 && sortType == 1 || Tiles.UserTotalDouble == 0 && sortType == 2) {
				if (sortType == 1 && seat == 1 && AIStatus == 0) {
					this.popMessage("El acabilmeniz icin elinizde en az 1 per olmasi gerkiyor!");
				}
				if (sortType == 2 && seat == 1 && AIStatus == 0) {
					this.popMessage("El acabilmeniz icin elinizde en az 1 cift olmasi gerkiyor!");
				}
				return 0;
			}
			// console.log(seat, UserTotal, sortType);

			var _0x488971 = Tiles.UserSeri.filter(e => e != '').slice();
			var _0x5869f9 = Board.tiles.filter(e => e != '').slice();
			if (_0x5869f9.length <= Tiles.tileLimits[seat]) {
				if (seat == 1) {
					this.popMessage("Önce yerden tas almaniz gerekiyor!");
				}
				return 0;
			}
			if (_0x488971.length > Tiles.tileLimit) {
				this.popMessage("Istakanizda saqa atacak tas kalmadiqi icin taslarinizi geri toplamaniz gerekiyor");
			}
			if (sortType == 1 && openStatusDouble[seat] == 1) {
				if (seat == 1 && AIStatus == 0) {
					this.popMessage("Cift actiqiniz icin, artik seri acamazsiniz!");
					openPunish[seat] = 0;
				}
				return 0;
			}
			if (sortType == 2 && openStatusSort[seat] == 1 && Tiles.handleDouble == 0) {
				if (seat == 1 && AIStatus == 0) {
					this.popMessage("Seri actiqiniz icin, artik cift acamazsiniz!");
				}
				return 0;
			}
			if (sortType == 1 && Tiles.UserTotal < openLimit && openStatusSort[seat] == 0) {
				if (seat == 1 && AIStatus == 0) {
					this.popMessage("Seri acabilmeniz icin toplam " + openLimit + " puana ulasmasi gerekiyor!");
					openPunish[seat] = 1;
				}
				if (seat != 1 || AIStatus == 1) {
					return 0;
				}
			}
			if (sortType == 2 && Tiles.UserTotalDouble < openLimitDouble && openStatusDouble[seat] == 0 && Tiles.handleDouble == 0) {
				if (seat == 1 && AIStatus == 0) {
					this.popMessage("Cift acabilmeniz icin toplam en az " + openLimitDouble + " seriniz olmasi gerekiyor!");
					openPunish[seat] = 1;
				}
				if (seat != 1 || AIStatus == 1) {
					return 0;
				}
			}

			if (Tiles.UserTotalDouble == 0 && sortType == 2 && seat == 1 && AIStatus == 0) {
				this.popMessage("Cift acabilecek tasiniz yok!");
			}

			var setTiles;
			if (sortType == 1) {
				if (openStatusSort[seat] == 0) {
					// UI update
					APP.game.dispatch({ type: "user-initial-meld", seat, total: Tiles.UserTotal });

					console.log(seat + " seri acti: " + UserTotal);
					if (settingsIncrease == 1) {
						openLimitLast = openLimit;
						openLimit = Tiles.UserTotal * 1 + 1;
						// $("table-sort-score").innerHTML = openLimit;
					}
				}
				openStatusSort[seat] = 1;
				setTiles = Tiles.UserSeri.slice();
				if (seat == 1 && Tiles.UserTotal >= openLimitLast) {
					this.buttonActivePassive("handle-sort", 1);
					this.buttonActivePassive("handle-double", 1);
					firstOpenCont = 1;
				}
			}
			if (sortType == 2) {
				if (openStatusDouble[seat] == 0) {
					console.log(seat + " cift acti : " + Tiles.UserTotalDouble);
					if (settingsIncrease == 1 && Tiles.UserTotalDouble >= openLimitDouble) {
						openLimitDoubleLast = openLimitDouble;
						openLimitDouble = Tiles.UserTotalDouble * 1 + 1;
						if (settingsType == 3) {
							openLimitDouble = openLimitD;
						}
						// $("table-double-score").innerHTML = openLimitDouble;
					}
				}
				if (Tiles.handleDouble == 0) {
					openStatusDouble[seat] = 1;
					if (seat == 1 && Tiles.UserTotalDouble >= openLimitDoubleLast) {
						this.buttonActivePassive("handle-sort", 1);
						this.buttonActivePassive("handle-double", 1);
						firstOpenCont = 1;
					}
				}
				setTiles = UserDouble.slice();
			}
			if (!collect[0]) {
				collect = [];
				// collectPlaces = boardPlaces.slice();
				collectTiles = Board.tiles.slice();
			}
			var _0x484f1e = seat;
			if (Tiles.handleDouble == 1) {
				_0x484f1e = doubleHandleTo;
			}
			
			for (let i=0; i<setTiles.length; i++) {
				if (setTiles[i] != '') {
					var _0x897419 = Board.tiles.findIndex(e => e.value == String(setTiles[i]));
					if (setTiles[i] - setTiles[i] % 100 == 900) {
						_0x897419 = Board.tiles.findIndex(e => e.value == String(Tiles.okey));
					}
					if (setTiles[i] - setTiles[i] % 100 == 800) {
						_0x897419 = Board.tiles.findIndex(e => e.value == "000");
					}
					if (_0x897419 !== -1) {
						this.moveToTable(_0x484f1e, setTiles[i], -1, -1, sortType);
						tileLimits[seat]--;
					}
				} else {
					if (sortType == 1) {
						tableH[_0x484f1e]++;
					}
					if (sortType == 2) {
						tableHdouble[_0x484f1e]++;
					}
					diff = 0;
					lastStone = '';
				}
				var _0x4fe46a = activePlayer;
				activePlayer = seat;
				this.updateBoards();
				activePlayer = _0x4fe46a;
			}
			var _0x2c9a7e = Board.tiles.filter(e => !!e).slice();
			if (_0x2c9a7e.length == 0) {
				if (seat != 1 || AIStatus == 1) {
					this.collectItBack();
				} else {
					this.popMessage("Istakanizsa saqa atabiceqiniz tas kalmadi.");
				}
			}
			Tiles.handleDouble = 0;
			if (seat == 1) {
				this.markIt(1);
				if (sortType == 1) {
					this.checkWin();
				}
				if (sortType == 2) {
					this.checkWinDouble();
				}
			}
			// animate set of tiles
			return APP.game.dispatch({ type: "meld-series", from: seat, setTiles });
		},
		markIt() {
			console.log("function markIt");
		}
	};

	return { Engine, Board, Tiles, AI };

})();
