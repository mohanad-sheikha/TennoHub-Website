/* eslint-disable */
import axios from 'axios';
import Cookies from 'js-cookie';

const state = {
	_id: null,
	email: null,
	isAdmin: null,
	ign: null,
	lastLogin: null,
	isLoading: false,
	isRetrieving: false
};

const getters = {
	isGuest: (state) => {
		return !state._id === true;
	}
}

const mutations = {
	setId(state, value) {
		state._id = value;
	},
	clearId(state) {
		state._id = null;
	}
}

const actions = {
	getUserProfile(context, userIgn) {
		return new Promise((resolve, reject) => {
			axios.get(`api/users/${userIgn}`)
				.then(response => {
					if (response.status === 200) {
						resolve(response.data);
						return;
					}
					else {
						let error = 'Unable to get user.';
						reject(error);
						return;
					}
				})
				.catch(error => {
					reject(error);
					return;
				});
		});
	},
	loginUsingToken({ state }) {
		state.isRetrieving = true;
		let authToken = Cookies.get('authToken');
		if (!authToken || authToken == 'undefined' || authToken == 'null') {
			state.isRetrieving = false;
			return;
		}

		axios.get(`api/users/login/${authToken}`)
			.then(response => {
				if (response.status === 200) {
					state._id = response.data._id;
					state.email = response.data.email;
					state.isAdmin = response.data.isAdmin;
					state.ign = response.data.ign;
					state.lastLogin = response.data.lastLogin;
					state.authToken = response.data.authToken;
					Cookies.set('authToken', state.authToken, { expires: 21 });
				}
				else {
				}
			})
			.catch(error => {
				Cookies.remove('authToken');
			})
			.finally(() => {
				state.isRetrieving = false;
			})
	},
	login({ state }, { email, password, stayLoggedIn }) {
		return new Promise((resolve, reject) => {
			axios.get(`api/users/login/${email}/${password}`)
				.then((response) => {
					if (response.status === 200) {
						let user = response.data;
						state._id = user._id;
						state.email = user.email;
						state.isAdmin = user.isAdmin;
						state.ign = user.ign;
						state.lastLogin = user.lastLogin;
						state.authToken = user.authToken;
						if (stayLoggedIn) {
							Cookies.set('authToken', state.authToken, { expires: 21 });
						}
						resolve(state);
						return;
					}
					else {
						reject('Unable to login.');
						return;
					}
				})
				.catch(error => {
					reject(error);
					return;
				});
		});
	},
	signup({ state }, { email, password, ign }) {
		return new Promise((resolve, reject) => {
			axios.post('api/users/signup', { email, password, ign })
				.then((response) => {
					if (response.status === 200) {
						resolve();
					}
					else {
						reject('Unable to create account.');
					}
				})
				.catch((error) => {
					if (error && error.response && error.response.data) {
						reject(error.response.data);
						return;
					}
					else {
						reject(error);
						return;
					}
				});
		}
		);
	},
	logout({ state }) {
		state._id = null;
		state.email = null;
		state.isAdmin = null;
		state.ign = null;
		state.lastLogin = null;
		state.authToken = null;
		Cookies.remove('authToken');

		return new Promise((resolve, reject) => {
			axios.post('api/users/logout', { authToken: state.authToken })
				.then((response) => {
					if (response.status === 200) {
						resolve();
						return;
					}
					else {
						reject('Unable to logout.');
						return;
					}
				})
				.catch((error) => {
					reject(error);
					return;
				})
		});
	},
	verify({ state }, verificationToken) {
		return new Promise((resolve, reject) => {
			axios.post('api/users/verify', { verificationToken })
				.then(response => {
					if (response.status === 200) {
						resolve(response.data);
						return;
					}
				})
				.catch(error => {
					reject(error);
					return;
				})
		})
	}
};

export default {
	state,
	mutations,
	getters,
	actions,
};
