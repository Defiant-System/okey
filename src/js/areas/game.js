
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
				let pY = Math.max(Math.min(parseInt(top / Drag.drop.height, 10), 1), 0),
					pX = Math.max(Math.min(parseInt(left / Drag.drop.width, 10), 16), 0);
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
					rOffset = Self.els.rack.offset(".board");
				if (Drag.hover.hasClass("drop")) {
					switch (true) {
						case Drag.hover.hasClass("rack"):
						case Drag.hover.hasClass("tile"):
							css = {
								top: (Drag.posY * 78) + 5,
								left: (Drag.posX * 56) + 21,
							};
							// decide direction to push tiles
							let // get all tiles on the same row
								row = Self.els.rack.find(".tile").filter(tile => +tile.offsetTop === css.top),
								hovered = row.filter(tile => +tile.offsetLeft === css.left),
								choose = {
									left: { els: [], chain: css.left, done: false },
									right: { els: [hovered], chain: css.left, done: false },
								};
							// if it is the first tile to the left
							if (Drag.posX <= 0) {
								choose.left.done = true;
								choose.left.els.push(...Array(99).fill(0));
							}
							// if it is the last tile to the right
							if (Drag.posX > 15) {
								choose.right.done = true;
								choose.right.els.push(...Array(99).fill(0));
							}
							// check all to the LEFT of the tile
							row.filter(tile => +tile.offsetLeft < css.left)
								.sort((a, b) => +b.offsetLeft - +a.offsetLeft)
								.map(tile => {
									if (choose.left.done) return;
									let tLeft = +tile.offsetLeft;
									choose.left.chain -= 56;
									if (tLeft === choose.left.chain) choose.left.els.push($(tile));
									else choose.left.done = true;
									// check for left end (start)
									if (choose.left.chain <= 21) {
										choose.left.done = true;
										choose.left.els.push(...Array(99).fill(0));
									}
								});
							// check all to the RIGHT of the tile
							row.filter(tile => +tile.offsetLeft > css.left)
								.sort((a, b) => +a.offsetLeft - +b.offsetLeft)
								.map(tile => {
									if (choose.right.done) return;
									let tLeft = +tile.offsetLeft;
									choose.right.chain += 56;
									if (tLeft === choose.right.chain) choose.right.els.push($(tile));
									else choose.right.done = true;
									// check for right end (start)
									if (choose.right.chain >= 860) {
										choose.right.done = true;
										choose.right.els.push(...Array(99).fill(0));
									}
								});
							// console.log(choose.left.els.length);
							// console.log(choose.right.els.length);
							if (choose.left.els.length > 16 && choose.right.els.length > 16) {
								// let tile fly back to origin
								css = {
									top: Drag.drop.top,
									left: Drag.drop.left
								};
							} else if (choose.left.els.length >= choose.right.els.length) {
								choose.right.els.map(tile => tile
									.cssSequence("smooth", "transitionend", el => el.removeClass("smooth"))
									.css({ left: +tile.prop("offsetLeft") + 56 }));
							} else {
								if (Drag.hover[0] === hovered[0]) css.left -= 56;
								choose.left.els.map(tile => tile
									.cssSequence("smooth", "transitionend", el => el.removeClass("smooth"))
									.css({ left: +tile.prop("offsetLeft") - 56 }));
							}
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
