
// okey.game

{
	init() {
		// fast references
		this.els = {
			el: window.find(".board"),
			rack: window.find(".player.user .rack"),
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
			case "engine-sort-serial":
				Engine.arrange(1, 1);
				break;
			case "engine-sort-double":
				Engine.arrange(1, 2);
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
					dEl = Self.els.el.find(".discard .inset.player-1").addClass("drop"),
					el = $(event.target).addClass("dragging"),
					drop = el.offset(),
					click = {
						x: event.clientX - drop.left,
						y: event.clientY - drop.top,
					};

				// enable drop zones
				Self.els.rack.addClass("drop");
				Self.els.rack.find("> .tile").addClass("drop");
				// drag info
				Self.drag = { doc, el, dEl, click, drop };
				// cover content
				Self.els.content.addClass("cover");
				// bind event handlers
				Self.drag.doc.on("mousemove mouseover mouseup", Self.move);
				break;
			case "mousemove":
				let left = (event.clientX - Drag.click.x),
					top = (event.clientY - Drag.click.y);
				// tile moving
				Drag.el.css({ top, left });
				break;
			case "mouseover":
				Drag.hover = $(event.srcElement);
				// console.log(event.srcElement);
				break;
			case "mouseup":
				Self.move({ type: "drop-tile" });

				// reset tile 
				Drag.el.removeClass("dragging");
				// reset target drop zones
				Drag.dEl.removeClass("drop");
				// move tile via Engine
				// Engine.discard(Drag.el, 1);

				// uncover content
				Self.els.content.removeClass("cover");
				// unbind event handlers
				Drag.doc.off("mousemove mouseover mouseup", Self.move);
				break;
			case "drop-tile":
				let css,
					tOffset = Drag.hover.offset(".board"),
					rOffset = Self.els.rack.offset(".board");
				if (Drag.hover.hasClass("drop")) {
					// console.log(Drag.hover[0]);
					switch (true) {
						case Drag.hover.hasClass("rack"): break;
						case Drag.hover.hasClass("tile"): break;
						case Drag.hover.hasClass("inset"):
							css = {
								top: tOffset.top - rOffset.top + 5,
								left: tOffset.left - rOffset.left + 5,
							};
							break;
					}
				} else {
					css = {
						top: Drag.drop.top,
						left: Drag.drop.left
					};
				}

				if (css) {
					Drag.el
						.removeClass("dragging")
						.cssSequence("smooth", "transitionend", el => el.removeClass("smooth"))
						.css(css);
				}
				break;
		}
	}
}
