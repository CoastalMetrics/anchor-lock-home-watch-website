<script lang="ts">
	let mobileMenuOpen = $state(false);
	let formSubmitted = $state(false);
	let showAllServices = $state(false);

	let form = $state({
		name: '',
		email: '',
		phone: '',
		message: ''
	});

	function scrollTo(id: string) {
		mobileMenuOpen = false;
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}

	function submitForm(e: Event) {
		e.preventDefault();
		// TODO: Wire this to a real form handler.
		formSubmitted = true;
	}

	const services = [
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>`,
			title: 'Interior & Exterior Inspections',
			desc: 'Thorough walkthroughs checking for water intrusion, HVAC issues, pest activity, and anything that looks off — inside and out.'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`,
			title: 'Storm Prep & Response',
			desc: 'Pre-storm preparation and post-storm damage assessment. We act fast when it matters most — before hurricane season and after every major storm.'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>`,
			title: 'Key Holding & Vendor Access',
			desc: 'We hold your keys and meet contractors, plumbers, or delivery services on your behalf so you never have to fly back for a repair.'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>`,
			title: 'Scheduled Check-Ins',
			desc: 'Weekly or bi-weekly visits with a detailed written and photo report delivered straight to your inbox — so you always know what\'s going on.'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>`,
			title: 'Mail & Package Collection',
			desc: 'We collect your mail and secure any packages so nothing sits out front signaling an empty home to the wrong people.'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>`,
			title: 'Photo Documentation',
			desc: 'Every visit is documented with timestamped photos. You get a complete visual record of your property\'s condition over time.'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>`,
			title: 'Pool & Lanai',
			desc: 'We check pool and spa equipment, water clarity, lanai screens, and gates — making sure everything is clean, functioning, and secured between services.'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>`,
			title: 'Boat, Dock & Lift',
			desc: 'For canal-front properties, we inspect the dock, lift, and boat cover — checking power at the lift, spigots, and that everything is in the same condition as originally observed.'
		}
	];
</script>

<!-- ===================== NAV ===================== -->
<header class="nav-wrapper">
	<nav class="nav container">
		<button class="logo" onclick={() => scrollTo('hero')}>
			<span class="logo-anchor">⚓</span>
			<span class="logo-text">
				<span class="logo-name">Anchor Lock</span>
				<span class="logo-sub">Home Watch</span>
			</span>
		</button>

		<!-- Desktop nav links -->
		<ul class="nav-links">
			<li><button onclick={() => scrollTo('services')}>Services</button></li>
			<li><button onclick={() => scrollTo('about')}>About</button></li>
			<li><button class="btn-primary" onclick={() => scrollTo('contact')}>Contact Us</button></li>
		</ul>

		<!-- Mobile hamburger — only visible on small screens -->
		<button
			class="hamburger"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-label="Toggle menu"
		>
			<!-- Svelte conditionals use {#if} — like an if/else in JSX or a ViewBuilder ternary -->
			{#if mobileMenuOpen}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
			{/if}
		</button>
	</nav>

	<!-- Mobile dropdown -->
	{#if mobileMenuOpen}
		<div class="mobile-menu">
			<button onclick={() => scrollTo('services')}>Services</button>
			<button onclick={() => scrollTo('about')}>About</button>
			<button class="btn-primary" onclick={() => scrollTo('contact')}>Contact Us</button>
		</div>
	{/if}
</header>

<!-- ===================== HERO ===================== -->
<section id="hero" class="hero">
	<div class="hero-bg"></div>
	<img src="/images/home-exterior.jpeg" alt="" class="hero-photo" aria-hidden="true" />
	<div class="container hero-content">
		<p class="hero-eyebrow">Punta Gorda | Cape Coral | Fort Myers | Estero </p>
		<h1 class="hero-headline">SWFL's Most Advanced <br />Home Watch Services</h1>
		<p class="hero-sub">
			Professional home watch services for Southwest Florida homeowners.<br />
			We keep a trusted eye on your property — so you don't have to worry. Locked once, checked twice!
		</p>
		<div class="hero-actions">
			<button class="btn-primary btn-lg" onclick={() => scrollTo('contact')}>Get a Free Consultation</button>
			<button class="btn-ghost btn-lg" onclick={() => scrollTo('services')}>See What We Do</button>
		</div>
		<div class="hero-badges">
			<span>✓ Licensed & Insured</span>
			<span>✓ Detailed Visit Reports</span>
			<span>✓ Locally Owned</span>
		</div>
	</div>
	<div class="hero-wave">
		<svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F8F7F4"/>
		</svg>
	</div>
</section>

<!-- ===================== SERVICES ===================== -->
<section id="services" class="services">
	<div class="container">
		<div class="section-header">
			<p class="section-eyebrow">What We Offer</p>
			<h2 class="section-title">Complete Home Watch Services</h2>
			<p class="section-desc">
				Whether you're a snowbird heading north for the summer or a homeowner who travels frequently,
				we give your Cape Coral or Fort Myers property the attention it deserves.
			</p>
		</div>

		<div class="services-grid">
			{#each services.slice(0, 4) as service (service.title)}
				<div class="service-card">
					<div class="service-icon">{@html service.icon}</div>
					<h3>{service.title}</h3>
					<p>{service.desc}</p>
				</div>
			{/each}
		</div>

		{#if showAllServices}
			<div class="services-extra">
				{#each services.slice(4) as service (service.title)}
					<div class="extra-item">
						<div class="extra-icon">{@html service.icon}</div>
						<div>
							<strong>{service.title}</strong>
							<p>{service.desc}</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<div class="services-more">
			<button class="btn-outline" onclick={() => (showAllServices = !showAllServices)}>
				{showAllServices ? 'Show Less ↑' : 'View More Services ↓'}
			</button>
		</div>
	</div>
</section>

<!-- ===================== PHOTO STRIP ===================== -->
<div class="photo-strip">
	<img src="/images/pool-lanai.jpeg" alt="Pool and spa under lanai screen enclosure" />
	<img src="/images/backyard-pool.jpeg" alt="Florida backyard with pool enclosure" />
	<img src="/images/hurricane-shutters-1.jpeg" alt="Hurricane shutters installed on home" />
</div>

<!-- ===================== ABOUT / TRUST ===================== -->
<section id="about" class="about">
	<div class="container about-inner">
		<div class="about-text">
			<p class="section-eyebrow">Why Anchor Lock</p>
			<h2 class="section-title">Local, Trusted, Thorough</h2>
			<p>
				We live and work right here in Southwest Florida. We know the weather patterns, the risks
				of the rainy season, and exactly what to look for in the homes on these canals.
			</p>
			<p>
				Every visit gets a written report with photos — no "looks fine" over the phone. You get
				documentation you can actually use if you ever need to file an insurance claim.
			</p>
			<p>
				We're fully licensed and insured, and we treat every property like it's our own. No rushing
				through checklists — just honest, reliable work you can count on.
			</p>
			<button class="btn-primary" onclick={() => scrollTo('contact')}>Reach Out Today</button>

			<div class="about-stats">
				<div class="stat">
					<span class="stat-number">100%</span>
					<span class="stat-label">Photo-documented visits with detailed thorough reports</span>
				</div>
				<div class="stat">
					<span class="stat-number">Southwest Florida</span>
					<span class="stat-label">Locally Owned & Operated</span>
				</div>
				<div class="stat">
					<span class="stat-number">24/7</span>
					<span class="stat-label">Emergency services and hurricane preparedness</span>
				</div>
				<div class="stat">
					<span class="stat-number">⚓ Anchor Lock Home Watch</span>
					<span class="stat-label">Licensed, insured, and bonded</span>
				</div>
			</div>
		</div>
		<div class="about-photo-col">
			<div class="owner-photo-wrap">
				<img src="/images/rob-and-sherrie.jpg" alt="Rob and Sherrie Senitza, owners of Anchor Lock Home Watch" class="owner-photo" />
				<p class="owner-caption">Rob & Sherrie Senitza<br /><span>Owners, Anchor Lock Home Watch</span></p>
			</div>
		</div>
	</div>
</section>

<!-- ===================== CONTACT ===================== -->
<section id="contact" class="contact">
	<div class="container">
		<div class="section-header">
			<p class="section-eyebrow">Get In Touch</p>
			<h2 class="section-title">Let's Talk About Your Property</h2>
			<p class="section-desc">
				Free consultations — no pressure. Tell us about your home and we'll put together a plan that fits.
			</p>
		</div>

		<div class="contact-inner">
			<div class="contact-info">
				<h3>Serving</h3>
				<p>Cape Coral · Fort Myers · Estero · Bonita Springs and surrounding Southwest Florida communities</p>

				<h3>Hours</h3>
				<p>Monday – Saturday: 8am – 6pm<br />Available by phone for emergencies 24/7</p>

				<h3>Contact</h3>
				<p>
					<a href="tel:+12395550000">(239) 555-0000</a><br />
					<a href="mailto:info@anchorlockwatch.com">info@anchorlockwatch.com</a>
				</p>
			</div>

			<div class="contact-form-wrap">
				<!-- {#if formSubmitted} shows a thank-you state instead of the form -->
				{#if formSubmitted}
					<div class="form-success">
						<span class="success-icon">✓</span>
						<h3>Message Sent!</h3>
						<p>Thanks for reaching out. We'll be in touch within one business day.</p>
					</div>
				{:else}
					<!-- bind:value is two-way data binding — like TextField binding in SwiftUI -->
					<form class="contact-form" onsubmit={submitForm}>
						<div class="form-row">
							<label>
								Name *
								<input type="text" bind:value={form.name} placeholder="John Smith" required />
							</label>
							<label>
								Phone
								<input type="tel" bind:value={form.phone} placeholder="(239) 555-0000" />
							</label>
						</div>
						<label>
							Email *
							<input type="email" bind:value={form.email} placeholder="john@email.com" required />
						</label>
						<label>
							Tell us about your property
							<textarea bind:value={form.message} rows="4" placeholder="Address, how often you need visits, any specific concerns..."></textarea>
						</label>
						<button type="submit" class="btn-primary btn-lg btn-full">Send Message</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- ===================== FOOTER ===================== -->
<footer class="footer">
	<div class="container footer-inner">
		<div class="footer-brand">
			<span class="logo-anchor">⚓</span>
			<span>
				<strong>Anchor Lock Home Watch</strong><br />
				Cape Coral & Fort Myers, FL
			</span>
		</div>
		<p class="footer-copy">© {new Date().getFullYear()} Anchor Lock Home Watch. All rights reserved.</p>
	</div>
</footer>

<style>
	/* === LAYOUT UTILITY === */
	.container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	/* === BUTTONS === */
	.btn-primary {
		background: var(--gold);
		color: var(--white);
		border: none;
		border-radius: 6px;
		padding: 0.75rem 1.75rem;
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s, transform 0.1s;
	}
	.btn-primary:hover { background: #b47d2e; }
	.btn-primary:active { transform: scale(0.98); }

	.btn-ghost {
		background: transparent;
		color: var(--white);
		border: 2px solid rgba(255,255,255,0.6);
		border-radius: 6px;
		padding: 0.75rem 1.75rem;
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s;
	}
	.btn-ghost:hover { border-color: var(--white); background: rgba(255,255,255,0.1); }

	.btn-lg { padding: 0.9rem 2.25rem; font-size: 1rem; }
	.btn-full { width: 100%; }

	/* === NAV === */
	.nav-wrapper {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--navy);
		box-shadow: 0 2px 12px rgba(0,0,0,0.15);
	}
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		color: var(--white);
	}
	.logo-anchor { font-size: 1.4rem; }
	.logo-text { display: flex; flex-direction: column; line-height: 1.2; }
	.logo-name { font-weight: 700; font-size: 1rem; letter-spacing: 0.01em; }
	.logo-sub  { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.75; }

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		list-style: none;
	}
	.nav-links button {
		background: none;
		border: none;
		color: rgba(255,255,255,0.85);
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 500;
		cursor: pointer;
		padding: 0.5rem 0.75rem;
		border-radius: 4px;
		transition: color 0.15s;
	}
	.nav-links button:hover { color: var(--white); }
	.nav-links .btn-primary { color: var(--white); padding: 0.5rem 1.25rem; }

	.hamburger {
		display: none;
		background: none;
		border: none;
		color: var(--white);
		cursor: pointer;
		padding: 4px;
	}

	.mobile-menu {
		display: flex;
		flex-direction: column;
		background: var(--navy-dark);
		padding: 0.75rem 1.5rem 1.25rem;
		gap: 0.25rem;
	}
	.mobile-menu button {
		background: none;
		border: none;
		color: rgba(255,255,255,0.9);
		font-family: var(--font-body);
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		padding: 0.6rem 0;
		text-align: left;
		border-bottom: 1px solid rgba(255,255,255,0.08);
	}
	.mobile-menu .btn-primary {
		margin-top: 0.5rem;
		text-align: center;
		border-bottom: none;
	}

	/* === HERO === */
	.hero {
		position: relative;
		background: linear-gradient(155deg, var(--navy-dark) 0%, var(--navy) 50%, var(--teal) 100%);
		padding: 6rem 0 5rem;
		overflow: hidden;
	}
	.hero-photo {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		opacity: 0.18;
		pointer-events: none;
	}
	.hero-bg {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(ellipse at 70% 50%, rgba(11,122,138,0.3) 0%, transparent 60%);
		pointer-events: none;
	}
	.hero-content {
		position: relative;
		z-index: 1;
		color: var(--white);
		max-width: 680px;
	}
	.hero-eyebrow {
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--gold-light);
		margin-bottom: 1rem;
	}
	.hero-headline {
		font-family: var(--font-heading);
		font-size: clamp(2.2rem, 5vw, 3.5rem);
		line-height: 1.15;
		margin-bottom: 1.25rem;
	}
	.hero-sub {
		font-size: 1.1rem;
		line-height: 1.7;
		color: rgba(255,255,255,0.85);
		margin-bottom: 2rem;
	}
	.hero-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 2rem;
	}
	.hero-badges {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		font-size: 0.85rem;
		color: rgba(255,255,255,0.7);
	}
	.hero-badges span { display: flex; align-items: center; gap: 0.4rem; }
	.hero-wave {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 80px;
		pointer-events: none;
	}
	.hero-wave svg { width: 100%; height: 100%; }

	/* === SECTION SHARED === */
	.section-header {
		text-align: center;
		max-width: 620px;
		margin: 0 auto 3.5rem;
	}
	.section-eyebrow {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--teal);
		margin-bottom: 0.5rem;
	}
	.section-title {
		font-family: var(--font-heading);
		font-size: clamp(1.6rem, 3vw, 2.25rem);
		color: var(--dark);
		margin-bottom: 1rem;
		line-height: 1.2;
	}
	.section-desc {
		color: var(--mid);
		font-size: 1rem;
		line-height: 1.7;
	}

	.btn-outline {
		background: transparent;
		color: var(--teal);
		border: 2px solid var(--teal);
		border-radius: 6px;
		padding: 0.75rem 1.75rem;
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
	}
	.btn-outline:hover { background: var(--teal); color: var(--white); }

	.services-more {
		text-align: center;
		margin-top: 2.5rem;
	}

	.services-extra {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
	}
	.extra-item {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}
	.extra-icon {
		width: 32px;
		height: 32px;
		flex-shrink: 0;
		color: var(--teal);
	}
	.extra-icon :global(svg) { width: 100%; height: 100%; }
	.extra-item strong { font-size: 0.95rem; color: var(--dark); display: block; margin-bottom: 0.2rem; }
	.extra-item p { color: var(--mid); font-size: 0.875rem; line-height: 1.6; margin: 0; }

	/* === SERVICES === */
	.services {
		background: var(--off-white);
		padding: 5rem 0;
	}
	.services-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		max-width: 760px;
		margin: 0 auto;
	}

	@media (max-width: 600px) {
		.services-grid { grid-template-columns: 1fr; }
	}
	.service-card {
		background: var(--white);
		border-radius: 12px;
		padding: 1.75rem;
		border: 1px solid var(--border);
		transition: box-shadow 0.2s, transform 0.2s;
	}
	.service-card:hover {
		box-shadow: 0 8px 24px rgba(0,0,0,0.08);
		transform: translateY(-2px);
	}
	.service-icon {
		width: 40px;
		height: 40px;
		color: var(--teal);
		margin-bottom: 1rem;
	}
	.service-icon :global(svg) { width: 100%; height: 100%; }
	.service-card h3 {
		font-size: 1rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--dark);
	}
	.service-card p { color: var(--mid); font-size: 0.9rem; line-height: 1.65; }

	/* === PHOTO STRIP === */
	.photo-strip {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		height: 280px;
		overflow: hidden;
		position: relative;
		z-index: 0;
	}
	.photo-strip img {
		width: 100%;
		height: 280px;
		object-fit: cover;
		display: block;
	}

	/* === ABOUT === */
	.about {
		background: var(--white);
		padding: 5rem 0;
		position: relative;
		z-index: 1;
	}
	.about-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: start;
	}
	.about-text .section-eyebrow { text-align: left; }
	.about-text .section-title   { text-align: left; margin-bottom: 1.25rem; }
	.about-text p { color: var(--mid); line-height: 1.75; margin-bottom: 1rem; }
	.about-text .btn-primary { margin-top: 0.5rem; margin-bottom: 2rem; }

	.about-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 1.5rem;
	}
	.stat {
		background: var(--off-white);
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		border: 1px solid var(--border);
	}
	.stat-number {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--navy);
		line-height: 1;
	}
	.stat-label { font-size: 0.75rem; color: var(--mid); font-weight: 500; }

	.about-photo-col {
		display: flex;
		align-items: flex-start;
	}
	.owner-photo-wrap {
		width: 100%;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 12px 40px rgba(0,0,0,0.15);
	}
	.owner-photo {
		width: 100%;
		aspect-ratio: 4/5;
		object-fit: cover;
		object-position: center top;
		display: block;
	}
	.owner-caption {
		background: var(--navy);
		color: var(--white);
		text-align: center;
		padding: 1rem;
		font-weight: 600;
		font-size: 0.95rem;
		margin: 0;
	}
	.owner-caption span { font-weight: 400; opacity: 0.8; font-size: 0.85rem; }

	/* === CONTACT === */
	.contact {
		background: var(--off-white);
		padding: 5rem 0;
	}
	.contact-inner {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 3rem;
		align-items: start;
	}
	.contact-info h3 {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--teal);
		margin-bottom: 0.4rem;
		margin-top: 1.5rem;
	}
	.contact-info h3:first-child { margin-top: 0; }
	.contact-info p { color: var(--mid); font-size: 0.9rem; line-height: 1.65; }
	.contact-info a { color: var(--navy); font-weight: 500; }
	.contact-info a:hover { text-decoration: underline; }

	.contact-form-wrap {
		background: var(--white);
		border-radius: 12px;
		padding: 2rem;
		border: 1px solid var(--border);
	}
	.contact-form { display: flex; flex-direction: column; gap: 1.1rem; }
	.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

	label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--dark);
	}
	input, textarea {
		font-family: var(--font-body);
		font-size: 0.95rem;
		padding: 0.65rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--dark);
		background: var(--white);
		transition: border-color 0.15s;
		outline: none;
	}
	input:focus, textarea:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(11,122,138,0.1); }
	textarea { resize: vertical; }

	.form-success {
		text-align: center;
		padding: 3rem 1rem;
	}
	.success-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		background: var(--teal);
		color: white;
		border-radius: 50%;
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}
	.form-success h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
	.form-success p  { color: var(--mid); }

	/* === FOOTER === */
	.footer {
		background: var(--navy-dark);
		color: rgba(255,255,255,0.7);
		padding: 2rem 0;
	}
	.footer-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.footer-brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--white);
		font-size: 0.9rem;
		line-height: 1.4;
	}
	.footer-brand .logo-anchor { font-size: 1.4rem; }
	.footer-copy { font-size: 0.8rem; }

	/* === RESPONSIVE === */
	@media (max-width: 768px) {
		.nav-links  { display: none; }
		.hamburger  { display: block; }

		.hero         { padding: 4rem 0 4rem; }
		.hero-content { max-width: 100%; }

		.photo-strip  { height: 180px; }

		.about-inner   { grid-template-columns: 1fr; gap: 2.5rem; }
		.about-photo-col { position: static; }
		.contact-inner { grid-template-columns: 1fr; gap: 2rem; }
		.form-row      { grid-template-columns: 1fr; }

		.footer-inner  { flex-direction: column; text-align: center; }
	}

	@media (max-width: 480px) {
		.hero-actions { flex-direction: column; }
		.hero-actions button { width: 100%; text-align: center; }
		.about-stats { grid-template-columns: 1fr 1fr; }
		.photo-strip { grid-template-columns: 1fr; height: auto; }
		.photo-strip img { height: 200px; }
	}
</style>
