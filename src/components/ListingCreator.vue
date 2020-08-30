<template>
	<div>
		<div class="modal fade" ref="listingCreatorModal" tabindex="-1" role="dialog">
			<div class="modal-dialog" role="document">
				<div class="modal-content overflow-hidden">
					<Loader :is-loading="isLoading" />
					<div class="modal-header">
						<h5 class="modal-title">Post a listing</h5>
						<button type="button" class="close" @click="onCloseClick">
							<i class="fas fa-times" />
						</button>
					</div>
					<form
						v-if="!$store.getters.isGuest"
						class="needs-validation"
						@submit="onListingSubmit"
						novalidate
					>
						<div class="modal-body">
							<div class="form-group position-relative dropdown">
								<label for="itemNameInput">Item</label>
								<input
									v-model="itemName"
									data-toggle="dropdown"
									:class="{ 'is-valid': isFormValidated && isItemValid, 'is-invalid': isFormValidated && !isItemValid }"
									type="text"
									class="form-control"
									id="lc-itemNameInput"
									autocomplete="off"
									required
								/>
								<!-- <div class="invalid-feedback">
									Please select from the dropdown.
								</div>-->
								<div class="dropdown-menu w-100 shadow">
									<h6 class="dropdown-header d-flex">
										<span>{{ hasSearchResults ? 'Search Results' : 'No items found' }}</span>
										<div v-if="isSearchLoading" class="w-fit ml-auto">
											<div
												class="spinner spinner-border text-white spinner-border-sm text-secondary show"
												role="status"
											/>
										</div>
									</h6>
									<transition-group
										tag="div"
										:css="false"
										@before-enter="beforeSearchResultEnter"
										@enter="searchResultEnter"
										@leave="searchResultLeave"
									>
										<div
											v-for="(item, index) in searchResults"
											:key="item.uniqueName"
											class="dropdown-item d-flex"
											style="cursor: pointer;"
											@click="onSearchResultClick(index)"
										>
											<span>{{ item.name }}</span>
											<div class="h-fit small ml-2 mt-auto text-muted font-weight-light">{{ item.type }}</div>
										</div>
									</transition-group>
								</div>
							</div>
							<div class="form-row">
								<div class="col">
									<label for="priceInput">Price</label>
									<div class="input-group mb-3">
										<input
											v-model.number="price"
											type="number"
											:class="{ 'is-valid': isFormValidated && isPriceValid, 'is-invalid': isFormValidated && !isPriceValid }"
											min="0"
											class="form-control"
											id="lc-priceInput"
											required
										/>
										<div class="input-group-append">
											<span class="input-group-text">Plat</span>
										</div>
									</div>
								</div>
								<div class="col">
									<label for="quantityInput">Quantity</label>
									<input
										v-model.number="quantity"
										type="number"
										:class="{ 'is-valid': isFormValidated && isQuantityValid, 'is-invalid': isFormValidated && !isQuantityValid }"
										min="0"
										class="form-control"
										id="lc-quantityInput"
										required
									/>
								</div>
							</div>
							<div class="form-group">
								<label for="ignDisplay">IGN</label>
								<input
									id="lc-ignDisplay"
									class="form-control"
									type="text"
									readonly
									:value="$store.state.user.ign"
								/>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-outline-secondary mr-auto" data-dismiss="modal">Close</button>
							<button type="submit" class="btn btn-primary" :disabled="isLoading || isPosted">Submit</button>
						</div>
					</form>
					<div v-else>
						<div class="modal-body">You must be logged in to post a listing.</div>
						<div class="modal-footer">
							<button class="btn btn-primary btn-block" @click="onLoginClick">Log in</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	/* eslint-disable */
	import Loader from "./Loader";
	import { EventBus } from "../EventBus";

	const SEARCH_RESULTS_LIMIT = 3;
	const INITIAL_STATE = () => {
		return {
			searchResults: null,
			selectedItem: null,
			itemName: null,
			price: null,
			quantity: null,
			isLoading: false,
			isSearchLoading: false,
			isPosted: false,
			isFormValidated: false,
			hasLoggedIn: false
		};
	};

	export default {
		name: "ListingCreator",
		components: {
			Loader
		},
		data: INITIAL_STATE,
		methods: {
			createListing() {
				this.isLoading = true;
				const itemUniqueName = this.selectedItem.uniqueName,
					price = this.price,
					quantity = this.quantity,
					authToken = this.$store.state.user.authToken;

				this.$store
					.dispatch("createListing", {
						itemUniqueName,
						price,
						quantity,
						authToken
					})
					.then(response => {
						this.isPosted = true;
						$(this.$refs.listingCreatorModal).modal("hide");
						this.$store.dispatch("createToast", {
							title: "Listing Posted",
							message: "Your listing is posted.",
							duration: 4000
						});
					})
					.catch(error => {
						this.isPosted = false;
						this.$store.dispatch("createToast", {
							title: "Uh-oh...",
							message:
								"We couldn't post your lisiting. Please ensure the listing's fields are valid.",
							duration: 4000
						});
					})
					.finally(() => {
						this.isLoading = false;
					});
			},
			onListingSubmit(event) {
				event.preventDefault();
				event.stopPropagation();
				this.isFormValidated = true;
				if (this.isItemValid && this.isPriceValid && this.isQuantityValid) {
					this.createListing();
				}
			},
			onSearchResultClick(index) {
				this.selectedItem = this.searchResults[index];
				this.itemName = this.selectedItem.name;
			},
			beforeSearchResultEnter(el) {
				el.style.opacity = 0;
				el.style.height = 0;
				el.style.paddingTop = 0;
				el.style.paddingBottom = 0;
			},
			searchResultEnter(el, done) {
				Velocity(
					el,
					{
						opacity: 1,
						height: "32px",
						paddingTop: "0.25rem",
						paddingBottom: "0.25rem"
					},
					{ duration: 250, complete: done }
				);
			},
			searchResultLeave(el, done) {
				Velocity(
					el,
					{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 },
					{ duration: 250, complete: done }
				);
			},
			onLoginClick() {
				$(this.$refs.listingCreatorModal).modal("hide");
				EventBus.$emit("show-login");
			},
			onCloseClick() {
				$(this.$refs.listingCreatorModal).modal("hide");
			},
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
			},
		},
		created() {
			this.handleItemNameChange = this.debounce(function() {
				this.searchResults = [];
				if (this.itemName) {
					this.$store
						.dispatch("getTradableItems", {
							itemName: this.itemName,
							limit: SEARCH_RESULTS_LIMIT
						})
						.then(items => {
							this.searchResults = items;
						})
						.catch(error => {})
						.finally(() => {
							this.isSearchLoading = false;
						});
				}
			}, 300);
		},
		mounted() {
			$(this.$refs.listingCreatorModal).on("hide.bs.modal", () => {
				let form = this.$el.querySelector("form");
				if (form) {
					form.classList.remove("was-validated");
				}
				Object.assign(this.$data, INITIAL_STATE());
			});

			let that = this;
			EventBus.$on("show-create-listing", function() {
				if (!that.$store.getters.isGuest) {
					$(that.$refs.listingCreatorModal).modal("show");
				} else {
					EventBus.$once("login-hidden", function() {
						if (!that.$store.getters.isGuest) {
							$(that.$refs.listingCreatorModal).modal("show");
						} 
					});
					EventBus.$emit("show-login");
				}
			});
			EventBus.$on("hide-create-listing", function() {
				$(that.$refs.listingCreatorModal).modal("hide");
			});
		},
		watch: {
			itemName: function(value) {
				if (value) {
					this.isSearchLoading = true;
					this.handleItemNameChange();
				} else {
					this.searchResults = null;
				}
			}
		},
		computed: {
			hasSearchResults() {
				return this.searchResults != null && this.searchResults.length > 0;
			},
			isQuantityValid() {
				return this.quantity && this.quantity > 0;
			},
			isPriceValid() {
				return this.price && this.price > 0;
			},
			isItemValid() {
				return (
					this.selectedItem && this.itemName === this.selectedItem.name
				);
			}
		}
	};
</script>
<style scoped lang="scss">
</style>