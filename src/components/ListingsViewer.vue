<template>
	<div class="d-flex flex-column flex-grow-1">
		<Loader :is-loading="isLoading" />
		<div class="d-block d-lg-none position-relative py-4 bg-light">
			<div class="mb-4 d-flex px-4">
				<h4 class="mb-0">Filter</h4>
				<button class="btn btn-outline-secondary ml-auto btn-sm" @click="onFilterClearClick">Clear</button>
			</div>
			<form class="form-inline px-4 mb-2" @submit.prevent="onFilterFormSubmit">
				<label class="sr-only" for="itemNameFilterInput">Item Name</label>
				<input
					type="text"
					class="form-control mr-2"
					id="itemNameFilterInput"
					placeholder="Item Name"
					v-model="filters[0].value"
					autocomplete="off"
				/>
				<label class="sr-only" for="itemTypeFilterSelect">Type</label>
				<select class="form-control mr-2" id="itemTypeFilterSelect" v-model="filters[1].value">
					<option :value="null">All</option>
					<option
						v-for="category of this.$store.state.items.categories"
						:value="category"
						:key="category"
					>{{ category }}</option>
				</select>
				<label class="sr-only" for="minPriceFilterInput">Min Price</label>
				<input
					type="number"
					min="0"
					class="form-control mr-2"
					id="minPriceFilterInput"
					placeholder="Min Price"
					v-model.number="filters[2].value"
					autocomplete="off"
				/>
				<label class="sr-only" for="maxPriceFilterInput">Max Price</label>
				<input
					type="number"
					min="0"
					class="form-control mr-2"
					id="maxPriceFilterInput"
					placeholder="Max Price"
					v-model.number="filters[3].value"
					autocomplete="off"
				/>
			</form>
			<form id="advancedFilterSection" class="overflow-hidden" @submit.prevent="onFilterFormSubmit">
				<div class="form-group px-4 py-2 mb-0 w-fit">
					<label class="sr-only" for="sellerFilterInput">Seller</label>
					<input
						type="text"
						class="form-control"
						id="sellerFilterInput"
						placeholder="Seller"
						autocomplete="off"
						v-model="filters[4].value"
					/>
				</div>
			</form>
			<div class="position-absolute filter-toggle">
				<button class="btn btn-sm btn-light shadow-sm" @click="onToggleFilterSectionClick">
					<i
						class="fas fa-chevron-down transition-transform"
						:class="{ flip: isAdvancedFilterVisible }"
					/>
				</button>
			</div>
		</div>
		<div class="d-flex flex-grow-1">
			<div
				id="filterFormDesktop"
				class="d-none d-lg-block position-relative py-4 bg-dark text-light border-right border-secondary"
			>
				<div class="mb-4 d-flex px-4">
					<h4 class="mb-0 text-light">Filter</h4>
					<button class="btn btn-outline-secondary ml-auto btn-sm" @click="onFilterClearClick">Clear</button>
				</div>
				<form class="px-4 mb-2" @submit.prevent="onFilterFormSubmit">
					<div class="form-group">
						<label for="itemNameFilterInput" class="sr-only">Item Name</label>
						<input
							type="text"
							class="form-control"
							id="itemNameFilterInput"
							placeholder="Item Name"
							v-model="filters[0].value"
							autocomplete="off"
						/>
					</div>
					<div class="form-group">
						<label for="itemTypeFilterSelect" class="sr-only">Type</label>
						<select class="form-control" id="itemTypeFilterSelect" v-model="filters[1].value">
							<option :value="null">All</option>
							<option
								v-for="category of this.$store.state.items.categories"
								:value="category"
								:key="category"
							>{{ category }}</option>
						</select>
					</div>
					<!-- <div class="form-group position-relative pb-3">
						<label for="priceFilterInput">Price</label>
						<input
							type="range"
							class="form-control-range position-absolute"
							min="0"
							id="minPriceFilterInput"
						/>
						<input
							type="range"
							class="form-control-range position-absolute"
							min="0"
							id="maxPriceFilterInput"
						/>
					</div>-->
					<div class="d-flex">
						<div class="form-group mr-2">
							<label for="minPriceFilterInput" class="sr-only">Min Price</label>
							<input
								type="number"
								min="0"
								class="form-control"
								id="minPriceFilterInput"
								v-model.number="filters[2].value"
								autocomplete="off"
								placeholder="Min Price"
							/>
						</div>
						<div class="form-group">
							<label for="maxPriceFilterInput" class="sr-only">Max Price</label>
							<input
								type="number"
								min="0"
								class="form-control"
								id="maxPriceFilterInput"
								v-model.number="filters[3].value"
								autocomplete="off"
								placeholder="Max Price"
							/>
						</div>
					</div>
					<div class="form-group">
						<label for="sellerFilterInput" class="sr-only">Seller</label>
						<input
							type="text"
							class="form-control"
							id="sellerFilterInput"
							autocomplete="off"
							v-model="filters[4].value"
							placeholder="Seller"
						/>
					</div>
				</form>
			</div>
			<div class="bg-dark position-relative flex-grow-1 p-4">
				<div class="d-flex">
					<h4 class="mb-0 text-light">Browse</h4>
					<div class="d-flex ml-auto">
						<div class="d-none d-md-flex">
							<div class="custom-control custom-switch custom-control-inline text-light my-auto">
								<input type="checkbox" class="custom-control-input" id="liveSearchToggle" v-model="isLive" />
								<label class="custom-control-label ml-2" for="liveSearchToggle">Live Search</label>
							</div>
						</div>
						<div class="btn-group btn-group-sm btn-group-toggle mr-3" role="group">
							<label class="btn btn-outline-light" :class="{ active: viewType === 'list' }">
								<input
									type="radio"
									name="viewTypeInput"
									id="listViewTypeInput"
									value="list"
									autocomplete="off"
									v-model="viewType"
								/>
								<i class="fas fa-list"></i>
							</label>
							<label class="btn btn-outline-light" :class="{ active: viewType === 'card' }">
								<input
									type="radio"
									name="viewTypeInput"
									id="cardViewTypeInput"
									value="card"
									autocomplete="off"
									v-model="viewType"
								/>
								<i class="fas fa-th"></i>
							</label>
						</div>
						<div class="dropdown">
							<button class="btn btn-outline-light btn-sm dropdown-menu-width" data-toggle="dropdown">
								<i class="fas fa-sort mr-2"></i>
								{{ activeSort.label }}
							</button>
							<div class="dropdown-menu dropdown-menu-right shadow">
								<button
									v-for="sortType of sorts"
									:key="sortType.label"
									:class="{
									active: activeSort.label === sortType.label
								}"
									@click="
									onSortClick(
										sortType.field,
										sortType.direction
									)
								"
									class="dropdown-item"
								>{{ sortType.label }}</button>
							</div>
						</div>
					</div>
				</div>
				<transition v-if="!isLoading" name="fade-scale" mode="out-in">
					<transition-group
						v-if="viewType === 'card' && getSortedListings.length > 0"
						name="list"
						class="d-flex flex-wrap pt-4"
					>
						<ListingCard
							v-for="(listing, index) in getSortedListings"
							class="mr-3"
							:key="listing._id"
							:index="index"
							:listing="listing"
						/>
					</transition-group>
					<table
						v-if="viewType === 'list' && getSortedListings.length > 0"
						class="table table-sm table-hover mb-0 mt-4 table-fixed"
					>
						<thead class="thead-light">
							<tr>
								<th>Item</th>
								<th class="text-center cursor-pointer" @click="onPriceHeaderClick">
									<transition name="fade" mode="out-in">
										<i
											key="price-up"
											v-if="
											activeSort.field === 'price' &&
												activeSort.direction === 'desc'
										"
											class="fas fa-arrow-down mr-2"
										/>
										<i
											key="price-down"
											v-if="
											activeSort.field === 'price' &&
												activeSort.direction === 'asc'
										"
											class="fas fa-arrow-up mr-2"
										/>
									</transition>
									<span class="btn-link">Price</span>
								</th>
								<th class="text-center cursor-pointer" @click="onQuantityHeaderClick">
									<transition name="fade" mode="out-in">
										<i
											key="quantity-up"
											v-if="
											activeSort.field === 'quantity' &&
												activeSort.direction === 'desc'
										"
											class="fas fa-arrow-down mr-2"
										/>
										<i
											key="quantity-down"
											v-if="
											activeSort.field === 'quantity' &&
												activeSort.direction === 'asc'
										"
											class="fas fa-arrow-up mr-2"
										/>
									</transition>
									<span class="btn-link">Quantity</span>
								</th>
								<th class="text-center">Seller</th>
								<th class="d-none d-lg-table-cell text-center cursor-pointer" @click="onPostedHeaderClick">
									<transition name="fade" mode="out-in">
										<i
											key="dateCreated-up"
											v-if="
											activeSort.field ===
												'dateCreated' &&
												activeSort.direction === 'desc'
										"
											class="fas fa-arrow-up mr-2"
										/>
										<i
											key="dateCreated-down"
											v-if="
											activeSort.field ===
												'dateCreated' &&
												activeSort.direction === 'asc'
										"
											class="fas fa-arrow-down mr-2"
										/>
									</transition>
									<span class="btn-link">Posted</span>
								</th>
								<th class="d-none d-lg-table-cell" />
							</tr>
						</thead>
						<tbody>
							<ListingRow
								v-for="(listing, index) in getSortedListings"
								:key="listing._id"
								:index="index"
								:listing="listing"
								class="table-light"
							/>
						</tbody>
					</table>
					<div v-if="getSortedListings.length === 0" class="mt-4">
						<h5 class="d-none d-lg-block m-auto w-fit text-light">Be the first to post!</h5>
						<h6 class="d-block d-lg-none m-auto w-fit text-light">Be the first to post!</h6>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>
<script>
	/* eslint-disable */
	import ListingCard from "./ListingCard";
	import ListingRow from "./ListingRow";
	import Loader from "./Loader";
	import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

	export default {
		name: "ListingsViewer",
		components: {
			ListingCard,
			ListingRow,
			Loader
		},
		methods: {
			...mapMutations([
				"setSortType",
				"resetSortType",
				"invertSortType",
				"clearFilters",
				"clearFilter",
				"setListingsLimit",
				"setListings",
				"clearListings"
			]),
			...mapActions(["getAllListings", "getUserListings", "getItemListings"]),
			onFilterFormSubmit() {
				return false;
			},
			onToggleFilterSectionClick() {
				this.isAdvancedFilterVisible = !this.isAdvancedFilterVisible;
				const element = this.$el.querySelector("#advancedFilterSection");
				const currentHeight = element.clientHeight;

				if (this.isAdvancedFilterVisible) {
					Velocity(
						element,
						{
							maxHeight: this.initialAdvancedFilterHeight
						},
						{
							duration: 250,
							easing: "ease"
						}
					);
				} else {
					let rect = element.getBoundingClientRect();
					Velocity(
						element,
						{
							maxHeight: 0
						},
						{
							duration: 250,
							easing: "ease"
						}
					);
				}
			},
			onFilterClearClick() {
				this.clearFilters();
			},
			onSortClick(field, direction) {
				this.setSortType({ field, direction });
			},
			onPriceHeaderClick() {
				if (this.activeSort.field !== "price") {
					this.setSortType({ field: "price", direction: "desc" });
				} else {
					this.invertSortType();
				}
			},
			onQuantityHeaderClick() {
				if (this.activeSort.field !== "quantity") {
					this.setSortType({ field: "quantity", direction: "desc" });
				} else {
					this.invertSortType();
				}
			},
			onPostedHeaderClick() {
				if (this.activeSort.field !== "dateCreated") {
					this.setSortType({ field: "dateCreated", direction: "desc" });
				} else {
					this.invertSortType();
				}
			},
			// handleWindowScroll() {
			// 	let rect = this.$el.getBoundingClientRect();
			// 	if (rect.top + rect.height - window.innerHeight <= 100) {
			// 		this.loadMoreResults();
			// 	}
			// },
			debounce(func, wait, immediate) {
				var timeout;
				return function() {
					var context = this,
						args = arguments;
					var later = function() {
						timeout = null;
						if (!immediate) func.apply(context, args);
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
					if (callNow) func.apply(context, args);
				};
			}
		},
		computed: {
			...mapState({
				listings: state => state.listings.listings,
				filters: state => state.listings.filters,
				sorts: state => state.listings.sorts,
				activeSort: state => state.listings.activeSort,
				isFiltering: state => state.listings.isFiltering,
				isSorting: state => state.listings.isSorting
			}),
			...mapGetters([
				"isLoading",
				"getFilteredListings",
				"getSortedListings",
				"getTransformedListings"
			])
		},
		data() {
			return {
				isAdvancedFilterVisible: false,
				initialAdvancedFilterHeight: 0,
				viewType: "card",
				isLive: false
			};
		},
		created() {
			if (this.$route.name === "listings") {
				this.getAllListings();
			} else if (this.$route.name === "userListings") {
				this.getUserListings(this.$route.params.userId);
			} else if (this.$route.name === "itemListings") {
				let itemUniqueName = this.$route.params.pathMatch;
				if (itemUniqueName.charAt(0) !== "/") {
					itemUniqueName = "/" + itemUniqueName;
				}
				this.getItemListings(itemUniqueName);
			} else {
				this.clearListings();
			}
		},
		watch: {
			isLive(value) {
				this.$store.commit("setLiveListings", value);
			}
		}
	};
</script>
<style>
	#filterFormDesktop {
		min-width: 300px;
		width: 300px;
		max-width: 300px;
	}
	.filter-toggle {
		bottom: -0.75rem;
		right: calc(50% - 0.75rem);
		z-index: 2;
	}
	.live-toggle-button {
		top: 0.5rem;
		right: 0.5rem;
	}
	.list-enter-active {
		transition-timing-function: var(--ease-in);
	}
	.list-leave-active {
		transition-timing-function: var(--ease-out);
	}
	.list-enter-active,
	.list-leave-active {
		transition: all 250ms;
	}
	.list-enter,
	.list-leave-to {
		opacity: 0;
	}
	table th,
	td {
		padding-left: 1rem;
	}
	table th {
		font-weight: 500;
		border: none;
		vertical-align: middle;
	}
	table td {
		border: none;
	}
	thead th:first-child {
		border-radius: 5px 0 0 0;
	}
	thead th:last-child {
		border-radius: 0 5px 0 0;
	}
	table tr:last-child td:first-child {
		border-radius: 0 0 0 5px;
	}
	table tr:last-child td:last-child {
		border-radius: 0 0 5px 0;
	}
	td,
	th {
		padding-left: 1rem !important;
		padding-right: 1rem !important;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	th {
		border: none !important;
	}
</style>