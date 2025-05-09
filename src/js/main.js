
@import "./modules/engine.js"
@import "./modules/test.js"


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
			case "set-game-engine":
				Engine.setEngine(event.arg);
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
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
	game: @import "./areas/game.js",
};

window.exports = okey;
