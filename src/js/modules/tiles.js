
let Tiles = {
	init() {
		this.reset();

		let index = 1;
		for (let j=1; j<=4; j++) {
			for (let i=1; i<=13; i++) {
				let x = String(i);
				if (i < 10) x = "0" + x;
				this.data.push({ uid: index++, value: j + x, _val: j + x });
			}
			for (let i=1; i<=13; i++) {
				let x = String(i);
				if (i < 10) x = "0" + x;
				this.data.push({ uid: index++, value: j + x, _val: j + x });
			}
		}
		// jokers
		this.data.push({ uid: index++, value: "000", _val: "000" });
		this.data.push({ uid: index++, value: "000", _val: "000" });
		// this.shuffle();
	},
	reset() {
		this.data = [];

		Board.tiles = [];
		Board.tiles1 = [];
		Board.tiles2 = [];
		Board.tiles3 = [];
		Board.tiles4 = [];

		activePlayer = 1;

		if (settingsType == 1) Board.tileLimit = 14;
		if (settingsType == 2) Board.tileLimit = 21;
		if (settingsType == 3) Board.tileLimit = 14;

		Board.tileLimits = [0, Board.tileLimit, Board.tileLimit, Board.tileLimit, Board.tileLimit];
		Board.handleItems = [];
		Board.handleDouble = 0;
		Board.markCont = 0;

		Board.UserSeri = [];
		Board.User1Seri = [];
		Board.User2Seri = [];
		Board.User3Seri = [];
		Board.User4Seri = [];
		Board.UserDouble = [];
		Board.User1Double = [];
		Board.User2Double = [];
		Board.User3Double = [];
		Board.User4Double = [];
	},
	restore(state) {		
		if (state.table.left) {
			// parse table tiles
			state.table.data = state.table.data.map((value, i) => ({ uid: i+1, value, _val: value }));

			let i = 1;
			state.table.left = state.table.left.map(value => ({ uid: i++, value, _val: value }));
			state.melded.series = state.melded.series.map(row => {
				return row.map(value => ({ uid: i++, value, _val: value }));
			});
			state.melded.doubles = state.melded.doubles.map(row => {
				return row.map(value => ({ uid: i++, value, _val: value }));
			});

			// loop players
			state.player.map(player => {
				player.rack = player.rack.map(value => ({ uid: i++, value, _val: value }));
				player.discard = player.discard.map(value => ({ uid: i++, value, _val: value }));

				// player racks
				Board[`tiles${player.seat}`] = player.rack;
				// player names
				APP.game.els.el.find(`.player .seat[data-seat="${player.seat}"] .name`).data({ name: player.name });
				// if player already melded
				if (player.melded) {
					APP.game.dispatch({ type: "user-initial-meld", seat: player.seat, total: player.melded });
				}
				// player discards
				let str = [];
				player.discard.map(tile => {
					let { id, clr, num } = Tiles.parse(tile.value);
					str.push(`<span class="tile ${clr}" data-v="${num}" data-id="${id}" data-uid="${tile.uid}"></span>`);
				});
				APP.game.els.el.find(`.discard .player-${player.seat}`).html(str.join(""));
			});

			// okey tile + tiles left
			this.okey = state.table.okey;
			this.tilesLeft = state.table.left;
			// dealer position
			APP.game.els.el.find(".dealer").data({ pos: state.table.dealer });

			Object.keys(state.melded).map(what => {
				if (state.melded[what].length) {
					// return APP.game.dispatch({ type, from: seat, setTiles, total: Board.UserTotal });
					APP.game.dispatch({ type: `meld-${what}`, setTiles: state.melded[what] });
				}
			});

			// table UI update
			Engine.updateLeftTiles();
			// auto arrange user tiles
			Engine.arrange(1, 1);

			// restore game state
			let rackTiles = state.player
									.map(player => ({ s: player.seat, l: player.rack.slice().filter(e => !!e).length }))
									.sort((a, b) => b.l - a.l);
			activePlayer = rackTiles[0].l === 22 ? rackTiles[0].s : 0;
			if (activePlayer === 0) {
				let discards = state.player
									.map(player => ({ s: player.seat, l: player.discard.length }))
									.filter(e => e.l == 0);
				activePlayer = 4 - discards.length;
			}
			activePlayer = (activePlayer) % 4;
		} else {
			// restore simple tile array
			this.data = state.table.data.map((value, i) => ({ uid: i+1, value, _val: value }));
			this.tilesLeft = this.data.slice();
			this.deliver();
		}
	},
	draw(fromStart) {
		return fromStart ? this.tilesLeft.shift() : this.tilesLeft.pop();
	},
	parse(tile) {
		let id = tile.toString(),
			clr = Colors[+id.slice(0,1)],
			num = new Number(id.slice(1)) * 1;
		if (+id.slice(0,1) == 8 || +id.slice(0,1) == "0") {
			clr = Colors[0];
			num = "j";
		}
		if (id == this.okey || +id.slice(0,1) > 8) {
			clr = "okey";
		}
		return { id, clr, num };
	},
	deliver() {
		let dEl = APP.game.els.el.find(".dealer"),
			dealer = +dEl.data("pos") || Board.dealer;
		dealer = (dealer + 1) % 4;

		for (let i=0; i<Board.tileLimit; i++) { Board.tiles1.push(this.draw(1)); }
		if (dealer == 1) Board[`tiles${dealer}`].push(this.draw(1));
		for (let i=0; i<Board.tileLimit; i++) { Board.tiles2.push(this.draw(1)); }
		if (dealer == 2) Board[`tiles${dealer}`].push(this.draw(1));
		for (let i=0; i<Board.tileLimit; i++) { Board.tiles3.push(this.draw(1)); }
		if (dealer == 3) Board[`tiles${dealer}`].push(this.draw(1));
		for (let i=0; i<Board.tileLimit; i++) { Board.tiles4.push(this.draw(1)); }
		if (dealer == 4) Board[`tiles${dealer}`].push(this.draw(1));

		let okeyValue = this.tilesLeft[this.tilesLeft.length-1].value,
			x = parseInt(okeyValue.substr(0,1),10),
			y = parseInt(okeyValue.substr(1,2),10);
		this.okey = y + 1;
		if (this.okey > 13) this.okey = 1;
		if (this.okey < 10) this.okey = "0"+ this.okey;
		this.okey = ""+ x + this.okey;

		// reset players
		let oppo = Opponents.slice().sort(() => Math.random() - 0.5);
		Engine._state.player = [];
		Engine._state.player.push({ seat: 1, name: ME.firstName, discard: [], rack: [] });
		Engine._state.player.push({ seat: 2, name: oppo.pop(), discard: [], rack: [] });
		Engine._state.player.push({ seat: 3, name: oppo.pop(), discard: [], rack: [] });
		Engine._state.player.push({ seat: 4, name: oppo.pop(), discard: [], rack: [] });
		// set player names
		Engine._state.player.map(player =>
			APP.game.els.el.find(`.player .seat[data-seat="${player.seat}"] .name`).data({ name: player.name }));

		// show how many tiles left
		Engine.updateLeftTiles();
		// auto arrange "series"
		Engine.arrange(1, 1);
	},
	shuffle() {
		let shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
		this.data = shuffleArray(this.data);
		this.tilesLeft = this.data.slice();
		if (this.data[105].value == "000") return this.shuffle();
	},
	removeArrayItem(arr, item, fromEnd) {
		let index;
		let fn = typeof item === "string" ? e => e.value == item : e => e.uid == item.uid;
		if (fromEnd != 1) index = arr.findIndex(fn);
		if (fromEnd == 1) index = arr.findLastIndex(fn);
		if (index > -1) {
			arr.splice(index, 1);
			return arr;
		}
		return arr;
	},
	sortTiles(num, sort, arr) {
		if (arr) Board.tiles = arr;
		Board.virtualTiles = Board.tiles.slice().sort().sort((a, b) => a.value - b.value);
		Board.tiles.sort((a, b) => a.value - b.value);
		let asc = [];
		let sorted = [];
		let arr3 = 0;
		let arr4 = 0;
		let min = parseInt(Board.virtualTiles[0].value);
		asc.push(Board.virtualTiles[0]);
		let max = { value: "999" };

		for (let i=1; i<Board.virtualTiles.length; i++) {
			let value1 = parseInt(Board.virtualTiles[i].value);
			let value2 = 0;
			if (value1 - 1 == min) {
				asc.push(Board.virtualTiles[i]);
				value2 = 1;
			}
			if (settingsType == 1) {
				if (min % 100 == 1) {
					max = { value: String(min) };
				}
				if (min - max.value == 12) {
					asc.push(max);
					value2 = 2;
					max = { value: "999" };
				}
			}
			if (value2 == 0 && value1 != min || value1 == min && asc.length == 0) {
				asc = [];
				asc.push(Board.virtualTiles[i]);
			}
			if (asc.length == num || value2 == 2) {
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
			min = parseInt(Board.virtualTiles[i].value);
			if (value2 == 2) {
				asc.push(Board.virtualTiles[i]);
			}
		}
		for (let i=0; i<sorted.length; i++) {
			Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, sorted[i]);
			if (sorted[i]) arr4 = arr4 * 1 + sorted[i].value % 100;
		}
		if (sort == 0) {
			if (settingsType == 1) return arr3;
			if (settingsType == 2 || settingsType == 3) return arr4;
		}
		if (sort == 1) return sorted;
	},
	sortTilesByColor(num, type, arr) {
		if (arr) Board.tiles = arr.slice();
		Board.virtualTiles = Board.tiles.slice();
		Board.virtualTiles.sort().sort((a, b) => a.value % 100 > b.value % 100 ? 1 : b.value % 100 > a.value % 100 ? -1 : 0);
		let asc = [];
		let sorted = [];
		let val1 = 0;
		let val2 = 0;
		let min = parseInt(Board.virtualTiles[0].value);
		asc.push(Board.virtualTiles[0]);
		for (let i=1; i<=Board.virtualTiles.length; i++) {
			let tileValue = parseInt((Board.virtualTiles[i] || {}).value);
			if (tileValue % 100 == min % 100 && tileValue != min) {
				asc.push(Board.virtualTiles[i]);
			} else if (tileValue != min) {
				asc = [];
				asc.push(Board.virtualTiles[i]);
			}
			if (asc.length == num) {
				sorted.push.apply(sorted, asc);
				sorted.push("");
				asc = [];
				val1++;
			}
			min = tileValue;
		}
		for (let i=0; i<=sorted.length; i++) {
			if (sorted[i]) {
				Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, sorted[i]);
				val2 = val2 * 1 + sorted[i].value % 100;
			}
		}
		if (type == 0) {
			if ([1].includes(settingsType)) return val1;
			if ([2,3].includes(settingsType)) return val2;
		}
		if (type == 1) return sorted;
	},
	sortDouble(seat, asc) {
		Board.virtualTiles = Board.tiles.slice().filter(e => e !== "").sort((a, b) => a.value - b.value);
		Board.virtualTiles.sort((a, b) => a.value % 100 > b.value % 100 ? 1 : b.value % 100 > a.value % 100 ? -1 : 0);
		let arr1 = [];
		let arr2 = [];
		let index1 = 0;
		let index2 = 0;
		let min;
		min = parseInt(Board.virtualTiles[0].value);
		arr1.push(Board.virtualTiles[0]);
		for (let i=1; i<Board.virtualTiles.length; i++) {
			if (Board.virtualTiles[i].value != "800") {
				let _0x596912 = parseInt(Board.virtualTiles[i].value);
				if (_0x596912 == min) {
					arr1.push(Board.virtualTiles[i]);
					arr2.push.apply(arr2, arr1);
					arr2.push("");
					arr1 = [];
					index1++;
				} else {
					if (_0x596912 != min) {
						arr1 = [];
						arr1.push(Board.virtualTiles[i]);
					}
				}
				min = parseInt(Board.virtualTiles[i].value);
			}
		}
		for (let i=0; i<arr2.length; i++) {
			Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, arr2[i]);
			index2 = index2 * 1 + arr2[i].value % 100;
		}
		if (asc == 0 && ((settingsType == 1 || settingsType == 2 || settingsType == 3))) return index1;
		if (asc == 1) return arr2;
	},
	checkPer(num, tmp) {
		let tiles = Board.tiles.slice();
		if (tmp) {
			tiles = tmp.slice();
			Board.tiles = tiles.slice();
			Board.virtualTiles = tiles.slice();
		}
		let arr = tiles.slice();
		let sort1 = this.sortTiles(num, 0);
		tiles = Board.virtualTiles.slice();
		let sortC2 = this.sortTilesByColor(num, 0);
		tiles = arr.slice();
		sortC2 = this.sortTilesByColor(num, 0);
		tiles = Board.virtualTiles.slice();
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
						let tile = bTiles[i].value;
						if (settingsType == 1) {
							if (bTiles[i] % 100 == 1) {
								tile = bTiles[i].value * 1 + 13;
							}
						}
						let t1 = perFull[j-1] ? perFull[j-1].value * 1 : "";
						let t2 = perFull[j-2] ? perFull[j-2].value * 1 : "";
						let t3 = perFull[j-3] ? perFull[j-3].value * 1 : "";
						if (t1+1 == tile && t2+2 == tile && t3+3 == tile) {
							perFull.splice(j, 0, bTiles[i]);
							Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, bTiles[i]);
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
						let t0 = bTiles[i].value;
						let t1 = perFull[j-1] ? perFull[j-1].value : "";
						let t2 = perFull[j-2] ? perFull[j-2].value : "";
						let t3 = perFull[j-3] ? perFull[j-3].value : "";
						if (t3 % 100 == t0 % 100 && t2 % 100 == t0 % 100 && t1 % 100 == t0 % 100 && t1 != t0 && t2 != t0 && t3 != t0) {
							perFull.splice(j, 0, bTiles[i]);
							Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, bTiles[i]);
							bTiles = this.removeArrayItem(bTiles, bTiles[i]);
						}
					}
					index = 0;
				}
			}
		}
		return bTiles;
	},
	addOkey(seat, okeyCont) {
		// Board.tiles.sort();
		Board.tiles.sort((a, b) => a.value - b.value);
		Board.virtualTiles = Board.tiles.slice();
		if (seat == 1) {
			let index;
			for (let i=2; i<=Board.tiles.length * 1 + 3; i++) {
				let t0 = Board.tiles[i]   ? Board.tiles[i].value   : "";
				let t1 = Board.tiles[i-1] ? Board.tiles[i-1].value : "";
				let t2 = Board.tiles[i+1] ? Board.tiles[i+1].value : "";
				let t3 = Board.tiles[i-2] ? Board.tiles[i-2].value : "";

				if (t1 % 100 == 1 && settingsType == 1) {
					index = i - 1;
				}
				if (index && t0 - t1 == 1 && t2 - t0 == 2 && t2 - Board.tiles[index].value == 12 && settingsType == 1) {
					let oTile = okeyCont.pop();
					perFull.push(Board.tiles[i-1]);
					perFull.push(Board.tiles[i]);
					perFull.push(oTile);
					perFull.push(Board.tiles[i+1]);
					perFull.push(Board.tiles[index]);
					perFull.push("");
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i-1]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i+1]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[index]);
					Board.tiles = Board.virtualTiles.slice();
					// okeyCont--;
					if (!okeyCont.length) return 0;
				}
				if (t1 - t3 == 2 && t0 - t1 == 1 && t2 - t0 == 1 || t1 - t3 == 1 && t0 - t1 == 2 && t2 - t0 == 1) {
					let oTile = okeyCont.pop();

					perFull.push(Board.tiles[i-2]);
					if (t1 - t3 > 1) perFull.push(oTile);
					
					perFull.push(Board.tiles[i-1]);
					if (t0 - t1 > 1) perFull.push(oTile);
					
					perFull.push(Board.tiles[i]);
					perFull.push(Board.tiles[i+1]);
					perFull.push("");
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i+1]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i-1]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i-2]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
					Board.tiles = Board.virtualTiles.slice();
					// okeyCont--;
					if (!okeyCont.length) return 0;
				}
				if (index && (t0 - t1 == 1 && t0 - Board.tiles[index].value == 11 || t0 - t1 == 2 && t0 - Board.tiles[index].value == 12) && settingsType == 1) {
					let oTile = okeyCont.pop();

					perFull.push(Board.tiles[i-1]);
					if (t0 - t1 == 2) perFull.push(oTile);
					
					perFull.push(Board.tiles[i]);
					if (t0 - t1 == 1) perFull.push(oTile);
					
					perFull.push(Board.tiles[index]);
					perFull.push("");
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i-1]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[index]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
					Board.tiles = Board.virtualTiles.slice();
					// okeyCont--;
					if (!okeyCont.length) return 0;
				}
				if (t1 - t3 == 2 && t0 - t1 == 1 || t1 - t3 == 1 && t0 - t1 == 2) {
					let oTile = okeyCont.pop();

					perFull.push(Board.tiles[i-2]);
					if (t1 - t3 > 1) perFull.push(oTile);
					
					perFull.push(Board.tiles[i-1]);
					if (t0 - t1 > 1) perFull.push(oTile);
					
					perFull.push(Board.tiles[i]);
					perFull.push("");
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i-1]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i-2]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
					Board.tiles = Board.virtualTiles.slice();
					// okeyCont--;
					if (!okeyCont.length) return 0;
				}
			}
		}
		if (seat == 2) {
			let index;
			for (let i=1; i<Board.tiles.length; i++) {
				let t0 = Board.tiles[i]   ? Board.tiles[i].value   : "";
				let t1 = Board.tiles[i-1] ? Board.tiles[i-1].value : "";
				let t2 = Board.tiles[i+1] ? Board.tiles[i+1].value : "";
				let t3 = Board.tiles[i-2] ? Board.tiles[i-2].value : "";

				if (t0 - t1 == 2) {
					let oTile = okeyCont.pop();
					perHalf.push(Board.tiles[i-1]);
					perHalf.push(oTile);
					perHalf.push(Board.tiles[i]);
					perHalf.push("");
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i-1]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
					Board.tiles = Board.virtualTiles.slice();
					// okeyCont--;
					if (!okeyCont.length) return 0;
				}
				if (t1 % 100 == 1 && settingsType == 1) {
					index = i - 1;
				}
				if (index && t0 - Board.tiles[index].value == 11 && settingsType == 1) {
					let oTile = okeyCont.pop();
					perHalf.push(Board.tiles[i]);
					perHalf.push(oTile);
					perHalf.push(Board.tiles[index]);
					perHalf.push("");
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[index]);
					Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
					Board.tiles = Board.virtualTiles.slice();
					// okeyCont--;
					if (!okeyCont.length) return 0;
				}
			}
		}
		if (seat == 3) {
			for (let j=0; j<perHalf.length; j++) {
				let p1 = perHalf[j-1] ? perHalf[j-1].value : "";
				let p2 = perHalf[j-2] ? perHalf[j-2].value : "";
				if (perHalf[j] == "" && ((settingsType == 2 || settingsType == 3) && p1 % 100 != 13 || settingsType == 1)) {
					if (p1 - p2 == 1) {
						let oTile = okeyCont.pop();
						perHalf.splice(j, 0, oTile);
						// okeyCont--;
						Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
						Board.tiles = this.removeArrayItem(Board.tiles, oTile);
						if (!okeyCont.length) return 0;
					}
					if (p2 - p1 == 12 && settingsType == 1) {
						let oTile = okeyCont.pop();
						perHalf.splice(j-2, 0, oTile);
						// okeyCont--;
						Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
						Board.tiles = this.removeArrayItem(Board.tiles, oTile);
						if (!okeyCont.length) return 0;
					}
				}
			}
			for (let j=0; j<perHalf.length; j++) {
				if (perHalf[j] == "") {
					let p1 = perHalf[j-1] ? perHalf[j-1].value : "";
					let p2 = perHalf[j-2] ? perHalf[j-2].value : "";
					if (p1 % 100 == p2 % 100 && p1 != p2) {
						let oTile = okeyCont.pop();
						perHalf.splice(j, 0, oTile);
						// okeyCont--;
						Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
						Board.tiles = this.removeArrayItem(Board.tiles, oTile);
						if (!okeyCont.length) return 0;
					}
				}
			}
		}
		if (seat == 4) {
			for (let j=0; j<perFull.length; j++) {
				let p1 = perFull[j-1] ? perFull[j-1].value : "";
				let p2 = perFull[j-2] ? perFull[j-2].value : "";
				if (perFull[j] == "" && ((settingsType == 2 || settingsType == 3) && p1 % 100 != 13 || settingsType == 1)) {
					if (p1 - p2 == 1) {
						for (let i=0; i<Board.tiles.length; i++) {
							if (Board.tiles[i].value - p1 == 2) {
								let oTile = okeyCont.pop();
								perFull.splice(j, 0, oTile);
								perFull.splice(j + 1, 0, Board.tiles[i]);
								// okeyCont--;
								Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
								Board.tiles = this.removeArrayItem(Board.tiles, oTile);
								Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i]);
								Board.tiles = this.removeArrayItem(Board.tiles, Board.tiles[i]);
								if (!okeyCont.length) return 0;
							}
						}
					}
				}
			}
			for (let j=0; j<perFull.length; j++) {
				let p0 = perFull[j].value;
				let p1 = perFull[j+1].value;
				if ((perFull[j-1] == "" || j == 0) && p1 % 100 != 1) {
					if (p1 - p0 == 1) {
						for (let i=0; i<Board.tiles.length; i++) {
							if (p0 - Board.tiles[i].value == 2) {
								let oTile = okeyCont.pop();
								perFull.splice(j, 0, oTile);
								perFull.splice(j, 0, Board.tiles[i]);
								// okeyCont--;
								Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
								Board.tiles = this.removeArrayItem(Board.tiles, oTile);
								Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i]);
								Board.tiles = this.removeArrayItem(Board.tiles, Board.tiles[i]);
								if (!okeyCont.length) return 0;
							}
						}
					}
				}
			}
			for (let j=0; j<perFull.length; j++) {
				let p1 = perFull[j-1] ? perFull[j-1].value : "";
				let p2 = perFull[j-2] ? perFull[j-2].value : "";
				if (perFull[j] == "" && p1 % 100 == 12 && settingsType == 1) {
					if (p1 - p2 == 1) {
						for (let i=0; i<Board.tiles.length; i++) {
							if (p1 - Board.tiles[i].value == 11) {
								let oTile = okeyCont.pop();
								perFull.splice(j, 0, Board.tiles[i]);
								perFull.splice(j, 0, oTile);
								Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
								Board.tiles = this.removeArrayItem(Board.tiles, oTile);
								Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i]);
								Board.tiles = this.removeArrayItem(Board.tiles, Board.tiles[i]);
								// okeyCont--;
								if (!okeyCont.length) return 0;
							}
						}
					}
				}
			}
			for (let j=0; j<perFull.length; j++) {
				let p1 = perFull[j-1] ? perFull[j-1].value : "";
				let p2 = perFull[j-2] ? perFull[j-2].value : "";
				if (perFull[j] == "" && ((settingsType == 2 || settingsType == 3) && p1 % 100 != 13 || settingsType == 1)) {
					if (p1 - p2 == 1) {
						let oTile = okeyCont.pop();
						perFull.splice(j, 0, oTile);
						// okeyCont--;
						Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
						Board.tiles = this.removeArrayItem(Board.tiles, oTile);
						if (!okeyCont.length) return 0;
					}
				}
			}
			for (let j=0; j<perFull.length; j++) {
				let p1 = perFull[j+1] ? perFull[j+1].value : "";
				let p2 = perFull[j+2] ? perFull[j+2].value : "";
				if ((perFull[j-1] == "" || j == 0) && p1 % 100 != 1) {
					if (p2 - p1 == 1) {
						let oTile = okeyCont.pop();
						perFull.splice(j, 0, oTile);
						// okeyCont--;
						Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
						Board.tiles = this.removeArrayItem(Board.tiles, oTile);
						if (!okeyCont.length) return 0;
					}
				}
			}
			let _0x2c0168 = 0;
			for (let j=0; j<perFull.length; j++) {
				_0x2c0168++;
				if (perFull[j] == "") {
					let p1 = perFull[j-1] ? perFull[j-1].value : "";
					let p2 = perFull[j-2] ? perFull[j-2].value : "";
					if (p1 % 100 == p2 % 100 && p1 != p2 && _0x2c0168 < 5) {
						let oTile = okeyCont.pop();
						perFull.splice(j, 0, oTile);
						// okeyCont--;
						Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
						Board.tiles = this.removeArrayItem(Board.tiles, oTile);
						if (!okeyCont.length) return 0;
					}
					_0x2c0168 = 0;
				}
			}
		}
	},
	addOkeyDouble(okeyCont) {
		// Board.tiles.sort();
		Board.tiles.sort((a, b) => a.value % 100 > b.value % 100 ? 1 : b.value % 100 > a.value % 100 ? -1 : 0);
		Board.tiles.reverse();
		for (let i=0; i<=Board.tiles.length; i++) {
			if (Board.tiles[i].value != "800") {
				let oTile = okeyCont.pop();
				perFull.push(Board.tiles[i]);
				perFull.push(oTile);
				perFull.push("");
				Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i]);
				Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, oTile);
				Board.tiles = this.removeArrayItem(Board.tiles, Board.tiles[i]);
				Board.tiles = this.removeArrayItem(Board.tiles, oTile);
				// okeyCont--;
				if (!okeyCont.length) return 0;
			}
		}
	},
	priority() {
		// Board.tiles.sort();
		Board.tiles.sort();
		Board.tiles.sort((a, b) => a.value - b.value);
		Board.virtualTiles = Board.tiles.slice();
		for (let i=1; i<Board.tiles.length; i++) {
			if (Math.abs(Board.tiles[i].value - Board.tiles[i-1].value) == 2) {
				Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i]);
				Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[i - 1]);
				Board.virtualTiles.unshift(Board.tiles[i]);
				Board.virtualTiles.unshift(Board.tiles[i - 1]);
			}
		}
		let index = 0;
		for (let i=0; i<perFull.length; i++) {
			index++;
			if (perFull[i] == "") {
				if (index > 3) {
					for (let j=0; j<Board.tiles.length; j++) {
						let p0 = Board.tiles[j].value;
						let p1 = perFull[i-1] ? perFull[i-1].value : "";
						let p2 = perFull[i-2] ? perFull[i-2].value : "";
						let p3 = perFull[i-3] ? perFull[i-3].value : "";
						let t1 = perFull[i-index+1].value;
						if ((p0 - p1 == 2 || t1 - p0 == 2) && (Math.abs(p1 - p2) == 1 || Math.abs(p2 - p3) == 1)) {
							Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[j]);
							Board.virtualTiles.unshift(Board.tiles[j]);
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
						let p0 = Board.tiles[j].value;
						let p1 = perFull[i-1] ? perFull[i-1].value : "";
						let t1 = perFull[i-index+1] ? perFull[i-index+1].value : "";
						if (p0 - p1 == 1 || t1 - p0 == 1) {
							Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[j]);
							Board.virtualTiles.unshift(Board.tiles[j]);
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
						let t0 = Board.tiles[j].value;
						let t1 = perFull[i-index+1].value;
						let p1 = perFull[i-1].value;
						if (Math.abs(t0 - p1) % 100 == 0 && t0 - p1 != 0 || Math.abs(t1 - t0) % 100 == 0 && t1 - t0 != 0) {
							Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[j]);
							Board.virtualTiles.unshift(Board.tiles[j]);
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
					let t0 = Board.tiles[j].value;
					let p1 = perHalf[i-1] ? perHalf[i-1].value : "";
					let p2 = perHalf[i-2] ? perHalf[i-2].value : "";
					if ((Math.abs(t0 - p1) % 100 == 0 || Math.abs(t0 - p2) % 100 == 0) && p1 != t0 && p2 != t0) {
						Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[j]);
						Board.virtualTiles.unshift(Board.tiles[j]);
					}
				}
			}
		}
		index = 0;
		for (let i=0; i<perHalf.length; i++) {
			if (perHalf[i] == "") {
				for (let j=0; j<Board.tiles.length; j++) {
					let t0 = Board.tiles[j].value;
					let p1 = perHalf[i-1] ? perHalf[i-1].value : "";
					let p2 = perHalf[i-2] ? perHalf[i-2].value : "";
					if ((Math.abs(t0 - p1) == 1 || Math.abs(p2 - t0) == 1) && p1 != t0 && p2 != t0) {
						Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[j]);
						Board.virtualTiles.unshift(Board.tiles[j]);
					}
				}
			}
		}
		index = 0;
		for (let i=0; i<perHalf.length; i++) {
			if (perHalf[i] == "") {
				for (let j=0; j<Board.tiles.length; j++) {
					let t0 = Board.tiles[j].value;
					let p1 = perHalf[i-1] ? perHalf[i-1].value : "";
					let p2 = perHalf[i-2] ? perHalf[i-2].value : "";
					if ((Math.abs(t0 - p1) == 2 || Math.abs(p2 - t0) == 2) && p1 != t0 && p2 != t0) {
						Board.virtualTiles = this.removeArrayItem(Board.virtualTiles, Board.tiles[j]);
						Board.virtualTiles.unshift(Board.tiles[j]);
					}
				}
			}
		}
		Board.tiles = Board.virtualTiles.slice();
	},
};
