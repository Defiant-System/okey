
let Tiles = {
	init() {
		this.reset();

		let index = 1;
		for (let j=1; j<=4; j++) {
			for (let i=1; i<=13; i++) {
				let x = String(i);
				if (i < 10) x = "0" + x;
				this.data.push({ tile: index++, value: j + x });
			}
			for (let i=1; i<=13; i++) {
				let x = String(i);
				if (i < 10) x = "0" + x;
				this.data.push({ tile: index++, value: j + x });
			}
		}
		// jokers
		this.data.push({ tile: index++, value: "000" });
		this.data.push({ tile: index++, value: "000" });
		// this.shuffle();
	},
	reset() {
		this.data = [];
		this.tileIndex = 0;

		activePlayer = 1;

		if (settingsType == 1) this.tileLimit = 14;
		if (settingsType == 2) this.tileLimit = 21;
		if (settingsType == 3) this.tileLimit = 14;
	},
	restore(state) {
		this.data = state.table.data.map((value, i) => ({ tile: i+1, value }));
		// this.okey = state.table.okey;
		// remove one tile from tile stack
		this.tilesLeft = this.data.slice();

		this.deliver();

		// console.log( Board );

		// table UI update
		// Engine.updateLeftTiles();
	},
	parse(tile) {
		let id = tile.toString(),
			clr = Colors[+id.slice(0,1)],
			num = new Number(id.slice(1)) * 1;
		if (+id.slice(0,1) == "0") {
			clr = Colors[0];
			num = "j";
		}
		if (+id.slice(0,1) > 8) {
			clr = "okey";
		}
		return { id, clr, num };
	},
	deliver() {
		Board.tiles = [];
		Board.tiles1 = [];
		Board.tiles2 = [];
		Board.tiles3 = [];
		Board.tiles4 = [];
		this.tileIndex = 0;

		for (let i=0; i<=this.tileLimit; i++) {
			Board.tiles1.push(this.data[this.tileIndex]);
			Engine.updateLeftTiles(this.data[this.tileIndex]);
			this.tileIndex++;
		}
		for (let i=0; i<this.tileLimit; i++) {
			Board.tiles2.push(this.data[this.tileIndex]);
			Engine.updateLeftTiles(this.data[this.tileIndex]);
			this.tileIndex++;
		}
		for (let i=0; i<this.tileLimit; i++) {
			Board.tiles3.push(this.data[this.tileIndex]);
			Engine.updateLeftTiles(this.data[this.tileIndex]);
			this.tileIndex++;
		}
		for (let i=0; i<this.tileLimit; i++) {
			Board.tiles4.push(this.data[this.tileIndex]);
			Engine.updateLeftTiles(this.data[this.tileIndex]);
			this.tileIndex++;
		}

		let x = parseInt(this.data[105].value.substr(0, 1));
		let y = parseInt(this.data[105].value.substr(1, 2));
		Tiles.okey = y + 1;
		if (Tiles.okey > 13) Tiles.okey = 1;
		if (Tiles.okey < 10) Tiles.okey = "0"+ Tiles.okey;
		Tiles.okey = ""+ x + Tiles.okey;

		console.log( Tiles.okey );
	},
	shuffle() {
		let shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
		this.data = shuffleArray(this.data);
		this.tilesLeft = this.data.slice();
		if (this.data[105].value == "000") return this.shuffle();
	},
	removeArrayItem(arr, item, fromEnd) {
		let index;
		let fn = typeof item === "string" ? e => e.value == item : e => e == item;
		if (fromEnd != 1) index = arr.findIndex(fn);
		if (fromEnd == 1) index = arr.findLastIndex(fn);
		if (index > -1) {
			arr.splice(index, 1);
			return arr;
		}
		return arr;
	},
	sortTiles(num, sort) {
		boardTilesVir = Board.tiles.slice().sort();
		Board.tiles.sort((a, b) => a.value - b.value);
		let asc = [];
		let sorted = [];
		let arr3 = 0;
		let arr4 = 0;
		let min = parseInt(boardTilesVir[0].value);
		asc.push(boardTilesVir[0]);
		let max = { value: "999" };

		for (let i=1; i<boardTilesVir.length; i++) {
			let _0x35e4cc = parseInt(boardTilesVir[i].value);
			let _0x1bf143 = 0;
			if (_0x35e4cc - 1 == min) {
				asc.push(boardTilesVir[i]);
				_0x1bf143 = 1;
			}
			if (settingsType == 1) {
				if (min % 100 == 1) {
					max = { value: String(min) };
				}
				if (min - max.value == 12) {
					asc.push(max);
					_0x1bf143 = 2;
					max = { value: "999" };
				}
			}
			if (_0x1bf143 == 0 && _0x35e4cc != min || _0x35e4cc == min && asc.length == 0) {
				asc = [];
				asc.push(boardTilesVir[i]);
			}
			if (asc.length == num || _0x1bf143 == 2) {
				if (asc.length == num) {
					if (asc[0].value == max.value) {
						max = { value: "999" };
					}
					sorted.push.apply(sorted, asc);
					sorted.push("");
					arr3++;
				}
				asc = [];
			}
			min = parseInt(boardTilesVir[i].value);
			if (_0x1bf143 == 2) {
				asc.push(boardTilesVir[i]);
			}
		}
		for (let i=0; i<sorted.length; i++) {
			boardTilesVir = this.removeArrayItem(boardTilesVir, sorted[i]);
			if (sorted[i]) arr4 = arr4 * 1 + sorted[i].value % 100;
		}
		if (sort == 0) {
			if (settingsType == 1) return arr3;
			if (settingsType == 2 || settingsType == 3) return arr4;
		}
		if (sort == 1) return sorted;
	},
	sortTilesByColor(num, type) {
		boardTilesVir = Board.tiles.slice().sort();
		boardTilesVir.sort((a, b) => a.value % 100 > b.value % 100 ? 1 : b.value % 100 > a.value % 100 ? -1 : 0);
		let arr1 = [];
		let arr2 = [];
		let val1 = 0;
		let val2 = 0;
		let min = parseInt(boardTilesVir[0].value);
		arr1.push(boardTilesVir[0]);
		for (let i=1; i<=boardTilesVir.length; i++) {
			let tileValue = parseInt((boardTilesVir[i] || {}).value);
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
			min = tileValue;
		}
		for (let i=0; i<=arr2.length; i++) {
			if (arr2[i]) {
				boardTilesVir = this.removeArrayItem(boardTilesVir, arr2[i]);
				val2 = val2 * 1 + arr2[i].value % 100;
			}
		}
		if (type == 0) {
			if ([1].includes(settingsType)) return val1;
			if ([2,3].includes(settingsType)) return val2;
		}
		if (type == 1) return arr2;
	},
	sortDouble(seat, asc) {
		boardTilesVir = Board.tiles.slice().sort();
		boardTilesVir.sort((a, b) => a.value % 100 > b.value % 100 ? 1 : b.value % 100 > a.value % 100 ? -1 : 0);
		let arr1 = [];
		let arr2 = [];
		let index1 = 0;
		let index2 = 0;
		let min;
		min = parseInt(boardTilesVir[0].value);
		arr1.push(boardTilesVir[0]);
		for (let i=1; i<=boardTilesVir.length; i++) {
			if (boardTilesVir[i].value != "800") {
				let _0x596912 = parseInt(boardTilesVir[i].value);
				if (_0x596912 == min) {
					arr1.push(boardTilesVir[i]);
					arr2.push.apply(arr2, arr1);
					arr2.push("");
					arr1 = [];
					index1++;
				} else {
					if (_0x596912 != min) {
						arr1 = [];
						arr1.push(boardTilesVir[i]);
					}
				}
				min = parseInt(boardTilesVir[i].value);
			}
		}
		for (let i=0; i<=arr2.length; i++) {
			boardTilesVir = this.removeArrayItem(boardTilesVir, arr2[i]);
			index2 = index2 * 1 + arr2[i].value % 100;
		}
		if (asc == 0 && ((settingsType == 1 || settingsType == 2 || settingsType == 3))) return index1;
		if (asc == 1) return arr2;
	},
	checkPer(num) {
		let tiles = Board.tiles.slice();
		let arr = tiles.slice();
		let sort1 = this.sortTiles(num, 0);
		tiles = boardTilesVir.slice();
		let sortC2 = this.sortTilesByColor(num, 0);
		tiles = arr.slice();
		sortC2 = this.sortTilesByColor(num, 0);
		tiles = boardTilesVir.slice();
		let sort2 = this.sortTiles(num, 0);
		tiles = arr.slice();
		let score1 = sort1 * 1 + sortC2 * 1;
		let score2 = sortC2 * 1 + sort2 * 1;

		return score1 >= score2 ? 1 : 0;
	},
	addFourth() {
		let bTiles = Board.tiles;
		for (let k=0; k<=1; k++) {
			for (let i=0; i<bTiles.length; i++) {
				for (let j=0; j<perFull.length; j++) {
					if (perFull[j] == "") {
						let _0x39a913 = bTiles[i].value;
						if (settingsType == 1) {
							if (bTiles[i] % 100 == 1) {
								_0x39a913 = bTiles[i].value * 1 + 13;
							}
						}
						if (perFull[j-1].value*1+1 == _0x39a913 && perFull[j-2].value*1+2 == _0x39a913 && perFull[j-3].value*1+3 == _0x39a913) {
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
			let index = 0;
			for (let j=0; j<perFull.length; j++) {
				index++;
				if (perFull[j] == "") {
					if (index == 4) {
						if (perFull[j-3].value % 100 == bTiles[i].value % 100 && perFull[j-2].value % 100 == bTiles[i].value % 100 && perFull[j-1].value % 100 == bTiles[i].value % 100 && perFull[j-1].value != bTiles[i].value && perFull[j-2].value != bTiles[i].value && perFull[j-3].value != bTiles[i].value) {
							perFull.splice(j, 0, bTiles[i]);
							boardTilesVir = this.removeArrayItem(boardTilesVir, bTiles[i]);
							bTiles = this.removeArrayItem(bTiles, bTiles[i]);
						}
					}
					index = 0;
				}
			}
		}
		return bTiles;
	},
	addOkey(seat) {
		Board.tiles.sort();
		Board.tiles.sort((a, b) => a - b);
		boardTilesVir = Board.tiles.slice();
		if (seat == 1) {
			let index;
			for (let i=2; i<=Board.tiles.length * 1 + 3; i++) {
				if (Board.tiles[i-1].value % 100 == 1 && settingsType == 1) {
					index = i - 1;
				}
				if (index && Board.tiles[i].value - Board.tiles[i-1].value == 1 && Board.tiles[i+1].value - Board.tiles[i].value == 2 && Board.tiles[i+1].value - Board.tiles[index].value == 12 && settingsType == 1) {
					perFull.push(Board.tiles[i-1]);
					perFull.push(Board.tiles[i]);
					perFull.push({ value: "800" });
					perFull.push(Board.tiles[i+1]);
					perFull.push(Board.tiles[index]);
					perFull.push("");
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i-1]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i+1]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[index]);
					Board.tiles = boardTilesVir.slice();
					okeyCont--;
					if (okeyCont == 0) return 0;
				}
				if (Board.tiles[i-1].value - Board.tiles[i-2].value == 2 && Board.tiles[i].value - Board.tiles[i-1].value == 1 && Board.tiles[i+1].value - Board.tiles[i].value == 1 || Board.tiles[i-1].value - Board.tiles[i-2].value == 1 && Board.tiles[i].value - Board.tiles[i-1].value == 2 && Board.tiles[i+1].value - Board.tiles[i].value == 1) {
					perFull.push(Board.tiles[i-2]);
					if (Board.tiles[i-1].value - Board.tiles[i-2].value > 1) {
						perFull.push({ value: "800" });
					}
					perFull.push(Board.tiles[i-1]);
					if (Board.tiles[i].value - Board.tiles[i-1].value > 1) {
						perFull.push({ value: "800" });
					}
					perFull.push(Board.tiles[i]);
					perFull.push(Board.tiles[i+1]);
					perFull.push("");
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i+1]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i-1]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i-2]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
					Board.tiles = boardTilesVir.slice();
					okeyCont--;
					if (okeyCont == 0) return 0;
				}
				if (index && (Board.tiles[i].value - Board.tiles[i-1].value == 1 && Board.tiles[i].value - Board.tiles[index].value == 11 || Board.tiles[i].value - Board.tiles[i-1].value == 2 && Board.tiles[i].value - Board.tiles[index].value == 12) && settingsType == 1) {
					perFull.push(Board.tiles[i-1]);
					if (Board.tiles[i].value - Board.tiles[i-1].value == 2) {
						perFull.push({ value: "800" });
					}
					perFull.push(Board.tiles[i]);
					if (Board.tiles[i].value - Board.tiles[i-1].value == 1) {
						perFull.push({ value: "800" });
					}
					perFull.push(Board.tiles[index]);
					perFull.push("");
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i-1]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[index]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
					Board.tiles = boardTilesVir.slice();
					okeyCont--;
					if (okeyCont == 0) return 0;
				}
				if (Board.tiles[i-1].value - Board.tiles[i-2].value == 2 && Board.tiles[i].value - Board.tiles[i-1].value == 1 || Board.tiles[i-1].value - Board.tiles[i-2].value == 1 && Board.tiles[i].value - Board.tiles[i-1].value == 2) {
					perFull.push(Board.tiles[i-2]);
					if (Board.tiles[i-1].value - Board.tiles[i-2].value > 1) {
						perFull.push({ value: "800" });
					}
					perFull.push(Board.tiles[i-1]);
					if (Board.tiles[i].value - Board.tiles[i-1].value > 1) {
						perFull.push({ value: "800" });
					}
					perFull.push(Board.tiles[i]);
					perFull.push("");
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i-1]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i-2]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
					Board.tiles = boardTilesVir.slice();
					okeyCont--;
					if (okeyCont == 0) return 0;
				}
			}
		}
		if (seat == 2) {
			let index;
			for (let i=1; i<Board.tiles.length; i++) {
				if (Board.tiles[i].value - Board.tiles[i-1].value == 2) {
					perHalf.push(Board.tiles[i-1]);
					perHalf.push({ value: "800" });
					perHalf.push(Board.tiles[i]);
					perHalf.push("");
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i-1]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
					Board.tiles = boardTilesVir.slice();
					okeyCont--;
					if (okeyCont == 0) return 0;
				}
				if (Board.tiles[i-1].value % 100 == 1 && settingsType == 1) {
					index = i - 1;
				}
				if (index && Board.tiles[i].value - Board.tiles[index].value == 11 && settingsType == 1) {
					perHalf.push(Board.tiles[i]);
					perHalf.push({ value: "800" });
					perHalf.push(Board.tiles[index]);
					perHalf.push("");
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[index]);
					boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
					Board.tiles = boardTilesVir.slice();
					okeyCont--;
					if (okeyCont == 0) return 0;
				}
			}
		}
		if (seat == 3) {
			for (let j=0; j<perHalf.length; j++) {
				if (perHalf[j] == "" && ((settingsType == 2 || settingsType == 3) && perHalf[j-1].value % 100 != 13 || settingsType == 1)) {
					if (perHalf[j-1].value - perHalf[j-2].value == 1) {
						perHalf.splice(j, 0, "800");
						okeyCont--;
						boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
						Board.tiles = this.removeArrayItem(Board.tiles, "800");
						if (okeyCont == 0) return 0;
					}
					if (perHalf[j-2].value - perHalf[j-1].value == 12 && settingsType == 1) {
						perHalf.splice(j-2, 0, "800");
						okeyCont--;
						boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
						Board.tiles = this.removeArrayItem(Board.tiles, "800");
						if (okeyCont == 0) return 0;
					}
				}
			}
			for (let j=0; j<perHalf.length; j++) {
				if (perHalf[j] == "") {
					if (perHalf[j-1].value % 100 == perHalf[j-2].value % 100 && perHalf[j-1].value != perHalf[j-2].value) {
						perHalf.splice(j, 0, "800");
						okeyCont--;
						boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
						Board.tiles = this.removeArrayItem(Board.tiles, "800");
						if (okeyCont == 0) return 0;
					}
				}
			}
		}
		if (seat == 4) {
			for (let j=0; j<perFull.length; j++) {
				if (perFull[j] == "" && ((settingsType == 2 || settingsType == 3) && perFull[j-1].value % 100 != 13 || settingsType == 1)) {
					if (perFull[j-1].value - perFull[j-2].value == 1) {
						for (let i=0; i<Board.tiles.length; i++) {
							if (Board.tiles[i].value - perFull[j-1].value == 2) {
								perFull.splice(j, 0, "800");
								perFull.splice(j + 1, 0, Board.tiles[i]);
								okeyCont--;
								boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
								Board.tiles = this.removeArrayItem(Board.tiles, "800");
								boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i]);
								Board.tiles = this.removeArrayItem(Board.tiles, Board.tiles[i]);
								if (okeyCont == 0) return 0;
							}
						}
					}
				}
			}
			for (let j=0; j<perFull.length; j++) {
				if ((perFull[j-1] == "" || j == 0) && perFull[j+1].value % 100 != 1) {
					if (perFull[j+1].value - perFull[j].value == 1) {
						for (let i=0; i<Board.tiles.length; i++) {
							if (perFull[j].value - Board.tiles[i].value == 2) {
								perFull.splice(j, 0, "800");
								perFull.splice(j, 0, Board.tiles[i]);
								okeyCont--;
								boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
								Board.tiles = this.removeArrayItem(Board.tiles, "800");
								boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i]);
								Board.tiles = this.removeArrayItem(Board.tiles, Board.tiles[i]);
								if (okeyCont == 0) return 0;
							}
						}
					}
				}
			}
			for (let j=0; j<perFull.length; j++) {
				if (perFull[j] == "" && perFull[j-1].value % 100 == 12 && settingsType == 1) {
					if (perFull[j-1].value - perFull[j-2].value == 1) {
						for (let i=0; i<Board.tiles.length; i++) {
							if (perFull[j-1].value - Board.tiles[i].value == 11) {
								perFull.splice(j, 0, Board.tiles[i]);
								perFull.splice(j, 0, "800");
								boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
								Board.tiles = this.removeArrayItem(Board.tiles, '800');
								boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i]);
								Board.tiles = this.removeArrayItem(Board.tiles, Board.tiles[i]);
								okeyCont--;
								if (okeyCont == 0) return 0;
							}
						}
					}
				}
			}
			for (let j=0; j<perFull.length; j++) {
				if (perFull[j] == "" && ((settingsType == 2 || settingsType == 3) && perFull[j-1].value % 100 != 13 || settingsType == 1)) {
					if (perFull[j-1].value - perFull[j-2].value == 1) {
						perFull.splice(j, 0, "800");
						okeyCont--;
						boardTilesVir = this.removeArrayItem(boardTilesVir, '800');
						Board.tiles = this.removeArrayItem(Board.tiles, "800");
						if (okeyCont == 0) return 0;
					}
				}
			}
			for (let j=0; j<perFull.length; j++) {
				if ((perFull[j - 1] == "" || j == 0) && perFull[j+1].value % 100 != 1) {
					if (perFull[j+2].value - perFull[j+1].value == 1) {
						perFull.splice(j, 0, "800");
						okeyCont--;
						boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
						Board.tiles = this.removeArrayItem(Board.tiles, "800");
						if (okeyCont == 0) return 0;
					}
				}
			}
			let _0x2c0168 = 0;
			for (let j=0; j<perFull.length; j++) {
				_0x2c0168++;
				if (perFull[j] == "") {
					if (perFull[j-1].value % 100 == perFull[j-2].value % 100 && perFull[j-1].value != perFull[j-2].value && _0x2c0168 < 5) {
						perFull.splice(j, 0, "800");
						okeyCont--;
						boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
						Board.tiles = this.removeArrayItem(Board.tiles, "800");
						if (okeyCont == 0) return 0;
					}
					_0x2c0168 = 0;
				}
			}
		}
	},
	addOkeyDouble() {
		Board.tiles.sort();
		Board.tiles.sort((_0x23565a, _0x1c1ef8) => _0x23565a % 100 > _0x1c1ef8 % 100 ? 1 : _0x1c1ef8 % 100 > _0x23565a % 100 ? -1 : 0);
		Board.tiles.reverse();
		for (let i=0; i<=Board.tiles.length; i++) {
			if (Board.tiles[i] != "800") {
				perFull.push(Board.tiles[i]);
				perFull.push("800");
				perFull.push("");
				boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i]);
				boardTilesVir = this.removeArrayItem(boardTilesVir, "800");
				Board.tiles = this.removeArrayItem(Board.tiles, Board.tiles[i]);
				Board.tiles = this.removeArrayItem(Board.tiles, "800");
				okeyCont--;
				if (okeyCont == 0) return 0;
			}
		}
	},
	priority() {
		Board.tiles.sort();
		Board.tiles.sort((a, b) => a - b);
		boardTilesVir = Board.tiles.slice();
		for (let i=1; i<Board.tiles.length; i++) {
			if (Math.abs(Board.tiles[i].value - Board.tiles[i-1].value) == 2) {
				boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i]);
				boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[i - 1]);
				boardTilesVir.unshift(Board.tiles[i]);
				boardTilesVir.unshift(Board.tiles[i - 1]);
			}
		}
		let index = 0;
		for (let i=0; i<perFull.length; i++) {
			index++;
			if (perFull[i] == "") {
				if (index > 3) {
					for (let j=0; j<Board.tiles.length; j++) {
						if ((Board.tiles[j].value - perFull[i-1].value == 2 || perFull[i-index+1].value - Board.tiles[j].value == 2) && (Math.abs(perFull[i-1].value - perFull[i-2].value) == 1 || Math.abs(perFull[i-2].value - perFull[i-3].value) == 1)) {
							boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[j]);
							boardTilesVir.unshift(Board.tiles[j]);
						}
					}
				}
				index = 0;
			}
		}
		index = 0;
		for (let i=0; i<perFull.length; i++) {
			index++;
			if (perFull[i] == "") {
				if (index > 4) {
					for (let j=0; j<Board.tiles.length; j++) {
						if (Board.tiles[j].value - perFull[i-1].value == 1 || perFull[i-index+1].value - Board.tiles[j].value == 1) {
							boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[j]);
							boardTilesVir.unshift(Board.tiles[j]);
						}
					}
				}
				index = 0;
			}
		}
		index = 0;
		for (let i=0; i<perFull.length; i++) {
			index++;
			if (perFull[i] == "") {
				if (index > 4) {
					for (let j=0; j<Board.tiles.length; j++) {
						if (Math.abs(Board.tiles[j].value - perFull[i-1].value) % 100 == 0 && Board.tiles[j].value - perFull[i-1].value != 0 || Math.abs(perFull[i-index+1].value - Board.tiles[j].value) % 100 == 0 && perFull[i-index+1].value - Board.tiles[j].value != 0) {
							boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[j]);
							boardTilesVir.unshift(Board.tiles[j]);
						}
					}
				}
				index = 0;
			}
		}
		index = 0;
		for (let i=0; i<perHalf.length; i++) {
			if (perHalf[i] == "") {
				for (let j=0; j<Board.tiles.length; j++) {
					if ((Math.abs(Board.tiles[j].value - perHalf[i-1].value) % 100 == 0 || Math.abs(Board.tiles[j].value - perHalf[i-2].value) % 100 == 0) && perHalf[i-1].value != Board.tiles[j].value && perHalf[i-2].value != Board.tiles[j].value) {
						boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[j]);
						boardTilesVir.unshift(Board.tiles[j]);
					}
				}
			}
		}
		index = 0;
		for (let i=0; i<perHalf.length; i++) {
			if (perHalf[i] == "") {
				for (let j=0; j<Board.tiles.length; j++) {
					if ((Math.abs(Board.tiles[j].value - perHalf[i-1].value) == 1 || Math.abs(perHalf[i-2].value - Board.tiles[j].value) == 1) && perHalf[i-1].value != Board.tiles[j].value && perHalf[i-2].value != Board.tiles[j].value) {
						boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[j]);
						boardTilesVir.unshift(Board.tiles[j]);
					}
				}
			}
		}
		index = 0;
		for (let i=0; i<perHalf.length; i++) {
			if (perHalf[i] == "") {
				for (let j=0; j<Board.tiles.length; j++) {
					if ((Math.abs(Board.tiles[j].value - perHalf[i-1].value) == 2 || Math.abs(perHalf[i-2].value - Board.tiles[j].value) == 2) && perHalf[i-1].value != Board.tiles[j].value && perHalf[i-2].value != Board.tiles[j].value) {
						boardTilesVir = this.removeArrayItem(boardTilesVir, Board.tiles[j]);
						boardTilesVir.unshift(Board.tiles[j]);
					}
				}
			}
		}
		Board.tiles = boardTilesVir.slice();
	},
};
