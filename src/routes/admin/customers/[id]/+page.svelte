<script lang="ts">
	import { page } from '$app/state';
	import { doc, getDoc, collection, getDocs, orderBy, query, addDoc, serverTimestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { browser } from '$app/environment';

	const uid = page.params.id!;

	type Customer = {
		name: string;
		email: string;
		phone: string | null;
		createdAt: Date | null;
	};

	type Property = {
		id: string;
		street: string;
		city: string;
		state: string;
		zip: string;
		nickname: string | null;
		createdAt: Date | null;
	};

	function fullAddress(p: Property) {
		return `${p.street}, ${p.city}, ${p.state} ${p.zip}`;
	}

	function mapsUrl(p: Property) {
		return `https://maps.google.com/?q=${encodeURIComponent(fullAddress(p))}`;
	}

	let customer = $state<Customer | null>(null);
	let properties = $state<Property[]>([]);
	let loading = $state(true);
	let notFound = $state(false);

	// Add property form
	let showForm = $state(false);
	let formStreet = $state('');
	let formCity = $state('');
	let formState = $state('FL');
	let formZip = $state('');
	let formNickname = $state('');
	let formError = $state('');
	let formSubmitting = $state(false);

	async function loadData() {
		loading = true;
		const customerSnap = await getDoc(doc(db, 'users', uid));
		if (!customerSnap.exists()) {
			notFound = true;
			loading = false;
			return;
		}
		const d = customerSnap.data();
		customer = {
			name: d.name,
			email: d.email,
			phone: d.phone ?? null,
			createdAt: d.createdAt?.toDate() ?? null
		};

		const propSnap = await getDocs(
			query(collection(db, 'users', uid, 'properties'), orderBy('createdAt', 'asc'))
		);
		properties = propSnap.docs.map((p) => ({
			id: p.id,
			street: p.data().street,
			city: p.data().city,
			state: p.data().state,
			zip: p.data().zip,
			nickname: p.data().nickname ?? null,
			createdAt: p.data().createdAt?.toDate() ?? null
		}));

		loading = false;
	}

	if (browser) {
		loadData();
	}

	async function handleAddProperty(e: SubmitEvent) {
		e.preventDefault();
		formError = '';
		formSubmitting = true;
		try {
			await addDoc(collection(db, 'users', uid, 'properties'), {
				street: formStreet,
				city: formCity,
				state: formState,
				zip: formZip,
				nickname: formNickname || null,
				createdAt: serverTimestamp()
			});
			formStreet = '';
			formCity = '';
			formState = 'FL';
			formZip = '';
			formNickname = '';
			showForm = false;
			await loadData();
		} catch (err: any) {
			formError = err.message ?? 'Something went wrong.';
		} finally {
			formSubmitting = false;
		}
	}
</script>

{#if loading}
	<p class="loading">Loading…</p>

{:else if notFound}
	<p class="loading">Customer not found. <a href="/admin/customers">Back to customers</a></p>

{:else if customer}
	<div class="page">

		<div class="page-header">
			<div>
				<a href="/admin/customers" class="back">← Customers</a>
				<h1>{customer.name}</h1>
			</div>
		</div>

		<div class="customer-meta">
			<span>{customer.email}</span>
			{#if customer.phone}<span>{customer.phone}</span>{/if}
			{#if customer.createdAt}<span>Added {customer.createdAt.toLocaleDateString()}</span>{/if}
		</div>

		<div class="section-header">
			<h2>Properties</h2>
			<button class="btn-action" onclick={() => { showForm = !showForm; formError = ''; }}>
				{showForm ? 'Cancel' : '+ Add Property'}
			</button>
		</div>

		{#if showForm}
			<div class="form-card">
				<form onsubmit={handleAddProperty}>
					<div class="field">
						<label for="street">Street Address *</label>
						<input id="street" type="text" bind:value={formStreet} required
							placeholder="1234 Coral Way" />
					</div>
					<div class="field-row">
						<div class="field">
							<label for="city">City *</label>
							<input id="city" type="text" bind:value={formCity} required
								placeholder="Cape Coral" />
						</div>
						<div class="field field--state">
							<label for="state">State *</label>
							<input id="state" type="text" bind:value={formState} required maxlength="2" />
						</div>
						<div class="field">
							<label for="zip">Zip *</label>
							<input id="zip" type="text" bind:value={formZip} required
								placeholder="33904" maxlength="5" />
						</div>
					</div>
					<div class="field">
						<label for="nickname">Nickname <span class="optional">(optional)</span></label>
						<input id="nickname" type="text" bind:value={formNickname}
							placeholder="e.g. Beach House, Main Home" />
					</div>
					{#if formError}
						<div class="alert error">{formError}</div>
					{/if}
					<div class="form-actions">
						<button type="submit" class="btn-action" disabled={formSubmitting}>
							{formSubmitting ? 'Adding…' : 'Add Property'}
						</button>
					</div>
				</form>
			</div>
		{/if}

		{#if properties.length === 0}
			<p class="empty">No properties yet. Add one above.</p>
		{:else}
			<div class="properties">
				{#each properties as p}
					<div class="property-card-wrap">
						<a href="/admin/customers/{uid}/properties/{p.id}" class="property-card">
							<div class="property-main">
								<strong>{p.nickname ?? fullAddress(p)}</strong>
								<span class="property-address">{fullAddress(p)}</span>
							</div>
							<span class="property-arrow">→</span>
						</a>
						<a href={mapsUrl(p)} target="_blank" rel="noopener noreferrer" class="map-link">
							Map ↗
						</a>
					</div>
				{/each}
			</div>
		{/if}

	</div>
{/if}

<style>
	.loading {
		color: var(--mid);
		font-size: 0.95rem;
		padding: 2rem 0;
	}
	.loading a { color: var(--navy); }

	.page { max-width: 720px; }

	.page-header { margin-bottom: 0.5rem; }

	.back {
		font-size: 0.85rem;
		color: var(--mid);
		text-decoration: none;
		display: inline-block;
		margin-bottom: 0.5rem;
		transition: color 0.15s;
	}
	.back:hover { color: var(--navy); }

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
		margin: 0;
	}

	.customer-meta {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		font-size: 0.875rem;
		color: var(--mid);
		margin-bottom: 2.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border);
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}


	.form-card {
		background: var(--white);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	/* .field-row overrides the global 1fr 1fr default for address layout */
	.field-row {
		grid-template-columns: 1fr 64px 1fr;
		gap: 0.75rem;
	}

	.empty { color: var(--mid); font-size: 0.95rem; }

	.properties {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.property-card-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.map-link {
		font-size: 0.8rem;
		color: var(--teal);
		text-decoration: none;
		white-space: nowrap;
		flex-shrink: 0;
	}
	.map-link:hover { text-decoration: underline; }

	.property-card {
		flex: 1;
		background: var(--white);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		text-decoration: none;
		transition: box-shadow 0.15s, border-color 0.15s;
	}
	.property-card:hover {
		box-shadow: 0 2px 12px rgba(0,0,0,0.07);
		border-color: var(--navy);
	}

	.property-main {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.property-main strong { font-size: 0.95rem; color: var(--dark); }

	.property-address {
		font-size: 0.8rem;
		color: var(--mid);
	}
	.property-arrow { color: var(--mid); font-size: 1rem; }
</style>
