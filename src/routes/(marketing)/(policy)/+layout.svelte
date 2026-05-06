<script lang="ts">
	let { children } = $props();
</script>

<header class="policy-header">
	<a href="/" class="logo">
		<span class="logo-anchor">⚓</span>
		<span class="logo-text">
			<span class="logo-name">Anchor Lock</span>
			<span class="logo-sub">Home Watch</span>
		</span>
	</a>
	<a href="/" class="back-link">← Back to home</a>
</header>

<main class="policy-main">
	<div class="policy-container">
		{@render children()}
	</div>
</main>

<footer class="policy-footer">
	<div class="policy-container">
		<p>© {new Date().getFullYear()} Anchor Lock Home Watch. All rights reserved.</p>
		<p class="policy-links">
			<a href="/privacy">Privacy Policy</a> ·
			<a href="/terms">Terms of Service</a>
		</p>
	</div>
</footer>

<style>
	.policy-container {
		max-width: 820px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.policy-header {
		background: var(--navy);
		color: var(--white);
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.logo { display: flex; align-items: center; gap: 0.55rem; color: var(--white); text-decoration: none; }
	.logo-anchor { font-size: 1.6rem; }
	.logo-text { display: flex; flex-direction: column; line-height: 1.15; }
	.logo-name { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; }
	.logo-sub { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.7; }
	.back-link {
		color: rgba(255,255,255,0.85);
		font-size: 0.9rem;
		font-weight: 500;
		padding: 0.4rem 0.9rem;
		border-radius: 6px;
		border: 1px solid rgba(255,255,255,0.3);
		transition: color 0.15s, border-color 0.15s;
	}
	.back-link:hover { color: var(--white); border-color: var(--white); }

	.policy-main {
		background: var(--off-white);
		padding: 3rem 0 4rem;
		min-height: calc(100vh - 200px);
	}

	:global(.policy-main h1) {
		font-family: var(--font-heading);
		font-size: 2.25rem;
		color: var(--navy);
		margin-bottom: 0.5rem;
	}
	:global(.policy-main .effective) {
		color: var(--mid);
		font-size: 0.9rem;
		margin-bottom: 2rem;
	}
	:global(.policy-main h2) {
		font-family: var(--font-heading);
		font-size: 1.35rem;
		color: var(--navy);
		margin: 1.75rem 0 0.5rem;
	}
	:global(.policy-main p) {
		color: var(--dark);
		line-height: 1.7;
		margin-bottom: 0.9rem;
	}
	:global(.policy-main a) { color: var(--navy); text-decoration: underline; }

	.policy-footer {
		background: var(--navy-dark);
		color: rgba(255,255,255,0.7);
		padding: 1.5rem 0;
		text-align: center;
		font-size: 0.85rem;
	}
	.policy-footer p { margin: 0.25rem 0; }
	.policy-links a { color: rgba(255,255,255,0.85); text-decoration: none; }
	.policy-links a:hover { color: var(--white); text-decoration: underline; }

	@media (max-width: 480px) {
		.policy-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
		:global(.policy-main h1) { font-size: 1.75rem; }
	}
</style>
