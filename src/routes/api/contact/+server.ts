import { RESEND_API_KEY, RESEND_AUDIENCE_ID } from '$env/static/private';
import { Resend } from 'resend';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const resend = new Resend(RESEND_API_KEY);

export const POST: RequestHandler = async ({ request }) => {
	const { name, email, phone, message, optIn } = await request.json();

	if (!name || !email) {
		return json({ error: 'Name and email are required.' }, { status: 400 });
	}

	const { error } = await resend.emails.send({
		from: 'Anchor Lock Home Watch <noreply@anchorlockhomewatch.com>',
		to: 'developer@coastalmetrics.net',
		replyTo: email,
		subject: `New inquiry from ${name}`,
		html: `
			<h2>New Contact Form Submission</h2>
			<p><strong>Name:</strong> ${name}</p>
			<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
			${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
			${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
			<p><strong>Mailing list opt-in:</strong> ${optIn ? '✅ Yes' : '❌ No'}</p>
		`
	});

	if (error) {
		console.error('Resend error:', error);
		return json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
	}

	if (optIn) {
		const [firstName, ...rest] = name.trim().split(' ');
		await resend.contacts.create({
			audienceId: RESEND_AUDIENCE_ID,
			email,
			firstName,
			lastName: rest.join(' ') || undefined,
			unsubscribed: false
		});
	}

	return json({ success: true });
};
