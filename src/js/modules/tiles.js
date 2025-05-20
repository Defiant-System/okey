
let Tiles = {
	data: [],
	init() {
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
	shuffle() {
		let shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
		this.data = shuffleArray(this.data);
		this.tilesLeft = this.data.slice();
		if (this.data[105].value == "000") return this.shuffle();
		// remove one tile from tile stack
		// this.tilesLeft = this.removeArrayItem(this.tilesLeft, this.data.pop());
		console.log(this.tilesLeft);
		// table UI update
		// Engine.updateLeftTiles();
	},
	restore(data) {
		this.data = data.map((value, i) => ({ tile: i+1, value }));
		// remove one tile from tile stack
		this.tilesLeft = this.data.slice();
		console.log(this.tilesLeft);
		// table UI update
		// Engine.updateLeftTiles();
	},
	parse(tile) {
		let id = tile.toString(),
			clr = Colors[+id.slice(0,1)],
			num = new Number(id.slice(1)) * 1;
		if (+id.slice(0,1) == 8) {
			clr = Colors[0];
			num = "j";
		}
		if (+id.slice(0,1) > 8) {
			clr = "okey";
		}
		return { id, clr, num };
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
	}
};
