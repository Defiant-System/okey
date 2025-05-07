
// okey.game

{
	init() {
		// fast references
		this.els = {
			el: window.find(".board"),
			content: window.find("content"),
		};

		// bind event handlers
		this.els.el.on("mousedown", ".rack .tile", this.move);
	},
	dispatch(event) {
		let APP = okey,
			Self = APP.game,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "set-opponents":
				break;
		}
	},
	move(event) {
		let Self = okey.game,
			Drag = Self.drag;
		switch (event.type) {
			// native events
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				let doc = $(document),
					dEl = Self.els.el.find(".discard .inset.player-bottom").addClass("drop"),
					el = $(event.target).addClass("dragging"),
					drop = el.offset(),
					click = {
						x: event.clientX - drop.left,
						y: event.clientY - drop.top,
					};
				// drag info
				Self.drag = { doc, el, dEl, click, drop };
				// cover content
				Self.els.content.addClass("cover");
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.move);
				break;
			case "mousemove":
				let left = (event.clientX - Drag.click.x),
					top = (event.clientY - Drag.click.y);
				// tile moving
				Drag.el.css({ top, left });
				break;
			case "mouseup":
				Drag.el
					.removeClass("dragging")
					.cssSequence("smooth", "transitionend", el => el.removeClass("smooth"))
					.css({ top: Drag.drop.top, left: Drag.drop.left });

				Drag.dEl.removeClass("drop");

				// uncover content
				Self.els.content.removeClass("cover");
				// unbind event handlers
				Drag.doc.off("mousemove mouseup", Self.move);
				break;
		}
	}
}
