/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';
import App from './components/App';
import store from './store/store';
import router from './router/router';
import axios from 'axios';

axios.defaults.baseURL = process.env.NODE_ENV == 'production' ? '//api.tennohut.com' : '//localhost:3000';

Vue.use(Router);
Vue.use(Vuex);

Vue.config.productionTip = false;

new Vue({
	el: '#app',
	store: store,
	render: (h) => h(App),
	router,
	mounted() {
		this.$store.dispatch('loginUsingToken');
		this.$store.dispatch('getCategories');
	}
});

OverlayScrollbars(document.body, {
	nativeScrollbarsOverlaid: {
		initialize: false,
	},
	scrollbars: {
		autoHide: 'scroll'
	}
});