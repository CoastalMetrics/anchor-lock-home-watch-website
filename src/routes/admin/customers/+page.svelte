<script lang="ts">
	import { getFunctions, httpsCallable } from 'firebase/functions';
	import { sendSignInLinkToEmail } from 'firebase/auth';
	import { collection, getDocs, orderBy, query } from 'firebase/firestore';
	import { app, auth, db } from '$lib/firebase';
	import { browser } from '$app/environment';

	const ACTION_CODE_SETTINGS = {
		url: `${browser ? window.location.origin : ''}/login`,
		handleCodeInApp: true
	};

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
	let formError = $state('');
	let formSubmitting = $state(false);
	let formSuccess = $state('');

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
		formSuccess = '';
		formSubmitting = true;

		try {
			const functions = getFunctions(app);
			const createCustomer = httpsCallable(functions, 'createCustomer');
			await createCustomer({ name: formName, email: formEmail, phone: formPhone || undefined });

			// Send welcome magic link using Firebase's built-in email
			await sendSignInLinkToEmail(auth, formEmail, ACTION_CODE_SETTINGS);

			formSuccess = `${formName} created and welcome email sent to ${formEmail}.`;
			formName = '';
			formEmail = '';
			formPhone = '';
			showForm = false;
			await loadCustomers();
		} catch (err: any) {
			formError = err.message ?? 'Something went wrong.';
		} finally {
			formSubmitting = false;
		}
	}
</script>

<div class="page">
	<div class="page-header">
		<h1>Customers</h1>
		<button class="btn-primary" onclick={() => { showForm = !showForm; formError = ''; formSuccess = ''; }}>
			{showForm ? 'Cancel' : '+ Add Customer'}
		</button>
	</div>

	{#if formSuccess}
		<div class="alert success">{formSuccess}</div>
	{/if}

	{#if showForm}
		<div class="form-card">
			<h2>New Customer</h2>
			<form onsubmit={handleCreateCustomer}>
				<div class="field">
					<label for="name">Full Name *</label>
					<input id="name" type="text" bind:value={formName} required placeholder="Jane Smith" />
				</div>
				<div class="field">
					<label for="email">Email *</label>
					<input id="email" type="email" bind:value={formEmail} required placeholder="jane@example.com" />
				</div>
				<div class="field">
					<label for="phone">Phone</label>
					<input id="phone" type="tel" bind:value={formPhone} placeholder="(239) 555-0100" />
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
	.alert.success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
	.alert.error   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

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
