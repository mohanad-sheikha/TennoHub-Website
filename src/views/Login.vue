<template>
	<div class="d-flex flex-column flex-grow-1 p-3">
		<form
			class="loginForm bg-light d-none d-lg-block m-auto p-5 rounded shadow-lg overflow-hidden position-relative"
			@submit.prevent="onLoginFormSubmit"
		>
			<h4 class="mb-3">Log in</h4>
			<Loader :is-loading="isLoading" />
			<div class="form-group">
				<label for="emailLoginInput">Email</label>
				<input
					type="text"
					class="form-control"
					id="emailLoginInput"
					autocomplete="on"
					name="email"
					required
					v-model="email"
				/>
			</div>
			<div class="form-group">
				<label for="passwordLoginInput">Password</label>
				<input
					type="password"
					class="form-control"
					id="passwordLoginInput"
					autocomplete="on"
					name="password"
					required
					v-model="password"
				/>
			</div>
			<div class="custom-control custom-checkbox mb-1">
				<input
					type="checkbox"
					id="rememberMeInput"
					name="rememberMeInput"
					class="custom-control-input"
					v-model="stayLoggedIn"
				/>
				<label class="custom-control-label" for="rememberMeInput">Keep me logged in</label>
			</div>
			<div class="mb-2 d-flex">
				<a href="#">Forgot password?</a>
				<router-link to="signup" class="ml-auto">Signup</router-link>
			</div>
			<button class="btn btn-primary btn-block" type="submit">Log in</button>
		</form>
		<form
			class="bg-light d-block d-lg-none m-auto p-3 rounded shadow-lg overflow-hidden position-relative"
			@submit.prevent="onLoginFormSubmit"
		>
			<h4 class="mb-3">Log in</h4>
			<Loader :is-loading="isLoading" />
			<div class="form-group">
				<label for="emailLoginInput">Email</label>
				<input
					type="text"
					class="form-control"
					id="emailLoginInput"
					autocomplete="on"
					name="email"
					required
					v-model="email"
				/>
			</div>
			<div class="form-group">
				<label for="passwordLoginInput">Password</label>
				<input
					type="password"
					class="form-control"
					id="passwordLoginInput"
					autocomplete="on"
					name="password"
					required
					v-model="password"
				/>
			</div>
			<div class="custom-control custom-checkbox mb-1">
				<input
					type="checkbox"
					id="rememberMeInput"
					name="rememberMeInput"
					class="custom-control-input"
					v-model="stayLoggedIn"
				/>
				<label class="custom-control-label" for="rememberMeInput">Keep me logged in</label>
			</div>
			<div class="mb-2 d-flex">
				<a href="#">Forgot password?</a>
				<router-link to="signup" class="ml-auto">Signup</router-link>
			</div>
			<button class="btn btn-primary btn-block" type="submit">Log in</button>
		</form>
	</div>
</template>
<script>
	/* eslint-disable no-unused-vars */
	import Loader from "../components/Loader";
	export default {
		name: "Login",
		components: {
			Loader
		},
		data() {
			return {
				email: null,
				password: null,
				isLoading: false,
				stayLoggedIn: true
			};
		},
		methods: {
			onLoginFormSubmit() {
				this.isLoading = true;
				this.$store
					.dispatch("login", {
						email: this.email,
						password: this.password,
						stayLoggedIn: this.stayLoggedIn
					})
					.then(() => {
						this.$router.push("listings");
					})
					.catch(error => {
						let message = "Unexpected error. Please try again later.";
						if (
							error &&
							error.message &&
							error.message.toLowerCase() === "network error"
						) {
							message =
								"Our server may be down. Please try again later.";
						}
						this.$store.dispatch("createToast", {
							title: "Unable to login",
							message
						});
					})
					.finally(() => {
						this.isLoading = false;
						return false;
					});
			}
		},
		created() {
			document.title = "Login - TennoHub";
		}
	};
</script>
<style scoped>
	.loginForm {
		width: 350px;
	}
</style>