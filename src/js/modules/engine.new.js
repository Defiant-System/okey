
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
		settingsPunish = 0,
		AIcont = 0,
		AIStatus = 0;

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
		openStatusDouble = [0, 0, 0, 0, 0],
		openPunish = [0, 0, 0, 0, 0];

	let Board = {
			tiles: [],
			tiles1: [],
			tiles2: [],
			tiles3: [],
			tiles4: [],
			gameOver: 0,
			winWithOkey: 0,
			winWithDouble: 0,
			handleDouble: 0,
			doubleHandleTo: 0,
			leftHandCont: 0,
			leftHandTile: 0,
			leftHandContTemp: 0,
			leftHandTileTemp: 0,
			sayTableTiles: 0,
			sayTableTilesTemp: 0,
			getOkeyKont: 0,
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
			collect: [],
			collectTiles: [],
			tableH: [0, 0, 0, 0, 0],
			tableHdouble: [0, 0, 0, 0, 0],
			tableUser1: new Array(7).fill(0).map(() => new Array(13).fill(0)),
			tableUser2: new Array(7).fill(0).map(() => new Array(13).fill(0)),
			tableUser3: new Array(7).fill(0).map(() => new Array(13).fill(0)),
			tableUser4: new Array(7).fill(0).map(() => new Array(13).fill(0)),
			tableUserTiles1: new Array(7).fill(0).map(() => new Array(13).fill(0)),
			tableUserTiles2: new Array(7).fill(0).map(() => new Array(13).fill(0)),
			tableUserTiles3: new Array(7).fill(0).map(() => new Array(13).fill(0)),
			tableUserTiles4: new Array(7).fill(0).map(() => new Array(13).fill(0)),
			tableDoubleUser1: new Array(14).fill(0).map(() => new Array(2).fill(0)),
			tableDoubleUser2: new Array(14).fill(0).map(() => new Array(2).fill(0)),
			tableDoubleUser3: new Array(14).fill(0).map(() => new Array(2).fill(0)),
			tableDoubleUser4: new Array(14).fill(0).map(() => new Array(2).fill(0)),
			tableDoubleUserTiles1: new Array(14).fill(0).map(() => new Array(2).fill(0)),
			tableDoubleUserTiles2: new Array(14).fill(0).map(() => new Array(2).fill(0)),
			tableDoubleUserTiles3: new Array(14).fill(0).map(() => new Array(2).fill(0)),
			tableDoubleUserTiles4: new Array(14).fill(0).map(() => new Array(2).fill(0)),
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

			this.checkThrow(activePlayer);
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
				this.checkThrow(activePlayer);
			} else {
				// if not throw tile, anything to do?
			}

			// update value
			this.checkWin();
		},
		checkThrow(seat) {
			let discard = APP.game.els.discard[`player${(seat-1) || 4}`].find(".tile").get(0);
			let tile = { uid: discard.data("uid"), value: discard.data("id") };

			if (Board.leftHandCont) {
				this.popMessage("Soldan aldiqiniz tasi kullanmadan tas atamazsiniz.");
				// this.moveBack(tile);
				return;
			}
			var _0x335bad = Board.tiles.filter(e => !!e).slice();
			// if (_0x335bad.length <= Board.tileLimits[seat]) {
			// 	this.popMessage("Istakanizda " + Board.tileLimits[seat] + " tas var, önce tas almaniz gerekiyor.");
			// 	// this.moveBack(tile);
			// 	return;
			// }
			if (openPunish[seat] == 2) {
				this.popMessage("Elinizi acmaniz ya da taslarinizi toplamaniz gerekiyor.");
				// this.moveBack(tile);
				return;
			}
			if (openPunish[seat] == 1 && _0x335bad.length > 1) {
				openPunish[seat] = 2;
				// this.changePoint(punishOffset, seat, 1);
				this.popMessage("Yanlis el actiniz " + punishOffset + " puan ceza yediniz.");
				// this.moveBack(tile);
				return;
			}
			// var _0x17313c = boardPlaces.indexOf(tile);
			// if (_0x17313c !== -1) {
			// 	if (activePlayer == 1) {
			// 		activePlayerCont = 0;
			// 		this.buttonActivePassive("collect", 0);
			// 		firstOpenCont = 0;
			// 	}
			// 	boardPlaces[_0x17313c] = 0;
			// 	Board.tiles[_0x17313c - 1] = '';
				this.movetoArea(tile, seat);
			// }
			// var _0x335bad = Board.tiles.filter(e => !!e).slice();
			if (_0x335bad.length == 0) {
				if (collect.length == 21) {
					this.popMessage("Oyuncu elden bitti!");
					openAllHand = 1;
				} else {
					this.popMessage("Oyun Bitti: Istakada Tas kalmadi");
				}
				winnerPlayer = activePlayer;
				this.gameOver(1);
			}
		},
		movetoArea(tile, seat, _0x1c04c4) {
			// var _0x10dd5c = Board.tiles.filter(e => !!e).slice();
			// var _0x536f0b = tile.split('-');
			// if (handleItems.indexOf(data[_0x536f0b[1] - 1]) > -1 && _0x10dd5c.length > 0 && _0x1c04c4 != 1) {
			// 	this.popMessage(users[activePlayer] + " islek tas atti, " + punishOffset + " ceza puani yedi!");
			// 	// this.changePoint(punishOffset, activePlayer, 1);
			// }
			// if (Tiles.okey == data[_0x536f0b[1] - 1] && _0x1c04c4 != 1) {
			// 	if (_0x10dd5c.length > 0 && (settingsType == 2 || settingsType == 3)) {
			// 		this.popMessage(users[activePlayer] + " yana okey atti, " + punishOffset + " ceza puani yedi!");
			// 		// this.changePoint(punishOffset, activePlayer, 1);
			// 	} else {
			// 		this.popMessage(users[activePlayer] + " yana OKEY atti!");
			// 		PointOkeyCont = 1;
			// 	}
			// }
			var _0x2cd34c = 0;
			if (seat == 1) {
				Board.area1Count++;
				_0x2cd34c = Board.area1items.length;
				_0x2cd34c = Board.area1Count;
			}
			if (seat == 2) {
				Board.area2Count++;
				_0x2cd34c = Board.area2items.length;
				_0x2cd34c = Board.area2Count;
			}
			if (seat == 3) {
				Board.area3Count++;
				_0x2cd34c = Board.area3items.length;
				_0x2cd34c = Board.area3Count;
			}
			if (seat == 4) {
				Board.area4Count++;
				_0x2cd34c = Board.area4items.length;
				_0x2cd34c = Board.area4Count;
			}
			// var _0x150c8a = $("area-" + seat).offsetLeft;
			// var _0x10c455 = $("area-" + seat).offsetTop;
			// var _0x4025c6 = $("area-" + seat).offsetHeight;
			// var _0x22e686 = $("area-" + seat).offsetWidth;
			// $(tile).style.transition = "all 0.5s";
			// $(tile).style.zIndex = _0x2cd34c * 1 + 1;
			// $(tile).style.left = _0x150c8a * 1 + _0x22e686 * 0.09 + 'px';
			// $(tile).style.top = _0x10c455 * 1 + _0x4025c6 * 0.09 + 'px';
			// $(tile).style.display = "block";
			// $(tile).children[0].style.display = 'block';
			if (Tiles.tilesLeft.length == 0) {
				this.popMessage("Oyun Bitti: Ortada Cekecek Tas kalmadi");
				Board.gameOver = 1;
				if (settingsType == 1) {
					this.message(2);
				}
				if (settingsType == 2 || settingsType == 3) {
					this.gameOver(1);
				}
			}
			if (seat == 1 && _0x1c04c4 != 1) {
				laps++;
				if (Board.area1items.length == 0) {
					this.playAudio(3);
				} else {
					this.playAudio(1);
				}
				Board.area1items.push(tile);
			}
			if (seat == 2 && _0x1c04c4 != 1) Board.area2items.push(tile);
			if (seat == 3 && _0x1c04c4 != 1) Board.area3items.push(tile);
			if (seat == 4 && _0x1c04c4 != 1) Board.area4items.push(tile);

			if (_0x1c04c4 != 1 && Board.gameOver == 0) {
				Board.gameMoveCont = 0;
				Board.timmerNextPlayer = setTimeout(() => {
					if (Board.gameOver == 1) return 0;
					
					if (seat == 1) AI.think(2);
					if (seat == 2) AI.think(3);
					if (seat == 3) AI.think(4);

					if (seat == 4) {
						activePlayer = 1;
						this.getRack(activePlayer);
						if (AIStatus == 1) {
							AI.think(1);
						} else {
							AIcont = 0;
							this.changePlayer(1);
						}
					}
					Board.gameMoveCont = 1;
					return 0;
				}, 100);
			}
			this.updateBoard();
			if (Board.gameOver == 1 && settingsType == 1) {
				this.gameOver(1);
			}
		},
		arrange(seat, type=1, arr) {
			this.getRack(seat);
			if (arr) Board.tiles = arr.slice();

			let arr1 = [];
			let arr2 = [];
			let arr3 = [];
			let arr4 = [];
			let arr5 = [];
			let min = 0;

			okeyCont = 0;
			if (activePlayer == 1) min = 1;
			
			if (settingsGameLevel > 1 || min == 1) {
				let oI = Board.tiles.findIndex(e => e.value == Tiles.okey);
				if (oI != -1) {
					Board.tiles[oI].value = "800";
					okeyCont++;
				}
				oI = Board.tiles.findIndex(e => e.value == Tiles.okey);
				if (oI != -1) {
					Board.tiles[oI].value = "800";
					okeyCont++;
				}
				oI = Board.tiles.findIndex(e => e.value == "000");
				if (oI != -1) {
					Board.tiles[oI].value = String(Tiles.okey);
				}
				oI = Board.tiles.findIndex(e => e.value == "000");
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
					this.popMessage("Oyun Bitti: " + users[activePlayer] + " Seri acti");
					winnerPlayer = activePlayer;
					this.gameOver(1);
				}
			}
			
			if (type == 2 && this.checkWinDouble()) {
				if (AIStatus == 0 && activePlayer == 1) {} else {
					this.popMessage("Oyun Bitti: " + users[activePlayer] + " cift acti");
					winnerPlayer = activePlayer;
					this.gameOver(1);
				}
			}
		},
		checkWin() {
			Board.virtualTiles = Board.tiles.slice();
			Board.User1Total = 0;
			Board.User2Total = 0;
			Board.User3Total = 0;
			Board.User4Total = 0;
			Board.UserTotal = 0;
			let  _0x5b3924 = 0;
			let  _0x257872 = 0;
			let temp = [];
			let temp1 = [];
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
						if (t2v % 100 == 1) t1v = String(t2v * 1 + 12);
						else t1v = String(t2v - 1);
					}
				}
				if (t1v == Tiles.okey && Board.virtualTiles[i - 1].value && (Board.virtualTiles[i - 1].value % 100 != 13 && (settingsType == 2 || settingsType == 3) || settingsType == 1)) {
					_0x9497e = 1;
					if (Board.virtualTiles[i - 1].value == "000") t1v = String(Tiles.okey * 1 + 1);
					else t1v = String(Board.virtualTiles[i - 1].value * 1 + 1);
				}
				if (t1v == "000") t1v = String(Tiles.okey);
				
				var _0x3c1af0 = 0;
				var _0x510804 = parseInt(t1v);
				if (Board.virtualTiles[i]) {
					temp.push(Board.virtualTiles[i]);
					if (_0x9497e == 1) _0x2b6e63.push(temp.length - 1);
					
					_0x9497e = 0;
					_0x3c1af0 = 1;
				}
				if (_0x3c1af0 == 0 || i == 15) {
					if (temp.length > 2) {
						_0x5b3924 = 1;
						for (let j=0; j<temp.length; j++) {
							if (j > 0) {
								if (temp[j].value - temp[j-1].value == 1 
									|| j == temp.length - 1 
									&& (temp[j-1].value - temp[j].value == 12 
									|| temp[j-1].value == Tiles.okey) && settingsType == 1) {
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
									if (_0x2b6e63[l] == k) temp[k].value = temp[k].value % 100 + 900;
								}
								if (temp[k].value == Tiles.okey) {
									temp[k].value = temp[k].value % 100 + 800;
								}
								temp2.push(temp[k]);
								var bvLen = Board.virtualTiles.findIndex(e => e.value == temp[k].value);
								if (bvLen != -1) Board.virtualTiles[bvLen] = "";
							}
							temp2.push("");
						}
					}
					temp = [];
					_0x2b6e63 = [];
					_0x47dfb5 = null;
					if (i == 15 && Board.virtualTiles[i]) {
						temp.push(Board.virtualTiles[i]);
					}
				}
			}
			Board.virtualTiles = Board.tiles.slice();
			_0x2b6e63 = null;
			_0x47dfb5 = null;
			temp = [];
			temp1 = [];
			for (let i=0; i<=Board.virtualTiles.length; i++) {
				let t1v = Board.virtualTiles[i]; t1v = t1v ? t1v.value : "";
				let t2v = Board.virtualTiles[i+1]; t2v = t2v ? t2v.value : "";
				if (t1v == Tiles.okey && t2v && i != 15) {
					_0x9497e = 1;
					if (t2v == "000") t1v = String(Tiles.okey % 100 + 900);
					else t1v = String(t2v % 100 + 900);
				}
				if (t1v == Tiles.okey && Board.virtualTiles[i - 1].value) {
					_0x9497e = 1;
					if (Board.virtualTiles[i - 1].value == "000") t1v = String(Tiles.okey % 100 + 900);
					else t1v = String(Board.virtualTiles[i - 1].value % 100 + 900);
				}
				if (t1v == "000") t1v = String(Tiles.okey % 100 + 800);
				
				var _0x3c1af0 = 0;
				var _0x510804 = parseInt(t1v);
				if (Board.virtualTiles[i]) {
					temp.push(Board.virtualTiles[i]);
					_0x3c1af0 = 1;
				}
				if (_0x3c1af0 == 0 || i == 15) {
					if (temp.length > 2) {
						temp1 = [];
						_0x5b3924 = 1;
						for (let j=0; j<temp.length; j++) {
							if (j > 0) {
								if (temp[j].value % 100 == temp[j-1].value % 100
									&& (temp[j].value != temp[j-1].value
									|| (temp[j].value / 900 > 1
									&& temp[j-1].value / 900) > 1)
									&& (temp[j].value != temp[j-2]?.value
									|| (temp[j].value / 900 > 1
									&& temp[j-2].value / 900) > 1)
									&& temp[j].value != temp[j-3]?.value
									|| (temp[j].value / 900 > 1
									&& temp[j-3].value / 900) > 1) {
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
						temp.push(Board.virtualTiles[i]);
					}
				}
			}
			Board.User1Seri = [];
			Board.User2Seri = [];
			Board.User3Seri = [];
			Board.User4Seri = [];
			for (let i=0; i<temp2.length; i++) {
				switch (activePlayer) {
					case 1:
						Board.User1Seri.push(temp2[i]);
						if (temp2[i]) Board.User1Total += temp2[i].value % 100;
						break;
					case 2:
						Board.User2Seri.push(temp2[i]);
						if (temp2[i]) Board.User2Total += temp2[i].value % 100;
						break;
					case 3:
						Board.User3Seri.push(temp2[i]);
						if (temp2[i]) Board.User3Total += temp2[i].value % 100;
						break;
					case 4:
						Board.User4Seri.push(temp2[i]);
						if (temp2[i]) Board.User4Total += temp2[i].value % 100;
						break;
				}
			}
			if (activePlayer == 1) {
				let sign = APP.content.find(`.player.user .melded`);
				if (openStatusSort[1] == 0 && openStatusDouble[1] == 0) {
					sign.removeClass("hidden").find("h4").html(Board.User1Total);
					sign.toggleClass("red", Board.User1Total < openLimitG);
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
			Board.User1TotalDouble = 0;
			Board.User2TotalDouble = 0;
			Board.User3TotalDouble = 0;
			Board.User4TotalDouble = 0;
			Board.UserTotalDouble = 0;
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
						Board.UserTotalDouble++;
					}
				}
			}
			Board.User1Double = [];
			Board.User2Double = [];
			Board.User3Double = [];
			Board.User4Double = [];
			for (let i=0; i<_0x1290e9.length; i++) {
				if (activePlayer == 1) {
					Board.User1TotalDouble = Board.UserTotalDouble;
					Board.User1Double.push(_0x1290e9[i]);
				}
				if (activePlayer == 2) {
					Board.User2TotalDouble = Board.UserTotalDouble;
					Board.User2Double.push(_0x1290e9[i]);
				}
				if (activePlayer == 3) {
					Board.User3TotalDouble = Board.UserTotalDouble;
					Board.User3Double.push(_0x1290e9[i]);
				}
				if (activePlayer == 4) {
					Board.User4TotalDouble = Board.UserTotalDouble;
					Board.User4Double.push(_0x1290e9[i]);
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
						sign.removeClass("hidden").find("h4").html(Board.User1TotalDouble);
						sign.toggleClass("red", Board.User1TotalDouble < openLimitDouble);
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
		changePlayer(seat) {
			activePlayer = seat;
			// if (activePlayer == 4) activePlayerCont = 1;

			APP.game.els.el.find(`.seat.highlight`).removeClass("highlight");
			if (activePlayer === 1) {
				APP.game.els.el.find(`.seat[data-seat="${activePlayer}"]`)
					.data({ status: "THINKING" })
					.cssSequence("thinking", "transitionend", el => {
						console.log("force move");
					});
			} else {
				APP.game.els.el.find(`.seat[data-seat="${activePlayer}"]`)
					.addClass("highlight");
			}

			Board.collect = [];
			Board.collectPlaces = [];
			Board.collectTiles = [];
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
			var _0x19ab28 = areaItemLast.value; // areaItemLast.split('-');
			// _0x19ab28 = _0x19ab28[1] - 1;
			// _0x19ab28 = data[_0x19ab28];

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
		place(tileId, pos, seat) {
			if (!seat) seat = activePlayer;
			
			try {
				// var _0x363bc5 = tileId.split("-");
				// _0x363bc5 = _0x363bc5[1] - 1;
				
				// boardPlaces[pos] = tileId;
				// boardTiles[pos-1] = data[_0x363bc5];
				this.updateBoard();
			} catch {
				this.popMessage("hata:" + tileId);
				this.popMessage("Hata-boardTiles");
				this.popMessage(boardTiles);
			}
		},
		putToTable(seat, sortType) {
			Board.UserTotal = 0;
			Board.UserTotalDouble = 0;
			let diff = 0;

			switch (seat) {
				case 1:
					Board.tiles = Board.tiles1.slice();
					// boardPlaces = boardPlaces1.slice();
					if (sortType == 1) this.checkWin();
					if (sortType == 2) this.checkWinDouble();
					Board.UserSeri = Board.User1Seri.slice();
					Board.UserDouble = Board.User1Double.slice();
					Board.UserTotal = Board.User1Total;
					Board.UserTotalDouble = Board.User1TotalDouble;
					break;
				case 2:
					Board.tiles = Board.tiles2.slice();
					// boardPlaces = boardPlaces2.slice();
					if (sortType == 1) this.checkWin();
					if (sortType == 2) this.checkWinDouble();
					Board.UserSeri = Board.User2Seri.slice();
					Board.UserDouble = Board.User2Double.slice();
					Board.UserTotal = Board.User2Total;
					Board.UserTotalDouble = Board.User2TotalDouble;
					break;
				case 3:
					Board.tiles = Board.tiles3.slice();
					// boardPlaces = boardPlaces3.slice();
					if (sortType == 1) this.checkWin();
					if (sortType == 2) this.checkWinDouble();
					Board.UserSeri = Board.User3Seri.slice();
					Board.UserDouble = Board.User3Double.slice();
					Board.UserTotal = Board.User3Total;
					Board.UserTotalDouble = Board.User3TotalDouble;
					break;
				case 4:
					Board.tiles = Board.tiles4.slice();
					// boardPlaces = boardPlaces4.slice();
					if (sortType == 1) this.checkWin();
					if (sortType == 2) this.checkWinDouble();
					Board.UserSeri = Board.User4Seri.slice();
					Board.UserDouble = Board.User4Double.slice();
					Board.UserTotal = Board.User4Total;
					Board.UserTotalDouble = Board.User4TotalDouble;
					break;
			}

			if (Board.UserTotal == 0 && sortType == 1 || Board.UserTotalDouble == 0 && sortType == 2) {
				if (sortType == 1 && seat == 1 && AIStatus == 0) {
					this.popMessage("El acabilmeniz icin elinizde en az 1 per olmasi gerkiyor!");
				}
				if (sortType == 2 && seat == 1 && AIStatus == 0) {
					this.popMessage("El acabilmeniz icin elinizde en az 1 cift olmasi gerkiyor!");
				}
				return 0;
			}

			var seriTiles = Board.UserSeri.filter(e => !!e).slice();
			var boardTiles = Board.tiles.filter(e => !!e).slice();
			if (boardTiles.length <= Board.tileLimits[seat]) {
				if (seat == 1) {
					this.popMessage("Önce yerden tas almaniz gerekiyor!");
				}
				return 0;
			}
			if (seriTiles.length > Tiles.tileLimit) {
				this.popMessage("Istakanizda saqa atacak tas kalmadiqi icin taslarinizi geri toplamaniz gerekiyor");
			}
			if (sortType == 1 && openStatusDouble[seat] == 1) {
				if (seat == 1 && AIStatus == 0) {
					this.popMessage("Cift actiqiniz icin, artik seri acamazsiniz!");
					openPunish[seat] = 0;
				}
				return 0;
			}
			if (sortType == 2 && openStatusSort[seat] == 1 && Board.handleDouble == 0) {
				if (seat == 1 && AIStatus == 0) {
					this.popMessage("Seri actiqiniz icin, artik cift acamazsiniz!");
				}
				return 0;
			}
			if (sortType == 1 && Board.UserTotal < openLimit && openStatusSort[seat] == 0) {
				if (seat == 1 && AIStatus == 0) {
					this.popMessage("Seri acabilmeniz icin toplam " + openLimit + " puana ulasmasi gerekiyor!");
					openPunish[seat] = 1;
				}
				if (seat != 1 || AIStatus == 1) {
					return 0;
				}
			}
			if (sortType == 2 && Board.UserTotalDouble < openLimitDouble && openStatusDouble[seat] == 0 && Board.handleDouble == 0) {
				if (seat == 1 && AIStatus == 0) {
					this.popMessage("Cift acabilmeniz icin toplam en az " + openLimitDouble + " seriniz olmasi gerekiyor!");
					openPunish[seat] = 1;
				}
				if (seat != 1 || AIStatus == 1) {
					return 0;
				}
			}

			if (Board.UserTotalDouble == 0 && sortType == 2 && seat == 1 && AIStatus == 0) {
				this.popMessage("Cift acabilecek tasiniz yok!");
			}

			var setTiles;
			if (sortType == 1) {
				if (openStatusSort[seat] == 0) {
					this.popMessage(seat + " seri acti: " + Board.UserTotal);
					if (settingsIncrease == 1) {
						openLimitLast = openLimit;
						openLimit = Board.UserTotal * 1 + 1;
						// $("table-sort-score").innerHTML = openLimit;
					}
				}
				openStatusSort[seat] = 1;
				setTiles = Board.UserSeri.slice();
				if (seat == 1 && Board.UserTotal >= openLimitLast) {
					this.buttonActivePassive("handle-sort", 1);
					this.buttonActivePassive("handle-double", 1);
					firstOpenCont = 1;
				}
			}
			if (sortType == 2) {
				if (openStatusDouble[seat] == 0) {
					let userName = APP.game.els.el.find(`.player .seat[data-seat="${seat}"] .name`).data("name");
					this.popMessage(userName + " cift acti : " + Board.UserTotalDouble);
					if (settingsIncrease == 1 && Board.UserTotalDouble >= openLimitDouble) {
						openLimitDoubleLast = openLimitDouble;
						openLimitDouble = Board.UserTotalDouble * 1 + 1;
						if (settingsType == 3) {
							openLimitDouble = openLimitD;
						}
						// $("table-double-score").innerHTML = openLimitDouble;
					}
				}
				if (Board.handleDouble == 0) {
					openStatusDouble[seat] = 1;
					if (seat == 1 && Board.UserTotalDouble >= openLimitDoubleLast) {
						this.buttonActivePassive("handle-sort", 1);
						this.buttonActivePassive("handle-double", 1);
						firstOpenCont = 1;
					}
				}
				setTiles = Board.UserDouble.slice();
			}
			if (!Board.collect[0]) {
				Board.collect = [];
				// collectPlaces = boardPlaces.slice();
				Board.collectTiles = Board.tiles.slice();
			}
			var _0x484f1e = seat;
			if (Board.handleDouble == 1) {
				_0x484f1e = Board.doubleHandleTo;
			}
			for (let i=0; i<setTiles.length; i++) {
				if (setTiles[i] != '') {
					var index = Board.tiles.findIndex(e => e.value == String(setTiles[i]));
					if (setTiles[i] - setTiles[i] % 100 == 900) {
						index = Board.tiles.findIndex(e => e.value == String(Tiles.okey));
					}
					if (setTiles[i] - setTiles[i] % 100 == 800) {
						index = Board.tiles.findIndex(e => e.value == "000");
					}
					if (index !== -1) {
						this.moveToTable(_0x484f1e, setTiles[i], -1, -1, sortType);
						Board.tileLimits[seat]--;
					}
				} else {
					if (sortType == 1) {
						Board.tableH[_0x484f1e]++;
					}
					if (sortType == 2) {
						Board.tableHdouble[_0x484f1e]++;
					}
					diff = 0;
					Board.lastStone = '';
				}
				var _0x4fe46a = activePlayer;
				activePlayer = seat;
				this.updateBoard();
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
			Board.handleDouble = 0;
			if (seat == 1) {
				this.markIt(1);
				if (sortType == 1) this.checkWin();
				if (sortType == 2) this.checkWinDouble();
			}

			// remove tiles from active board rack
			setTiles.filter(e => !!e).map(tile => Tiles.removeArrayItem(Board.tiles, tile));

			// animate set of tiles
			let type = sortType === 1 ? "meld-series" : "meld-doubles";
			return APP.game.dispatch({ type, from: seat, setTiles, total: Board.UserTotal });
		},
		markIt(seat) {
			Tiles.markCont = 1;
			this.checkHandle(seat, 2);
			this.getOkeyFromTable(seat);
			Tiles.markCont = 0;
		},
		checkHandleDouble(seat) {
			// if (activePlayer == 1 && true) {}
			if (seat == 1 && this.getOkeyFromTable(1, 2)) return 0;
			
			var bTiles = Board.tiles.filter(e => !!e).slice();
			if (bTiles.length <= Board.tileLimits[seat]) {
				if (seat == 1) {
					this.popMessage("Önce yerden tas almaniz gerekiyor!");
				}
				return 0;
			}
			if (openStatusSort[seat] == 0 && openStatusDouble[seat] == 0) {
				if (seat == 1) {
					this.popMessage("Tas iseleyebilmeniz icin el acmaniz gerekiyor!");
				}
				return 0;
			}
			bTiles = Board.tiles.filter(e => !!e).slice();
			if (bTiles.length < 3) {
				this.markIt(seat);
				return 0;
			}
			if (openStatusDouble.indexOf(1) > -1) {
				Board.doubleHandleTo = openStatusDouble.indexOf(1);
				Board.handleDouble = 0;
				this.checkWinDouble();
				if (UserTotalDouble > 0) {
					this.popMessage(users[seat] + " cift isledi!");
					Board.handleDouble = 1;
					this.putToTable(activePlayer, 2);
				}
			}
		},
		checkHandle(seat, num=0) {
			// var _0x3c5f2e = [];
			Tiles.handleItems = [];
			if (seat == 1) {
				Board.tiles = Board.tiles1.slice();
				// boardPlaces = boardPlaces1.slice();
				// _0x3c5f2e = Board.User1Seri.slice();
				Board.UserTotal = Board.User1Total;
			}
			if (seat == 2) {
				Board.tiles = Board.tiles2.slice();
				// boardPlaces = boardPlaces2.slice();
				// _0x3c5f2e = Board.User2Seri.slice();
				Board.UserTotal = Board.User2Total;
			}
			if (seat == 3) {
				Board.tiles = Board.tiles3.slice();
				// boardPlaces = boardPlaces3.slice();
				// _0x3c5f2e = Board.User3Seri.slice();
				Board.UserTotal = Board.User3Total;
			}
			if (seat == 4) {
				Board.tiles = Board.tiles4.slice();
				// boardPlaces = boardPlaces4.slice();
				// _0x3c5f2e = User4Seri.slice();
				Board.UserTotal = Board.User4Total;
			}
			var bTiles = Board.tiles.filter(e => !!e).slice();
			if (bTiles.length <= Board.tileLimits[seat] && num == 0) {
				if (seat == 1 && Tiles.markCont == 0) {
					this.popMessage("Önce yerden tas almaniz gerekiyor!");
				}
				return 0;
			}
			if (openStatusSort[seat] == 0 && openStatusDouble[seat] == 0 && num == 0) {
				if (seat == 1) {
					this.popMessage("Tas iseleyebilmeniz icin el acmaniz gerekiyor!");
				}
				return 0;
			}
			if (seat == 1 && num == 0) {
				if (this.getOkeyFromTable(1, 1)) {
					return 0;
				}
			}
			if (!Board.collect[0] && num == 0) {
				Board.collect = [];
				// collectPlaces = boardPlaces.slice();
				Board.collectTiles = Board.tiles.slice();
			}
			var _0x364dc5 = [0, 0, 0, 0, 0];
			var _0x2bbb42 = 0;
			for (let i=0; i<Board.tiles.length; i++) {
				var _0x5e0d4d = Board.tiles.filter(e => e != '').slice();
				if (_0x5e0d4d.length == 1 && num == 0) {
					this.markIt(seat);
					if (seat == 1) {
						this.popMessage("Son tasi isleyemezsiniz, saqa atmaniz gerekiyor.");
					}
					return 0;
				}
				if (Board.tiles[i]) {
					// $(boardPlaces[i * 1 + 1]).children[0].children[0].classList.remove("marked");
					// $(boardPlaces[i * 1 + 1]).children[0].children[0].innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" class=\"heart\" viewBox=\"0 0 16 16\"> <path fill-rule=\"evenodd\" d=\"M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z\"/> </svg>";
					var _0x1fc99b;
					if (Board.tiles[i] == "000") {
						_0x1fc99b = Tiles.okey;
					} else {
						_0x1fc99b = Board.tiles[i];
					}
					for (let j=0; j<7; j++) {
						for (let k=0; k<=13; k++) {
							if (Board.tiles[i] && Board.tiles[i] != Tiles.okey) {
								var _0x49f720 = 0;
								var _0x2fc30f = 0;
								var _0x46b158;
								var _0x3a83d2;
								var _0x34dbca;
								var _0x29577e;
								var _0x4935d9;
								if (Board.tableUser1[j][k] > 0) {
									_0x46b158 = Board.tableUser1[j][k];
									_0x3a83d2 = Board.tableUser1[j][k - 1];
									_0x34dbca = Board.tableUser1[j][k * 1 + 1];
									_0x29577e = Board.tableUser1[j][k * 1 + 2];
									_0x4935d9 = Board.tableUser1[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) _0x46b158 = Tiles.okey;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) _0x3a83d2 = Tiles.okey;
									if (_0x34dbca - _0x34dbca % 100 == 800) _0x34dbca = Tiles.okey;
									if (_0x29577e - _0x29577e % 100 == 800) _0x29577e = Tiles.okey;
									if (_0x4935d9 - _0x4935d9 % 100 == 800) _0x4935d9 = Tiles.okey;
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x3a83d2) _0x46b158 = _0x3a83d2 * 1 + 1;
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x34dbca) _0x46b158 = _0x34dbca - 1;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x46b158) _0x3a83d2 = _0x46b158 - 1;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x34dbca) _0x3a83d2 = _0x34dbca - 2;
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x46b158) _0x34dbca = _0x46b158 * 1 + 1;
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x3a83d2) _0x34dbca = _0x3a83d2 * 1 + 2;
									if (_0x29577e - _0x29577e % 100 == 900 && _0x46b158) _0x29577e = _0x46b158 * 1 + 2;
									if (_0x29577e - _0x29577e % 100 == 900 && _0x3a83d2) _0x29577e = _0x3a83d2 * 1 + 3;
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x46b158) _0x4935d9 = _0x46b158 - 2;
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x3a83d2) _0x4935d9 = _0x3a83d2 - 1;
									if (_0x46b158 - _0x3a83d2 == 1 && _0x3a83d2 - _0x4935d9 == 1 && _0x34dbca == 0 && _0x1fc99b - _0x46b158 == 1) {
										_0x2fc30f = k * 1 + 1;
										_0x49f720 = 1;
									}
									if (_0x34dbca - _0x46b158 == 1 && _0x29577e - _0x34dbca == 1 && _0x3a83d2 == 0 && _0x46b158 - _0x1fc99b == 1) {
										_0x2fc30f = k - 1;
										_0x49f720 = 1;
									}
									_0x46b158 = Board.tableUser1[j][k];
									_0x3a83d2 = Board.tableUser1[j][k - 1];
									_0x34dbca = Board.tableUser1[j][k * 1 + 1];
									_0x29577e = Board.tableUser1[j][k * 1 + 2];
									_0x4935d9 = Board.tableUser1[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) _0x46b158 = Tiles.okey;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) _0x3a83d2 = Tiles.okey;
									if (_0x34dbca - _0x34dbca % 100 == 800) _0x34dbca = Tiles.okey;
									if (_0x29577e - _0x29577e % 100 == 800) _0x29577e = Tiles.okey;
									if (_0x4935d9 - _0x4935d9 % 100 == 800) _0x4935d9 = Tiles.okey;
									if (_0x46b158 % 100 == _0x3a83d2 % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && Board.tableUser1[j][k - 3] == 0 && (_0x34dbca == 0 || !_0x34dbca) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x3a83d2 && _0x1fc99b != _0x4935d9) {
										_0x2fc30f = k - 3;
										_0x49f720 = 1;
									}
									if (_0x46b158 % 100 == _0x34dbca % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && Board.tableUser1[j][k * 1 + 3] == 0 && (_0x3a83d2 == 0 || !_0x3a83d2) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x34dbca && _0x1fc99b != _0x29577e) {
										_0x2fc30f = k * 1 + 3;
										_0x49f720 = 1;
									}
								}
								if (Board.tableUser2[j][k] > 0 && _0x49f720 == 0) {
									_0x46b158 = Board.tableUser2[j][k];
									_0x3a83d2 = Board.tableUser2[j][k - 1];
									_0x34dbca = Board.tableUser2[j][k * 1 + 1];
									_0x29577e = Board.tableUser2[j][k * 1 + 2];
									_0x4935d9 = Board.tableUser2[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) _0x46b158 = Tiles.okey;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) _0x3a83d2 = Tiles.okey;
									if (_0x34dbca - _0x34dbca % 100 == 800) _0x34dbca = Tiles.okey;
									if (_0x29577e - _0x29577e % 100 == 800) _0x29577e = Tiles.okey;
									if (_0x4935d9 - _0x4935d9 % 100 == 800) _0x4935d9 = Tiles.okey;
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x3a83d2) _0x46b158 = _0x3a83d2 * 1 + 1;
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x34dbca) _0x46b158 = _0x34dbca - 1;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x46b158) _0x3a83d2 = _0x46b158 - 1;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x34dbca) _0x3a83d2 = _0x34dbca - 2;
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x46b158) _0x34dbca = _0x46b158 * 1 + 1;
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x3a83d2) _0x34dbca = _0x3a83d2 * 1 + 2;
									if (_0x29577e - _0x29577e % 100 == 900 && _0x46b158) _0x29577e = _0x46b158 * 1 + 2;
									if (_0x29577e - _0x29577e % 100 == 900 && _0x3a83d2) _0x29577e = _0x3a83d2 * 1 + 3;
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x46b158) _0x4935d9 = _0x46b158 - 2;
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x3a83d2) _0x4935d9 = _0x3a83d2 - 1;
									if (_0x46b158 - _0x3a83d2 == 1 && _0x3a83d2 - _0x4935d9 == 1 && _0x34dbca == 0 && _0x1fc99b - _0x46b158 == 1) {
										_0x2fc30f = k * 1 + 1;
										_0x49f720 = 2;
									}
									if (_0x34dbca - _0x46b158 == 1 && _0x29577e - _0x34dbca == 1 && _0x3a83d2 == 0 && _0x46b158 - _0x1fc99b == 1) {
										_0x2fc30f = k - 1;
										_0x49f720 = 2;
									}
									_0x46b158 = Board.tableUser2[j][k];
									_0x3a83d2 = Board.tableUser2[j][k - 1];
									_0x34dbca = Board.tableUser2[j][k * 1 + 1];
									_0x29577e = Board.tableUser2[j][k * 1 + 2];
									_0x4935d9 = Board.tableUser2[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) _0x46b158 = Tiles.okey;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) _0x3a83d2 = Tiles.okey;
									if (_0x34dbca - _0x34dbca % 100 == 800) _0x34dbca = Tiles.okey;
									if (_0x29577e - _0x29577e % 100 == 800) _0x29577e = Tiles.okey;
									if (_0x4935d9 - _0x4935d9 % 100 == 800) _0x4935d9 = Tiles.okey;
									if (_0x46b158 % 100 == _0x3a83d2 % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && Board.tableUser2[j][k - 3] == 0 && (_0x34dbca == 0 || !_0x34dbca) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x3a83d2 && _0x1fc99b != _0x4935d9) {
										_0x2fc30f = k - 3;
										_0x49f720 = 2;
									}
									if (_0x46b158 % 100 == _0x34dbca % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && Board.tableUser2[j][k * 1 + 3] == 0 && (_0x3a83d2 == 0 || !_0x3a83d2) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x34dbca && _0x1fc99b != _0x29577e) {
										_0x2fc30f = k * 1 + 3;
										_0x49f720 = 2;
									}
								}
								if (Board.tableUser3[j][k] > 0 && _0x49f720 == 0) {
									_0x46b158 = Board.tableUser3[j][k];
									_0x3a83d2 = Board.tableUser3[j][k - 1];
									_0x34dbca = Board.tableUser3[j][k * 1 + 1];
									_0x29577e = Board.tableUser3[j][k * 1 + 2];
									_0x4935d9 = Board.tableUser3[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) _0x46b158 = Tiles.okey;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) _0x3a83d2 = Tiles.okey;
									if (_0x34dbca - _0x34dbca % 100 == 800) _0x34dbca = Tiles.okey;
									if (_0x29577e - _0x29577e % 100 == 800) _0x29577e = Tiles.okey;
									if (_0x4935d9 - _0x4935d9 % 100 == 800) _0x4935d9 = Tiles.okey;
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x3a83d2) _0x46b158 = _0x3a83d2 * 1 + 1;
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x34dbca) _0x46b158 = _0x34dbca - 1;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x46b158) _0x3a83d2 = _0x46b158 - 1;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x34dbca) _0x3a83d2 = _0x34dbca - 2;
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x46b158) _0x34dbca = _0x46b158 * 1 + 1;
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x3a83d2) _0x34dbca = _0x3a83d2 * 1 + 2;
									if (_0x29577e - _0x29577e % 100 == 900 && _0x46b158) _0x29577e = _0x46b158 * 1 + 2;
									if (_0x29577e - _0x29577e % 100 == 900 && _0x3a83d2) _0x29577e = _0x3a83d2 * 1 + 3;
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x46b158) _0x4935d9 = _0x46b158 - 2;
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x3a83d2) _0x4935d9 = _0x3a83d2 - 1;
									if (_0x46b158 - _0x3a83d2 == 1 && _0x3a83d2 - _0x4935d9 == 1 && _0x34dbca == 0 && _0x1fc99b - _0x46b158 == 1) {
										_0x2fc30f = k * 1 + 1;
										_0x49f720 = 3;
									}
									if (_0x34dbca - _0x46b158 == 1 && _0x29577e - _0x34dbca == 1 && _0x3a83d2 == 0 && _0x46b158 - _0x1fc99b == 1) {
										_0x2fc30f = k - 1;
										_0x49f720 = 3;
									}
									_0x46b158 = Board.tableUser3[j][k];
									_0x3a83d2 = Board.tableUser3[j][k - 1];
									_0x34dbca = Board.tableUser3[j][k * 1 + 1];
									_0x29577e = Board.tableUser3[j][k * 1 + 2];
									_0x4935d9 = Board.tableUser3[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) _0x46b158 = Tiles.okey;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) _0x3a83d2 = Tiles.okey;
									if (_0x34dbca - _0x34dbca % 100 == 800) _0x34dbca = Tiles.okey;
									if (_0x29577e - _0x29577e % 100 == 800) _0x29577e = Tiles.okey;
									if (_0x4935d9 - _0x4935d9 % 100 == 800) _0x4935d9 = Tiles.okey;
									if (_0x46b158 % 100 == _0x3a83d2 % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && Board.tableUser3[j][k - 3] == 0 && (_0x34dbca == 0 || !_0x34dbca) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x3a83d2 && _0x1fc99b != _0x4935d9) {
										_0x2fc30f = k - 3;
										_0x49f720 = 3;
									}
									if (_0x46b158 % 100 == _0x34dbca % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && Board.tableUser3[j][k * 1 + 3] == 0 && (_0x3a83d2 == 0 || !_0x3a83d2) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x34dbca && _0x1fc99b != _0x29577e) {
										_0x2fc30f = k * 1 + 3;
										_0x49f720 = 3;
									}
								}
								if (Board.tableUser4[j][k] > 0 && _0x49f720 == 0) {
									_0x46b158 = Board.tableUser4[j][k];
									_0x3a83d2 = Board.tableUser4[j][k - 1];
									_0x34dbca = Board.tableUser4[j][k * 1 + 1];
									_0x29577e = Board.tableUser4[j][k * 1 + 2];
									_0x4935d9 = Board.tableUser4[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) _0x46b158 = Tiles.okey;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) _0x3a83d2 = Tiles.okey;
									if (_0x34dbca - _0x34dbca % 100 == 800) _0x34dbca = Tiles.okey;
									if (_0x29577e - _0x29577e % 100 == 800) _0x29577e = Tiles.okey;
									if (_0x4935d9 - _0x4935d9 % 100 == 800) _0x4935d9 = Tiles.okey;
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x3a83d2) _0x46b158 = _0x3a83d2 * 1 + 1;
									if (_0x46b158 - _0x46b158 % 100 == 900 && _0x34dbca) _0x46b158 = _0x34dbca - 1;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x46b158) _0x3a83d2 = _0x46b158 - 1;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 900 && _0x34dbca) _0x3a83d2 = _0x34dbca - 2;
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x46b158) _0x34dbca = _0x46b158 * 1 + 1;
									if (_0x34dbca - _0x34dbca % 100 == 900 && _0x3a83d2) _0x34dbca = _0x3a83d2 * 1 + 2;
									if (_0x29577e - _0x29577e % 100 == 900 && _0x46b158) _0x29577e = _0x46b158 * 1 + 2;
									if (_0x29577e - _0x29577e % 100 == 900 && _0x3a83d2) _0x29577e = _0x3a83d2 * 1 + 3;
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x46b158) _0x4935d9 = _0x46b158 - 2;
									if (_0x4935d9 - _0x4935d9 % 100 == 900 && _0x3a83d2) _0x4935d9 = _0x3a83d2 - 1;
									if (_0x46b158 - _0x3a83d2 == 1 && _0x3a83d2 - _0x4935d9 == 1 && _0x34dbca == 0 && _0x1fc99b - _0x46b158 == 1) {
										_0x2fc30f = k * 1 + 1;
										_0x49f720 = 4;
									}
									if (_0x34dbca - _0x46b158 == 1 && _0x29577e - _0x34dbca == 1 && _0x3a83d2 == 0 && _0x46b158 - _0x1fc99b == 1) {
										_0x2fc30f = k - 1;
										_0x49f720 = 4;
									}
									_0x46b158 = Board.tableUser4[j][k];
									_0x3a83d2 = Board.tableUser4[j][k - 1];
									_0x34dbca = Board.tableUser4[j][k * 1 + 1];
									_0x29577e = Board.tableUser4[j][k * 1 + 2];
									_0x4935d9 = Board.tableUser4[j][k - 2];
									if (_0x46b158 - _0x46b158 % 100 == 800) _0x46b158 = Tiles.okey;
									if (_0x3a83d2 - _0x3a83d2 % 100 == 800) _0x3a83d2 = Tiles.okey;
									if (_0x34dbca - _0x34dbca % 100 == 800) _0x34dbca = Tiles.okey;
									if (_0x29577e - _0x29577e % 100 == 800) _0x29577e = Tiles.okey;
									if (_0x4935d9 - _0x4935d9 % 100 == 800) _0x4935d9 = Tiles.okey;
									if (_0x46b158 % 100 == _0x3a83d2 % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && Board.tableUser4[j][k - 3] == 0 && (_0x34dbca == 0 || !_0x34dbca) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x3a83d2 && _0x1fc99b != _0x4935d9) {
										_0x2fc30f = k - 3;
										_0x49f720 = 4;
									}
									if (_0x46b158 % 100 == _0x34dbca % 100 && _0x46b158 % 100 == _0x1fc99b % 100 && Board.tableUser4[j][k * 1 + 3] == 0 && (_0x3a83d2 == 0 || !_0x3a83d2) && _0x1fc99b != _0x46b158 && _0x1fc99b != _0x34dbca && _0x1fc99b != _0x29577e) {
										_0x2fc30f = k * 1 + 3;
										_0x49f720 = 4;
									}
								}
								if (_0x49f720 > 0) {
									if (num == 0) {
										if (_0x1fc99b == Tiles.okey) _0x1fc99b = Tiles.okey % 100 + 800;
										this.moveToTable(_0x49f720, _0x1fc99b, _0x2fc30f, j, 1);
										this.popMessage(users[seat] + " seri isledi!");
										Board.tileLimits[seat]--;
										if (activePlayer != _0x49f720) {
											_0x364dc5[_0x49f720] += _0x1fc99b % 100 * 10;
										}
										var _0xaf41f9 = activePlayer;
										activePlayer = seat;
										this.updateBoard();
										activePlayer = _0xaf41f9;
										_0x2bbb42 = 1;
									} else {
										Tiles.handleItems.push(Board.tiles[i]);
										// $(boardPlaces[i * 1 + 1]).children[0].children[0].innerHTML = '';
										// $(boardPlaces[i * 1 + 1]).children[0].children[0].classList.add("marked");
									}
								}
							}
						}
					}
				}
			}
			if (_0x2bbb42 == 0 && num == 0) this.putOkeyToTable(seat);
			if (num == 0) this.markIt(seat);
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
		getOkeyFromTable(seat, num=0) {
			Board.getOkeyKont = 0;
			var _0x108f0b = 0;
			var _0x495ad6 = [];
			if (seat == 1) _0x495ad6 = Board.tiles1.slice();
			if (seat == 2) _0x495ad6 = Board.tiles2.slice();
			if (seat == 3) _0x495ad6 = Board.tiles3.slice();
			if (seat == 4) _0x495ad6 = Board.tiles4.slice();
			var _0x194228 = 0;
			var _0x3dd017 = 0;
			var _0x43a6ba = [];
			var _0x24fcc5 = [1, 2, 3, 4];
			for (let i=0; i<_0x495ad6.length; i++) {
				if (_0x495ad6[i]) {
					if (num == 1 || num == 0) {
						if (Board.tiles[i] == "000") {
							_0x495ad6[i] = okey;
						}
						for (let j=0; j<7; j++) {
							for (let k=0; k<13; k++) {
								_0x194228 = 0;
								_0x3dd017 = 0;
								_0x43a6ba = [];
								if (Board.tableUser1[j][k] - Board.tableUser1[j][k] % 100 == 900) {
									if (Board.tableUser1[j][k - 1] - Board.tableUser1[j][k - 2] == 1) {
										_0x194228 = Board.tableUser1[j][k - 1] * 1 + 1;
									}
									if (Board.tableUser1[j][k * 1 + 2] - Board.tableUser1[j][k * 1 + 1] == 1) {
										_0x194228 = Board.tableUser1[j][k * 1 + 1] - 1;
									}
									if (Board.tableUser1[j][k * 1 + 1] - Board.tableUser1[j][k - 1] == 2) {
										_0x194228 = Board.tableUser1[j][k * 1 + 1] - 1;
									}
									if (Board.tableUser1[j][k] != 0 && _0x495ad6[i] != (Board.tableUser1[j - 1] && Board.tableUser1[j - 2] && Board.tableUser1[j - 3] && Board.tableUser1[j][k * 1 + 1] && Board.tableUser1[j][k * 1 + 2] && Board.tableUser1[j][k * 1 + 3])) {
										if (Board.tableUser1[j][k * 1 + 1] % 100 == (Board.tableUser1[j][k * 1 + 2] % 100 && Board.tableUser1[j][k * 1 + 3] % 100) && (Board.tableUser1[j][k * 1 + 1] % 100 && Board.tableUser1[j][k * 1 + 2] % 100 && Board.tableUser1[j][k * 1 + 3] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser1[j][k * 1 + 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser1[j][k * 1 + 2] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser1[j][k * 1 + 3] / 100));
											let _0x131561 = _0x24fcc5.filter(_0x1a3ffa => !_0x43a6ba.includes(_0x1a3ffa));
											_0x194228 = _0x131561 * 100 + Board.tableUser1[j][k * 1 + 1] % 100;
										}
										if (Board.tableUser1[j][k - 1] % 100 == (Board.tableUser1[j][k * 1 + 1] % 100 && Board.tableUser1[j][k * 1 + 2] % 100) && (Board.tableUser1[j][k - 1] % 100 && Board.tableUser1[j][k * 1 + 1] % 100 && Board.tableUser1[j][k * 1 + 2] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser1[j][k - 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser1[j][k * 1 + 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser1[j][k * 1 + 2] / 100));
											let _0x3b764f = _0x24fcc5.filter(_0x4e5b23 => !_0x43a6ba.includes(_0x4e5b23));
											_0x194228 = _0x3b764f * 100 + Board.tableUser1[j][k * 1 + 1] % 100;
										}
										if (Board.tableUser1[j][k - 1] % 100 == (Board.tableUser1[j][k - 2] % 100 && Board.tableUser1[j][k * 1 + 1] % 100) && (Board.tableUser1[j][k - 1] % 100 && Board.tableUser1[j][k - 2] % 100 && Board.tableUser1[j][k * 1 + 1] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser1[j][k - 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser1[j][k - 2] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser1[j][k * 1 + 1] / 100));
											let _0x5bfb63 = _0x24fcc5.filter(_0x3831c7 => !_0x43a6ba.includes(_0x3831c7));
											_0x194228 = _0x5bfb63 * 100 + Board.tableUser1[j][k * 1 + 1] % 100;
										}
										if (Board.tableUser1[j][k - 1] % 100 == (Board.tableUser1[j][k - 2] % 100 && Board.tableUser1[j][k - 3] % 100) && (Board.tableUser1[j][k - 1] % 100 && Board.tableUser1[j][k - 2] % 100 && Board.tableUser1[j][k - 3] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser1[j][k - 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser1[j][k - 2] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser1[j][k - 3] / 100));
											let _0x5191b4 = _0x24fcc5.filter(_0x3b90f8 => !_0x43a6ba.includes(_0x3b90f8));
											_0x194228 = _0x5191b4 * 100 + Board.tableUser1[j][k - 1] % 100;
										}
									}
									_0x3dd017 = 1;
								}
								if (Board.tableUser2[j][k] - Board.tableUser2[j][k] % 100 == 900) {
									if (Board.tableUser2[j][k - 1] - Board.tableUser2[j][k - 2] == 1) {
										_0x194228 = Board.tableUser2[j][k - 1] * 1 + 1;
									}
									if (Board.tableUser2[j][k * 1 + 2] - Board.tableUser2[j][k * 1 + 1] == 1) {
										_0x194228 = Board.tableUser2[j][k * 1 + 1] - 1;
									}
									if (Board.tableUser2[j][k * 1 + 1] - Board.tableUser2[j][k - 1] == 2) {
										_0x194228 = Board.tableUser2[j][k * 1 + 1] - 1;
									}
									if (Board.tableUser2[j][k] != 0 && _0x495ad6[i] != (Board.tableUser2[j - 1] && Board.tableUser2[j - 2] && Board.tableUser2[j - 3] && Board.tableUser2[j][k * 1 + 1] && Board.tableUser2[j][k * 1 + 2] && Board.tableUser2[j][k * 1 + 3])) {
										if (Board.tableUser2[j][k * 1 + 1] % 100 == (Board.tableUser2[j][k * 1 + 2] % 100 && Board.tableUser2[j][k * 1 + 3] % 100) && (Board.tableUser2[j][k * 1 + 1] % 100 && Board.tableUser2[j][k * 1 + 2] % 100 && Board.tableUser2[j][k * 1 + 3] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser2[j][k * 1 + 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser2[j][k * 1 + 2] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser2[j][k * 1 + 3] / 100));
											let _0x4cb701 = _0x24fcc5.filter(_0x340063 => !_0x43a6ba.includes(_0x340063));
											_0x194228 = _0x4cb701 * 100 + Board.tableUser2[j][k * 1 + 1] % 100;
										}
										if (Board.tableUser2[j][k - 1] % 100 == (Board.tableUser2[j][k * 1 + 1] % 100 && Board.tableUser2[j][k * 1 + 2] % 100) && (Board.tableUser2[j][k - 1] % 100 && Board.tableUser2[j][k * 1 + 1] % 100 && Board.tableUser2[j][k * 1 + 2] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser2[j][k - 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser2[j][k * 1 + 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser2[j][k * 1 + 2] / 100));
											let _0x56af68 = _0x24fcc5.filter(_0x10de9e => !_0x43a6ba.includes(_0x10de9e));
											_0x194228 = _0x56af68 * 100 + Board.tableUser2[j][k * 1 + 1] % 100;
										}
										if (Board.tableUser2[j][k - 1] % 100 == (Board.tableUser2[j][k - 2] % 100 && Board.tableUser2[j][k * 1 + 1] % 100) && (Board.tableUser2[j][k - 1] % 100 && Board.tableUser2[j][k - 2] % 100 && Board.tableUser2[j][k * 1 + 1] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser2[j][k - 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser2[j][k - 2] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser2[j][k * 1 + 1] / 100));
											let _0x5317c7 = _0x24fcc5.filter(_0x47dc25 => !_0x43a6ba.includes(_0x47dc25));
											_0x194228 = _0x5317c7 * 100 + Board.tableUser2[j][k * 1 + 1] % 100;
										}
										if (Board.tableUser2[j][k - 1] % 100 == (Board.tableUser2[j][k - 2] % 100 && Board.tableUser2[j][k - 3] % 100) && (Board.tableUser2[j][k - 1] % 100 && Board.tableUser2[j][k - 2] % 100 && Board.tableUser2[j][k - 3] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser2[j][k - 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser2[j][k - 2] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser2[j][k - 3] / 100));
											let _0x17162a = _0x24fcc5.filter(_0x1a5d20 => !_0x43a6ba.includes(_0x1a5d20));
											_0x194228 = _0x17162a * 100 + Board.tableUser2[j][k - 1] % 100;
										}
									}
									_0x3dd017 = 2;
								}
								if (Board.tableUser3[j][k] - Board.tableUser3[j][k] % 100 == 900) {
									if (Board.tableUser3[j][k - 1] - Board.tableUser3[j][k - 2] == 1) {
										_0x194228 = Board.tableUser3[j][k - 1] * 1 + 1;
									}
									if (Board.tableUser3[j][k * 1 + 2] - Board.tableUser3[j][k * 1 + 1] == 1) {
										_0x194228 = Board.tableUser3[j][k * 1 + 1] - 1;
									}
									if (Board.tableUser3[j][k * 1 + 1] - Board.tableUser3[j][k - 1] == 2) {
										_0x194228 = Board.tableUser3[j][k * 1 + 1] - 1;
									}
									if (Board.tableUser3[j][k] != 0 && _0x495ad6[i] != (Board.tableUser3[j - 1] && Board.tableUser3[j - 2] && Board.tableUser3[j - 3] && Board.tableUser3[j][k * 1 + 1] && Board.tableUser3[j][k * 1 + 2] && Board.tableUser3[j][k * 1 + 3])) {
										if (Board.tableUser3[j][k * 1 + 1] % 100 == (Board.tableUser3[j][k * 1 + 2] % 100 && Board.tableUser3[j][k * 1 + 3] % 100) && (Board.tableUser3[j][k * 1 + 1] % 100 && Board.tableUser3[j][k * 1 + 2] % 100 && Board.tableUser3[j][k * 1 + 3] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser3[j][k * 1 + 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser3[j][k * 1 + 2] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser3[j][k * 1 + 3] / 100));
											let _0x16a071 = _0x24fcc5.filter(_0x440e48 => !_0x43a6ba.includes(_0x440e48));
											_0x194228 = _0x16a071 * 100 + Board.tableUser3[j][k * 1 + 1] % 100;
										}
										if (Board.tableUser3[j][k - 1] % 100 == (Board.tableUser3[j][k * 1 + 1] % 100 && Board.tableUser3[j][k * 1 + 2] % 100) && (Board.tableUser3[j][k - 1] % 100 && Board.tableUser3[j][k * 1 + 1] % 100 && Board.tableUser3[j][k * 1 + 2] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser3[j][k - 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser3[j][k * 1 + 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser3[j][k * 1 + 2] / 100));
											let _0x939e30 = _0x24fcc5.filter(_0x5725e2 => !_0x43a6ba.includes(_0x5725e2));
											_0x194228 = _0x939e30 * 100 + Board.tableUser3[j][k * 1 + 1] % 100;
										}
										if (Board.tableUser3[j][k - 1] % 100 == (Board.tableUser3[j][k - 2] % 100 && Board.tableUser3[j][k * 1 + 1] % 100) && (Board.tableUser3[j][k - 1] % 100 && Board.tableUser3[j][k - 2] % 100 && Board.tableUser3[j][k * 1 + 1] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser3[j][k - 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser3[j][k - 2] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser3[j][k * 1 + 1] / 100));
											let _0x21f921 = _0x24fcc5.filter(_0x19b7d7 => !_0x43a6ba.includes(_0x19b7d7));
											_0x194228 = _0x21f921 * 100 + Board.tableUser3[j][k * 1 + 1] % 100;
										}
										if (Board.tableUser3[j][k - 1] % 100 == (Board.tableUser3[j][k - 2] % 100 && Board.tableUser3[j][k - 3] % 100) && (Board.tableUser3[j][k - 1] % 100 && Board.tableUser3[j][k - 2] % 100 && Board.tableUser3[j][k - 3] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser3[j][k - 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser3[j][k - 2] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser3[j][k - 3] / 100));
											let _0x55d72b = _0x24fcc5.filter(_0x40cdf5 => !_0x43a6ba.includes(_0x40cdf5));
											_0x194228 = _0x55d72b * 100 + Board.tableUser3[j][k - 1] % 100;
										}
									}
									_0x3dd017 = 3;
								}
								if (Board.tableUser4[j][k] - Board.tableUser4[j][k] % 100 == 900) {
									if (Board.tableUser4[j][k - 1] - Board.tableUser4[j][k - 2] == 1) {
										_0x194228 = Board.tableUser4[j][k - 1] * 1 + 1;
									}
									if (Board.tableUser4[j][k * 1 + 2] - Board.tableUser4[j][k * 1 + 1] == 1) {
										_0x194228 = Board.tableUser4[j][k * 1 + 1] - 1;
									}
									if (Board.tableUser4[j][k * 1 + 1] - Board.tableUser4[j][k - 1] == 2) {
										_0x194228 = Board.tableUser4[j][k * 1 + 1] - 1;
									}
									if (Board.tableUser4[j][k] != 0 && _0x495ad6[i] != (Board.tableUser4[j - 1] && Board.tableUser4[j - 2] && Board.tableUser4[j - 3] && Board.tableUser4[j][k * 1 + 1] && Board.tableUser4[j][k * 1 + 2] && Board.tableUser4[j][k * 1 + 3])) {
										if (Board.tableUser4[j][k * 1 + 1] % 100 == (Board.tableUser4[j][k * 1 + 2] % 100 && Board.tableUser4[j][k * 1 + 3] % 100) && (Board.tableUser4[j][k * 1 + 1] % 100 && Board.tableUser4[j][k * 1 + 2] % 100 && Board.tableUser4[j][k * 1 + 3] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser4[j][k * 1 + 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser4[j][k * 1 + 2] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser4[j][k * 1 + 3] / 100));
											let _0x55b1ae = _0x24fcc5.filter(_0x43b955 => !_0x43a6ba.includes(_0x43b955));
											_0x194228 = _0x55b1ae * 100 + Board.tableUser4[j][k * 1 + 1] % 100;
										}
										if (Board.tableUser4[j][k - 1] % 100 == (Board.tableUser4[j][k * 1 + 1] % 100 && Board.tableUser4[j][k * 1 + 2] % 100) && (Board.tableUser4[j][k - 1] % 100 && Board.tableUser4[j][k * 1 + 1] % 100 && Board.tableUser4[j][k * 1 + 2] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser4[j][k - 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser4[j][k * 1 + 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser4[j][k * 1 + 2] / 100));
											let _0x2bf494 = _0x24fcc5.filter(_0x375208 => !_0x43a6ba.includes(_0x375208));
											_0x194228 = _0x2bf494 * 100 + Board.tableUser4[j][k * 1 + 1] % 100;
										}
										if (Board.tableUser4[j][k - 1] % 100 == (Board.tableUser4[j][k - 2] % 100 && Board.tableUser4[j][k * 1 + 1] % 100) && (Board.tableUser4[j][k - 1] % 100 && Board.tableUser4[j][k - 2] % 100 && Board.tableUser4[j][k * 1 + 1] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser4[j][k - 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser4[j][k - 2] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser4[j][k * 1 + 1] / 100));
											let _0x4247b3 = _0x24fcc5.filter(_0x3efb35 => !_0x43a6ba.includes(_0x3efb35));
											_0x194228 = _0x4247b3 * 100 + Board.tableUser4[j][k * 1 + 1] % 100;
										}
										if (Board.tableUser4[j][k - 1] % 100 == (Board.tableUser4[j][k - 2] % 100 && Board.tableUser4[j][k - 3] % 100) && (Board.tableUser4[j][k - 1] % 100 && Board.tableUser4[j][k - 2] % 100 && Board.tableUser4[j][k - 3] % 100) != 0) {
											_0x43a6ba.push(Math.floor(Board.tableUser4[j][k - 1] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser4[j][k - 2] / 100));
											_0x43a6ba.push(Math.floor(Board.tableUser4[j][k - 3] / 100));
											let _0x5b9599 = _0x24fcc5.filter(_0x2720e2 => !_0x43a6ba.includes(_0x2720e2));
											_0x194228 = _0x5b9599 * 100 + Board.tableUser4[j][k - 1] % 100;
										}
									}
									_0x3dd017 = 4;
								}
								if (_0x194228 != 0 && _0x495ad6[i] == _0x194228) {
									if (Tiles.markCont == 0) {
										if (Board.tiles[i] == "000") {
											Board.tiles[i] = okey % 100 + 800;
										}
										Board.getOkeyKont = 1;
										this.moveToTable(_0x3dd017, Board.tiles[i], k, j, 1);
										Board.getOkeyKont = 0;
										if (markOkey == 1) {
											// $(boardPlaces[i * 1 + 1]).children[0].style.display = "none";
										}
										// $(boardPlaces[i * 1 + 1]).classList.remove(color[1]);
										// $(boardPlaces[i * 1 + 1]).classList.remove(color[2]);
										// $(boardPlaces[i * 1 + 1]).classList.remove(color[3]);
										// $(boardPlaces[i * 1 + 1]).classList.remove(color[4]);
										// $(boardPlaces[i * 1 + 1]).classList.add(color[Math.floor(okey / 100)]);
										// $(boardPlaces[i * 1 + 1]).children[0].children[1].innerHTML = okey % 100;
										Board.tiles[i] = okey;
										// var _0x1b0a1e = boardPlaces[i * 1 + 1].split('-');
										_0x1b0a1e = _0x1b0a1e[1] - 1;
										data[_0x1b0a1e] = okey;
										var _0x559c6d = activePlayer;
										activePlayer = seat;
										this.updateBoard();
										activePlayer = _0x559c6d;
										_0x108f0b = 1;
										this.popMessage(users[activePlayer] + " yerden okey aldi!");
									} else {
										Tiles.handleItems.push(Board.tiles[i]);
										// $(boardPlaces[i * 1 + 1]).children[0].children[0].innerHTML = '';
										// $(boardPlaces[i * 1 + 1]).children[0].children[0].classList.add("marked");
									}
								}
							}
						}
					}
					if (num == 2 || num == 0) {
						if (Board.tiles[i] == "000") {
							_0x495ad6[i] = okey % 100 + 800;
						}
						for (let j=0; j<14; j++) {
							for (let k=0; k<2; k++) {
								Board.tableDoubleUser1[j][k];
								_0x194228 = 0;
								_0x3dd017 = 0;
								if (Board.tableDoubleUser1[j][k] - Board.tableDoubleUser1[j][k] % 100 == 900) {
									if (k == 0) _0x194228 = Board.tableDoubleUser1[j][k * 1 + 1];
									if (k == 1) _0x194228 = Board.tableDoubleUser1[j][k - 1];
									_0x3dd017 = 1;
								}
								if (Board.tableDoubleUser2[j][k] - Board.tableDoubleUser2[j][k] % 100 == 900) {
									if (k == 0) _0x194228 = Board.tableDoubleUser2[j][k * 1 + 1];
									if (k == 1) _0x194228 = Board.tableDoubleUser2[j][k - 1];
									_0x3dd017 = 2;
								}
								if (Board.tableDoubleUser3[j][k] - Board.tableDoubleUser3[j][k] % 100 == 900) {
									if (k == 0) _0x194228 = Board.tableDoubleUser3[j][k * 1 + 1];
									if (k == 1) _0x194228 = Board.tableDoubleUser3[j][k - 1];
									_0x3dd017 = 3;
								}
								if (Board.tableDoubleUser4[j][k] - Board.tableDoubleUser4[j][k] % 100 == 900) {
									if (k == 0) _0x194228 = Board.tableDoubleUser4[j][k * 1 + 1];
									if (k == 1) _0x194228 = Board.tableDoubleUser4[j][k - 1];
									_0x3dd017 = 4;
								}
								if (_0x194228 != 0 && _0x495ad6[i] == _0x194228) {
									if (Tiles.markCont == 0) {
										if (Board.tiles[i] == "000") {
											Board.tiles[i] = okey % 100 + 800;
										}
										this.popMessage("yerden okey aliniyor!");
										Board.getOkeyKont = 1;
										this.moveToTable(_0x3dd017, _0x495ad6[i], k, j, 2);
										Board.getOkeyKont = 0;
										if (markOkey == 1) {
											// $(boardPlaces[i * 1 + 1]).children[0].style.display = 'none';
										}
										// $(boardPlaces[i * 1 + 1]).children[0].children[1].innerHTML = okey % 100;
										Board.tiles[i] = okey;
										// var _0x1b0a1e = boardPlaces[i * 1 + 1].split('-');
										_0x1b0a1e = _0x1b0a1e[1] - 1;
										data[_0x1b0a1e] = okey;
										var _0x559c6d = activePlayer;
										activePlayer = seat;
										this.updateBoard();
										activePlayer = _0x559c6d;
										_0x108f0b = 1;
									} else {
										Tiles.handleItems.push(Board.tiles[i]);
										// $(boardPlaces[i * 1 + 1]).children[0].children[0].innerHTML = '';
										// $(boardPlaces[i * 1 + 1]).children[0].children[0].classList.add("marked");
									}
								}
							}
						}
					}
				}
			}
			return _0x108f0b;
		},
		moveToTable(seat, _0x315c85, _0x5f22f9, _0x4693ec, _0x14df73, _0x5486c5) {
			var _0x2a961e = String(_0x315c85);
			var _0x4295dd;
			let stone = parseInt(_0x2a961e.substr(1, 2));
			let color1 = _0x2a961e.substr(0, 1);
			var _0xf1fecf = Board.tiles.findIndex(e => e.value == String(_0x315c85));
			var _0x5b13d2 = 0;
			if (_0x315c85 - _0x315c85 % 100 == 900) {
				_0xf1fecf = Board.tiles.findIndex(e => e.value == String(Tiles.okey));
			}
			if (_0x315c85 - _0x315c85 % 100 == 800) {
				_0xf1fecf = Board.tiles.findIndex(e => e.value == "000");
				_0x5b13d2 = 1;
			}
			if (Board.getOkeyKont == 0) {
				// _0x4295dd = boardPlaces[_0xf1fecf * 1 + 1];
				// boardPlaces[_0xf1fecf * 1 + 1] = 0;
				Board.tiles[_0xf1fecf] = '';
			}
			if (_0x5486c5) {
				Board.sayTableTilesTemp = Board.sayTableTiles;
				Board.sayTableTiles = _0x5486c5;
				_0x4295dd = 0;
			} else {
				Board.sayTableTiles++;
			}
			if (_0x315c85 == Board.leftHandCont || Board.leftHandCont == "000" && _0x5b13d2 == 1) {
				var _0x57b199 = Board.leftHandCont % 100;
				_0x57b199 = _0x57b199 * 10;
				Board.leftHandContTemp = Board.leftHandCont;
				Board.leftHandTileTemp = Board.leftHandTile;
				Board.leftHandCont = 0;
				Board.leftHandTile = 0;
				if (activePlayer == 1) {
					if (settingsPunish == 1 && (settingsType == 2 || settingsType == 3)) {
						this.changePoint(_0x57b199, 4, 1);
					}
					// $("area-4").innerHTML = '';
					// $("area-4").classList.remove("drop");
				}
			}
			
			let diff = 0;
			var tileW = 1;
			var tileH = 1;
			var _0x383df0 = tileW * 0.54;
			var _0x3af68e = tileH * 0.54;
			var _0x2378b2 = _0x383df0 * 0.04;
			var _0x29cbcd = _0x3af68e * 0.04;
			if (Board.stone == Board.lastStone) {
				if (Board.stone > 10 && _0x14df73 == 1) {
					diff--;
				} else {
					diff++;
				}
			}
			var _0x51fce2;
			var _0x5a1841;
			if (_0x14df73 == 1) {
				_0x51fce2 = Board.stone - 1 + diff * 1;
				_0x5a1841 = Board.tableH[seat];
			}
			if (_0x14df73 == 2) {
				_0x51fce2 = diff * 1;
				_0x5a1841 = Board.tableHdouble[seat];
			}
			if (_0x5f22f9 > -1) {
				_0x51fce2 = _0x5f22f9;
			}
			if (_0x4693ec > -1) {
				_0x5a1841 = _0x4693ec;
			}
			if (seat == 1) {
				if (_0x14df73 == 1) {
					Board.tableUser1[_0x5a1841][_0x51fce2] = _0x315c85;
					Board.tableUserTiles1[_0x5a1841][_0x51fce2] = Board.sayTableTiles;
				}
				if (_0x14df73 == 2) {
					Board.tableDoubleUser1[_0x5a1841][_0x51fce2] = _0x315c85;
					Board.tableDoubleUserTiles1[_0x5a1841][_0x51fce2] = Board.sayTableTiles;
				}
			}
			if (seat == 2) {
				if (_0x14df73 == 1) {
					Board.tableUser2[_0x5a1841][_0x51fce2] = _0x315c85;
					Board.tableUserTiles2[_0x5a1841][_0x51fce2] = Board.sayTableTiles;
				}
				if (_0x14df73 == 2) {
					Board.tableDoubleUser2[_0x5a1841][_0x51fce2] = _0x315c85;
					Board.tableDoubleUserTiles2[_0x5a1841][_0x51fce2] = Board.sayTableTiles;
				}
			}
			if (seat == 3) {
				if (_0x14df73 == 1) {
					Board.tableUser3[_0x5a1841][_0x51fce2] = _0x315c85;
					Board.tableUserTiles3[_0x5a1841][_0x51fce2] = Board.sayTableTiles;
				}
				if (_0x14df73 == 2) {
					Board.tableDoubleUser3[_0x5a1841][_0x51fce2] = _0x315c85;
					Board.tableDoubleUserTiles3[_0x5a1841][_0x51fce2] = Board.sayTableTiles;
				}
			}
			if (seat == 4) {
				if (_0x14df73 == 1) {
					Board.tableUser4[_0x5a1841][_0x51fce2] = _0x315c85;
					Board.tableUserTiles4[_0x5a1841][_0x51fce2] = Board.sayTableTiles;
				}
				if (_0x14df73 == 2) {
					Board.tableDoubleUser4[_0x5a1841][_0x51fce2] = _0x315c85;
					Board.tableDoubleUserTiles4[_0x5a1841][_0x51fce2] = Board.sayTableTiles;
				}
			}
			if (Board.getOkeyKont == 0) {
				if (!_0x5486c5) {
					Board.collect.push(seat + ',' + "tile-mini2-" + Board.sayTableTiles + ',' + _0x5a1841 + ',' + _0x51fce2 + ',' + _0x14df73);
					if (activePlayer == 1) {
						this.buttonActivePassive("collect", 1);
					}
				}
				// this.moveTile(_0x4295dd, seat, _0x383df0 * 0.7 * _0x5a1841, _0x383df0 * 0.49 * _0x51fce2, _0x14df73, "tile-mini2-" + Board.sayTableTiles);
			}
			var _0x4d23cf = null;
			if (_0x315c85 - _0x315c85 % 100 == 800) {
				_0x4d23cf = Board.stone;
				Board.stone = 'R';
				Board.color1 = 0;
			}
			var _0x469b85;
			if (_0x14df73 == 1) {
				_0x469b85 = "sort";
			}
			if (_0x14df73 == 2) {
				_0x469b85 = "double";
			}
			if (!_0x5486c5) {
				// $("user" + seat + "-table-" + _0x469b85).innerHTML += "<div id=\"tile-mini2-" + sayTableTiles + "\" class=\"tile " + color[color1] + "\">" + sayTableTiles + "</div>";
			}
			// $("tile-mini2-" + sayTableTiles).style.left = _0x2378b2 * 1 + _0x383df0 * 0.49 * _0x51fce2 + 'px';
			// $("tile-mini2-" + sayTableTiles).style.top = _0x29cbcd * 1 + _0x383df0 * 0.7 * _0x5a1841 + 'px';
			// $("tile-mini2-" + sayTableTiles).style.width = _0x383df0 * 0.45 + 'px';
			// $("tile-mini2-" + sayTableTiles).style.height = _0x3af68e * 0.45 + 'px';
			// $("tile-mini2-" + sayTableTiles).style.lineHeight = _0x3af68e * 0.28 + 'px';
			// $("tile-mini2-" + sayTableTiles).style.fontSize = _0x383df0 * 0.35 + 'px';
			// $("tile-mini2-" + sayTableTiles).style.borderRadius = _0x383df0 * 0.05 + 'px';
			;
			if (Board.getOkeyKont == 0) {
				// $("tile-mini2-" + sayTableTiles).style.visibility = "hidden";
			}
			// $("tile-mini2-" + sayTableTiles).innerHTML = "<div id='face-mini2-" + sayTableTiles + "' style='display:block'><div class='point2-mini'>" + "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" class=\"heart2-mini\" viewBox=\"0 0 16 16\"> <path fill-rule=\"evenodd\" d=\"M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z\"/> </svg>" + "</div><div id='Letter-mini2-" + j + '-' + i + "'>" + stone + "</div></div>";
			if (_0x315c85 - _0x315c85 % 100 == 900) {
				// $("face-mini2-" + sayTableTiles).style.display = "none";
			}
			if (_0x4d23cf) {
				Board.stone = _0x4d23cf;
			}
			Board.lastStone = Board.stone;
			if (_0x5486c5) {
				Board.sayTableTiles = Board.sayTableTilesTemp;
			}
		},
		putOkeyToTable(seat) {
			let oI = Board.tiles.findIndex(e => e.value == Tiles.okey);
			if (oI == -1) return 0;
			
			var _0xecd2ba;
			var _0x2f62c4;
			var _0x3b82ff = 0;
			for (let k=12; k>=0; k--) {
				for (let j=0; j<7; j++) {
					_0xecd2ba = j;
					_0x2f62c4 = k;
					if (Board.tableUser1[j][k] == 0 && Board.tableUser1[j][k - 1] && Board.tableUser1[j][k - 1] % 100 - Board.tableUser1[j][k - 2] % 100 == 1) {
						_0x3b82ff = Board.tableUser1[j][k - 1] % 100 + 1;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(1, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser1[j][k] == 0 && Board.tableUser1[j][k * 1 + 1] && Board.tableUser1[j][k * 1 + 2] % 100 - Board.tableUser1[j][k * 1 + 1] % 100 == 1) {
						_0x3b82ff = Board.tableUser1[j][k * 1 + 1] % 100 - 1;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(1, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser1[j][k] == 0 && Board.tableUser1[j][k - 4] == 0 && Board.tableUser1[j][k - 1] && Board.tableUser1[j][k - 1] % 100 == Board.tableUser1[j][k - 3] % 100 == 1) {
						_0x3b82ff = Board.tableUser1[j][k - 1] % 100;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(1, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser1[j][k] == 0 && Board.tableUser1[j][k * 1 + 4] == 0 && Board.tableUser1[j][k * 1 + 1] && Board.tableUser1[j][k * 1 + 1] % 100 == Board.tableUser1[j][k * 1 + 3] % 100 == 1) {
						_0x3b82ff = Board.tableUser1[j][k * 1 + 1] % 100;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(1, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser2[j][k] == 0 && Board.tableUser2[j][k - 1] && Board.tableUser2[j][k - 1] % 100 - Board.tableUser2[j][k - 2] % 100 == 1) {
						_0x3b82ff = Board.tableUser2[j][k - 1] % 100 + 1;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(2, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser2[j][k] == 0 && Board.tableUser2[j][k * 1 + 1] && Board.tableUser2[j][k * 1 + 2] % 100 - Board.tableUser2[j][k * 1 + 1] % 100 == 1) {
						_0x3b82ff = Board.tableUser2[j][k * 1 + 1] % 100 - 1;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(2, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser2[j][k] == 0 && Board.tableUser2[j][k - 4] == 0 && Board.tableUser2[j][k - 1] && Board.tableUser2[j][k - 1] % 100 == Board.tableUser2[j][k - 3] % 100 == 1) {
						_0x3b82ff = Board.tableUser2[j][k - 1] % 100;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(2, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser2[j][k] == 0 && Board.tableUser2[j][k * 1 + 4] == 0 && Board.tableUser2[j][k * 1 + 1] && Board.tableUser2[j][k * 1 + 1] % 100 == Board.tableUser2[j][k * 1 + 3] % 100 == 1) {
						_0x3b82ff = Board.tableUser2[j][k * 1 + 1] % 100;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(2, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser3[j][k] == 0 && Board.tableUser3[j][k - 1] && Board.tableUser3[j][k - 1] % 100 - Board.tableUser3[j][k - 2] % 100 == 1) {
						_0x3b82ff = Board.tableUser3[j][k - 1] % 100 + 1;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(3, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser3[j][k] == 0 && Board.tableUser3[j][k * 1 + 1] && Board.tableUser3[j][k * 1 + 2] % 100 - Board.tableUser3[j][k * 1 + 1] % 100 == 1) {
						_0x3b82ff = Board.tableUser3[j][k * 1 + 1] % 100 - 1;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(3, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser3[j][k] == 0 && Board.tableUser3[j][k - 4] == 0 && Board.tableUser3[j][k - 1] && Board.tableUser3[j][k - 1] % 100 == Board.tableUser3[j][k - 3] % 100 == 1) {
						_0x3b82ff = Board.tableUser3[j][k - 1] % 100;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(3, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser3[j][k] == 0 && Board.tableUser3[j][k * 1 + 4] == 0 && Board.tableUser3[j][k * 1 + 1] && Board.tableUser3[j][k * 1 + 1] % 100 == Board.tableUser3[j][k * 1 + 3] % 100 == 1) {
						_0x3b82ff = Board.tableUser3[j][k * 1 + 1] % 100;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(3, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser4[j][k] == 0 && Board.tableUser4[j][k - 1] && Board.tableUser4[j][k - 1] % 100 - Board.tableUser4[j][k - 2] % 100 == 1) {
						_0x3b82ff = Board.tableUser4[j][k - 1] % 100 + 1;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(4, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser4[j][k] == 0 && Board.tableUser4[j][k * 1 + 1] && Board.tableUser4[j][k * 1 + 2] % 100 - Board.tableUser4[j][k * 1 + 1] % 100 == 1) {
						_0x3b82ff = Board.tableUser4[j][k * 1 + 1] % 100 - 1;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(4, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser4[j][k] == 0 && Board.tableUser4[j][k - 4] == 0 && Board.tableUser4[j][k - 1] && Board.tableUser4[j][k - 1] % 100 == Board.tableUser4[j][k - 3] % 100 == 1) {
						_0x3b82ff = Board.tableUser4[j][k - 1] % 100;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(4, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
					if (Board.tableUser4[j][k] == 0 && Board.tableUser4[j][k * 1 + 4] == 0 && Board.tableUser4[j][k * 1 + 1] && Board.tableUser4[j][k * 1 + 1] % 100 == Board.tableUser4[j][k * 1 + 3] % 100 == 1) {
						_0x3b82ff = Board.tableUser4[j][k * 1 + 1] % 100;
						_0x3b82ff = _0x3b82ff % 100 + 900;
						this.moveToTable(4, _0x3b82ff, _0x2f62c4, _0xecd2ba, 1);
						Board.tileLimits[seat]--;
						this.updateBoard();
						return 0;
					}
				}
			}
		},
		popMessage(msg) {
			console.log(msg);
		}
	};

	return { Engine, Board, Tiles, AI };

})();
