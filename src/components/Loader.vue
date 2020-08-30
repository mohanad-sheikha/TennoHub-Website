<template>
	<div>
		<div class="position-absolute backdrop" :class="{show: isLoading}"></div>
		<div class="position-absolute spinner spinner-border text-white m-auto" :class="{show: isLoading}" role="status">
			<span class="sr-only">Loading...</span>
		</div>
	</div>
</template>
<script>
	/* eslint-disable no-unused-vars */
	export default {
		name: "Loader",
		props: ["isLoading"],
		mounted() {
			this.$el.parentElement.classList.add("position-relative");
		}
	};
</script>
<style scoped>
	.spinner {
		pointer-events: none;
		top: 25%;
		right: calc(50% - 1rem);
		opacity: 0;
		transition: opacity 250ms;
		transition-timing-function: var(--ease-out);
		z-index: 5;
	}
	.spinner.show {
		transition-timing-function: var(--ease-in);
		opacity: 5;
	}
	.backdrop {
		z-index: 1;
	}
</style>