/* eslint-disable */
import axios from 'axios';
import { sendListing } from '../../real-time/listings';
import * as liveListings from '../../real-time/listings';

Object.byString = function (o, s)
{
	s = s.replace(/\[(\w+)\]/g, '.$1');
	s = s.replace(/^\./, '');
	var a = s.split('.');
	for (var i = 0, n = a.length; i < n; ++i)
	{
		var k = a[i];
		if (k in o)
		{
			o = o[k];
		} else
		{
			return;
		}
	}
	return o;
}

const FILTER_FUNCTIONS = {
	STRING: {
		CONTAINS: (a, b) => String(b).toLowerCase().includes(String(a).toLowerCase()),
		EQUALS: (a, b) => String(b).toLowerCase() === String(a).toLowerCase(),
		STARTS_WITH: (a, b) => String(b).toLowerCase().startsWith(String(a).toLowerCase()),
		ENDS_WITH: (a, b) => String(b).toLowerCase().endsWith(String(a).toLowerCase())
	},
	NUMBER: {
		MINIMUM: (a, b) => Number(b) >= Number(a),
		MAXIMUM: (a, b) => Number(b) <= Number(a),
		EQUALS: (a, b) => Number(b) === Number(a)
	},
	DATE: {
		BEFORE: (a, b) => Date(b) <= Date(a),
		AFTER: (a, b) => Date(b) >= Date(a),
		EQUALS: (a, b) => Date(b) === Date(a)
	}
}
const SORT_FUNCTIONS = {
	STRING: {
		A_TO_Z: (field) => (a, b) =>
		{
			const aValue = Object.byString(a, field);
			const bValue = Object.byString(b, field);
			return String(aValue).localeCompare(String(bValue))
		},
		Z_TO_A: (field) => (a, b) =>
		{
			const aValue = Object.byString(a, field);
			const bValue = Object.byString(b, field);
			return String(bValue).localeCompare(String(aValue))
		},
	},
	NUMBER: {
		LOW_TO_HIGH: (field) => (a, b) =>
		{
			const aValue = Object.byString(a, field);
			const bValue = Object.byString(b, field);
			return Number(aValue) < Number(bValue) ? -1 : 1
		},
		HIGH_TO_LOW: (field) => (a, b) =>
		{
			const aValue = Object.byString(a, field);
			const bValue = Object.byString(b, field);
			return Number(aValue) > Number(bValue) ? -1 : 1
		},
	},
	DATE: {
		OLD_TO_NEW: (field) => (a, b) =>
		{
			const aValue = Object.byString(a, field);
			const bValue = Object.byString(b, field);
			return new Date(aValue) - new Date(bValue);
		},
		NEW_TO_OLD: (field) => (a, b) =>
		{
			const aValue = Object.byString(a, field);
			const bValue = Object.byString(b, field);
			return new Date(bValue) - new Date(aValue);
		},
	}
}

const state = {
	// { _id: {}, item: {}, price: 5, quantity: 5, userId: {}, itemUniqueName: '123', dateCreated: Date }
	listings: [],
	filters: [
		{
			name: 'item.name STARTS WITH',
			field: 'item.name',
			function: FILTER_FUNCTIONS.STRING.STARTS_WITH,
			value: null
		},
		{
			name: 'item.category EQUALS',
			field: 'item.category',
			function: FILTER_FUNCTIONS.STRING.EQUALS,
			value: null
		},
		{
			name: 'price MINIMUM',
			field: 'price',
			function: FILTER_FUNCTIONS.NUMBER.MINIMUM,
			value: null
		},
		{
			name: 'price MAXIMUM',
			field: 'price',
			function: FILTER_FUNCTIONS.NUMBER.MAXIMUM,
			value: null
		},
		{
			name: 'userId.ign EQUALS',
			field: 'userId.ign',
			function: FILTER_FUNCTIONS.STRING.STARTS_WITH,
			value: null
        },
	],
	sorts: [
		{
			label: "Most Recent",
			field: "dateCreated",
			direction: 'desc',
			function: SORT_FUNCTIONS.DATE.NEW_TO_OLD('dateCreated'),
		},
		{
			label: "Lowest Price",
			field: "price",
			direction: 'asc',
			function: SORT_FUNCTIONS.NUMBER.LOW_TO_HIGH('price'),
		},
		{
			label: "Highest Price",
			field: "price",
			direction: 'desc',
			function: SORT_FUNCTIONS.NUMBER.HIGH_TO_LOW('price'),
		},
		{
			label: "Lowest Quantity",
			field: "quantity",
			direction: 'asc',
			function: SORT_FUNCTIONS.NUMBER.LOW_TO_HIGH('quantity'),
		},
		{
			label: "Highest Quantity",
			field: "quantity",
			direction: 'desc',
			function: SORT_FUNCTIONS.NUMBER.HIGH_TO_LOW('quantity'),
		},
		{
			label: "Least Recent",
			field: "dateCreated",
			direction: 'asc',
			function: SORT_FUNCTIONS.DATE.OLD_TO_NEW('dateCreated'),
		}
	],
	activeSort: {
		label: "Most Recent",
		field: "dateCreated",
		direction: 'desc',
		function: SORT_FUNCTIONS.DATE.NEW_TO_OLD('dateCreated'),
	},
	isRetrieving: false,
	isFiltering: false,
	isSorting: false,
	isDeleting: false,
	lowestPrice: 0,
	highestPrice: 0
};
const getters = {
	priceRange: state => {
		const prices = state.listings.map(listing => listing.price);
		const lowestPrice = Math.min(...prices);
		const highestPrice = Math.max(...prices);
		return { lowestPrice, highestPrice };
	},
	isLoading: state => state.isFiltering || state.isSorting || state.isRetrieving || state.isDeleting,
	// Get the active filters
	// Check if is valid listing
	// Store the index to easily modify
	// the original listings array later
	// and push to valid listings
	getFilteredListings: state =>
	{
		try
		{
			state.isFiltering = true;
			
			const filters = state.filters.filter(el => !!el.value === true);
			let listings = [];
			state.listings.slice().forEach(listing =>
			{
				let isValid = true;
				for (let filter of filters)
				{
					const value = Object.byString(listing, filter.field);
					isValid = isValid && filter.function(filter.value, value);
				}
				if (isValid)
				{
					listings.push(listing);
				}
			})

			state.isFiltering = false;
			return listings;
		}
		catch (exception)
		{
			return [];
		}
	},
	getSortedListings: (state, getters) =>
	{
		state.isSorting = true;
		let listings = getters.getFilteredListings.sort(state.activeSort.function);
		state.isSorting = false;
		return listings;
	},
	getTransformedListings: (state, getters) => getters.getSortedListings
};
const mutations = {
	setSortType (state, { field, direction })
	{
		state.activeSort = state.sorts.find(el => el.field === field && el.direction === direction);
	},
	resetSortType (state)
	{
		state.activeSort = state.sorts[0];
	},
	invertSortType (state)
	{
		state.activeSort = state.sorts.find(el => el.field === state.activeSort.field && el.direction !== state.activeSort.direction);
	},
	clearFilters (state)
	{
		state.filters.forEach(filter => filter.value = null);
	},
	clearFilter (state, name)
	{
		state.filters.find(el => el.name === name).value = null;
	},
	setFilter (state, name, value)
	{
		state.filters.find(el => el.name === name).value = value;
	},
	setListingsLimit (state, limit)
	{
		state.limit = limit;
	},
	setListings (state, listings)
	{
		state.listings = listings;
	},
	clearListings (state)
	{
		state.listings = [];
	},
	removeListing (state, listing)
	{
		const index = state.listings.findIndex(el => el._id === listing._id);
		state.listings.splice(index, 1);
	},
	addListing (state, listing)
	{
		let existingListing = state.listings.findIndex(e => e._id === listing._id) !== -1;
		if (!existingListing)
		{
			state.listings.push(listing);
		}
	},
	setLiveListings (state, isLive)
	{
		if (isLive === true)
		{
			liveListings.listen();
		}
		else
		{
			liveListings.stopListening();
		}
	}
};
const actions = {
	getAllListings ({ state, commit })
	{
		state.isRetrieving = true;
		axios.get('api/listings')
			.then(response =>
			{
				if (response.status === 200)
				{
					commit('setListings', response.data);
				} else
				{
				}
			})
			.catch(error =>
			{
			})
			.finally(() =>
			{
				state.isRetrieving = false;
			})
	},
	getUserListings ({ state, commit }, userIgn)
	{
		state.isRetrieving = true;
		axios.get(`api/users/listings/${userIgn}`)
			.then(response =>
			{
				if (response.status === 200)
				{
					commit('setListings', response.data);
				} else
				{
				}
			})
			.catch(error =>
			{
				console.error(`Error retrieving user's listings.`);
			})
			.finally(() =>
			{
				state.isRetrieving = false;
			})
	},
	getItemListings ({ state, commit }, itemUniqueName)
	{
		state.isRetrieving = true;
		axios.get(`api/listings/item/${itemUniqueName}`)
			.then(response =>
			{
				if (response.status === 200)
				{
					commit('setListings', response.data);
				} else
				{
				}
			})
			.catch(error =>
			{
				console.error(`Error retrieving item's listings.`);
			})
			.finally(() =>
			{
				state.isRetrieving = false;
			})
	},
	refreshListings ({ dispatch }, route)
	{
		if (route.name === 'listings')
		{
			dispatch('getAllListings');
		}
		else if (route.name === 'userListings')
		{
			let userId = route.params.userId;
			dispatch('getUserListings', userId);
		}
	},
	getListingById ({ state }, listingId)
	{
		return new Promise((resolve, reject) =>
		{
			axios.get(`api/listings/${listingId}`)
				.then(response =>
				{
					if (response.status === 200)
					{
						resolve(response.data);
						return;
					}
				})
				.catch(error =>
				{
					reject(error);
					return;
				});
		})
	},
	createListing ({ state, commit }, { itemUniqueName, price, quantity, authToken })
	{
		return new Promise((resolve, reject) =>
		{
			axios.post("api/listings", { itemUniqueName, price, quantity, authToken })
				.then(response =>
				{
					if (response.status === 200 && response.data)
					{
						resolve(response.data);
						commit('addListing', response.data);
						sendListing(response.data);
						return;
					}
				})
				.catch(error =>
				{
					reject(error);
					return;
				})
		});
	},
	deleteListing ({ state }, { listingId, authToken })
	{
		state.isDeleting = true;
		return new Promise((resolve, reject) =>
		{
			axios.delete(`api/listings/${listingId}/${authToken}`)
				.then(response =>
				{
					if (response.status === 200)
					{
						resolve(response.data);
						return;
					}
				})
				.catch(error =>
				{
					reject(error);
					return;
				})
				.finally(() =>
				{
					state.isDeleting = false;
				})
		})
	},
	updateListing ({ state }, { listingId, price, quantity, authToken })
	{
		return new Promise((resolve, reject) =>
		{
			axios.put("api/listings", { listingId, price, quantity, authToken })
				.then(response =>
				{
					if (response.status === 200)
					{
						resolve(response.data);
						return;
					}
				})
				.catch(error =>
				{
					reject(error);
					return;
				})
		})
	}
};

export default {
	state,
	getters,
	mutations,
	actions
}