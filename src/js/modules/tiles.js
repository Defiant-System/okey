
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

		if (settingsType == 1) this.tileLimit = 14;
		if (settingsType == 2) this.tileLimit = 21;
		if (settingsType == 3) this.tileLimit = 14;
	},
	restore(state) {
		this.data = state.table.data.map((value, i) => ({ tile: i+1, value }));
		this.okey = state.table.okey;
		// remove one tile from tile stack
		this.tilesLeft = this.data.slice();

		this.deliver();

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
		Board.tiles1 = [];
		Board.tiles2 = [];
		Board.tiles3 = [];
		Board.tiles4 = [];
		// var _0x2c717f = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		this.tileIndex = 0;
		activePlayer = 1;
		Board.tiles = [];
		// boardPlaces = [];
		for (let i=0; i<=this.tileLimit; i++) {
			Board.tiles.push(this.data[this.tileIndex]);
			Engine.updateLeftTiles(this.data[this.tileIndex]);
			this.tileIndex++;
			// Engine.place("tile-"+ this.tileIndex, _0x2c717f[i]);
		}
		Board.tiles1 = Board.tiles.slice();
		// boardPlaces1 = boardPlaces.slice();
		activePlayer = 2;
		Board.tiles = [];
		// boardPlaces = [];
		for (let i=0; i<this.tileLimit; i++) {
			Board.tiles.push(this.data[this.tileIndex]);
			Engine.updateLeftTiles(this.data[this.tileIndex]);
			this.tileIndex++;
			// Engine.place("tile-"+ this.tileIndex, _0x2c717f[i]);
		}
		Board.tiles2 = Board.tiles.slice();
		// boardPlaces2 = boardPlaces.slice();
		activePlayer = 3;
		Board.tiles = [];
		// boardPlaces = [];
		for (let i=0; i<this.tileLimit; i++) {
			Board.tiles.push(this.data[this.tileIndex]);
			Engine.updateLeftTiles(this.data[this.tileIndex]);
			this.tileIndex++;
			// Engine.place("tile-"+ this.tileIndex, _0x2c717f[i]);
		}
		Board.tiles3 = Board.tiles.slice();
		// boardPlaces3 = boardPlaces.slice();
		activePlayer = 4;
		Board.tiles = [];
		// boardPlaces = [];
		for (let i=0; i<this.tileLimit; i++) {
			Board.tiles.push(this.data[this.tileIndex]);
			Engine.updateLeftTiles(this.data[this.tileIndex]);
			this.tileIndex++;
			// Engine.place("tile-"+ this.tileIndex, _0x2c717f[i]);
		}
		activePlayer = 1;

		var _0x5f031e = 0;
		for (let i=1; i<=8; i++) {
			for (let j=1; j<=13; j++) {
				var stone = parseInt(this.data[_0x5f031e].value.substr(1, 2));
				var color1 = this.data[_0x5f031e].value.substr(0, 1);
				if (stone == 0) stone = 'R';
				_0x5f031e++;
			}
		}
		for (let j=104; j<=105; j++) {
			var stone = parseInt(this.data[_0x5f031e].value.substr(1, 2));
			var color1 = this.data[_0x5f031e].value.substr(0, 1);
			if (stone == 0) stone = 'R';
			_0x5f031e++;
		}
		let x = parseInt(this.data[_0x5f031e - 1].value.substr(0, 1));
		let y = parseInt(this.data[_0x5f031e - 1].value.substr(1, 2));
		Tiles.okey = y * 1 + 1;
		if (Tiles.okey > 13) Tiles.okey = 1;
		if (Tiles.okey < 10) Tiles.okey = '0' + Tiles.okey;
		Tiles.okey = String(x) + String(Tiles.okey);
	},
	shuffle() {
		let shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
		this.data = shuffleArray(this.data);
		this.tilesLeft = this.data.slice();
		if (this.data[105].value == "000") return this.shuffle();
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
	sortTiles(num, sort) {
		boardTilesVir = Board.tiles.slice().sort();
		Board.tiles.sort((a, b) => a - b);
		let asc = [];
		let sorted = [];
		let arr3 = 0;
		let arr4 = 0;
		let min = parseInt(boardTilesVir[0]);
		asc.push(boardTilesVir[0]);
		let max = 999;

		for (let i=1; i<boardTilesVir.length; i++) {
			let _0x35e4cc = parseInt(boardTilesVir[i]);
			let _0x1bf143 = 0;
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
		boardTilesVir = Board.tiles.slice().sort();
		boardTilesVir.sort((a, b) => a % 100 > b % 100 ? 1 : b % 100 > a % 100 ? -1 : 0);
		let arr1 = [];
		let arr2 = [];
		let val1 = 0;
		let val2 = 0;
		let min = parseInt(boardTilesVir[0]);
		arr1.push(boardTilesVir[0]);
		for (let i=1; i<=boardTilesVir.length; i++) {
			let tileValue = parseInt(boardTilesVir[i]);
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
	sortDouble(seat, asc) {
		boardTilesVir = Board.tiles.slice().sort();
		boardTilesVir.sort((a, b) => a % 100 > b % 100 ? 1 : b % 100 > a % 100 ? -1 : 0);
		let arr1 = [];
		let arr2 = [];
		let index1 = 0;
		let index2 = 0;
		let min;
		min = parseInt(boardTilesVir[0]);
		arr1.push(boardTilesVir[0]);
		for (let i=1; i<=boardTilesVir.length; i++) {
			if (boardTilesVir[i] != "800") {
				let _0x596912 = parseInt(boardTilesVir[i]);
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
				min = parseInt(boardTilesVir[i]);
			}
		}
		for (let i=0; i<=arr2.length; i++) {
			boardTilesVir = this.removeArrayItem(boardTilesVir, arr2[i]);
			index2 = index2 * 1 + arr2[i] % 100;
		}
		if (asc == 0 && ((settingsType == 1 || settingsType == 2 || settingsType == 3))) return index1;
		if (asc == 1) return arr2;
	}
};
