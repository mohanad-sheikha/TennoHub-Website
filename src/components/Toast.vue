<template>
	<div role="alert" class="toast" :data-autohide="autohide.toString()" :data-delay="duration">
		<div v-if="!hideHeader" class="toast-header">
			<strong class="mr-auto">{{ title }}</strong>
			<v-btn v-if="!hideClose" type="button" class="btn btn-sm shadow-none" @click="onCloseClick">
				<i class="fas fa-times"></i>
			</v-btn>
		</div>
		<div class="toast-body d-flex">{{ message }}
			<v-btn v-if="hideHeader && !hideClose" type="button" class="btn btn-sm shadow-none p-0 ml-auto" @click="onCloseClick">
				<i class="fas fa-times"></i>
			</v-btn>
		</div>
	</div>
</template>
<script>
	/* eslint-disable */
	export default {
		props: {
			title: {
				type: String
			},
			message: {
				type: String
			},
			duration: {
				type: Number,
				default: 4000
			},
			index: {
				type: Number
			},
			autohide: {
				type: Boolean,
				default: true
			}
		},
		name: "Toast",
		methods: {
			onCloseClick() {
				$(".toast").toast("hide");
			}
		},
		mounted() {
			$(".toast")
				.toast("show")
				.on("hidden.bs.toast", () => {
					this.$store.dispatch("removeToast", this.index);
				});
		},
		computed: {
			hideClose() {
				return this.autohide;
			},
			hideHeader() {
				return !this.title;
			}
		}
	};
</script>
<style scoped>
	.toast {
		min-width: 300px;
	}
</style>