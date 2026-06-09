# -*- coding: utf-8 -*-
"""
Generates: Double Helix Pharma UK — Hosting Costs & Go-Live Requirements (PDF)
Edition: DigitalOcean Droplet + Microsoft 365 (4 mailboxes).
Pure reportlab (vector). Run: python build_cost_doc.py
"""
import html
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, PageBreak, Preformatted, KeepTogether, ListFlowable, ListItem)
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Group

# ----------------------------------------------------------------------------- palette
NAVY      = colors.HexColor('#042a63')
TEAL      = colors.HexColor('#0aa6e2')
TEAL_INK  = colors.HexColor('#136c9c')
GREEN     = colors.HexColor('#2f8f3a')
AMBER     = colors.HexColor('#b8860b')
RED       = colors.HexColor('#c0392b')
PLUM      = colors.HexColor('#6d4aa0')
INK       = colors.HexColor('#243748')
MUTED     = colors.HexColor('#5f7283')
LINE      = colors.HexColor('#d4dde6')
SURFACE   = colors.HexColor('#f3f7fa')
SOFT      = colors.HexColor('#eaf1f7')
WHITE     = colors.white

DATE = "9 June 2026"
VERSION = "2.0"
OUT = "Double-Helix-Pharma-Hosting-Costs-and-Requirements.pdf"

# ----------------------------------------------------------------------------- styles
ss = getSampleStyleSheet()
def mk(name, **kw):
    return ParagraphStyle(name, parent=ss['Normal'], **kw)

body   = mk('Body', fontName='Helvetica', fontSize=9.5, leading=14, textColor=INK, spaceAfter=7, alignment=TA_JUSTIFY)
lead   = mk('Lead', fontName='Helvetica', fontSize=11, leading=16, textColor=MUTED, spaceAfter=10)
h1     = mk('H1', fontName='Helvetica-Bold', fontSize=17, leading=21, textColor=NAVY, spaceBefore=6, spaceAfter=10, keepWithNext=1)
h3     = mk('H3', fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=TEAL_INK, spaceBefore=10, spaceAfter=4, keepWithNext=1)
cellH  = mk('CellH', fontName='Helvetica-Bold', fontSize=8.2, leading=10.5, textColor=WHITE)
cell   = mk('Cell', fontName='Helvetica', fontSize=8.2, leading=10.5, textColor=INK)
small  = mk('Small', fontName='Helvetica', fontSize=8, leading=11, textColor=MUTED)
covT   = mk('CovT', fontName='Helvetica-Bold', fontSize=30, leading=34, textColor=NAVY)
covS   = mk('CovS', fontName='Helvetica', fontSize=13, leading=18, textColor=TEAL_INK)

ST_DONE  = '<font color="#2f8f3a"><b>Done</b></font>'
ST_READY = '<font color="#2f8f3a"><b>Ready in code</b></font>'
ST_SETUP = '<font color="#b8860b"><b>To set up</b></font>'
ST_CFG   = '<font color="#b8860b"><b>To configure</b></font>'
ST_TODO  = '<font color="#b8860b"><b>Action needed</b></font>'
ST_BUY   = '<font color="#c0392b"><b>To purchase</b></font>'
ST_REC   = '<font color="#136c9c"><b>Recommended</b></font>'
ST_AFTER = '<font color="#5f7283">After domain</font>'

def esc(s):
    return html.escape(str(s), quote=False)

# ----------------------------------------------------------------------------- helpers
story = []
def P(t, st=body): story.append(Paragraph(t, st))  # content authored as markup-safe rich text
def H1(t): story.append(Paragraph(esc(t), h1))
def H3(t): story.append(Paragraph(esc(t), h3))
def SP(h=6): story.append(Spacer(1, h))
def bullets(items, st=body):
    flow = [ListItem(Paragraph(esc(x) if not x.startswith('<') else x, st), leftIndent=6, value=None) for x in items]
    story.append(ListFlowable(flow, bulletType='bullet', bulletColor=TEAL, bulletFontSize=6,
                              start='square', leftIndent=14, spaceAfter=8))

def steps(items, st=body):
    flow = [ListItem(Paragraph(esc(x) if not x.startswith('<') else x, st), leftIndent=6) for x in items]
    story.append(ListFlowable(flow, bulletType='1', bulletColor=NAVY, bulletFontName='Helvetica-Bold',
                              leftIndent=16, spaceAfter=8))

def table(headers, rows, widths, header_bg=NAVY, zebra=True, total_row=False):
    data = [[Paragraph(esc(h), cellH) for h in headers]]
    for r in rows:
        data.append([Paragraph(esc(c) if not str(c).startswith('<') else c, cell) for c in r])
    t = Table(data, colWidths=widths, repeatRows=1)
    sty = [
        ('BACKGROUND', (0,0), (-1,0), header_bg),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 5), ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LINEBELOW', (0,0), (-1,0), 0.6, header_bg),
        ('GRID', (0,1), (-1,-1), 0.4, LINE),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, SURFACE] if zebra else [WHITE, WHITE]),
    ]
    if total_row:
        sty += [('BACKGROUND', (0,-1), (-1,-1), SOFT),
                ('LINEABOVE', (0,-1), (-1,-1), 0.8, NAVY),
                ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold')]
    t.setStyle(TableStyle(sty))
    story.append(t); SP(9)

def callout(text, color=TEAL_INK, bg=SOFT, label="NOTE"):
    inner = Paragraph('<b>%s &nbsp;</b> %s' % (esc(label), text), mk('Call', fontName='Helvetica', fontSize=8.6, leading=12.5, textColor=INK))
    t = Table([[inner]], colWidths=[170*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1), bg),
        ('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),
        ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),
        ('LINEBEFORE',(0,0),(0,-1), 2.5, color),
    ]))
    story.append(t); SP(9)

def cost_bar_drawing():
    d = Drawing(470, 150)
    rows = [("Lean (1GB server, M365 Basic)", 29, GREEN, "~ £29 / mo"),
            ("Recommended (2GB + backups)", 35, NAVY, "~ £35 / mo"),
            ("Fuller (M365 Standard, desktop Office)", 58, TEAL_INK, "~ £58 / mo")]
    x0 = 200; maxw = 180; maxv = 62; barh = 18; gap = 30; top = 96
    d.add(String(8, 130, "Indicative monthly running cost (ex VAT)", fontName='Helvetica-Bold', fontSize=9.5, fillColor=NAVY))
    for i,(label,val,col,txt) in enumerate(rows):
        y = top - i*gap
        d.add(String(8, y+5, label, fontName='Helvetica', fontSize=8.2, fillColor=INK))
        w = max(3, maxw*val/maxv)
        d.add(Rect(x0, y, w, barh, rx=2, ry=2, fillColor=col, strokeColor=col))
        d.add(String(x0+w+6, y+5, txt, fontName='Helvetica-Bold', fontSize=8.5, fillColor=col))
    d.add(Line(x0, top-2*gap-6, x0, top+barh+4, strokeColor=LINE, strokeWidth=0.6))
    d.add(String(8, top-2*gap-16, "The 4 Microsoft 365 mailboxes are the largest part of the cost — the server itself is cheap.",
                 fontName='Helvetica-Oblique', fontSize=7.4, fillColor=MUTED))
    return d

# =============================================================================
# COVER
# =============================================================================
story.append(Spacer(1, 56*mm))
story.append(Paragraph("Hosting Costs &amp;<br/>Go-Live Requirements", covT))
SP(8)
story.append(Paragraph("Double Helix Pharma UK Ltd — running the site on DigitalOcean, with Microsoft 365 email", covS))
SP(26)
cover_meta = Table([
    [Paragraph("<b>Document</b>", cell), Paragraph("Hosting Costs &amp; Go-Live Requirements", cell)],
    [Paragraph("<b>Version</b>", cell),  Paragraph(VERSION + " (DigitalOcean + Microsoft 365 edition)", cell)],
    [Paragraph("<b>Date</b>", cell),     Paragraph(DATE, cell)],
    [Paragraph("<b>Target host</b>", cell), Paragraph("DigitalOcean Droplet (self-managed Linux server)", cell)],
    [Paragraph("<b>Email</b>", cell),    Paragraph("Microsoft 365 — 4 mailboxes (form notifies one)", cell)],
    [Paragraph("<b>Application</b>", cell), Paragraph("Next.js (App Router) — built &amp; running", cell)],
], colWidths=[32*mm, 124*mm])
cover_meta.setStyle(TableStyle([
    ('LINEBELOW',(0,0),(-1,-2),0.4,LINE),
    ('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),
    ('LEFTPADDING',(0,0),(0,-1),0),
]))
story.append(cover_meta)
SP(34)
story.append(Paragraph("All figures are indicative, in GBP and exclusive of VAT (reclaimable for a VAT-registered "
    "company), as at June 2026. US-dollar services (DigitalOcean) are converted at approximately $1 = £0.79. "
    "Microsoft and DigitalOcean list prices may change — Microsoft has a further UK increase scheduled for July 2026.", small))
story.append(PageBreak())

# =============================================================================
# 1. AT A GLANCE
# =============================================================================
H1("1.  At a glance")
P("Your website and its backend are <b>already built</b>. This document covers the cost and the steps to run it "
  "on a <b>DigitalOcean Droplet</b> (a Linux server you own and control) with <b>Microsoft 365</b> providing four "
  "staff mailboxes and sending the enquiry alerts. The database runs as a file <b>on the server's own disk</b>, so "
  "no separate database service is needed.")

table(["Scenario", "What it gives you", "Cost / month (ex VAT)"],
[
 ["Lean", "1GB server + Microsoft 365 Business Basic x4 + domain.", "~ £29"],
 ["Recommended", "2GB server + automatic backups + M365 Basic x4 + domain.", "~ £35"],
 ["Fuller", "As recommended, but M365 Business Standard (desktop Office) x4.", "~ £58"],
], [30*mm, 104*mm, 36*mm])

callout("The website itself is cheap to host (a £5–£10 / month server). The bulk of the cost is the <b>four "
        "Microsoft 365 mailboxes</b> — that is real staff email you own, roughly £23 / month on the Basic plan, "
        "not a website expense as such.", label="BOTTOM LINE", color=GREEN)

story.append(cost_bar_drawing()); SP(2)
story.append(Paragraph("Figure 1 — Indicative monthly running cost by scenario (excludes VAT; domain amortised).", small)); SP(6)

# =============================================================================
# 2. YOUR CHOSEN SETUP
# =============================================================================
H1("2.  Your chosen setup (the stack)")
P("Five parts. You own and run the server (the DigitalOcean Droplet); everything the app needs to store lives on "
  "that same server, which keeps the architecture simple and avoids a separate database bill.")
table(["Part", "What it does", "Plan", "Cost", "Status"],
[
 ["DigitalOcean Droplet", "A Linux server that runs the whole app (site + backend).", "2GB Droplet", "~ £9.50/mo", ST_SETUP],
 ["SQLite (on the disk)", "The database — stores enquiries and editable content.", "On-server file", "£0", ST_READY],
 ["Microsoft 365", "Four staff mailboxes; the form emails enquiries to one.", "Business Basic x4", "~ £23/mo", ST_SETUP],
 ["Cloudflare Turnstile", "CAPTCHA — blocks spam / bot form submissions.", "Free", "£0", ST_TODO],
 ["Domain registrar", "Your public web address (e.g. a .co.uk).", "Annual", "~ £10/yr", ST_BUY],
], [30*mm, 56*mm, 28*mm, 22*mm, 30*mm])
callout("Because the database is a single file on one server, <b>backups are essential</b> — a server can fail. "
        "The recommended plan includes DigitalOcean's automatic backups (+20%); we also add a nightly database "
        "snapshot. Without backups, a server loss would lose your enquiries.", label="IMPORTANT", color=RED, bg=colors.HexColor('#fbeceA'))

# =============================================================================
# 3. MONTHLY COST BREAKDOWN
# =============================================================================
H1("3.  Monthly cost breakdown")
P("The same site under three budget levels. The only real differences are the server size, whether automatic "
  "backups are on, and which Microsoft 365 plan the four mailboxes use.")
table(["Line item", "Lean", "Recommended", "Fuller"],
[
 ["Server — DigitalOcean Droplet", "£4.75  (1GB)", "£9.50  (2GB)", "£9.50  (2GB)"],
 ["Automatic server backups (+20%)", "—", "£1.90", "£1.90"],
 ["Database — SQLite on the server", "£0", "£0", "£0"],
 ["Email — Microsoft 365 x4 mailboxes", "£23.00  (Basic)", "£23.00  (Basic)", "£46.20  (Standard)"],
 ["CAPTCHA — Cloudflare Turnstile", "£0", "£0", "£0"],
 ["Domain name (amortised)", "£0.83", "£0.83", "£0.83"],
 ["TOTAL / month (ex VAT)", "~ £29", "~ £35", "~ £58"],
 ["TOTAL / year (ex VAT)", "~ £345", "~ £420", "~ £700"],
], [64*mm, 35*mm, 35*mm, 35*mm], total_row=True)
P("<font size=8 color='#5f7283'>Microsoft 365: Business Basic £5.75 and Business Standard £11.55 per user / month "
  "(ex VAT), x4 mailboxes. DigitalOcean billed in USD (~$12 = £9.50 for the 2GB Droplet). VAT is added on top but "
  "is normally reclaimable for a VAT-registered company.</font>", small)

# =============================================================================
# 4. ONE-TIME & OPTIONAL
# =============================================================================
H1("4.  One-time & optional costs")
bullets([
    "<b>Domain name (recommended, ~£8–£12 / year).</b> The only purchase needed to launch on your own address. "
    "Buy from Cloudflare Registrar, Namecheap or GoDaddy; renews yearly.",
    "<b>Initial server setup (one-time).</b> Installing the runtime, web server, HTTPS and first deploy on the "
    "Droplet. We provide a setup script and run it with you — no software licence cost.",
    "<b>HTTPS / SSL certificate (£0).</b> Free and automatic via Let's Encrypt (renews itself).",
    "<b>Microsoft 365 — email-only alternative.</b> If the four users only need email (no Teams/Office), "
    "Exchange Online Plan 1 is cheaper (about £3.30 / user / month, ex VAT) — ask your Microsoft reseller.",
    "<b>CAPTCHA keys (£0).</b> Cloudflare Turnstile is free; you just create a widget to obtain the keys.",
])

# =============================================================================
# 5. EVERYTHING NEEDED TO MAKE IT WORK
# =============================================================================
H1("5.  Everything needed to make the app work")
table(["Requirement", "What it is for", "Cost", "Status"],
[
 ["DigitalOcean account + Droplet", "The server that runs the site.", "~ £9.50/mo", ST_SETUP],
 ["Server stack (Node 20, Nginx, SSL)", "Serves the app securely over HTTPS.", "£0", ST_CFG],
 ["Database (SQLite on disk)", "Stores enquiries + content.", "£0", ST_READY],
 ["Automatic backups", "Protects the on-server database.", "~ £1.90/mo", ST_REC],
 ["Microsoft 365 (4 mailboxes)", "Staff email + sending enquiry alerts.", "~ £23/mo", ST_SETUP],
 ["Email app registration (Graph)", "Lets the app send mail through M365.", "£0", ST_CFG],
 ["Bot protection (Turnstile keys)", "Stops spam on the contact form.", "£0", ST_TODO],
 ["Domain name", "Your public web address.", "~ £10/yr", ST_BUY],
 ["Canonical URL setting", "Correct SEO / sitemap once live.", "£0", ST_AFTER],
], [48*mm, 60*mm, 22*mm, 40*mm])
callout("Most items are configuration we carry out for you. The things only <b>you</b> can do are: open a "
        "DigitalOcean account, buy the domain, and in Microsoft 365 create the 4 mailboxes plus one “app "
        "registration” so the website is allowed to send mail. Details in section 7.", label="WHO DOES WHAT")

# =============================================================================
# 6. MIGRATION PLAN
# =============================================================================
H1("6.  Migration plan — Vercel to DigitalOcean")
P("A staged move with no downtime: the site keeps running on its current address until the new server is tested "
  "and the domain is switched over at the end.")
steps([
    "Provision a DigitalOcean Droplet (Ubuntu 24.04 LTS, 2GB) and secure it (firewall, non-root user, SSH keys).",
    "Install the runtime: Node.js 20, Nginx as a reverse proxy, and a process manager to keep the app running and "
    "restart it on reboot.",
    "Deploy the app from GitHub and run an optimised production build (Next.js “standalone” output) on the server.",
    "Point the database at a file on the server's persistent disk and seed the live content; switch email from "
    "Resend to Microsoft 365 (already coded — just supply the keys).",
    "Add a free Let's Encrypt HTTPS certificate (auto-renewing).",
    "Set all environment variables on the server (database path, security secret, admin login, Microsoft 365 + "
    "Turnstile keys, public site URL).",
    "Turn on automatic backups and a nightly database snapshot.",
    "Test everything on the server's temporary address, then repoint the domain's DNS to the Droplet and retire "
    "the Vercel deployment.",
])
callout("We make the code and configuration changes (standalone build, Microsoft 365 email, server scripts). "
        "We can run the server steps with you over SSH, or hand you a copy-paste runbook — your choice.", label="HOW WE RUN IT")

# =============================================================================
# 7. WHAT YOU NEED TO PROVIDE
# =============================================================================
H1("7.  What you need to provide")
P("To carry out the move we will need the following from you. None of it is difficult; we guide each step.")
table(["Item", "Why it is needed", "Where to get it"],
[
 ["DigitalOcean account", "To create and pay for the server.", "digitalocean.com — sign up (card required)."],
 ["Domain name", "Your public web address.", "Any registrar; tell us the exact name."],
 ["Microsoft 365 admin access", "To create the 4 mailboxes.", "Microsoft 365 admin centre."],
 ["M365 app registration details", "Lets the website send mail via M365.", "We guide it in Azure / Entra: gives a Tenant ID, Client ID and a secret."],
 ["The send-from + notify addresses", "Which mailbox sends, which receives enquiries.", "You choose, e.g. send from contact@, notify enquiries@."],
 ["Cloudflare Turnstile keys", "Real spam protection.", "dash.cloudflare.com — free Turnstile widget."],
 ["Server access (SSH)", "So we can set the server up.", "Created with the Droplet; or do the steps with us."],
], [40*mm, 56*mm, 74*mm])
callout("On sending mail: the website will send through Microsoft 365 using the secure modern method (Microsoft "
        "Graph, an “app registration”). This avoids older password-based email that Microsoft is retiring. It is "
        "well within Microsoft 365's limits for a contact form's low volume.", label="EMAIL METHOD", color=PLUM)

# =============================================================================
# 8. RECOMMENDATION
# =============================================================================
H1("8.  Recommendation & budget")
bullets([
    "<b>Server:</b> a 2GB DigitalOcean Droplet with automatic backups (~£11.40 / month) — comfortable headroom "
    "for Next.js and protected against server loss.",
    "<b>Email:</b> Microsoft 365 Business Basic for the four mailboxes (~£23 / month) unless the team needs the "
    "desktop Office apps, in which case Business Standard.",
    "<b>Database:</b> keep it simple — SQLite on the server's disk (£0), with the nightly backup we set up.",
    "<b>To launch:</b> buy a domain and create the four mailboxes + the app registration; we do the rest.",
])
SP(2)
table(["Budget option", "Per month (ex VAT)", "Per year (ex VAT)"],
[
 ["Lean (1GB, M365 Basic x4)", "~ £29", "~ £345"],
 ["Recommended (2GB + backups, M365 Basic x4)", "~ £35", "~ £420"],
 ["Fuller (2GB + backups, M365 Standard x4)", "~ £58", "~ £700"],
], [86*mm, 40*mm, 44*mm])
SP(4)
P("In short: <b>the app is built and ready to move.</b> Hosting it on your own DigitalOcean server is inexpensive; "
  "the main ongoing cost is the four Microsoft 365 mailboxes — which give you proper, owned company email. Budget "
  "around <b>£35 / month</b> (ex VAT) for the recommended setup, plus a domain.", lead)
SP(6)
P("— End of summary —", small)

# =============================================================================
# BUILD
# =============================================================================
W, Hh = A4
LM = RM = 20*mm

class Doc(BaseDocTemplate):
    def afterFlowable(self, f):
        if isinstance(f, Paragraph) and f.style.name == 'H1':
            self.notify('TOCEntry', (0, f.getPlainText(), self.page))

def decorate(canvas, doc):
    canvas.saveState()
    if doc.page == 1:
        canvas.setFillColor(NAVY); canvas.rect(0, Hh-48*mm, W, 48*mm, fill=1, stroke=0)
        canvas.setFillColor(TEAL); canvas.rect(0, Hh-50*mm, W, 2*mm, fill=1, stroke=0)
        canvas.setFillColor(GREEN); canvas.rect(0, Hh-50*mm, W*0.32, 2*mm, fill=1, stroke=0)
        canvas.setFillColor(WHITE)
        canvas.setFont('Helvetica-Bold', 13); canvas.drawString(LM, Hh-20*mm, "DOUBLE HELIX PHARMA UK")
        canvas.setFont('Helvetica', 9); canvas.setFillColor(colors.HexColor('#9fd0ec'))
        canvas.drawString(LM, Hh-27*mm, "Pharmaceutical Quality & Compliance")
    else:
        canvas.setStrokeColor(LINE); canvas.setLineWidth(0.5)
        canvas.line(LM, Hh-15*mm, W-RM, Hh-15*mm)
        canvas.setFont('Helvetica', 7.5); canvas.setFillColor(MUTED)
        canvas.drawString(LM, Hh-13*mm, "Double Helix Pharma UK — Hosting Costs & Go-Live Requirements")
        canvas.drawRightString(W-RM, Hh-13*mm, "Confidential")
        canvas.line(LM, 13*mm, W-RM, 13*mm)
        canvas.drawString(LM, 9*mm, "v%s · %s" % (VERSION, DATE))
        canvas.drawRightString(W-RM, 9*mm, "Page %d" % (doc.page - 1))
    canvas.restoreState()

frame = Frame(LM, 18*mm, W-LM-RM, Hh-18*mm-20*mm, id='main')
doc = Doc(OUT, pagesize=A4, leftMargin=LM, rightMargin=RM, topMargin=22*mm, bottomMargin=18*mm,
          title="Double Helix Pharma UK — Hosting Costs & Go-Live Requirements",
          author="Double Helix Pharma UK Ltd")
doc.addPageTemplates([PageTemplate(id='main', frames=[frame], onPage=decorate)])
doc.multiBuild(story)
print("WROTE", OUT)
