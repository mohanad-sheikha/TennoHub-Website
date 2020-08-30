<template>
	<div class="d-flex flex-column flex-grow-1">
		<div id="container" class="d-flex flex-column m-auto p-4 rounded shadow-lg overflow-hidden position-relative">
			<h5>Logged out</h5>
			<div class="m-auto">Hope to see you soon!</div>
			<!-- <button class="btn btn-primary btn-block mt-auto">Send us feedback</button> -->
		</div>
	</div>
</template>
<script>
	export default {
		name: "Logout",
		data() {
			return {};
		},
		mounted() {
			this.$store.dispatch("logout");
		},
		created() {
			document.title = 'Logout - TennoHub';
		}
	};
</script>
<style scoped>
	#container {
		min-width: 300px;
		min-height: 250px;
		background-color: rgba(255, 250, 235, 0.9);
	}
</style>