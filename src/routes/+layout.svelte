<script lang="ts">
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Anchor Lock Home Watch — professional home watch services in Cape Coral & Fort Myers, FL." />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
</svelte:head>

{@render children()}

<style>
	/* :global() punches through Svelte's scoped styles to set true globals */
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(:root) {
		--navy:      #1B3D6F;
		--navy-dark: #122B52;
		--teal:      #0B7A8A;
		--gold:      #C9913A;
		--gold-light:#F2C97A;
		--off-white: #F8F7F4;
		--white:     #FFFFFF;
		--dark:      #1C2B3A;
		--mid:       #4A5568;
		--border:    #E2E8F0;

		--font-body:    'Inter', system-ui, sans-serif;
		--font-heading: 'Playfair Display', Georgia, serif;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		font-family: var(--font-body);
		color: var(--dark);
		background: var(--white);
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
	}

	:global(img) {
		max-width: 100%;
		display: block;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	/* === SHARED BUTTON STYLES === */

	/* Ghost button — for nav bars on dark backgrounds */
	:global(.btn-nav) {
		color: rgba(255,255,255,0.85);
		font-family: var(--font-body);
		font-size: 0.85rem;
		font-weight: 500;
		padding: 0.4rem 0.9rem;
		border-radius: 6px;
		border: 1px solid rgba(255,255,255,0.3);
		background: transparent;
		cursor: pointer;
		text-decoration: none;
		display: inline-block;
		transition: color 0.15s, border-color 0.15s;
	}
	:global(.btn-nav:hover) { color: white; border-color: white; }

	/* Solid button — for admin action buttons */
	:global(.btn-action) {
		background: var(--navy);
		color: var(--white);
		border: none;
		border-radius: 8px;
		padding: 0.6rem 1.2rem;
		font-family: var(--font-body);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		display: inline-block;
		transition: background 0.15s;
	}
	:global(.btn-action:hover:not(:disabled)) { background: var(--navy-dark); }
	:global(.btn-action:disabled) { opacity: 0.6; cursor: not-allowed; }

	/* === SHARED FORM STYLES === */

	:global(.field) {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		margin-bottom: 1rem;
	}

	:global(.field-row) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	:global(.optional) {
		font-weight: 400;
		color: var(--mid);
	}

	:global(.form-actions) {
		margin-top: 1.25rem;
	}

	:global(.form-section-label) {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--mid);
		margin: 1.25rem 0 0.75rem;
	}

	/* === SHARED ALERT STYLES === */

	:global(.alert) {
		border-radius: 8px;
		padding: 0.75rem 1rem;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}
	:global(.alert.success) { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
	:global(.alert.error)   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
</style>
