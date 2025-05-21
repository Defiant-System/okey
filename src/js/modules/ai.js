
let Opponents = ["Adam", "Denise", "Yasmin", "Sean", "Ann", "Ali"];

let AI = {
	init() {
		this.setOpponents();
	},
	setOpponents() {
		let users = Opponents.slice();
		APP.game.els.el.find(`.player:not(.user) .name`).map(elem => {
			let el = $(elem),
				index = Utils.randomInt(0, Opponents.length),
				name = users.splice(index, 1);
			el.data({ name });
		});
	}
};
