
// okey.game

{
	init() {
		// fast references
		this.els = {
			el: window.find(".board"),
			rack: window.find(".player.user .rack"),
			content: window.find("content"),
			common: {
				series: window.find(".common .series"),
				doubles: window.find(".common .doubles"),
				info: window.find(".common .info"),
			},
			discard: {
				player1: window.find(".discard .player-1"),
				player2: window.find(".discard .player-2"),
				player3: window.find(".discard .player-3"),
				player4: window.find(".discard .player-4"),
			},
		};

		// bind event handlers
		this.els.el.on("mousedown", ".rack .tile, .tile.draggable", this.move);
	},
	dispatch(event) {
		let APP = okey,
			Self = APP.game,
			sOffset,
			dOffset,
			rows,
			rI,
			css,
			str,
			pEl,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "set-game-engine":
				let types = ["51", "101", "okey"],
					num = types.indexOf(event.arg);
				Engine.setEngine(num);
				// update board attribute
				Self.els.el.data({ engine: types[num] });
				break;
			case "engine-sort-serial":
				Engine.arrange(1, 1);
				Engine.updateRack();
				break;
			case "engine-sort-double":
				Engine.arrange(1, 2);
				Engine.updateRack();
				break;
			case "draw-stack-tile":
				pEl = Self.els.el.find(`.seat[data-seat="${event.seat}"] .hole`).addClass("draw-tile");
				setTimeout(() => {
					pEl.cssSequence("draw-anim", "transitionend", elem => {
						elem.removeClass("draw-tile draw-anim");
					});
				}, 10);
				break;
			case "discard-tile":
				let eventTile = Engine.toParts(event.tile);
				pEl = Self.els.el.find(`.seat[data-seat="${event.seat}"] .hole`).addClass("discard-tile");
				el = pEl.find(".tile").removeClass("blank").addClass(eventTile.clr).data({ v: eventTile.num });
				setTimeout(() => {
					pEl.cssSequence("discard-anim", "transitionend", elem => {
						elem.removeClass("discard-tile discard-anim");
						// insert tile into discard hole
						let clone = Self.els.discard[`player${event.seat}`].append(el.clone(true));
						// reset original tile
						el.addClass("blank").removeClass(eventTile.clr).removeAttr("data-v");

						if (event.seat === 4) {
							// make last tile draggable
							clone.addClass("draggable");
							// make tile stack draggable
							Self.els.common.info.find(".left .tile").addClass("draggable");
						}
					});
				}, 10);
				break;
			case "get-discarded-tile":
				el = Self.els.discard[`player${event.from}`].find(".tile").get(0);
				pEl = Self.els.el.find(`.seat[data-seat="${event.seat}"] .hole`).addClass("get-discarded");
				pEl.append(el);
				setTimeout(() => {
					pEl.cssSequence("get-anim", "transitionend", elem => {
						elem.removeClass("get-anim get-discarded")
						el.remove();
					});
				}, 10);
				break;
			case "put-tile-back":
				dOffset = Self.els.el.find(".discard .player-4").offset(".board");
				rOffset = Self.els.rack.offset(".board");
				css = {
					top: dOffset.top - rOffset.top + 5,
					left: dOffset.left - rOffset.left + 5,
				}
				// hide button
				event.el.addClass("hidden");
				// animate tile back to discard pile
				Self.els.rack.find(".discard-loan")
					.cssSequence("smooth", "transitionend", el => {
						// reset element
						el.removeClass("smooth discard-loan").css({ top: "", left: "" });
						// update DOM
						Self.els.el.find(".discard .player-4").append(el);
					})
					.css(css);
				break;
			case "user-initial-meld":
				pEl = Self.els.el.find(`.seat[data-seat="${event.seat}"] .scored`);
				el = pEl.find(".tile");
				event.total.toString().split("").map((v, i) => el.get(i).data({ v }));
				pEl.removeClass("hidden").addClass("pop-tiles");
				break;
			case "meld-series":
				dOffset = Self.els.common.series.offset(".board");
				sOffset = Self.els.el.find(`.seat[data-seat="${event.from}"] .hole`).offset(".board");
				str = [];
				rows = [[]];
				rI = +(Self.els.common.series.data("rows") || 0);

				event.setTiles.map(item => {
					if (item == "") rows.push([]);
					else rows[rows.length-1].push(item);
				});
				// remove empty arrays
				rows = rows.filter(r => r.length);

				rows.map((row, y) => {
					let i,
						il = row.length,
						fy = sOffset.top - dOffset.top,
						fx = sOffset.left - dOffset.left;
					row.map((col, x) => {
						let { id, clr, num } = Engine.toParts(col);
						if (!i) {
							switch (num) {
								case 10: i = 9-(il>>1); break;
								case 11: i = 10-(il>>1); break;
								default: i = Math.min(13-il, num-1);
							}
						};
						str.push(`<span class="tile ${clr}" data-v="${num}" data-id="${col}" style="--y: ${y+rI}; --x: ${x+i}; --fd: ${str.length}; --fy: ${fy}px; --fx: ${fx}px"></span>`);
					});
				});
				Self.els.common.series
					.addClass("anim-start")
					.css({ "--aT": str.length })
					.data({ rows: rows.length })
					.append(str.join(""));
				return new Promise(resolve => {
					// start anim
					setTimeout(() =>
						Self.els.common.series.cssSequence("anim-end", "transitionend", el => {
							el.removeClass("anim-start anim-end").css({ "--aT": "" });
							resolve();
						}), 100);
				});
				break;
			case "meld-doubles":
				dOffset = Self.els.common.doubles.offset(".board");
				sOffset = Self.els.el.find(`.seat[data-seat="${event.from}"] .hole`).offset(".board");
				str = [];
				rows = [[]];
				rI = +(Self.els.common.doubles.data("rows") || 0);

				event.setTiles.map(item => {
					if (item == "") rows.push([]);
					else rows[rows.length-1].push(item);
				});
				// remove empty arrays
				rows = rows.filter(r => r.length);

				rows.map((row, y) => {
					let i = 0,
						fy = sOffset.top - dOffset.top,
						fx = sOffset.left - dOffset.left;
					row.map((col, x) => {
						let { id, clr, num } = Engine.toParts(col);
						str.push(`<span class="tile ${clr}" data-v="${num}" data-id="${col}" style="--y: ${y+rI}; --x: ${x+i}; --fd: ${str.length}; --fy: ${fy}px; --fx: ${fx}px""></span>`);
					});
				});
				Self.els.common.doubles
					.addClass("anim-start")
					.css({ "--aT": str.length })
					.data({ rows: rows.length })
					.append(str.join(""));
				// start anim
				setTimeout(() =>
					Self.els.common.doubles.cssSequence("anim-end", "transitionend", el => {
						el.removeClass("anim-start anim-end").css({ "--aT": "" });
					}), 100);
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
					rOffset = Self.els.rack.offset(".board"),
					isNew;
				if (el.parent().hasClass("left")) {
					let { id, clr, num } = Engine.drawTile(),
						lTiles = Self.els.el.find(".info .tiles.left"),
						lOffset = lTiles.offset(".board"),
						y = lOffset.top - rOffset.top + 5,
						x = lOffset.left - rOffset.left + 5;
					//disable draggablity
					Self.els.common.info.find(".tile.draggable").removeClass("draggable");
					// insert new tile as dragged element
					el = Self.els.rack.append(`<span class="tile ${clr} new-tile" data-v="${num}" data-id="${id}" style="top: ${y}px; left: ${x}px;"></span>`);
				}

				el = el.addClass("dragging");

				let doc = $(document),
					drop = el.offset(".rack"),
					tOffset = el.offset(".board"),
					dOffset = Self.els.discard.player1.offset(".board"),
					isDiscard = el.parent().hasClass("player-4"),
					diff = { x: 0, y: 0 },
					offset = {
						y: event.offsetY,
						x: event.offsetX,
					},
					click = {
						y: event.clientY,
						x: event.clientX,
					};
				if (isDiscard) {
					drop = el.offset();
					diff.y -= 73;
				}
				if (!drop) {
					drop = el.offset();
					diff.y -= 73;
				}
				click.y -= drop.top;
				click.x -= drop.left;

				// enable drop zones
				Self.els.el.addClass("drop");
				Self.els.rack.addClass("drop arranging");
				if (!isDiscard) Self.els.el.find(".discard .inset.player-1").addClass("drop");
				// drag info
				Self.drag = { doc, el, click, drop, diff, offset, tOffset, rOffset, dOffset, isDiscard, isNew };
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
					if (Drag.isDiscard) {
						let pEl = Drag.el.parent().offset(".board"),
							dOffset = Drag.el.offset();
						Self.els.el.find(".actions.put-back").removeClass("hidden");
						Drag.el = Self.els.rack.append(Drag.el).addClass("discard-loan");
						Drag.el.css({
								top: pEl.top - Drag.rOffset.top + dOffset.top,
								left: pEl.left - Drag.rOffset.left + dOffset.left,
							});
					}

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
									css = Self.getEmptySlot();
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
							Drag.isThrow = true;
							// sof land position
							css = {
								top: Drag.dOffset.top - Drag.rOffset.top + 5,
								left: Drag.dOffset.left - Drag.rOffset.left + 5,
							};
							break;
						case Drag.hover.hasClass("board"):
							if (Drag.el.hasClass("new-tile")) {
								css = Self.getEmptySlot();
							}
							break;
					}
				}
				// soft landing of dragged tile
				Drag.el
					.removeClass("dragging new-tile")
					.cssSequence("smooth", "transitionend", el => {
						// reset dragged element
						el.removeClass("smooth draggable");
						// reset drop zones
						Self.els.el.removeClass("drop");
						Self.els.el.find(".drop").removeClass("drop");

						if (Drag.isThrow) {
							// move element to discard hole
							Self.els.discard.player1.append(el.css({ top: "", left: "" }));
						}
						// update game engine
						Engine.dragStop(1, Drag);
					})
					.css(css);
				break;
		}
	},
	getEmptySlot() {
		let slot = {},
			row;
		if (this.drag.posY === 0) {
			slot.top = 83;
			row = this.els.rack.find(".tile").filter(tile => +tile.offsetTop === 83);
		} else {
			slot.top = 5;
			row = this.els.rack.find(".tile").filter(tile => +tile.offsetTop === 5);
		}
		for (let i=0; i<16; i++) {
			let checkSlot = row.filter(tile => tile.offsetLeft === (i * 56) + 21);
			if (!slot.left && !checkSlot.length) {
				slot.left = (i * 56) + 21;
			}
		}
		return slot;
	}
}
