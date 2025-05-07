
let Engine = (() => {

	let APP;
	let Colors = ["green", "red",  "blue", "yellow", "black"];

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
		},
		updateLeft() {
			// update table tiles left
			APP.content.find(`.info .tiles.left .tile`).data({ n: Tiles.left.length });
		},
		discard(tile, num) {
			let target = APP.content.find(`.discard .player-${num}`),
				tgtOffset = target.offset(".board"),
				srcOffset = tile.offset(".board"),
				top = tgtOffset.top - srcOffset.top,
				left = 900; // tgtOffset.left - srcOffset.left;
			console.log( srcOffset, tgtOffset );
			tile.cssSequence("smooth", "transitionend", el => el.removeClass("smooth"))
				.css({ top, left });
		},
		restore(state) {
			let str = [],
				okeyTile = state.table.okey;
			state.player.map(p => {
				if (p.seat === 1) {
					p.rack.map(t => {
						let clr = Colors[+t.slice(0,1)],
							num = new Number(t.slice(1));
						if (+t-1 === okeyTile) clr += " okey";
						if (t) str.push(`<span class="temp tile ${clr}" data-v="${num}"></span>`);
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

			console.log(state);
		}
	};

	let removeArrayItem = (arr, item, add) => {
		let index;
		if (add != 1) index = arr.indexOf(item);
		if (add == 1) index = arr.lastIndexOf(item);
		if (index > -1) {
			arr.splice(index, 1);
			return arr;
		}
		return arr;
	};

	return Engine;

})();
