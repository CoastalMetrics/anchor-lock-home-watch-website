<script lang="ts">
	let mobileMenuOpen = $state(false);
	let formSubmitted = $state(false);
	let formError = $state('');
	let formLoading = $state(false);
	let showAllServices = $state(false);

	let form = $state({
		name: '',
		email: '',
		phone: '',
		message: '',
		optIn: false
	});

	function scrollTo(id: string) {
		mobileMenuOpen = false;
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}

	async function submitForm(e: Event) {
		e.preventDefault();
		formLoading = true;
		formError = '';

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form)
			});

			const data = await res.json();

			if (!res.ok) {
				formError = data.error ?? 'Something went wrong. Please try again.';
			} else {
				formSubmitted = true;
			}
		} catch {
			formError = 'Network error. Please check your connection and try again.';
		} finally {
			formLoading = false;
		}
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
			desc: 'For water-front properties, we inspect the dock, lift, and boat cover — checking power at the lift, spigots, and that everything is in the same condition as originally observed.'
		}
	];
</script>

<!-- ===================== NAV ===================== -->
<header class="nav-wrapper">
	<nav class="nav container">
		<button class="logo" onclick={() => scrollTo('hero')}>
			<img src="/images/anchor-lock-logo-white-800.png" alt="Anchor Lock Home Watch" class="nav-logo" />
			<span class="logo-wordmark">
				<span class="logo-wordmark-name">Anchor Lock</span>
				<span class="logo-wordmark-sub">Home Watch</span>
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
		<p class="hero-eyebrow">Cape Coral | Fort Myers | Matlacha | Pine Island</p>
		<h1 class="hero-headline">Peace of Mind for<br />Your SWFL Home</h1>
		<p class="hero-sub">
			<strong>Locked tight. Checked twice.</strong><br />
			Local, professional home watch services for Southwest Florida homeowners. We provide
			scheduled visits, detailed reports, and reliable oversight while you're away.
		</p>
		<div class="hero-actions">
			<button class="btn-primary btn-lg" onclick={() => scrollTo('contact')}>Get a Free Consultation</button>
			<button class="btn-ghost btn-lg" onclick={() => scrollTo('services')}>See What We Do</button>
		</div>
		<div class="hero-badges">
			<span>✓ Licensed, Insured, & Bonded</span>
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
				we give your Southwest Florida property the attention it deserves.
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
	<div class="container about-container">
		<div class="about-photo-col">
			<div class="owner-photo-wrap">
				<img src="/images/rob-and-sherrie.jpeg" alt="Rob Senitza, owner of Anchor Lock Home Watch" class="owner-photo" />
				<p class="owner-caption">Rob Senitza<br /><span>Owner, Anchor Lock Home Watch</span></p>
			</div>
		</div>
		<h2 class="section-title about-title">About Anchor Lock Home Watch</h2>
		<p class="about-p">
			<b>At Anchor Lock Home Watch</b>, we understand that your home is more than an investment.
			It's peace of mind. Our approach is built on decades of experience, attention to
			detail, and a deep connection to the Southwest Florida communities we serve.
		</p>
		<p class="about-p">
			With <b>decades of experience in aerospace quality</b>, we bring a disciplined, methodical
			mindset to every home watch visit. In aerospace, details matter, and that same
			standard carries over into how we observe, document, and report on your property.
			Nothing is rushed. Nothing is overlooked.
		</p>
		<p class="about-p">
			Our hands-on experience with <b>home ownership, maintenance, remodeling, and upgrades
			dating back to the early 1990's</b> gives us practical insight into how homes really
			function, especially in Florida's demanding environment. We know how systems age,
			where problems tend to start, and what "doesn't look right" long before minor issues
			turn into major repairs.
		</p>
		<p class="about-p">
			We are proud to be <b>local</b>. Our family lives here, and this isn't just where we work.
			It's home. We've lived here through multiple hurricanes, and that firsthand experience
			shaped how seriously we take preparation, post-storm checks, and clear communication
			when it matters most. This region isn't theoretical to us. We know it street by street.
		</p>
		<p class="about-p">
			From <b>Fort Myers and Cape Coral to Pine Island</b>, we are familiar with local construction
			styles, weather patterns, flood concerns, and community expectations. That local
			knowledge allows us to provide informed, reliable home watch services tailored
			specifically to Southwest Florida homes.
		</p>
		<p class="about-p">
			At Anchor Lock Home Watch, we combine <b>professional quality standards, real-world home
			experience, and true local commitment</b> so you can leave your home knowing it's being
			watched over by someone who cares as much as you do.
		</p>
		<button class="btn-primary about-cta" onclick={() => scrollTo('contact')}>Reach Out Today</button>
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
				<p>Cape Coral · Fort Myers · Matlacha · Pine Island and surrounding Southwest Florida communities</p>

				<h3>Hours</h3>
				<p>Monday – Saturday: 8am – 6pm<br />Available by phone for emergencies 24/7</p>

				<h3>Contact</h3>
				<p>
					<a href="tel:+12399907090">239-990-7090</a><br />
					<a href="mailto:Rob@AnchorLockHomeWatch.com">Rob@AnchorLockHomeWatch.com</a>
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
								<input type="tel" bind:value={form.phone} placeholder="(239) 990-7090" />
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
						<label class="opt-in-label">
							<input type="checkbox" bind:checked={form.optIn} />
							<span>Yes, I'd like to receive occasional updates and tips from Anchor Lock Home Watch.</span>
						</label>
						{#if formError}
							<p class="form-error">{formError}</p>
						{/if}
						<button type="submit" class="btn-primary btn-lg btn-full" disabled={formLoading}>
							{formLoading ? 'Sending…' : 'Send Message'}
						</button>
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
			<img src="/images/anchor-lock-logo-white-800.png" alt="Anchor Lock Home Watch" class="footer-logo" />
			<span>
				<strong>Anchor Lock Home Watch</strong><br />
				Cape Coral · Fort Myers · Matlacha · Pine Island, FL
			</span>
		</div>
		<div class="footer-meta">
			<p class="footer-links">
				<a href="/privacy">Privacy Policy</a> ·
				<a href="/terms">Terms of Service</a>
			</p>
			<p class="footer-copy">© {new Date().getFullYear()} Anchor Lock Home Watch. All rights reserved.</p>
			<p class="footer-built">
				Built by <a href="https://coastalmetrics.net" target="_blank" rel="noopener" class="footer-coastal">Coastal Metrics, LLC</a>
			</p>
		</div>
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
	.nav-logo    { height: 44px; width: auto; display: block; }
	.footer-logo { height: 36px; width: auto; display: block; }

	.logo-wordmark {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.1rem;
		line-height: 1;
	}
	.logo-wordmark-name {
		font-family: var(--font-body);
		font-size: 1.15rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--white);
	}
	.logo-wordmark-sub {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-family: var(--font-body);
		font-size: 0.58rem;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(255,255,255,0.85);
	}
	.logo-wordmark-sub::before,
	.logo-wordmark-sub::after {
		content: '';
		flex: 1;
		height: 1px;
		background: rgba(255,255,255,0.5);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		list-style: none;
	}
	.nav-links button:not(.btn-nav) {
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
	.nav-links button:not(.btn-nav):hover { color: var(--white); }
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
		text-decoration: none;
		display: block;
		width: 100%;
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
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: -0.01em;
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
		margin: 0 auto 2rem;
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
		font-weight: 800;
		color: var(--dark);
		margin-bottom: 1rem;
		line-height: 1.15;
		letter-spacing: -0.01em;
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
		padding: 3.5rem 0;
	}
	.services-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.25rem;
		max-width: 920px;
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
		color: var(--gold);
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
		background: var(--off-white);
		padding: 5rem 0;
		position: relative;
		z-index: 1;
		border-top: 3px solid var(--gold);
	}
	.about-container { overflow: hidden; }
	.about-title { text-align: left; margin-bottom: 1.25rem; }
	.about-p { color: var(--mid); line-height: 1.75; margin-bottom: 1rem; }
	.about-p:first-of-type { font-size: 1.05rem; color: var(--dark); }
	.about-cta { margin-top: 1.5rem; display: block; width: fit-content; margin-left: auto; margin-right: auto; }

	.about-photo-col {
		float: right;
		width: 38%;
		margin: 0.25rem 0 1.5rem 2.5rem;
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
		border-radius: 0 0 16px 16px;
	}
	.owner-caption span { font-weight: 400; opacity: 0.8; font-size: 0.85rem; }

	/* === CONTACT === */
	.contact {
		background: var(--white);
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

	.opt-in-label {
		flex-direction: row;
		align-items: flex-start;
		gap: 0.6rem;
		font-size: 0.82rem;
		font-weight: 400;
		color: var(--mid);
		cursor: pointer;
	}
	.opt-in-label input[type="checkbox"] {
		margin-top: 2px;
		flex-shrink: 0;
		accent-color: var(--teal);
		width: 15px;
		height: 15px;
	}

	.form-error {
		color: #c0392b;
		font-size: 0.875rem;
		background: #fdf0ef;
		border: 1px solid #f5c6c3;
		border-radius: 6px;
		padding: 0.65rem 0.9rem;
	}

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
	.footer-meta { text-align: right; }
	.footer-links { font-size: 0.85rem; margin-bottom: 0.25rem; }
	.footer-links a { color: rgba(255,255,255,0.85); text-decoration: none; }
	.footer-links a:hover { color: var(--white); text-decoration: underline; }
	.footer-copy { font-size: 0.8rem; }
	.footer-built { font-size: 0.8rem; color: rgba(255,255,255,0.55); margin-top: 0.4rem; }
	.footer-coastal { color: var(--gold-light); font-weight: 600; transition: color 0.2s; }
	.footer-coastal:hover { color: var(--white); }

	/* === RESPONSIVE === */
	@media (max-width: 768px) {
		.nav-links  { display: none; }
		.hamburger  { display: block; }

		.hero         { padding: 4rem 0 4rem; }
		.hero-content { max-width: 100%; }

		.photo-strip  { height: 180px; }

		.about-photo-col { float: none; width: 100%; margin: 0 0 1.5rem 0; }
		.contact-inner { grid-template-columns: 1fr; gap: 2rem; }
		.form-row      { grid-template-columns: 1fr; }

		.footer-inner  { flex-direction: column; text-align: center; }
		.footer-meta   { text-align: center; }
	}

	@media (max-width: 480px) {
		.hero-actions { flex-direction: column; }
		.hero-actions button { width: 100%; text-align: center; }
		.photo-strip { grid-template-columns: 1fr; height: auto; }
		.photo-strip img { height: 200px; }
	}
</style>
