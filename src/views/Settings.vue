<template>
	<div id="container" class="d-flex flex-column flex-grow-1">
		<form id="settingsForm" class="bg-light d-flex flex-column m-auto p-4 rounded shadow-lg overflow-hidden position-relative" @submit.prevent="onSettingsFormSubmit">
			<h4 class="mb-3">Settings</h4>
			<Loader :is-loading="isLoading" />
			<div class="d-flex mb-3 flex-grow-1">
				<div class="nav flex-column nav-pills mr-4" id="settings-tabs" role="tablist" aria-orientation="vertical">
					<a class="nav-link active" id="settings-account-tab" data-toggle="pill" href="#settings-account" role="tab" aria-controls="settings-account" aria-selected="true"><i class="fas fa-user-circle mr-2"></i>Account</a>
					<!-- <a class="nav-link" id="settings-notifications-tab" data-toggle="pill" href="#settings-notifications" role="tab" aria-controls="settings-notifications" aria-selected="false"><i class="fas fa-bell mr-2"></i>Notifications</a> -->
				</div>
				<div class="tab-content flex-grow-1" id="v-pills-tabContent">
					<div class="tab-pane fade show active" id="settings-account" role="tabpanel" aria-labelledby="settings-account-tab">
						<div class="form-group">
							<label for="emailSettingsInput">Email</label>
							<input type="text" class="form-control" id="emailSettingsInput" name="email" readonly required v-model="$store.state.user.email" />
						</div>
						<div class="form-group">
							<label for="passwordSettingsInput">Password</label>
							<input type="password" class="form-control" id="passwordSettingsInput" name="password" readonly required value="whatareyoulookingfor" />
						</div>
						<div class="form-group mb-0">
							<label for="ignSettingsInput">Warframe IGN</label>
							<input type="text" class="form-control" id="ignSettingsInput" name="ign" required readonly :value="$store.state.user.ign" />
						</div>
					</div>
					<div class="tab-pane fade" id="settings-notifications" role="tabpanel" aria-labelledby="settings-notifications-tab">Notifications</div>
				</div>
			</div>
			<!-- <button class="btn btn-primary btn-block mt-auto" type="submit">Save</button> -->
		</form>
	</div>
</template>
<script>
	import Loader from "../components/Loader";
	export default {
		name: "Settings",
		components: {
			Loader
		},
		data() {
			return {
				email: null,
				password: null,
				ign: null,
				isLoading: false
			};
		},
		created() {
			document.title = 'Settings - TennoHub';
		}
	};
</script>
<style scoped>
	#settingsForm {
		min-width: 400px;
		max-width: 700px;
		width: 100%;
		min-height: 450px;
	}
</style>