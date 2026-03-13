<script lang="ts">
	// $props() is Svelte 5's way of receiving component inputs
	// On mobile you'd think of this like a view's initializer parameters
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
</style>
