
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
