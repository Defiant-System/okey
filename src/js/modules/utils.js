
let Utils = {
	random(min, max) {
		return Math.random() * ( max - min ) + min;
	},
	randomInt(min, max) {
		return this.random(min, max) | 0;
	}
};
