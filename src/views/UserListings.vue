<template>
	<div class="d-flex flex-column flex-grow-1">
		<div class="d-flex">
			<Loader :is-loading="isLoading" />
			<div id="user-settings" class="p-5 mx-auto">
				<div class="d-flex fade-enter-active h-fit my-auto text-light rounded p-5 shadow card-background-color" :class="{ 'invisible' : !this.user }">
					<div id="player-avatar" class="rounded-circle bg-primary shadow d-flex mr-3">
						<div id="player-ign-initial" class="text-dark m-auto">{{ user ? user.ign.substring(0,1) : 'T' }}</div>
					</div>
					<div class="my-auto">
						<h1>{{ user ? user.ign : 'Tenno' }}</h1>
						<h6 class="mb-0">Since {{ createdTimeAgo }}</h6>
					</div>
				</div>
			</div>
		</div>
		<div class="d-flex flex-column flex-grow-1 min-fullscreen-height">
			<ListingsViewer />
		</div>
	</div>
</template>
<script>
	/* eslint-disable */
	import ListingsViewer from "../components/ListingsViewer";
	import ListingCreator from "../components/ListingCreator";
	import ListingEditor from "../components/ListingEditor";
	import Loader from "../components/Loader";

	export default {
		name: "UserListings",
		components: {
			ListingsViewer,
			ListingCreator,
			ListingEditor,
			Loader
		},
		data() {
			return {
				user: null,
				error: null,
				isLoading: false,
				userIgn: null
			};
		},
		created() {
			this.isLoading = true;
            this.userIgn = this.$route.params.userIgn;
			this.$store
				.dispatch("getUserProfile", this.userIgn)
				.then(user => {
					this.user = user;
					document.title = `${user.ign}'s store - TennoHub`;
				})
				.catch(error => {
					this.error =
						"Failed to load data. Please refresh the page and try again.";
				})
				.finally(() => {
					this.isLoading = false;
				});
		},
		computed: {
			createdTimeAgo() {
				return this.user
					? moment(this.user.dateCreated).format(`MMMM YYYY`)
					: moment().format(`MMMM YYYY`);
			}
		}
	};
</script>
<style scoped>
	#player-ign-initial {
		font-size: 30px;
		text-transform: uppercase;
	}
	#player-avatar {
		min-width: 75px;
		width: 75px;
		max-width: 75px;
		min-height: 75px;
		height: 75px;
		max-height: 75px;
	}
</style>