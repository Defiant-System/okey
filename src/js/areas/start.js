
// okey.start

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			board: window.find(".board-view"),
		};
	},
	dispatch(event) {
		let APP = okey,
			Self = APP.start,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "select-engine":
				// console.log(event);
				Self.els.content.data({ show: "board" });
				Self.els.board.data({ engine: event.arg })
				break;
			case "show-dialog":
				APP.content.addClass("show-dialog");
				APP.content.find(".dialog.settings").removeClass("hidden");
				break;
			case "open-help":
				APP.dispatch(event);
				break;
		}
	}
}
