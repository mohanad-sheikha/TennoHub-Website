<template>
	<div class="d-flex flex-column flex-grow-1">
		<div class="position-relative d-flex overflow-hidden">
			<div class="mx-auto d-flex w-fit p-5">
				<div class="h-fit my-auto text-light rounded p-5 shadow card-background-color">
					<div>
						<h4 class="text-center">Hi
							<transition name="fade" mode="out-in">
								<span key="guest" v-if="$store.getters.isGuest" class="font-weight-bold">Tenno</span>
								<span key="user" v-else class="font-weight-bold">{{ $store.state.user.ign }}</span>
							</transition>
						</h4>
					</div>
					<h1 class="d-none d-lg-block mb-3 text-center">Got items to sell?</h1>
					<h4 class="d-block d-lg-none mb-3 text-center">Got items to sell?</h4>
					<button class="mx-auto text-dark font-weight-medium btn btn-primary btn-block btn-lg shadow" @click="onPostListingClick">
						<i class="mr-2 fas fa-plus"></i>Post a listing
					</button>
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
	import { EventBus } from '../EventBus';

	export default {
		name: "Listings",
		components: {
			ListingsViewer,
		},
		methods: {
			onPostListingClick() {
				EventBus.$emit('show-create-listing');
			}
		},
		created() {
			document.title = 'Listings - TennoHub';
		}
	};
</script>
<style scoped>
</style>