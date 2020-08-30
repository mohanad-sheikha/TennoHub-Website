<template>
	<div class="d-flex flex-column flex-grow-1">
		<div id="container" class="d-flex flex-column m-auto p-4 rounded shadow-lg overflow-hidden position-relative">
			<h5>Verification</h5>
			<transition name="fade" mode="out-in">
				<Loader v-if="isLoading" :is-loading="isLoading" />
				<div key="verified" v-else class="my-auto">
					<div key="verified" v-if="isVerified">
						<h3 class="text-success">Completed</h3>
						<div>Thanks for verifiying your email.</div>
					</div>
					<div key="verified" v-if="!isVerified">
						<h2 class="text-danger">Uh oh...</h2>
						<div>We could not verify your account.</div>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>
<script>
	/* eslint-disable */
	import Loader from '../components/Loader';

	export default {
		name: "Logout",
		components: {
			Loader
		},
		data() {
			return {
				isLoading: true,
				isVerified: false
			};
		},
		mounted() {
			this.$store.dispatch("verify", this.$route.params.verificationToken)
			.then(result => {
				this.isVerified = true;
				setTimeout(() => {
					this.$router.push('listings');
				})
			})
			.catch(error => {
				this.isVerified = false;
			})
			.finally(() => {
				this.isLoading = false;
			})
		},
		created() {
			document.title = 'Verification - TennoHub';
		}
	};
</script>
<style scoped>
	#container {
		min-width: 300px;
		max-width: 300px;
		min-height: 250px;
		background-color: rgba(255, 250, 235, 0.9);
	}
</style>