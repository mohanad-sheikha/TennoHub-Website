<template>
	<div>
		<div class="jumbotron mx-5 mt-5">
			<h1 class="display-4">Welcome Tenno</h1>
			<div>to the best Warframe marketplace</div>
		</div>
		<div class="d-flex">
			<div class="home-route-card bg-dark p-4 d-flex flex-column w-50">
				<img src="../../public/images/online_store_.png">
				<button class="btn btn-outline-primary mt-4">View Listings</button>
			</div>
			<div class="home-route-card bg-dark p-4 d-flex flex-column w-50">
				<img src="../../public/images/content_creation.png">
				<button class="btn btn-outline-primary mt-4">Post a Listing</button>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: "Home",
		data() {
			return {};
		},
		created() {
			document.title = "TennoHub";
		}
	};
</script>
<style scoped>
	.home-route-card img {
		object-fit: contain;
		max-height: 150px;
	}
</style>