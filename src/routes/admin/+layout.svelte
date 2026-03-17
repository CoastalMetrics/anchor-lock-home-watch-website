<script lang="ts">
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import { doc, getDoc } from 'firebase/firestore';
	import { auth, db } from '$lib/firebase';
	import { browser } from '$app/environment';

	async function handleSignOut() {
		await signOut(auth);
		window.location.href = '/';
	}

	let { children } = $props();

	let status = $state<'checking' | 'authorized' | 'unauthorized' | 'redirecting'>('checking');

	if (browser) {
		onAuthStateChanged(auth, async (user) => {
			if (!user?.email) {
				status = 'redirecting';
				window.location.href = '/login';
				return;
			}
			const adminDoc = await getDoc(doc(db, 'admins', user.email));
			if (adminDoc.exists()) {
				status = 'authorized';
			} else {
				status = 'unauthorized';
			}
		});
	}
</script>

{#if status === 'checking' || status === 'redirecting'}
	<div class="loading">Checking access...</div>

{:else if status === 'unauthorized'}
	<div class="loading">You don't have access to this area.</div>

{:else if status === 'authorized'}
	<div class="admin-shell">
		<aside class="sidebar">
			<a href="/admin" class="sidebar-logo">
				<span>⚓</span>
				<div>
					<strong>Anchor Lock</strong>
					<span>Admin</span>
				</div>
			</a>
			<nav class="sidebar-nav">
				<a href="/admin">Dashboard</a>
				<a href="/admin/customers">Customers</a>
			</nav>
			<a href="/" class="sidebar-back">← Back to site</a>
			<button class="sidebar-signout" onclick={handleSignOut}>Sign Out</button>
		</aside>
		<main class="admin-main">
			{@render children()}
		</main>
	</div>
{/if}

<style>
	.loading {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--mid);
		font-size: 0.95rem;
	}

	.admin-shell {
		display: grid;
		grid-template-columns: 220px 1fr;
		min-height: 100vh;
	}

	/* === SIDEBAR === */
	.sidebar {
		background: var(--navy-dark);
		display: flex;
		flex-direction: column;
		padding: 1.5rem 0;
		position: sticky;
		top: 0;
		height: 100vh;
	}

	.sidebar-logo {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0 1.25rem 1.5rem;
		border-bottom: 1px solid rgba(255,255,255,0.08);
		margin-bottom: 1rem;
		text-decoration: none;
		color: var(--white);
		font-size: 1.3rem;
	}
	.sidebar-logo div {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}
	.sidebar-logo strong { font-size: 0.95rem; font-weight: 700; }
	.sidebar-logo span { font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.6; }

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 0 0.75rem;
		gap: 0.15rem;
	}
	.sidebar-nav a {
		color: rgba(255,255,255,0.7);
		text-decoration: none;
		font-size: 0.9rem;
		padding: 0.6rem 0.75rem;
		border-radius: 6px;
		transition: background 0.15s, color 0.15s;
	}
	.sidebar-nav a:hover {
		background: rgba(255,255,255,0.07);
		color: var(--white);
	}

	.sidebar-back {
		padding: 1rem 1.25rem 0;
		border-top: 1px solid rgba(255,255,255,0.08);
		color: rgba(255,255,255,0.4);
		text-decoration: none;
		font-size: 0.8rem;
		transition: color 0.15s;
	}
	.sidebar-back:hover { color: rgba(255,255,255,0.7); }

	.sidebar-signout {
		background: none;
		border: none;
		color: rgba(255,255,255,0.4);
		font-family: var(--font-body);
		font-size: 0.8rem;
		cursor: pointer;
		padding: 0.5rem 1.25rem 0;
		text-align: left;
		transition: color 0.15s;
	}
	.sidebar-signout:hover { color: rgba(255,255,255,0.7); }

	/* === MAIN === */
	.admin-main {
		background: var(--off-white);
		padding: 2.5rem;
		overflow-y: auto;
	}
</style>
