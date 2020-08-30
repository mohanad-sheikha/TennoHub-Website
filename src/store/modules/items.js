/* eslint-disable */
import axios from 'axios';

const ITEM_CACHE_TTL = 5 * 60 * 1000;

const state = {
	categories: [],
	cache: []
}
const mutations = {
	setCategories (state, categories)
	{
		categories.sort();
		state.categories = categories;
	},
	cacheItem (state, item)
	{
		if (item && item.uniqueName)
		{
			const isCached = !!state.cache.find(element => element.uniqueName == item.uniqueName) === true;
			if (!isCached)
			{
				item.cachedDate = new Date();
				state.cache.push(item);
			}
		}
	}
}
const actions = {
	getTradableItem ({ state, getters, commit }, itemUniqueName)
	{
		return new Promise((resolve, reject) =>
		{
			const item = getters.getCachedItem(itemUniqueName);
			if (item)
			{
				resolve(item);
				return;
			}

			axios.get(`api/item/tradable/${itemUniqueName}`)
				.then(response =>
				{
					const item = response.data;
					commit('cacheItem', item);
					resolve(item);
					return;
				})
				.catch(error =>
				{
					reject(error);
					return;
				})
		});
	},
	getTradableItems ({ state, getters, commit }, { itemName, limit })
	{
		return new Promise((resolve, reject) =>
		{
			axios.get(`api/items/tradable/${itemName}/${limit}`)
				.then(response =>
				{
					resolve(response.data);
					return;
				})
				.catch(error =>
				{
					reject(error);
					return;
				})
		})
	},
	getItems ({ state, getters, commit }, { itemName, limit })
	{
		return new Promise((resolve, reject) =>
		{
			axios.get(`api/items/${itemName}/${limit}`)
				.then(response =>
				{
					resolve(response.data);
					return;
				})
				.catch(error =>
				{
					reject(error);
					return;
				})
		});
	},
	getItem ({ state, getters, commit }, itemUniqueName)
	{
		return new Promise((resolve, reject) =>
		{
			const item = getters.getCachedItem(itemUniqueName);
			if (item)
			{
				resolve(item);
				return;
			}

			axios.get(`api/item/${itemUniqueName}`)
				.then(response =>
				{
					const item = response.data;
					commit('cacheItem', item);
					resolve(item);
					return;
				})
				.catch(error =>
				{
					reject(error);
					return;
				})
		});
	},
	getItemWithAnalytics ({ state, getters, commit }, itemUniqueName)
	{
		return new Promise((resolve, reject) =>
		{
			const item = getters.getCachedItem(itemUniqueName);
			if (item)
			{
				resolve(item);
				return;
			}

			axios.get(`api/item/analytics/${itemUniqueName}`)
				.then(response =>
				{
					const item = response.data;
					commit('cacheItem', item);
					resolve(item);
					return;
				})
				.catch(error =>
				{
					reject(error);
					return;
				})
		});
	},
	getCategories ({ commit })
	{
		return new Promise((resolve, reject) =>
		{
			axios.get("api/items/categories").then(response =>
			{
				if (response.status === 200)
				{
					commit("setCategories", response.data);
					resolve(response.data);
					return;
				}
				reject();
				return;
			})
				.catch(error =>
				{
					reject(error);
					return;
				})
		})
	}
}

const getters = {
	getCachedItem: (state) => (itemUniqueName) =>
	{
		const item = state.cache.find(element => element.uniqueName === itemUniqueName);
		if (item && item.cachedDate)
		{
			const now = new Date();
			const timeDifference = now.getTime() - new Date (item.cachedDate).getTime();
			const isExpired = timeDifference > ITEM_CACHE_TTL;

			if (!isExpired)
			{
				return item;
			}
		}
		return null;
	}
}

export default {
	state,
	mutations,
	actions,
	getters
};
