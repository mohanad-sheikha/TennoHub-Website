<template>
	<div class="d-flex flex-column flex-grow-1 p-3">
		<form class="signupForm d-none d-lg-block bg-light m-auto p-5 rounded shadow-lg overflow-hidden position-relative" @submit.prevent="onSignupFormSubmit">
			<Loader :is-loading="isLoading" />
			<h4 class="mb-3">Sign up</h4>
			<div class="form-group">
				<label for="emailSignupInput">Email</label>
				<input type="email" class="form-control" id="emailSignupInput" autocomplete="on" name="email" required v-model="email" />
			</div>
			<div class="form-group">
				<label for="passwordSignupInput">Password</label>
				<input type="password" class="form-control" id="passwordSignupInput" minlength="8" maxlength="32" autocomplete="on" name="password" required v-model="password" />
				<div class="small d-flex mt-1">
					<div class="mr-4 d-flex">
						<div class="password-icon-container">
							<transition name="fade" mode="out-in">
								<i key="invalid" v-if="!password || password.length < 8 || password.length > 32" class="text-danger fas fa-times"></i>
								<i key="valid" v-else class="text-success fas fa-check"></i>
							</transition>
						</div>
						8 to 32 characters
					</div>
					<!-- <div class="d-flex">
						<div class="password-icon-container">
							<transition name="fade" mode="out-in">
								<i key="invalid" v-if="!password || password.includes(' ')" class="text-danger fas fa-times"></i>
								<i key="valid" v-else class="text-success fas fa-check"></i>
							</transition>
						</div>
						No spaces
					</div> -->
				</div>
			</div>
			<div class="form-group">
				<label for="ignSignupInput">Warframe IGN</label>
				<input type="text" class="form-control" id="ignSignupInput" autocomplete="on" name="ign" required v-model="ign" />
			</div>
			<button class="btn btn-primary btn-block" type="submit">Sign up</button>
		</form>
		<form class="d-block d-lg-none bg-light m-auto p-3 rounded shadow-lg overflow-hidden position-relative" @submit.prevent="onSignupFormSubmit">
			<Loader :is-loading="isLoading" />
			<h4 class="mb-3">Sign up</h4>
			<div class="form-group">
				<label for="emailSignupInput">Email</label>
				<input type="email" class="form-control" id="emailSignupInput" autocomplete="on" name="email" required v-model="email" />
			</div>
			<div class="form-group">
				<label for="passwordSignupInput">Password</label>
				<input type="password" class="form-control" id="passwordSignupInput" minlength="8" maxlength="32" autocomplete="on" name="password" required v-model="password" />
				<div class="small d-flex mt-1">
					<div class="mr-4 d-flex">
						<div class="password-icon-container">
							<transition name="fade" mode="out-in">
								<i key="invalid" v-if="!password || password.length < 8 || password.length > 32" class="text-danger fas fa-times"></i>
								<i key="valid" v-else class="text-success fas fa-check"></i>
							</transition>
						</div>
						8 to 32 characters
					</div>
					<!-- <div class="d-flex">
						<div class="password-icon-container">
							<transition name="fade" mode="out-in">
								<i key="invalid" v-if="!password || password.includes(' ')" class="text-danger fas fa-times"></i>
								<i key="valid" v-else class="text-success fas fa-check"></i>
							</transition>
						</div>
						No spaces
					</div> -->
				</div>
			</div>
			<div class="form-group">
				<label for="ignSignupInput">Warframe IGN</label>
				<input type="text" class="form-control" id="ignSignupInput" autocomplete="on" name="ign" required v-model="ign" />
			</div>
			<button class="btn btn-primary btn-block" type="submit">Sign up</button>
		</form>
	</div>
</template>
<script>
	import Loader from "../components/Loader";
	export default {
		name: "Signup",
		components: { Loader },
		data() {
			return {
				email: null,
				password: null,
				ign: null,
				isLoading: false
			};
		},
		methods: {
			onSignupFormSubmit() {
				this.isLoading = true;
				this.$store
					.dispatch("signup", {
						email: this.email,
						password: this.password,
						ign: this.ign
					})
					.then(() => {
						this.$router.push("listings");
					})
					.catch(error => {
						this.$store.dispatch("createToast", {
							title: "Unable to sign up",
							message:
								error ||
								"Uh-oh! Please contact support for assistance.",
							duration: 4000
						});
					})
					.finally(() => {
						this.isLoading = false;
					});
			}
		},
		created() {
			document.title = 'Sign up - TennoHub';
		}
	};
</script>
<style scoped>
	.signupForm {
		width: 350px;
	}
	.password-icon-container {
		min-width: 18px;
	}
</style>