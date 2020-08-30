<template>
	<div class="p-2 bg-dark text-light position-relative">
		<div class="d-flex">
			<div class="w-33 d-flex">
				<button class="btn btn-outline-light" @click="onNavMenuButtonClick">
					<i class="fas fa-bars"></i>
				</button>
				<nav class="d-none d-lg-flex nav nav-pills ml-2">
					<router-link
						to="/listings"
						class="nav-item nav-link"
						:class="{ active: this.$route.name == 'listings' }"
						data-toggle="pill"
						role="tab"
					>Listings</router-link>
					<transition name="fade" mode="out-in">
						<div key="user-view" v-if="!isGuest">
							<router-link
								:to="`/user/${userIgn}`"
								class="nav-item nav-link"
								:class="{ active: this.$route.name == 'userListings' && this.$route.params.userId == this.$store.state.user._id }"
								data-toggle="pill"
								role="tab"
							>My Store</router-link>
						</div>
					</transition>
				</nav>
			</div>
			<div class="mx-auto">
				<router-link to="/" class="text-light">
					<h3 class="mb-0 font-weight-normal">TennoHub</h3>
				</router-link>
			</div>
			<div class="w-33 d-flex">
				<div class="d-none d-lg-flex ml-auto w-fit">
					<transition name="fade" mode="out-in">
						<div key="guest-view" class="nav nav-pills d-flex" v-if="isGuest">
							<button class="btn btn-link nav-item nav-link py-1" @click="onLoginClick">Login</button>
							<router-link
								to="/signup"
								class="nav-item nav-link"
								:class="{ active: this.$route.name == 'signup' }"
								data-toggle="pill"
								role="tab"
							>Signup</router-link>
						</div>
						<div key="user-view" v-else class="d-none d-lg-block my-auto">
							Hello
							<h5 class="font-weight-bold d-inline">{{ign}}</h5>
						</div>
					</transition>
				</div>
			</div>
		</div>
		<div id="slidingNav" class="position-absolute p-4 nav-menu bg-dark">
			<div class="nav flex-column nav-pills" role="tablist">
				<!-- <router-link to="/home" class="nav-link" :class="{ active: this.$route.name == 'home' }" data-toggle="pill" role="tab" @click.native="onNavItemClick">Home</router-link> -->
				<router-link
					to="/listings"
					class="nav-link"
					:class="{ active: this.$route.name == 'listings' }"
					data-toggle="pill"
					role="tab"
					@click.native="onNavItemClick"
				>
					<i class="fas fa-list-ul mr-2"></i>Listings
				</router-link>
				<transition name="fade" mode="out-in">
					<div key="guest-links" v-if="isGuest">
						<button class="btn btn-link nav-item nav-link py-1 btn-block text-left" @click="onLoginClick">
							<i class="fas fa-user mr-2"></i>Login
						</button>
						<button
							class="btn btn-link nav-item nav-link py-1 btn-block text-left"
							@click="onSignupClick"
						>
							<i class="fas fa-user-plus mr-2"></i>Signup
						</button>
					</div>
					<div key="user-links" v-else>
						<router-link
							to="/settings"
							class="nav-link"
							:class="{ active: this.$route.name == 'settings' }"
							data-toggle="pill"
							role="tab"
							@click.native="onNavItemClick"
						>
							<i class="fas fa-cog mr-2"></i>Settings
						</router-link>
						<router-link
							:to="`/user/${userIgn}`"
							class="nav-item nav-link"
							:class="{ active: this.$route.name == 'userListings' && this.$route.params.userId == this.$store.state.user._id }"
							data-toggle="pill"
							role="tab"
							@click.native="onNavItemClick"
						>
							<i class="fas fa-store mr-2"></i>My Store
						</router-link>
						<button class="btn btn-link nav-item nav-link py-1" @click="onLogoutClick">
							<i class="fas fa-user-alt-slash mr-2"></i>Logout
						</button>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapState, mapGetters } from "vuex";
	import { EventBus } from "../EventBus";

	export default {
		name: "Nav",
		methods: {
			onNavMenuButtonClick() {
				this.showNavMenu();
			},
			onNavItemClick() {
				this.hideNavMenu();
			},
			onBodyKeyUp(event) {
				if (event.keyCode === 27) {
					this.hideNavMenu();
				}
			},
			showNavMenu() {
				let navMenu = this.$el.querySelector(".nav-menu");
				let backdrop = document.querySelector(".backdrop");
				let body = document.querySelector("body");
				if (navMenu && backdrop && body) {
					body.addEventListener("keyup", this.onBodyKeyUp);
					body.classList.add("overflow-hidden");
					if (body.scrollHeight > screen.height) {
						// body.classList.add("scrollbar-padding");
					}
					navMenu.classList.add("show");
					backdrop.classList.add("show");
					backdrop.addEventListener(
						"click",
						event => {
							if (event.currentTarget != navMenu) {
								this.onNavItemClick();
							}
						},
						{ once: true }
					);
				}
			},
			hideNavMenu() {
				let navMenu = this.$el.querySelector(".nav-menu");
				let backdrop = document.querySelector(".backdrop");
				let body = document.querySelector("body");
				if (navMenu && backdrop && body) {
					body.classList.remove("overflow-hidden");
					body.classList.remove("scrollbar-padding");
					navMenu.classList.remove("show");
					backdrop.classList.remove("show");
				}
			},
			onLogoutClick() {
				this.onNavItemClick();
				this.$store.dispatch("logout");
			},
			onLoginClick() {
				this.onNavItemClick();
				EventBus.$emit("show-login");
			},
			onSignupClick() {
				this.onNavItemClick();
				EventBus.$emit("show-signup");
			}
		},
		computed: {
			...mapState({
				ign: state => state.user.ign,
                userId: state => state.user._id,
                userIgn: state => state.user.ign
			}),
			...mapGetters(["isGuest"])
		}
	};
</script>
<style scoped>
	#website-name {
		font-weight: 600;
	}
	#slidingNav {
		box-shadow: 0 0.5rem 10rem rgba(0, 0, 0, 0.15);
	}
	.nav-menu {
		left: 0;
		top: 0;
		z-index: 4;
		opacity: 0;
		transition-property: transform, opacity;
		transition-duration: 250ms;
		transition-timing-function: var(--ease-out);
		transform: translateX(-100%);
		height: 100vh;
	}
	.nav-menu.show {
		transition-timing-function: var(--ease-in);
		transform: translateX(0);
		opacity: 1;
	}
	.nav {
		min-width: 150px;
	}
	.nav-link {
		transition: background-color 250ms, box-shadow 250ms;
	}
	.nav-link i {
		min-width: 20px;
	}
	.nav-link.active {
		box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.15) !important;
	}
</style>
