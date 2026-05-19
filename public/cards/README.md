# Service Card Images

Drop your service card reference images here, then uncomment the matching `imageUrl`
line in `src/lib/services-config.ts`.

Expected filenames (rename your images to match):

- `whatsapp.png` — WhatsApp Automation Services card
- `recruitment.png` — Recruitment & HR Automation card
- `crm.png` — CRM, Lead Management & AI Marketing card
- `docsec.png` — Document Verification & Security card
- `workforce.png` — Workforce & Operations Tracking card

## Workflow

1. Save the reference PNG here with the matching name above.
2. Open `src/lib/services-config.ts`.
3. Find the matching service entry.
4. Uncomment the `imageUrl` line.
5. If your image has a "Design Instructions" sidebar on the right (ChatGPT mockups
   typically do), also uncomment `imageCropRight: 40` to hide the right 40%.

## Tips

- PNG works best (transparency preserved). JPG also fine.
- Recommended dimensions: at least 1200×675 (16:9 aspect ratio).
- File size: keep each under 500KB if possible (use tinypng.com to compress).
- The image is shown with `object-position: left center`, so the visible portion
  (after any crop) is whatever sits in the left part of your image.
