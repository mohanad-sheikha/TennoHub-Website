import user from './modules/user';
import toasts from './modules/toasts';
import items from './modules/items';
import listings from './modules/listings';
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		user: user,
		toasts: toasts,
		items: items,
		listings: listings
	},
});
