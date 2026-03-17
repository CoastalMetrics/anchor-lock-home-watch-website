<script lang="ts">
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import { doc, getDoc } from 'firebase/firestore';
	import { auth, db } from '$lib/firebase';
	import { browser } from '$app/environment';

	let status = $state<'checking' | 'authenticated' | 'redirecting'>('checking');
	let userEmail = $state('');
	let isAdmin = $state(false);

	if (browser) {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				userEmail = user.email ?? '';
				const adminDoc = await getDoc(doc(db, 'admins', user.email ?? ''));
				isAdmin = adminDoc.exists();
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

			<!-- Placeholder — inspection list goes here once schema is finalized -->
			<div class="empty-state">
				<span class="empty-icon">📋</span>
				<h2>No reports yet</h2>
				<p>Your inspection reports will appear here after your first scheduled visit.</p>
			</div>
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
		max-width: 1100px;
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
	.logo div {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}
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
	main {
		padding: 3rem 1.5rem;
	}
	.page-header {
		margin-bottom: 2.5rem;
	}
	.page-header h1 {
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 3vw, 2rem);
		color: var(--dark);
		margin-bottom: 0.5rem;
	}
	.page-header p {
		color: var(--mid);
		font-size: 0.95rem;
	}

	/* === EMPTY STATE === */
	.empty-state {
		background: var(--white);
		border: 1px solid var(--border);
		border-radius: 16px;
		padding: 4rem 2rem;
		text-align: center;
		max-width: 480px;
		margin: 0 auto;
	}
	.empty-icon {
		font-size: 2.5rem;
		display: block;
		margin-bottom: 1rem;
	}
	.empty-state h2 {
		font-size: 1.25rem;
		color: var(--dark);
		margin-bottom: 0.5rem;
	}
	.empty-state p {
		color: var(--mid);
		font-size: 0.9rem;
		line-height: 1.6;
	}

	@media (max-width: 480px) {
		.user-email { display: none; }
	}
</style>
