export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, message } = req.body ?? {}
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const response = await fetch('https://send.api.mailtrap.io/api/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MAILTRAP_TOKEN}`,
    },
    body: JSON.stringify({
      from:    { email: 'portfolio@demomailtrap.co', name: 'Portfolio Contact' },
      to:      [{ email: 'davidxanderwagan@gmail.com' }],
      subject: `[Portfolio] Message from ${name}`,
      text:    `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html:    `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
    }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    return res.status(response.status).json({ error: body?.message ?? 'Failed to send email' })
  }

  return res.status(200).json({ ok: true })
}
