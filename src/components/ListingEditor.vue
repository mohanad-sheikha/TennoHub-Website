<template>
	<div>
		<div class="modal fade" ref="listingEditorModal" tabindex="-1" role="dialog">
			<div class="modal-dialog" role="document">
				<div class="modal-content overflow-hidden">
					<Loader :is-loading="isLoading" />
					<div class="modal-header">
						<h5 class="modal-title">Edit a listing</h5>
						<button type="button" class="close" @click="onCloseClick">
							<i class="fas fa-times" />
						</button>
					</div>
					<form v-if="!$store.getters.isGuest" class="needs-validation" @submit.prevent="onListingSubmit">
						<div class="modal-body">
							<div class="form-group position-relative dropdown">
								<label>Item</label>
								<input :value="listing.item.name" type="text" class="form-control" readonly />
							</div>
							<div class="form-row">
								<div class="col">
									<label for="priceInput">Price</label>
									<div class="input-group mb-3">
										<input v-model.number="listing.price" type="number" min="0" class="form-control" required />
										<div class="input-group-append">
											<span class="input-group-text">Plat</span>
										</div>
									</div>
								</div>
								<div class="col">
									<label for="quantityInput">Quantity</label>
									<input v-model.number="listing.quantity" type="number" min="0" class="form-control" required />
								</div>
							</div>
							<div class="form-group">
								<label for="ignDisplay">IGN</label>
								<input :value="$store.state.user.ign" class="form-control" type="text" readonly />
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-outline-secondary mr-auto" data-dismiss="modal">
								Close
							</button>
							<button type="submit" class="btn btn-primary" :disabled="isLoading || isSaved">
								Submit
							</button>
						</div>
					</form>
					<div v-if="$store.state.user.isGuest">
						<div class="modal-body">
							You must be logged in to edit a listing.
						</div>
						<div class="modal-footer">
							<button class="btn btn-primary btn-block" @click="onLoginClick">
								Log in
							</button>
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
	import { EventBus } from '../EventBus';

	const INITIAL_STATE = () => {
		return {
			listingId: null,
			listing: {
				item: {
					name: null
				},
				price: null,
				quantity: null,
				userId: {
					ign: null,
					_id: null
				}
			},
			isLoading: false,
			isSaved: false
		};
	};

	export default {
		name: "ListingEditor",
		components: {
			Loader
		},
		methods: {
			getListing() {
				this.isLoading = true;
				this.$store.dispatch("getListingById", this.listingId)
					.then(listing => {
						if (listing && listing.userId._id === this.$store.state.user._id)
						{
							this.listing = listing;
						}
						else
						{
							this.hasError = true;
						}
					})
					.catch(error => {
						this.hasError = true;
					})
					.finally(() => {
						this.isLoading = false;
					})
			},
			editListing() {
				this.isLoading = true;
				const listingId = this.listing._id,
				price = this.listing.price,
				quantity = this.listing.quantity,
				authToken = this.$store.state.user.authToken;

				this.$store.dispatch('updateListing', { listingId, price, quantity, authToken })
					.then(response => {
						this.isSaved = true;
						this.$store.dispatch("createToast", {
							title: "Listing Saved",
							message: "Your listing was saved.",
							duration: 4000
						});
						this.$store.dispatch("refreshListings", this.$route);
						$(this.$el.querySelector('.modal')).modal('hide');
					})
					.catch(error => {
						this.$store.dispatch("createToast", {
							title: "Uh-oh...",
							message: "Couldn't update your listing. Please try again",
							duration: 4000
						});
					})
					.finally(() => {
						this.isLoading = false;
					});
			},
			onListingSubmit(event) {
				if (event.currentTarget.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				} else {
					this.handleSubmit();
				}
				event.currentTarget.classList.add("was-validated");
				return false;
			},
			handleSubmit() {
				this.editListing();
			},
			onLoginClick() {
				$(this.$el.querySelector('.modal')).modal('hide');
				EventBus.$emit('show-login');

			},
			resetForm() {
				let form = this.$el.querySelector("form");
				if (form)
				{
					form.classList.remove("was-validated");
				}
			},
			resetState() {
				this.listingId = null;
				this.listing = {
					item: {
						name: null
					},
					price: null,
					quantity: null,
					userId: {
						ign: null,
						_id: null
					}
				};
				this.isLoading = false,
				this.isSaved = false
			},
			onCloseClick() {
				$(this.$el.querySelector('.modal')).modal('hide');
			}
		},
		data: INITIAL_STATE,
		mounted() {
			$(this.$refs.listingEditorModal).on("hide.bs.modal", () => {
				let form = this.$el.querySelector("form");
				if (form)
				{
					form.classList.remove("was-validated");
				}
			});
			$(this.$refs.listingEditorModal).on("hidden.bs.modal", () => {
				Object.assign(this.$data, INITIAL_STATE());
			});
			
			let that = this;
			EventBus.$on('show-edit-listing', function(listingId) {
				that.listingId = listingId;
				that.getListing();
				$(that.$refs.listingEditorModal).modal('show');
			});
			EventBus.$on('hide-edit-listing', function() {
				that.listingId = null;
				$(that.$refs.listingEditorModal).modal('hide');
			});
		},
	};
</script>
<style scoped lang="scss">
</style>