<template>
	<tr>
		<td>
			{{ listing.item.name }}
			<span
				class="h-fit small ml-2 mt-auto text-muted font-weight-light"
			>{{ listing.item.type }}</span>
		</td>
		<td class="text-center">
			<h5 class="text-h5 mb-0">{{ listing.price }}P</h5>
		</td>
		<td class="text-center">{{ listing.quantity }}</td>
		<td class="text-center">{{ listing.userId.ign }}</td>
		<td class="d-none d-lg-table-cell text-center">{{ postedTimeAgo }}</td>
		<td class="d-none d-lg-table-cell btn-group text-right overflow-visible">
			<button class="btn btn-outline-secondary btn-sm" @click="onCopyClick">
				<transition name="fade" mode="out-in">
					<span key="copy" v-if="!showCopiedIndicator">
						<i class="far fa-copy"></i>
					</span>
					<span key="copied" v-else class="text-success">
						<i class="fas fa-check"></i>
					</span>
				</transition>
			</button>
			<button
				type="button"
				class="btn btn-outline-secondary btn-sm dropdown-toggle shadow-sm"
				data-toggle="dropdown"
			>
				<i class="fas fa-caret-down"></i>
			</button>
			<div class="dropdown">
				<div class="dropdown-menu dropdown-menu-right shadow">
					<a
						:href="
							`//warframe.fandom.com/wiki/${wikiItemName}`
						"
						target="_blank"
						class="dropdown-item"
						:class="{ disabled: !wikiItemName }"
					>
						<i class="fas fa-external-link-alt mr-2"></i>Wiki
					</a>
					<router-link class="dropdown-item" :to="`/listings/item/${listing.item.uniqueName}`">
						<i class="fas fa-chart-pie mr-2"></i>Analyze
					</router-link>
					<div v-if="listing.userId._id === this.$store.state.user._id">
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
		</td>
	</tr>
</template>
<script>
	/* eslint-disable no-unused-vars */
	/* eslint-disable no-undef */
	import { EventBus } from "../EventBus";

	export default {
		name: "ListingRow",
		props: {
			listing: Object,
			index: Number
		},
		data() {
			return {
				wikiItemName: null,
				showCopiedIndicator: false
			};
		},
		computed: {
			postedTimeAgo() {
				return moment(this.listing.dateCreated).fromNow();
			}
		},
		methods: {
			onRemoveClick() {
				const listingId = this.listing._id;
				const authToken = this.$store.state.user.authToken;
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
			},
			generateWikiItemName() {
				try {
					let removedExtension = this.listing.item.imageName.split(
						"."
					)[0];
					let separated = removedExtension.replace(/-/g, " ");
					let upperCased = separated.replace(/\b\w/g, l =>
						l.toUpperCase()
					);
					let joined = upperCased.replace(" ", "_");
					let lowerCasedWords = joined.replace("Of", "of");
					this.wikiItemName = lowerCasedWords;
				} catch (exception) {
					this.wikiItemName = null;
				}
			}
		},
		mounted() {
			this.generateWikiItemName();
		}
	};
</script>
<style lang="scss">
</style>
