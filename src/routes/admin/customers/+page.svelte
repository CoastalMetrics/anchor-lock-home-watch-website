<script lang="ts">
	import { getFunctions, httpsCallable } from 'firebase/functions';
	import { sendSignInLinkToEmail } from 'firebase/auth';
	import { collection, getDocs, orderBy, query } from 'firebase/firestore';
	import { app, auth, db } from '$lib/firebase';
	import { browser } from '$app/environment';

	function getActionCodeSettings(email: string) {
		const base = browser ? window.location.origin : '';
		return {
			url: `${base}/login?email=${encodeURIComponent(email)}`,
			handleCodeInApp: true
		};
	}

	type Customer = {
		uid: string;
		name: string;
		email: string;
		phone: string | null;
		createdAt: Date | null;
	};

	let customers = $state<Customer[]>([]);
	let loading = $state(true);
	let showForm = $state(false);

	// Form fields
	let formName = $state('');
	let formEmail = $state('');
	let formPhone = $state('');
	let formStreet = $state('');
	let formCity = $state('');
	let formState = $state('FL');
	let formZip = $state('');
	let formNickname = $state('');
	let formError = $state('');
	let formSubmitting = $state(false);

	async function loadCustomers() {
		loading = true;
		const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
		customers = snap.docs.map((d) => {
			const data = d.data();
			return {
				uid: d.id,
				name: data.name,
				email: data.email,
				phone: data.phone ?? null,
				createdAt: data.createdAt?.toDate() ?? null
			};
		});
		loading = false;
	}

	if (browser) {
		loadCustomers();
	}

	async function handleCreateCustomer(e: SubmitEvent) {
		e.preventDefault();
		formError = '';
		formSubmitting = true;

		try {
			const functions = getFunctions(app);
			const createCustomer = httpsCallable(functions, 'createCustomer');
			const result = await createCustomer({
				name: formName,
				email: formEmail,
				phone: formPhone || undefined,
				firstProperty: formStreet
					? { street: formStreet, city: formCity, state: formState, zip: formZip, nickname: formNickname || undefined }
					: undefined
			});

			// Send welcome magic link using Firebase's built-in email
			await sendSignInLinkToEmail(auth, formEmail, getActionCodeSettings(formEmail));

			const { uid } = result.data as { uid: string };
			window.location.href = `/admin/customers/${uid}`;
		} catch (err: any) {
			formError = err.message ?? 'Something went wrong.';
			formSubmitting = false;
		}
	}
</script>

<div class="page">
	<div class="page-header">
		<h1>Customers</h1>
		<button class="btn-primary" onclick={() => { showForm = !showForm; formError = ''; }}>
			{showForm ? 'Cancel' : '+ Add Customer'}
		</button>
	</div>

	{#if showForm}
		<div class="form-card">
			<h2>New Customer</h2>
			<form onsubmit={handleCreateCustomer}>
				<div class="form-section-label">Customer</div>
				<div class="field-row">
					<div class="field">
						<label for="name">Full Name *</label>
						<input id="name" type="text" bind:value={formName} required placeholder="Jane Smith" />
					</div>
					<div class="field">
						<label for="phone">Phone</label>
						<input id="phone" type="tel" bind:value={formPhone} placeholder="(239) 555-0100" />
					</div>
				</div>
				<div class="field">
					<label for="email">Email *</label>
					<input id="email" type="email" bind:value={formEmail} required placeholder="jane@example.com" />
				</div>

				<div class="form-section-label">First Property</div>
				<div class="field">
					<label for="street">Street Address</label>
					<input id="street" type="text" bind:value={formStreet} placeholder="1234 Coral Way" />
				</div>
				<div class="field-row field-row--address">
					<div class="field">
						<label for="city">City</label>
						<input id="city" type="text" bind:value={formCity} placeholder="Cape Coral" />
					</div>
					<div class="field field--state">
						<label for="state">State</label>
						<input id="state" type="text" bind:value={formState} maxlength="2" />
					</div>
					<div class="field">
						<label for="zip">Zip</label>
						<input id="zip" type="text" bind:value={formZip} placeholder="33904" maxlength="5" />
					</div>
				</div>
				<div class="field">
					<label for="nickname">Nickname <span class="optional">(optional)</span></label>
					<input id="nickname" type="text" bind:value={formNickname} placeholder="e.g. Beach House, Main Home" />
				</div>

				{#if formError}
					<div class="alert error">{formError}</div>
				{/if}
				<div class="form-actions">
					<button type="submit" class="btn-primary" disabled={formSubmitting}>
						{formSubmitting ? 'Creating…' : 'Create Customer & Send Welcome Email'}
					</button>
				</div>
			</form>
		</div>
	{/if}

	{#if loading}
		<p class="empty">Loading…</p>
	{:else if customers.length === 0}
		<p class="empty">No customers yet. Add one above.</p>
	{:else}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Phone</th>
						<th>Added</th>
					</tr>
				</thead>
				<tbody>
					{#each customers as c}
						<tr>
							<td><a href="/admin/customers/{c.uid}">{c.name}</a></td>
							<td>{c.email}</td>
							<td>{c.phone ?? '—'}</td>
							<td>{c.createdAt ? c.createdAt.toLocaleDateString() : '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 860px;
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	h1 {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		color: var(--dark);
		margin: 0;
	}

	h2 {
		font-family: var(--font-heading);
		font-size: 1.2rem;
		color: var(--dark);
		margin: 0 0 1.25rem;
	}

	.btn-primary {
		background: var(--navy);
		color: var(--white);
		border: none;
		border-radius: 8px;
		padding: 0.6rem 1.2rem;
		font-family: var(--font-body);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.btn-primary:hover:not(:disabled) { background: var(--navy-dark); }
	.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

	.form-card {
		background: var(--white);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.75rem;
		margin-bottom: 2rem;
	}

	.form-section-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--mid);
		margin: 1.25rem 0 0.75rem;
	}
	.form-section-label:first-of-type { margin-top: 0; }

	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.field-row--address {
		grid-template-columns: 1fr 64px 1fr;
		gap: 0.75rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		margin-bottom: 1rem;
	}

	label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--dark);
	}

	.optional {
		font-weight: 400;
		color: var(--mid);
	}

	input {
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0.6rem 0.75rem;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--dark);
		outline: none;
		transition: border-color 0.15s;
	}
	input:focus { border-color: var(--navy); }

	.form-actions {
		margin-top: 1.25rem;
	}

	.alert {
		border-radius: 8px;
		padding: 0.75rem 1rem;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}
	.alert.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

	.empty {
		color: var(--mid);
		font-size: 0.95rem;
		margin-top: 1rem;
	}

	.table-wrap {
		background: var(--white);
		border: 1px solid var(--border);
		border-radius: 12px;
		overflow: hidden;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	thead {
		background: var(--off-white);
		border-bottom: 1px solid var(--border);
	}

	th {
		text-align: left;
		padding: 0.75rem 1.25rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--mid);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	td {
		padding: 0.85rem 1.25rem;
		color: var(--dark);
		border-bottom: 1px solid var(--border);
	}
	tr:last-child td { border-bottom: none; }

	td a {
		color: var(--navy);
		text-decoration: none;
		font-weight: 600;
	}
	td a:hover { text-decoration: underline; }
</style>
