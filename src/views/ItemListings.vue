<template>
	<div class="d-flex flex-column flex-grow-1">
		<div id="top-container" class="d-flex">
			<Loader :is-loading="isLoading" />
			<transition name="fade" mode="out-in">
				<div v-if="item" class="w-100 p-5">
					<div class="d-flex">
						<h1 class="text-light mx-auto mb-0">{{ item.name }}</h1>
					</div>
					<div class="d-flex flex-wrap mt-5 justify-content-center">
						<div class="card bg-dark text-light shadow mr-4 border-right-0 border-left-0 border-bottom-0 border-light">
							<div class="card-body">
								<div class="d-flex mb-4">
									<h5 class="card-title mb-0">Pricing</h5>
									<div class="dropdown ml-auto my-auto">
										<button class="btn btn-outline-light btn-sm dropdown-menu-width" data-toggle="dropdown">
											{{ currentPricingChartView }}
										</button>
										<div class="dropdown-menu dropdown-menu-right shadow">
											<button v-for="pricingChartView in pricingChartViews" :key="pricingChartView" :class="{
													active:
														currentPricingChartView ===
														pricingChartView
												}" class="dropdown-item" @click="
													setPricingChartView(
														pricingChartView
													)
												">
												{{ pricingChartView }}
											</button>
										</div>
									</div>
								</div>
								<div v-if="item.analytics.pricing">
									<canvas ref="pricingAnalyticsCanvas"></canvas>
								</div>
								<div v-else>
									Currently unvailable.
								</div>
							</div>
						</div>
						<div class="card bg-dark text-light shadow border-right-0 border-left-0 border-bottom-0 border-light">
							<div class="card-body">
								<div class="d-flex mb-4">
									<h5 class="card-title mb-0">Supply</h5>
									<div class="dropdown ml-auto my-auto">
										<button class="btn btn-outline-light btn-sm dropdown-menu-width" data-toggle="dropdown">
											{{ currentSupplyChartView }}
										</button>
										<div class="dropdown-menu dropdown-menu-right shadow">
											<button v-for="supplyChartView in supplyChartViews" :key="supplyChartView" :class="{
													active:
														currentSupplyChartView ===
														supplyChartView
												}" class="dropdown-item" @click="
													setSupplyChartView(
														supplyChartView
													)
												">
												{{ supplyChartView }}
											</button>
										</div>
									</div>
								</div>
								<div v-if="item.analytics.supply">
									<canvas ref="supplyAnalyticsCanvas"></canvas>
								</div>
								<div v-else>
									Currently unavailable.
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- <div class="mx-auto d-flex p-4" v-if="item">
					<img id="item-image" class="bg-secondary rounded shadow-lg mr-3" :src="imageSource || ''" :alt="item.imageName || ''" draggable="false" />
					<div>
						<h1 class="text-light">{{ item.name }}</h1>
					</div>
				</div> -->
			</transition>
		</div>
		<div class="d-flex flex-column flex-grow-1 min-fullscreen-height">
			<ListingsViewer />
		</div>
	</div>
</template>
<script>
	/* eslint-disable */
	import Loader from "../components/Loader";
	import ListingsViewer from "../components/ListingsViewer";

	export default {
		name: "ItemListings",
		components: {
			Loader,
			ListingsViewer
		},
		data() {
			return {
				item: null,
				itemUniqueName: null,
				isLoading: false,

				supplyChart: null,
				currentSupplyChartView: "Weekly",
				supplyChartViews: ["Weekly", "Monthly", "Yearly"],
				supplyChartConfig: null,
				supplyChartOptions: null,
				currentWeekSupplyChartData: null,
				currentMonthSupplyChartData: null,
				currentYearSupplyChartData: null,

				pricingChart: null,
				currentPricingChartView: "Weekly",
				pricingChartViews: ["Weekly", "Monthly", "Yearly"],
				pricingChartConfig: null,
				pricingChartOptions: null,
				currentWeekPricingChartData: null,
				currentMonthPricingChartData: null,
				currentYearPricingChartData: null
			};
		},
		created() {
			this.isLoading = true;
			this.itemUniqueName = this.$route.params.pathMatch;
			if (this.itemUniqueName.charAt(0) !== "/") {
				this.itemUniqueName = "/" + this.itemUniqueName;
			}
			this.$store
				.dispatch("getItemWithAnalytics", this.itemUniqueName)
				.then(async item => {
					await (this.item = item);
					if (item) {
						document.title = `${this.item.name} - TennoHub`;
						this.createCharts();
					}
				})
				.catch(error => {
					this.error =
						"Failed to load data. Please refresh the page and try again.";
				})
				.finally(() => {
					this.isLoading = false;
				});
		},
		methods: {
			setSupplyChartView(value) {
				this.currentSupplyChartView = value;
				switch (value) {
					case "Weekly":
						this.supplyChartConfig.data = this.currentWeekSupplyChartData;
						break;
					case "Monthly":
						this.supplyChartConfig.data = this.currentMonthSupplyChartData;
						break;
					case "Yearly":
						this.supplyChartConfig.data = this.currentYearSupplyChartData;
						break;
				}
				this.supplyChart.update();
			},
			setPricingChartView(value) {
				this.currentPricingChartView = value;
				switch (value) {
					case "Weekly":
						this.pricingChartConfig.data = this.currentWeekPricingChartData;
						break;
					case "Monthly":
						this.pricingChartConfig.data = this.currentMonthPricingChartData;
						break;
					case "Yearly":
						this.pricingChartConfig.data = this.currentYearPricingChartData;
						break;
				}
				this.pricingChart.update();
			},
			createCharts() {
				this.createSupplyChart();
				this.createPricingChart();
			},
			createSupplyChart() {
				const analytics = this.item.analytics;
				analytics.supply.weekly.datasets[0].borderColor =
					"rgb(133, 255, 159)";
				analytics.supply.weekly.datasets[0].backgroundColor =
					"rgba(133, 255, 159, 0.5)";

				analytics.supply.monthly.datasets[0].borderColor =
					"rgb(133, 255, 159)";
				analytics.supply.monthly.datasets[0].backgroundColor =
					"rgba(133, 255, 159, 0.5)";

				analytics.supply.yearly.datasets[0].borderColor =
					"rgb(133, 255, 159)";
				analytics.supply.yearly.datasets[0].backgroundColor =
					"rgba(133, 255, 159, 0.5)";

				this.currentWeekSupplyChartData = {
					labels: analytics.supply.weekly.xAxes,
					datasets: analytics.supply.weekly.datasets
				};
				this.currentMonthSupplyChartData = {
					labels: analytics.supply.monthly.xAxes,
					datasets: analytics.supply.monthly.datasets
				};
				this.currentYearSupplyChartData = {
					labels: analytics.supply.yearly.xAxes,
					datasets: analytics.supply.yearly.datasets
				};

				this.supplyChartOptions = {
					layout: {
						padding: {
							top: 5
						}
					},
					responsive: true,
					legend: {
						display: false
					},
					scales: {
						xAxes: [
							{
								gridLines: {
									display: false
								},
								ticks: {
									fontColor: "rgba(255, 255, 255, 0.5)",
									padding: 10,
									beginAtZero: true
								}
							}
						],
						yAxes: [
							{
								gridLines: {
									display: false
								},
								ticks: {
									display: false,
									beginAtZero: true,
									// fontColor: "rgba(255, 255, 255, 0.5)",
									// padding: 10,
									// stepSize: 1
								}
							}
						]
					},
					tooltips: {
						mode: "index",
						intersect: false
					}
				};
				const supplyCanvasContext = this.$refs.supplyAnalyticsCanvas.getContext(
					"2d"
				);
				this.supplyChartConfig = {
					type: "line",
					data: this.currentWeekSupplyChartData,
					options: this.supplyChartOptions
				};
				this.supplyChart = new Chart(
					supplyCanvasContext,
					this.supplyChartConfig
				);
			},
			createPricingChart() {
				const analytics = this.item.analytics;
				analytics.pricing.weekly.datasets[0].borderColor =
					"rgba(0, 0, 0, 0)";
				analytics.pricing.weekly.datasets[0].backgroundColor =
					"rgba(0, 0, 0, 0)";
				analytics.pricing.weekly.datasets[1].borderColor =
					"rgb(133, 255, 159)";
				analytics.pricing.weekly.datasets[1].backgroundColor =
					"rgba(133, 255, 159, 0.5)";
				analytics.pricing.weekly.datasets[2].borderColor =
					"rgba(0, 0, 0, 0)";
				analytics.pricing.weekly.datasets[2].backgroundColor =
					"rgba(0, 0, 0, 0)";

				analytics.pricing.monthly.datasets[0].borderColor =
					"rgba(0, 0, 0, 0)";
				analytics.pricing.monthly.datasets[0].backgroundColor =
					"rgba(0, 0, 0, 0)";
				analytics.pricing.monthly.datasets[1].borderColor =
					"rgb(133, 255, 159)";
				analytics.pricing.monthly.datasets[1].backgroundColor =
					"rgba(133, 255, 159, 0.5)";
				analytics.pricing.monthly.datasets[2].borderColor =
					"rgba(0, 0, 0, 0)";
				analytics.pricing.monthly.datasets[2].backgroundColor =
					"rgba(0, 0, 0, 0)";

				analytics.pricing.yearly.datasets[0].borderColor =
					"rgba(0, 0, 0, 0)";
				analytics.pricing.yearly.datasets[0].backgroundColor =
					"rgba(0, 0, 0, 0)";
				analytics.pricing.yearly.datasets[1].borderColor =
					"rgb(133, 255, 159)";
				analytics.pricing.yearly.datasets[1].backgroundColor =
					"rgba(133, 255, 159, 0.5)";
				analytics.pricing.yearly.datasets[2].borderColor =
					"rgba(0, 0, 0, 0)";
				analytics.pricing.yearly.datasets[2].backgroundColor =
					"rgba(0, 0, 0, 0)";

				this.currentWeekPricingChartData = {
					labels: analytics.pricing.weekly.xAxes,
					datasets: analytics.pricing.weekly.datasets
				};
				this.currentMonthPricingChartData = {
					labels: analytics.pricing.monthly.xAxes,
					datasets: analytics.pricing.monthly.datasets
				};
				this.currentYearPricingChartData = {
					labels: analytics.pricing.yearly.xAxes,
					datasets: analytics.pricing.yearly.datasets
				};

				this.pricingChartOptions = {
					layout: {
						padding: {
							top: 5
						}
					},
					responsive: true,
					legend: {
						display: false
					},
					scales: {
						xAxes: [
							{
								gridLines: {
									display: false
								},
								ticks: {
									fontColor: "rgba(255, 255, 255, 0.5)",
									padding: 10,
									beginAtZero: true
								}
							}
						],
						yAxes: [
							{
								gridLines: {
									display: false
								},
								ticks: {
									display: false,
									beginAtZero: true,
									// fontColor: "rgba(255, 255, 255, 0.5)",
									// padding: 10,
									// stepSize: 1
								}
							}
						]
					},
					tooltips: {
						mode: "index",
						intersect: false
					}
				};
				const pricingCanvasContext = this.$refs.pricingAnalyticsCanvas.getContext(
					"2d"
				);
				this.pricingChartConfig = {
					type: "line",
					data: this.currentWeekPricingChartData,
					options: this.pricingChartOptions
				};
				this.pricingChart = new Chart(
					pricingCanvasContext,
					this.pricingChartConfig
				);
			}
		},
		computed: {
			imageSource() {
				return this.item.imageName
					? `/images/${this.item.imageName}`
					: null;
			}
		}
	};
</script>
<style scoped>
	#top-container {
		min-height: 200px;
	}
	#item-image {
		object-fit: cover;
		min-height: 200px;
		height: 200px;
		max-height: 200px;
	}
	.card {
		max-width: 25rem;
	}
</style>