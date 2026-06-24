# Deploy — Hetzner CAX11 (ARM64), Ubuntu 24.04

Node app (middleware + server actions + API). Runs `next start` behind Caddy.
SQLite + `public/uploads/` persist on disk. **Build on the box** (ARM) — never copy
`node_modules`/`.next` from x64.

## 1. Base packages
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - && sudo apt install -y nodejs git
# Caddy (arm64) via its repo:
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

## 2. Code + env
```bash
sudo git clone <your-repo-url> /var/www/doublehelix && cd /var/www/doublehelix
sudo cp deploy/.env.example .env && sudo nano .env     # fill every value (see .env.example)
npm ci && npm run build
node scripts/create-admin.mjs you@domain "StrongPassword" "Your Name"
```

## 3. systemd — keep it running
`/etc/systemd/system/doublehelix.service`:
```ini
[Service]
WorkingDirectory=/var/www/doublehelix
ExecStart=/usr/bin/npm start
Environment=NODE_ENV=production PORT=3000
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```
```bash
sudo chown -R www-data:www-data /var/www/doublehelix
sudo systemctl enable --now doublehelix
```

## 4. Caddy — HTTPS + reverse proxy
Point the domain's DNS A-record at the server IP first. `/etc/caddy/Caddyfile`:
```
doublehelixpharma.co.uk {
    reverse_proxy localhost:3000
}
```
```bash
sudo systemctl reload caddy   # TLS is automatic
sudo ufw allow 80,443,22/tcp
```

## 5. Cron — drip-publish (replaces vercel.json, ignored off-Vercel)
```bash
crontab -e
0 9 * * * curl -fsS -H "Authorization: Bearer <CRON_SECRET>" https://doublehelixpharma.co.uk/api/cron/publish >/dev/null
```

## 6. Test the mail
Resend domain must show **Verified** first. Then on the box:
```bash
set -a; source .env; set +a
node deploy/resend-test.mjs        # sends one email; check CONTACT_TO inbox + Resend -> Emails
```
Then submit the live contact form and confirm it lands in `CONTACT_TO`.

## Redeploy later
```bash
bash deploy/deploy.sh             # git pull + npm ci + build + restart
```

## Notes
- Back up `.data/dh.db` and `public/uploads/`.
- `NEXT_PUBLIC_*` are baked at build time — rebuild if they change.
- Security headers/HSTS are in `next.config.mjs` — don't duplicate in Caddy.
