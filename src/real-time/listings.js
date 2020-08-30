
import store from '../store/store';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import CONSTANTS from './constants';

const socket = io(CONSTANTS.API_URL, { secure: true, upgrade: false, reconnectionAttempts: 1 });
const app = feathers();

app.configure(socketio(socket));

export function listen() {
	app.service('listings').on('created', listing => {
		store.commit('addListing', listing);
	});
}

export function stopListening() {
	app.service('listings').removeListener('created');
}

export function sendListing(listing) {
	app.service('listings').create(listing);
}