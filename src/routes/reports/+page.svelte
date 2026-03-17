<script lang="ts">
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
	import { auth, db } from '$lib/firebase';
	import { browser } from '$app/environment';

	type Property = {
		id: string;
		street: string;
		city: string;
		state: string;
		zip: string;
		nickname: string | null;
	};

	function fullAddress(p: Property) {
		return `${p.street}, ${p.city}, ${p.state} ${p.zip}`;
	}

	let status = $state<'checking' | 'authenticated' | 'redirecting'>('checking');
	let userEmail = $state('');
	let isAdmin = $state(false);
	let properties = $state<Property[]>([]);

	if (browser) {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				userEmail = user.email ?? '';
				const [adminDoc, propSnap] = await Promise.all([
					getDoc(doc(db, 'admins', user.email ?? '')),
					getDocs(query(collection(db, 'users', user.uid, 'properties'), orderBy('createdAt', 'asc')))
				]);
				isAdmin = adminDoc.exists();
				properties = propSnap.docs.map((p) => ({
					id: p.id,
					street: p.data().street,
					city: p.data().city,
					state: p.data().state,
					zip: p.data().zip,
					nickname: p.data().nickname ?? null
				}));
				status = 'authenticated';
			} else {
				status = 'redirecting';
				window.location.href = '/login';
			}
		});
	}

	async function handleSignOut() {
		await signOut(auth);
		window.location.href = '/';
	}
</script>

{#if status === 'checking' || status === 'redirecting'}
	<div class="loading-page">
		<p>Loading...</p>
	</div>

{:else if status === 'authenticated'}
	<div class="reports-page">

		<header class="reports-nav">
			<div class="container nav-inner">
				<a href="/" class="logo">
					<span>⚓</span>
					<div>
						<strong>Anchor Lock</strong>
						<span>Home Watch</span>
					</div>
				</a>
				<div class="nav-right">
					<span class="user-email">{userEmail}</span>
					{#if isAdmin}
						<a href="/admin" class="btn-nav">Admin</a>
					{/if}
					<button class="btn-nav" onclick={handleSignOut}>Sign Out</button>
				</div>
			</div>
		</header>

		<main class="container">
			<div class="page-header">
				<h1>Your Inspection Reports</h1>
				<p>All visits to your property are documented here with photos and detailed notes.</p>
			</div>

			{#if properties.length > 0}
				<div class="properties">
					{#each properties as p}
						<div class="property-section">
							<div class="property-header">
								<div>
									<h2>{p.nickname ?? fullAddress(p)}</h2>
									{#if p.nickname}<span class="property-address">{fullAddress(p)}</span>{/if}
								</div>
							</div>

							<div class="empty-state">
								<span class="empty-icon">📋</span>
								<h3>No reports yet</h3>
								<p>Inspection reports for this property will appear here after your first scheduled visit.</p>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="empty-state centered">
					<span class="empty-icon">🏠</span>
					<h2>No properties yet</h2>
					<p>Your properties and inspection reports will appear here once your account is fully set up.</p>
				</div>
			{/if}
		</main>

	</div>
{/if}

<style>
	.loading-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--mid);
	}

	.reports-page {
		min-height: 100vh;
		background: var(--off-white);
	}

	/* === NAV === */
	.reports-nav {
		background: var(--navy);
		box-shadow: 0 2px 12px rgba(0,0,0,0.15);
		position: sticky;
		top: 0;
		z-index: 100;
	}
	.container {
		max-width: 860px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}
	.nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		text-decoration: none;
		color: var(--white);
		font-size: 1.4rem;
	}
	.logo div { display: flex; flex-direction: column; line-height: 1.2; }
	.logo strong { font-size: 1rem; font-weight: 700; }
	.logo span { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.75; }

	.nav-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.user-email {
		font-size: 0.85rem;
		color: rgba(255,255,255,0.7);
	}

	/* === CONTENT === */
	main { padding: 3rem 1.5rem; }

	.page-header { margin-bottom: 2.5rem; }
	.page-header h1 {
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 3vw, 2rem);
		color: var(--dark);
		margin-bottom: 0.5rem;
	}
	.page-header p { color: var(--mid); font-size: 0.95rem; }

	/* === PROPERTIES === */
	.properties {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.property-section {
		background: var(--white);
		border: 1px solid var(--border);
		border-radius: 16px;
		overflow: hidden;
	}

	.property-header {
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid var(--border);
		background: var(--off-white);
	}

	.property-header h2 {
		font-family: var(--font-heading);
		font-size: 1.1rem;
		color: var(--dark);
		margin: 0;
	}

	.property-address {
		font-size: 0.8rem;
		color: var(--mid);
		margin-top: 0.2rem;
		display: block;
	}

	/* === EMPTY STATES === */
	.empty-state {
		padding: 3rem 2rem;
		text-align: center;
	}
	.empty-state.centered {
		background: var(--white);
		border: 1px solid var(--border);
		border-radius: 16px;
		max-width: 480px;
		margin: 0 auto;
	}
	.empty-icon { font-size: 2rem; display: block; margin-bottom: 0.75rem; }
	.empty-state h2, .empty-state h3 {
		font-size: 1.1rem;
		color: var(--dark);
		margin-bottom: 0.4rem;
	}
	.empty-state p { color: var(--mid); font-size: 0.875rem; line-height: 1.6; }

	@media (max-width: 480px) {
		.user-email { display: none; }
	}
</style>
