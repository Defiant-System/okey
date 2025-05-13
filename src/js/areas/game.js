
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
		this.els.el.on("mousedown", ".rack .tile, .tile.draggable", this.move);
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
			Drag = Self.drag,
			pX, pY;
		switch (event.type) {
			// native events
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				let el = $(event.target),
					rOffset = Self.els.rack.offset(".board");
				if (el.parent().hasClass("left")) {
					let { id, clr, num } = Engine.drawTile(),
						lOffset = Self.els.el.find(".info .tiles.left").offset(".board"),
						y = lOffset.top - rOffset.top + 5,
						x = lOffset.left - rOffset.left + 5;
					el = Self.els.rack.append(`<span class="tile ${clr} new-tile" data-v="${num}" data-id="${id}" style="top: ${y}px; left: ${x}px;"></span>`);
				}

				el = el.addClass("dragging");

				let doc = $(document),
					drop = el.offset(".rack"),
					tOffset = el.offset(".board"),
					diff = { x: 0, y: 0},
					offset = {
						y: event.offsetY,
						x: event.offsetX,
					},
					click = {
						y: event.clientY,
						x: event.clientX,
					};

				if (!drop) {
					drop = el.offset();
					diff.y -= 73;
				}
				click.y -= drop.top;
				click.x -= drop.left;

				// enable drop zones
				Self.els.el.addClass("drop");
				Self.els.rack.addClass("drop arranging");
				Self.els.el.find(".discard .inset.player-1").addClass("drop");
				// drag info
				Self.drag = { doc, el, click, drop, diff, offset, tOffset, rOffset };
				// bind event handlers
				Self.drag.doc.on("mousemove mouseover mouseup", Self.move);
				break;
			case "mousemove":
				let left = (event.clientX - Drag.click.x),
					top = (event.clientY - Drag.click.y);
				// tile moving
				Drag.el.css({ top, left });

				// position indicator
				pY = Math.max(Math.min(parseInt((top + Drag.diff.y) / Drag.drop.height, 10), 1), 0);
				pX = Math.max(Math.min(parseInt((left + Drag.diff.x) / Drag.drop.width, 10), 16), 0);
				if (Drag.posY !== pY || Drag.posX !== pX) {
					Drag.posY = pY;
					Drag.posX = pX;
					Self.els.rack.css({ "--posY": pY, "--posX": pX });
					// console.log(Drag.posX);
				}
				break;
			case "mouseover":
				Drag.hover = $(event.srcElement);
				// console.log(event.srcElement);
				break;
			case "mouseup":
				// handle tile drag end
				Self.move({ type: "drop-tile", orgEvent: event });
				// reset rack
				Self.els.rack.removeClass("drop arranging").css({ "--posY": "", "--posX": "" });
				// unbind event handlers
				Drag.doc.off("mousemove mouseover mouseup", Self.move);
				break;
			case "drop-tile":
				let css = {
						top: Drag.drop.top,
						left: Drag.drop.left
					};
				pY = Drag.posY;
				pX = Math.min(Drag.posX, 15);
				if (Drag.hover.hasClass("drop")) {
					switch (true) {
						case Drag.hover.hasClass("rack"):
							css = {
								top: (pY * 78) + 5,
								left: (pX * 56) + 21,
							};
							// decide direction to push tiles
							let row = Self.els.rack.find(".tile").filter(tile => +tile.offsetTop === css.top),
								hovered = row.filter(tile => +tile.offsetLeft === css.left),
								choose = {
									left: { els: [], chain: css.left, done: false },
									right: { els: [], chain: css.left, done: false },
								};
							// if it is the first tile to the left
							if (Drag.posX <= 0) {
								choose.left.done = true;
								choose.left.els.push(...Array(99).fill(0));
							}
							// if it is the last tile to the right
							if (Drag.posX >= 15) {
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

							if (!hovered.length) {
								// empty slot - do nothing
							} else if (choose.left.els.length > 16 && choose.right.els.length > 16) {
								// no empty space - let tile fly back to origin
								css = {
									top: Drag.drop.top,
									left: Drag.drop.left
								};
								if (Drag.el.hasClass("new-tile")) {
									let slot = {};
									if (pY === 0) {
										slot.top = 83;
										row = Self.els.rack.find(".tile").filter(tile => +tile.offsetTop === 83);
									} else {
										slot.top = 5;
										row = Self.els.rack.find(".tile").filter(tile => +tile.offsetTop === 5);
									}
									for (let i=0; i<16; i++) {
										if (!slot.left && (!row[i] || +row[i].offsetLeft !== (i * 56) + 21)) {
											slot.left = (i * 56) + 21;
										}
									}
									css = {
										top: slot.top,
										left: slot.left,
									};
								}
							} else if (hovered.length && choose.left.els.length >= choose.right.els.length) {
								if (hovered.length) choose.right.els.unshift(hovered);

								choose.right.els.map(tile => tile
									.cssSequence("smooth", "transitionend", el => el.removeClass("smooth"))
									.css({ left: +tile.prop("offsetLeft") + 56 }));
							} else if (hovered.length) {
								if (Drag.posX === 16 && hovered.length) choose.left.els.unshift(hovered);
								if (Drag.posX < 16) css.left -= 56;

								choose.left.els.map(tile => tile
									.cssSequence("smooth", "transitionend", el => el.removeClass("smooth"))
									.css({ left: +tile.prop("offsetLeft") - 56 }));
							}
							break;
						case Drag.hover.hasClass("inset"):
							css = {
								top: Drag.tOffset.top - Drag.rOffset.top + 5,
								left: Drag.tOffset.left - Drag.rOffset.left + 5,
							};
							break;
						case Drag.hover.hasClass("board"):
							if (Drag.el.hasClass("new-tile")) {
								console.log(Drag.hover);
							}
							break;
					}
				}
				// soft landing of dragged tile
				Drag.el
					.removeClass("dragging new-tile")
					.cssSequence("smooth", "transitionend", el => {
						// reset dragged element
						el.removeClass("smooth");
						// reset drop zones
						Self.els.el.removeClass("drop");
						Self.els.el.find(".drop").removeClass("drop");
						// update game engine
						Engine.checkThrow(1, el.data("id"));
					})
					.css(css);
				break;
		}
	}
}
