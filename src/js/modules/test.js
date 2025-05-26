
let Test = {
	init(APP) {

		// return;

		// APP.dispatch({ type: "open-help" });
		// return setTimeout(() => APP.content.find(`.button[data-click="show-settings"]`).trigger("click"), 500);

		// let arr = ['211', '311', '411', '113', '000', '313', '106', '107', '301', '302', '104', '304', '306', '104', '201', '403', '405', '209', '403', '405', '408', '412'];
		// Board.tiles = arr.map(e => ({ value: e }));
		// console.log( Tiles.sortDouble(0, 1).map(e => e ? e.value : "") );
		// return;

		APP.game.dispatch({ type: "restore-state", state });
		// APP.game.dispatch({ type: "start-game", dealer: 4, noAnim: true });
		
		// setTimeout(() => Engine.dragStop(1, { rack: APP.content.find(".rack ") }), 500);
		// Tiles.restore(state.table.data);

		// setTimeout(() => APP.game.dispatch({ type: "deal-tiles-to", seat: 2, num: 21 }), 500);
		// setTimeout(() => APP.game.dispatch({ type: "deal-user-tiles", tiles: state.player[0].board }), 500);

		// setTimeout(() => APP.game.dispatch({ type: "get-discarded-tile", seat: 2, from: 1 }), 500);
		// setTimeout(() => APP.game.dispatch({ type: "get-discarded-tile", seat: 3, from: 2 }), 1000);
		// setTimeout(() => APP.game.dispatch({ type: "get-discarded-tile", seat: 4, from: 3 }), 1500);

		// setTimeout(() => APP.game.dispatch({ type: "discard-tile", seat: 2, tile: "101" }), 500);
		// setTimeout(() => APP.game.dispatch({ type: "discard-tile", seat: 3, tile: "202" }), 1000);
		// setTimeout(() => APP.game.dispatch({ type: "discard-tile", seat: 4, tile: "303" }), 1500);

		// setTimeout(() => APP.game.dispatch({ type: "draw-stack-tile", seat: 2 }), 500);
		// setTimeout(() => APP.game.dispatch({ type: "draw-stack-tile", seat: 3 }), 1000);
		// setTimeout(() => APP.game.dispatch({ type: "draw-stack-tile", seat: 4 }), 1500);

		
		// setTimeout(() => APP.game.dispatch({ type: "user-initial-meld", seat: 3, total: 115 }), 500);


		// setTimeout(() => {
		// 	let set = [106, 107, 108, 109, '', 210, 211, 212, '', 113, 813, 313, 413, '', 112, 312, 412, 212, '', 111, 311, 411, 211, '', 110, 310, 410, 210];
		// 	APP.game.dispatch({ type: "meld-series", from: 2, set });
		// }, 1000);

		// setTimeout(() => {
		// 	let set = [312, 312, '', 101, 101, '', 203, 203, '', 406, 406, '', 107, 107];
		// 	APP.game.dispatch({ type: "meld-doubles", from: 4, set });
		// }, 1000);


		// setTimeout(() => APP.content.find(`.button[data-click="engine-sort-serial"]`).trigger("click"), 500);
		// setTimeout(() => APP.content.find(`.button[data-click="engine-sort-double"]`).trigger("click"), 500);


		// setTimeout(() => {
		// 	let Self = APP.game,
		// 		el = Self.els.el.find(`.tile[data-id="201"]`);
		// 	Self.els.discard.player1.append(el.css({ top: "", left: "" }));
		// 	Engine.dragStop(1, el.data("id"));
		// }, 500);

		// setTimeout(() => APP.game.dispatch({ type: "put-tile-back" }), 200);


	}
};

let state = {
		settings: {
			solo: true,
			assisted: true,
			regular: true,
			rounds: 1
		},
		table: {
			data: ["405","104","000","301","106","306","311","411","302","201","107","408","113","412","304","211","313","403","403","405","104","209","402","208","303","105","305","410","202","209","201","311","407","304","404","310","404","409","301","112","407","303","112","102","305","208","413","205","210","109","401","406","113","401","211","313","000","310","106","212","107","308","109","206","308","413","406","412","204","206","207","411","306","210","312","402","213","409","101","101","309","111","307","307","108","203","312","302","410","103","205","202","207","105","309","110","408","102","111","110","204","103","213","108","203","212"],
			// data: ["108","101","303","409","401","207","212","105","307","309","108","310","208","302","404","106","312","411","403","413","311","305","112","312","211","102","402","105","203","410","210","304","203","306","208","302","308","109","306","213","413","000","212","111","107","311","301","202","309","401","408","304","204","303","410","409","113","103","411","305","412","404","405","201","406","313","204","406","206","110","407","402","102","301","308","112","209","310","313","408","307","111","103","113","201","211","205","407","101","106","104","202","210","403","104","207","110","405","412","209","000","109","213","205","206","107"],
			// data: ["410","309","405","409","312","310","302","413","301","305","304","308","113","113","109","312","107","311","106","307","406","412","407","107","309","000","209","313","201","213","203","103","204","301","401","108","405","411","404","205","104","207","210","102","112","303","406","205","101","308","210","402","209","304","403","401","305","306","413","412","311","403","411","211","110","212","306","307","201","103","101","105","111","213","410","303","208","302","408","408","112","211","102","106","111","104","108","207","109","212","202","208","313","000","203","407","105","402","206","204","110","206","404","310","202","409"],
			// data: ["107","309","202","406","203","203","101","207","209","204","105","310","305","313","405","306","313","000","403","205","212","405","304","102","103","202","411","109","211","107","303","302","304","112","413","409","211","111","209","311","301","101","408","212","108","306","105","413","104","406","303","308","110","407","410","404","402","311","204","210","112","407","113","308","401","102","208","109","312","302","307","213","404","412","111","307","309","110","104","408","207","106","305","205","113","410","310","402","312","401","403","000","103","213","301","206","201","106","206","210","411","208","108","412","409","201"],
			
			left: ["203","312","302","410","103","205","202","207","105","309","110","408","102","111","110","204","103","213","108","203","212"],
			okey: 213,
			dealer: 2,
		},
		melded: {
			series: [
				[
					{ uid: 1, value: "102" },
					{ uid: 2, value: "103" },
					{ uid: 3, value: "104" },
					{ uid: 4, value: "105" },
					{ uid: 5, value: "106" }
				],
				[
					{ uid: 6, value: "108" },
					{ uid: 7, value: "109" },
					{ uid: 8, value: "110" },
				],
			],
			doubles: [
				[{ uid: 16, value: "211" }, { uid: 16, value: "211" }],
				[{ uid: 18, value: "301" }, { uid: 19, value: "301" }],
			],
		},
		player: [
			{ seat: 1, name: "Hakan",  discard: [], rack: [
				{ uid: 16, value: "211" },
				{ uid: 7, value: "311" },
				{ uid: 8, value: "411" },
				{ uid: 13, value: "113" },
				{ uid: 3, value: "000" },
				{ uid: 17, value: "313" },
				{ uid: 5, value: "106" },
				{ uid: 11, value: "107" },
				{ uid: 4, value: "301" },
				{ uid: 9, value: "302" },
				{ uid: 2, value: "104" },
				{ uid: 15, value: "304" },
				{ uid: 6, value: "306" },
				{ uid: 21, value: "104" },
				{ uid: 10, value: "201" },
				{ uid: 18, value: "403" },
				{ uid: 1, value: "405" },
				{ uid: 22, value: "209" },
				{ uid: 19, value: "403" },
				{ uid: 20, value: "405" },
				{ uid: 12, value: "408" },
				{ uid: 14, value: "412" }
			] },
			{ seat: 2, name: "Denise", discard: [], rack: [
				{ uid: 23, value: '402' },
				{ uid: 24, value: '208' },
				{ uid: 25, value: '303' },
				{ uid: 26, value: '105' },
				{ uid: 27, value: '305' },
				{ uid: 28, value: '410' },
				{ uid: 29, value: '202' },
				{ uid: 30, value: '209' },
				{ uid: 31, value: '201' },
				{ uid: 32, value: '311' },
				{ uid: 33, value: '407' },
				{ uid: 34, value: '304' },
				{ uid: 35, value: '404' },
				{ uid: 36, value: '310' },
				{ uid: 37, value: '404' },
				{ uid: 38, value: '409' },
				{ uid: 39, value: '301' },
				{ uid: 40, value: '112' },
				{ uid: 41, value: '407' },
				{ uid: 42, value: '303' },
				{ uid: 43, value: '112' }
			] },
			{ seat: 3, name: "Ann",    discard: [], rack: [
				{ uid: 44, value: '102' },
				{ uid: 45, value: '305' },
				{ uid: 46, value: '208' },
				{ uid: 47, value: '413' },
				{ uid: 48, value: '205' },
				{ uid: 49, value: '210' },
				{ uid: 50, value: '109' },
				{ uid: 51, value: '401' },
				{ uid: 52, value: '406' },
				{ uid: 53, value: '113' },
				{ uid: 54, value: '401' },
				{ uid: 55, value: '211' },
				{ uid: 56, value: '313' },
				{ uid: 57, value: '000' },
				{ uid: 58, value: '310' },
				{ uid: 59, value: '106' },
				{ uid: 60, value: '212' },
				{ uid: 61, value: '107' },
				{ uid: 62, value: '308' },
				{ uid: 63, value: '109' },
				{ uid: 64, value: '206' }
			] },
			{ seat: 4, name: "Yasmin",   discard: [], rack: [
				{ uid: 65, value: '308'} ,
				{ uid: 66, value: '413'} ,
				{ uid: 67, value: '406'} ,
				{ uid: 68, value: '412'} ,
				{ uid: 69, value: '204'} ,
				{ uid: 70, value: '206'} ,
				{ uid: 71, value: '207'} ,
				{ uid: 72, value: '411'} ,
				{ uid: 73, value: '306'} ,
				{ uid: 74, value: '210'} ,
				{ uid: 75, value: '312'} ,
				{ uid: 76, value: '402'} ,
				{ uid: 77, value: '213'} ,
				{ uid: 78, value: '409'} ,
				{ uid: 79, value: '101'} ,
				{ uid: 80, value: '101'} ,
				{ uid: 81, value: '309'} ,
				{ uid: 82, value: '111'} ,
				{ uid: 83, value: '307'} ,
				{ uid: 84, value: '307'} ,
				{ uid: 85, value: '108'} 
			] },
		],
	};
