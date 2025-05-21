
// okey.dialog

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};
	},
	dispatch(event) {
		let APP = okey,
			Self = APP.dialog,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "close-dialog":
				event.el.parents(".dialog").addClass("hidden");
				break;
		}
	}
}
