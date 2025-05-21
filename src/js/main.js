
@import "./modules/engine.new.js"
@import "./modules/utils.js"
@import "./modules/test.js"


const ME = karaqu.user;
const Opponents = ["Adam", "Denise", "Yasmin", "Sean", "Ann", "Ali"];


const okey = {
	init() {
		// fast references
		this.content = window.find("content");

		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));

		// init game engine
		Engine.init();

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = okey,
			value,
			el;
		switch (event.type) {
			// system events
			case "window.init":
				break;
			// custom events
			case "open-help":
				karaqu.shell("fs -u '~/help/toc.md'");
				break;
			// proxy events
			case "set-game-engine":
				return Self.game.dispatch(event);
			default:
				el = event.el;
				if (!el && event.origin) el = event.origin.el;
				if (el) {
					let pEl = el.parents(`?div[data-area]`);
					if (pEl.length) {
						let name = pEl.data("area");
						return Self[name].dispatch(event);
					}
				}
		}
	},
	start: @import "./areas/start.js",
	dialog: @import "./areas/dialog.js",
	game: @import "./areas/game.js",
};

window.exports = okey;
