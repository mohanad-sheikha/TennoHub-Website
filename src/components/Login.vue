<template>
	<div>
		<div class="modal fade" ref="loginModal" tabindex="-1" role="dialog">
			<div class="modal-dialog" role="document">
				<div class="modal-content overflow-hidden">
					<Loader :is-loading="isLoading" />
					<div class="modal-header">
						<h5 class="modal-title">Login</h5>
						<button type="button" class="close" @click="onCloseClick">
							<i class="fas fa-times" />
						</button>
					</div>
					<div class="modal-body position-relative">
						<form id="loginForm" @submit.prevent="onLoginFormSubmit">
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
							<div class="d-flex">
								<div class="custom-control custom-checkbox">
									<input
										type="checkbox"
										id="rememberMeInput"
										name="rememberMeInput"
										class="custom-control-input"
										v-model="stayLoggedIn"
									/>
									<label class="custom-control-label" for="rememberMeInput">Keep me logged in</label>
								</div>
								<button class="btn btn-link ml-auto p-0" @click="onSignupClick">Signup</button>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button class="btn btn-primary btn-block" type="submit" form="loginForm">Log in</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	/* eslint-disable */
	import Loader from "./Loader";
	import { EventBus } from "../EventBus";

	const INITIAL_STATE = () => {
		return {
			email: null,
			password: null,
			isLoading: false,
			stayLoggedIn: true
		};
	};

	export default {
		name: "Login",
		components: {
			Loader
		},
		data: INITIAL_STATE,
		methods: {
			hideModal() {
				$(this.$refs.loginModal).modal("hide");
			},
			onLoginFormSubmit() {
				this.isLoading = true;
				this.$store
					.dispatch("login", {
						email: this.email,
						password: this.password,
						stayLoggedIn: this.stayLoggedIn
					})
					.then(() => {
						$(this.$refs.loginModal).modal("hide");
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
			},
			onCloseClick() {
				this.hideModal();
			},
			onSignupClick() {
				this.hideModal();
				EventBus.$emit("show-signup");
			}
		},
		mounted() {
			$(this.$refs.loginModal).on("hide.bs.modal", () => {
				let form = this.$el.querySelector("form");
				if (form) {
					form.classList.remove("was-validated");
				}
                Object.assign(this.$data, INITIAL_STATE());
            });
            
            $(this.$refs.loginModal).on("hidden.bs.modal", () => {
                EventBus.$emit('login-hidden');
            })

			let that = this;
			EventBus.$on("show-login", function() {
				$(that.$refs.loginModal).modal("show");
			});
			EventBus.$on("hide-login", function() {
				$(that.$refs.loginModal).modal("hide");
			});
		}
	};
</script>
<style scoped>
</style>