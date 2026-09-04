# WhatsApp Cloud API — setup guide

The webhook lives in the site at `src/app/api/whatsapp/webhook/route.ts`.

- **Callback URL:** `https://summitautomates.com/api/whatsapp/webhook`
- **Verify token:** `summit_wa_0f662d5280c3be8a3661b64d32fbbe2c38f638b0`

Behaviour: incoming customer messages get an automatic reply. Without an
`OPENAI_API_KEY` it sends a templated acknowledgement; once the key is added it
replies with AI (model `gpt-4o-mini` by default, override with `OPENAI_MODEL`).

---

## Step 1 — Verify the webhook (works now, no secrets needed)

In Meta → WhatsApp → Configuration / Production setup → **Configure Webhooks**:

1. **Callback URL:** `https://summitautomates.com/api/whatsapp/webhook`
2. **Verify token:** `summit_wa_0f662d5280c3be8a3661b64d32fbbe2c38f638b0`
3. Click **Verify and save**.
4. Subscribe to the **`messages`** webhook field.

This works as soon as the site is deployed — verification only needs the token.

## Step 2 — Enable sending replies (create secrets)

Gather from the Meta app:
- **App secret** — App settings → Basic → App Secret
- **Access token** — WhatsApp → API Setup (use a permanent System User token, not the 24h temp one)
- **Phone number ID** — WhatsApp → API Setup (the numeric ID, not the phone number)

Create the secrets in Cloud Secret Manager:

```bash
firebase apphosting:secrets:set whatsapp-app-secret
firebase apphosting:secrets:set whatsapp-access-token
firebase apphosting:secrets:set whatsapp-phone-number-id
```

Then in `apphosting.yaml`, **uncomment** the three matching env blocks and redeploy.

## Step 3 — Turn on AI replies (later, when you have the key)

```bash
firebase apphosting:secrets:set openai-api-key
```

Uncomment the `OPENAI_API_KEY` block in `apphosting.yaml` and redeploy. Replies
switch from templated to AI automatically. No key = templated replies still work.

---

## Notes & limits (v1)

- **Signature check:** enforced once `WHATSAPP_APP_SECRET` is set; until then the
  endpoint accepts POSTs so setup/testing works.
- **Dedupe** is best-effort in-memory (per instance). Fine for low volume; move to
  a shared store (e.g. Firestore) if you scale to multiple instances.
- **Synchronous replies:** the handler generates + sends the reply before acking
  Meta. If AI latency ever causes Meta retries, move send to a background task.
- **24-hour window:** free-form replies are only allowed within 24h of the
  customer's last message; outside it, Meta requires pre-approved templates.
- **Non-text messages** (images, audio) get a generic acknowledgement in v1.
