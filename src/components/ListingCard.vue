<template>
	<div v-if="listing" class="item shadow d-flex flex-column mb-3">
		<div class="item-image-container position-relative">
			<img
				class="item-image w-100 h-100 bg-secondary rounded-top"
				:src="imageSource || ''"
				:alt="listing.item.imageName || ''"
				draggable="false"
			/>
			<div class="position-absolute item-image-dropdown">
				<div class="dropdown">
					<button
						type="button"
						class="btn btn-light btn-sm dropdown-toggle shadow-sm"
						data-toggle="dropdown"
					>
						<i class="fas fa-caret-down"></i>
					</button>
					<div class="dropdown-menu dropdown-menu-right shadow">
						<a :href="wikiUrl" target="_blank" class="dropdown-item" :class="{ disabled: !wikiUrl }">
							<i class="fas fa-external-link-alt mr-2"></i>Wiki
						</a>
						<router-link class="dropdown-item" :to="`/listings/item/${listing.item.uniqueName}`">
							<i class="fas fa-chart-pie mr-2"></i>Analyze
						</router-link>
						<div v-if="
								listing.userId._id ===
									this.$store.state.user._id
							">
							<div class="dropdown-divider"></div>
							<button class="dropdown-item" @click="onEditClick">
								<i class="fas fa-pen mr-2"></i>Edit
						</button>
							<button class="dropdown-item" @click="onRemoveClick">
								<i class="fas fa-trash mr-2"></i>Remove
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="mt-auto p-4 bg-xdark text-light rounded-bottom">
			<div class="text-truncate mb-2">{{ listing.item.name }}</div>
			<div class="d-flex">
				<h5 class="mb-0 text-truncate">{{ listing.price }}P</h5>
				<div
					class="ml-auto mt-auto text-truncate text-muted"
				>{{ listing.quantity }} in stock</div>
			</div>
			<div class="d-flex mb-2 text-truncate">
				<div
					id="seller-ign"
					class="flex-shrink-1 flex-grow-1 text-muted text-truncate"
				>
				<i class="fa fa-user fa-xs mr-2"></i>{{ listing.userId.ign }}
				</div>
			</div>
			<div class="d-flex">
				<button class="btn btn-outline-primary btn-block" @click="onCopyClick">
					<transition name="fade" mode="out-in">
						<span key="copy" v-if="!showCopiedIndicator">
							<i class="far fa-copy mr-2"></i>Copy
						</span>
						<span key="copied" v-else class="text-success">
							<i class="fas fa-check mr-2"></i>Copied
						</span>
					</transition>
				</button>
			</div>
		</div>
	</div>
</template>
<script>
	/* eslint-disable */
	import axios from "axios";
	import { EventBus } from "../EventBus";

	export default {
		name: "ListingCard",
		props: {
			listing: Object,
			index: Number
		},
		methods: {
			onRemoveClick() {
				let listingId = this.listing._id;
				let authToken = this.$store.state.user.authToken;
				this.$store
					.dispatch("deleteListing", { listingId, authToken })
					.then(response => {
						this.$store.dispatch("createToast", {
							title: "Listing Removed",
							message: "Your listing was removed.",
							duration: 4000
						});
						this.$store.dispatch("refreshListings", this.$route);
					})
					.catch(error => {});
			},
			onEditClick() {
				EventBus.$emit("show-edit-listing", this.listing._id);
			},
			onCopyClick(event) {
				let whisperText = `/w ${this.listing.userId.ign} Hi, I'd like to buy ${this.listing.quantity} ${this.listing.item.name} for ${this.listing.price} Plat`;
				navigator.clipboard
					.writeText(whisperText)
					.then(() => {
						this.showCopiedIndicator = true;
						setTimeout(() => {
							this.showCopiedIndicator = false;
						}, 4000);
					})
					.catch(() => {
						// Todo: try document.execCommand('copy')
					});
			}
		},
		computed: {
			imageSource() {
				return this.listing.item.imageName
					? `https://cdn.warframestat.us/img/${this.listing.item.imageName}`
					: null;
			},
			wikiItemName() {
				if (!this.listing.item.imageName) return null;
				let removedExtension = this.listing.item.imageName.split(".")[0];
				let separated = removedExtension.replace(/-/g, " ");
				let upperCased = separated.replace(/\b\w/g, l => l.toUpperCase());
				let joined = upperCased.replace(" ", "_");
				let lowerCasedWords = joined.replace("Of", "of");
				return lowerCasedWords;
			},
			wikiUrl() {
				return this.wikiItemName
					? `//warframe.fandom.com/wiki/${this.wikiItemName}`
					: null;
			}
		},
		data() {
			return {
				showCopiedIndicator: false
			};
		},
		mounted() {
			$('[data-toggle="tooltip"]').tooltip();
			$('[data-toggle="popover"]').popover();
		}
	};
</script>
<style lang="scss" scoped>
	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}
	.item {
		width: 225px;
		transition: transform 250ms, box-shadow 250ms;
		user-select: none;
	}
	.item:hover {
		box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.3) !important;
	}
	.item-image-container {
		min-height: 200px;
		height: 200px;
		max-height: 200px;
	}
	.item-image-dropdown {
		top: 1rem;
		right: 1rem;
	}
	.item-image {
		object-fit: cover;
		object-position: bottom;
	}
	.item-image:before {
		content: " ";
		display: block;

		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: rgb(230, 230, 230);
	}
	.item-image:after {
		content: "Broken Image \f5b4";
		display: block;
		font-size: 16px;
		font-style: normal;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			"Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
			"Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji",
			"Font Awesome 5 Free";
		color: rgb(100, 100, 100);

		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		text-align: center;
	}
	#seller-ign {
		user-select: text;
	}
</style>