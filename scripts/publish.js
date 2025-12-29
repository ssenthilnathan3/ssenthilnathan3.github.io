const WEBHOOK_URL = process.env.PUBLISH_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.PUBLISH_WEBHOOK_SECRET;

if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
  console.error("Missing publish env vars");
  process.exit(1);
}

async function publish() {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "x-webhook-secret": WEBHOOK_SECRET,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Publish failed:", text);
    process.exit(1);
  }

  console.log("🚀 Publish triggered");
}

publish();
