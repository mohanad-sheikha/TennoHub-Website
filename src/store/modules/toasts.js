import uniqid from 'uniqid';

const state = {
	active: [],
};

const actions = {
	createToast({ state }, payload) {
		state.active.push({
			title: payload.title,
			message: payload.message,
			duration: payload.duration,
			autohide: payload.autohide,
			id: uniqid(),
		});
	},
	removeToast({ state }, index) {
		if (state.active.length > index && index >= 0)
			state.active.splice(index, 1);
	},
};

export default {
	state,
	actions,
};
