
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
				APP.content.cssSequence("close-dialog", "transitionend", el => {
					el.removeClass("show-dialog close-dialog");
					event.el.parents(".dialog").addClass("hidden");
				});
				break;
		}
	}
}
