<script lang="ts">
	import { getAuth, onAuthStateChanged, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, type User } from 'firebase/auth';
	import { doc, getDoc } from 'firebase/firestore';
	import { app, db } from '$lib/firebase';
	import { browser } from '$app/environment';

	const auth = getAuth(app);

	let email = $state('');
	let step = $state<'form' | 'sent' | 'completing' | 'confirm' | 'error'>('form');
	let errorMessage = $state('');
	let pendingLink = $state('');

	async function redirectAfterSignIn(user: User) {
		const adminDoc = await getDoc(doc(db, 'admins', user.email ?? ''));
		window.location.href = adminDoc.exists() ? '/admin' : '/reports';
	}

	// If already logged in, skip the form entirely
	if (browser && !isSignInWithEmailLink(auth, window.location.href)) {
		onAuthStateChanged(auth, (user) => {
			if (user) redirectAfterSignIn(user);
		});
	}

	// If this page load is the callback from the email link, complete sign-in
	if (browser && isSignInWithEmailLink(auth, window.location.href)) {
		step = 'completing';
		const savedEmail = localStorage.getItem('emailForSignIn');
		if (savedEmail) {
			signInWithEmailLink(auth, savedEmail, window.location.href)
				.then((cred) => {
					localStorage.removeItem('emailForSignIn');
					redirectAfterSignIn(cred.user);
				})
				.catch((err) => {
					step = 'error';
					errorMessage = err.message;
				});
		} else {
			// Check if email was passed as a query param (e.g. from welcome link)
			const params = new URLSearchParams(window.location.search);
			const emailFromUrl = params.get('email');
			if (emailFromUrl) {
				signInWithEmailLink(auth, emailFromUrl, window.location.href)
					.then((cred) => redirectAfterSignIn(cred.user))
					.catch((err) => { step = 'error'; errorMessage = err.message; });
			} else {
				// Different device — ask for email to complete this sign-in
				pendingLink = window.location.href;
				step = 'confirm';
			}
		}
	}

	async function confirmEmail() {
		try {
			const cred = await signInWithEmailLink(auth, email, pendingLink);
			redirectAfterSignIn(cred.user);
		} catch (err: any) {
			step = 'error';
			errorMessage = err.message;
		}
	}

	async function sendLink() {
		const actionCodeSettings = {
			url: window.location.origin + '/login',
			handleCodeInApp: true
		};
		try {
			await sendSignInLinkToEmail(auth, email, actionCodeSettings);
			localStorage.setItem('emailForSignIn', email);
			step = 'sent';
		} catch (err: any) {
			step = 'error';
			errorMessage = err.message;
		}
	}
</script>

<div class="login-page">
	<div class="login-card">
		<div class="login-logo">
			<span>⚓</span>
			<div>
				<strong>Anchor Lock</strong>
				<span>Home Watch</span>
			</div>
		</div>

		{#if step === 'form'}
			<h1>View Your Reports</h1>
			<p class="login-desc">Enter the email address associated with your account and we'll send you a secure sign-in link.</p>
			<form onsubmit={(e) => { e.preventDefault(); sendLink(); }}>
				<label>
					Email address
					<input
						type="email"
						bind:value={email}
						placeholder="you@email.com"
						required
						autofocus
					/>
				</label>
				<button type="submit" class="btn-primary">Send Sign-In Link</button>
			</form>

		{:else if step === 'sent'}
			<div class="step-sent">
				<span class="sent-icon">✉️</span>
				<h1>Check Your Email</h1>
				<p>We sent a sign-in link to <strong>{email}</strong>. Click the link in that email to access your inspection reports.</p>
				<p class="sent-note">The link expires in 1 hour. Check your spam folder if you don't see it.</p>
			</div>

		{:else if step === 'confirm'}
			<h1>Confirm Your Email</h1>
			<p class="login-desc">Enter your email address to complete sign-in.</p>
			<form onsubmit={(e) => { e.preventDefault(); confirmEmail(); }}>
				<label>
					Email address
					<input
						type="email"
						bind:value={email}
						placeholder="you@email.com"
						required
						autofocus
					/>
				</label>
				<button type="submit" class="btn-primary">Sign In</button>
			</form>

		{:else if step === 'completing'}
			<div class="step-completing">
				<p>Signing you in...</p>
			</div>

		{:else if step === 'error'}
			<div class="step-error">
				<h1>Something went wrong</h1>
				<p>{errorMessage}</p>
				<button class="btn-primary" onclick={() => (step = 'form')}>Try Again</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.login-page {
		min-height: 100vh;
		background: var(--off-white);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.5rem;
	}

	.login-card {
		background: var(--white);
		border-radius: 16px;
		border: 1px solid var(--border);
		padding: 2.5rem;
		width: 100%;
		max-width: 420px;
		box-shadow: 0 4px 24px rgba(0,0,0,0.07);
	}

	.login-logo {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 2rem;
		font-size: 1.4rem;
	}
	.login-logo div {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
		font-size: 1rem;
	}
	.login-logo strong { font-weight: 700; color: var(--navy); }
	.login-logo span:last-child { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--mid); }

	h1 {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		color: var(--dark);
		margin-bottom: 0.75rem;
	}

	.login-desc {
		color: var(--mid);
		font-size: 0.9rem;
		line-height: 1.6;
		margin-bottom: 1.75rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--dark);
	}

	input {
		font-family: var(--font-body);
		font-size: 0.95rem;
		padding: 0.65rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--dark);
		background: var(--white);
		outline: none;
		transition: border-color 0.15s;
	}
	input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(11,122,138,0.1); }

	.btn-primary {
		background: var(--gold);
		color: var(--white);
		border: none;
		border-radius: 6px;
		padding: 0.8rem 1.75rem;
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
		width: 100%;
	}
	.btn-primary:hover { background: #b47d2e; }

	.step-sent, .step-error, .step-completing {
		text-align: center;
		padding: 1rem 0;
	}
	.sent-icon { font-size: 2.5rem; display: block; margin-bottom: 1rem; }
	.step-sent p { color: var(--mid); font-size: 0.9rem; line-height: 1.6; margin-bottom: 0.75rem; }
	.sent-note { font-size: 0.8rem !important; opacity: 0.7; }
	.step-error p { color: var(--mid); margin-bottom: 1.5rem; font-size: 0.9rem; }
	.step-completing p { color: var(--mid); }
</style>
