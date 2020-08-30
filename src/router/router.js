/* eslint-disable no-unused-vars */
import VueRouter from 'vue-router';
import store from '../store/store.js';
const Home = () => import('../views/Home');
const Listings = () => import('../views/Listings');
const Login = () => import('../views/Login');
const Signup = () => import('../views/Signup');
const Logout = () => import('../views/Logout');
const Settings = () => import('../views/Settings');
const UserVerification = () => import('../views/UserVerification');
const UserListings = () => import('../views/UserListings');
const ItemListings = () => import('../views/ItemListings');

export default new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/home',
			name: 'home',
			component: Home,
		},
		{
			path: '/',
            name: 'listings',
            alias: '/listings',
			component: Listings
		},
		{
			path: '/listings/item/*',
			name: 'itemListings',
			component: ItemListings
		},
		{
			path: '/settings',
			name: 'settings',
			component: Settings,
			beforeEnter: (to, from, next) => {
				if (store.getters.isGuest) {
					return next({ name: 'login' });
				}
				return next();
			}
		},
		{
			path: '/login',
			name: 'login',
			component: Login,
			beforeEnter: (to, from, next) => {
				if (!store.getters.isGuest) {
					return next({ name: 'listings' });
				}
				return next();
			}
		},
		{
			path: '/signup',
			name: 'signup',
			component: Signup,
			beforeEnter: (to, from, next) => {
				if (!store.getters.isGuest) {
					return next({ name: 'listings' });
				}
				return next();
			}
		},
		{
			path: '/logout',
			name: 'logout',
			component: Logout,
			beforeEnter: (to, from, next) => {
				if (store.getters.isGuest) {
					return next({ name: 'listings' });
				}
				return next();
			}
		},
		{
			path: '/user/verify/:verificationToken',
			name: 'userVerification',
			component: UserVerification,
		},
		{
			path: '/user/:userIgn',
			name: 'userListings',
			component: UserListings,
		},
	],
});
