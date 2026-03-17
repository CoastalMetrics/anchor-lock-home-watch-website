<script lang="ts">
	import { auth } from '$lib/firebase';
</script>

<div class="dashboard">
	<h1>Dashboard</h1>
	<p class="welcome">Welcome back, {auth.currentUser?.email}</p>

	<div class="cards">
		<a href="/admin/customers" class="card">
			<span class="card-icon">👥</span>
			<strong>Customers</strong>
			<span>Manage customers & properties</span>
		</a>
	</div>
</div>

<style>
	h1 {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		color: var(--dark);
		margin-bottom: 0.25rem;
	}
	.welcome {
		color: var(--mid);
		font-size: 0.9rem;
		margin-bottom: 2.5rem;
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		max-width: 600px;
	}
	.card {
		background: var(--white);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.5rem;
		text-decoration: none;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		transition: box-shadow 0.2s, transform 0.2s;
	}
	.card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }
	.card-icon { font-size: 1.5rem; }
	.card strong { font-size: 1rem; color: var(--dark); }
	.card span { font-size: 0.8rem; color: var(--mid); }
</style>
