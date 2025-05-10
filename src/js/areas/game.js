
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
					offset = {
						y: event.offsetY,
						x: event.offsetX,
					},
					click = {
						x: event.clientX - drop.left,
						y: event.clientY - drop.top,
					};

				// enable drop zones
				Self.els.rack.addClass("drop");
				Self.els.rack.find("> .tile").addClass("drop");
				// drag info
				Self.drag = { doc, el, dEl, click, drop, offset };
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

				// position indicator
				let pY = parseInt(top / Drag.drop.height, 10),
					pX = parseInt((left - Drag.offset.x) / Drag.drop.width, 10);
				if (Drag.posY !== pY || Drag.posX !== pX) {
					Drag.posY = pY;
					Drag.posX = pX;
					Self.els.rack.css({ "--posY": pY, "--posX": pX });
				}
				break;
			case "mouseover":
				Drag.hover = $(event.srcElement);
				// console.log(event.srcElement);
				break;
			case "mouseup":
				Self.move({ type: "drop-tile", orgEvent: event });

				// reset rack
				Self.els.rack.css({ "--posY": "", "--posX": "" });
				// reset tile 
				Drag.el.removeClass("dragging");
				// reset target drop zones
				Drag.dEl.removeClass("drop");
				// uncover content
				Self.els.content.removeClass("cover");
				// unbind event handlers
				Drag.doc.off("mousemove mouseover mouseup", Self.move);
				break;
			case "drop-tile":
				let css = {
						top: Drag.drop.top,
						left: Drag.drop.left
					},
					tOffset = Drag.hover.offset(".board"),
					rOffset = Self.els.rack.offset(".board"),
					oY = event.orgEvent.offsetY,
					oX = event.orgEvent.offsetX;
				if (Drag.hover.hasClass("drop")) {
					switch (true) {
						case Drag.hover.hasClass("rack"):
							oX += Drag.offset.x;
							css = {
								top: oY - (oY % Drag.drop.height) + 5,
								left: oX - (oX % Drag.drop.width) - (Drag.drop.width >> 1) - 7,
							};
							if (css.top > 20) css.top += 5;
							break;
						case Drag.hover.hasClass("tile"):
							css = {
								top: +Drag.hover.prop("offsetTop"),
								left: +Drag.hover.prop("offsetLeft"),
							};
							Self.els.rack.find(".tile")
								// get all tiles on the same row
								.filter(tile => +tile.offsetTop === css.top)
								// assign weight to each tile; first and last position is heaviest
								.map(tile => {
									let el = $(tile),
										left = tile.offsetLeft,
										pos = parseInt(left / Drag.drop.width, 10),
										weight = [0,15].includes(pos) ? 99 : 1,
										targetPos = parseInt(css.left / Drag.drop.width, 10);
									console.log(targetPos, pos, weight);
								});
								// push tiles depending on accumulated weight
							break;
						case Drag.hover.hasClass("inset"):
							css = {
								top: tOffset.top - rOffset.top + 5,
								left: tOffset.left - rOffset.left + 5,
							};
							break;
					}
				}
				// soft landing of dragged tile
				Drag.el
					.removeClass("dragging")
					.cssSequence("smooth", "transitionend", el => {
						// reset dragged element
						el.removeClass("smooth");
						// reset drop zones
						Self.els.el.find(".drop").removeClass("drop");
					})
					.css(css);
				break;
		}
	}
}
