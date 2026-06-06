# -*- coding: utf-8 -*-
"""
Generates: Double Helix Pharma UK — Backend & Database Design Specification (PDF)
Pure reportlab (vector). Run: python build_backend_doc.py
"""
import html
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, PageBreak, Preformatted, KeepTogether, ListFlowable, ListItem)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon, Group

# ----------------------------------------------------------------------------- palette
NAVY      = colors.HexColor('#042a63')
NAVY_DEEP = colors.HexColor('#001a45')
TEAL      = colors.HexColor('#0aa6e2')
TEAL_INK  = colors.HexColor('#136c9c')
GREEN     = colors.HexColor('#2f8f3a')
PLUM      = colors.HexColor('#6d4aa0')
INK       = colors.HexColor('#243748')
MUTED     = colors.HexColor('#5f7283')
LINE      = colors.HexColor('#d4dde6')
SURFACE   = colors.HexColor('#f3f7fa')
SOFT      = colors.HexColor('#eaf1f7')
WHITE     = colors.white

DATE = "6 June 2026"
VERSION = "1.0"
OUT = "Double-Helix-Pharma-Backend-and-Database-Design.pdf"

# ----------------------------------------------------------------------------- styles
ss = getSampleStyleSheet()
def mk(name, **kw):
    return ParagraphStyle(name, parent=ss['Normal'], **kw)

body   = mk('Body', fontName='Helvetica', fontSize=9.5, leading=14, textColor=INK, spaceAfter=7, alignment=TA_JUSTIFY)
lead   = mk('Lead', fontName='Helvetica', fontSize=11, leading=16, textColor=MUTED, spaceAfter=10)
h1     = mk('H1', fontName='Helvetica-Bold', fontSize=17, leading=21, textColor=NAVY, spaceBefore=6, spaceAfter=10, keepWithNext=1)
h2     = mk('H2', fontName='Helvetica-Bold', fontSize=12.5, leading=16, textColor=NAVY, spaceBefore=14, spaceAfter=6, keepWithNext=1)
h3     = mk('H3', fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=TEAL_INK, spaceBefore=10, spaceAfter=4, keepWithNext=1)
cellH  = mk('CellH', fontName='Helvetica-Bold', fontSize=8.2, leading=10.5, textColor=WHITE)
cell   = mk('Cell', fontName='Helvetica', fontSize=8.2, leading=10.5, textColor=INK)
cellB  = mk('CellB', fontName='Helvetica-Bold', fontSize=8.2, leading=10.5, textColor=NAVY)
mono   = mk('Mono', fontName='Courier', fontSize=8, leading=11, textColor=INK)
small  = mk('Small', fontName='Helvetica', fontSize=8, leading=11, textColor=MUTED)
covT   = mk('CovT', fontName='Helvetica-Bold', fontSize=30, leading=34, textColor=NAVY)
covS   = mk('CovS', fontName='Helvetica', fontSize=13, leading=18, textColor=TEAL_INK)
white_small = mk('WS', fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=WHITE)

def esc(s):
    return html.escape(str(s), quote=False)

# ----------------------------------------------------------------------------- helpers
story = []
def P(t, st=body): story.append(Paragraph(t if t.startswith('<') else esc(t), st))
def H1(t): story.append(Paragraph(esc(t), h1))
def H2(t): story.append(Paragraph(esc(t), h2))
def H3(t): story.append(Paragraph(esc(t), h3))
def SP(h=6): story.append(Spacer(1, h))
def bullets(items, st=body):
    flow = [ListItem(Paragraph(esc(x) if not x.startswith('<') else x, st), leftIndent=6, value=None) for x in items]
    story.append(ListFlowable(flow, bulletType='bullet', bulletColor=TEAL, bulletFontSize=6,
                              start='square', leftIndent=14, spaceAfter=8))

def table(headers, rows, widths, header_bg=NAVY, font=8.2, zebra=True, align_left_cols=None):
    data = [[Paragraph(esc(h), cellH) for h in headers]]
    for r in rows:
        data.append([Paragraph(esc(c) if not str(c).startswith('<') else c, cell) for c in r])
    t = Table(data, colWidths=widths, repeatRows=1)
    sty = [
        ('BACKGROUND', (0,0), (-1,0), header_bg),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LINEBELOW', (0,0), (-1,0), 0.6, header_bg),
        ('GRID', (0,1), (-1,-1), 0.4, LINE),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, SURFACE] if zebra else [WHITE, WHITE]),
    ]
    t.setStyle(TableStyle(sty))
    story.append(t); SP(9)

def code(text, title=None):
    if title:
        story.append(Paragraph(esc(title), mk('CodeTitle', fontName='Helvetica-Bold', fontSize=8.5, textColor=MUTED, spaceAfter=2)))
    pre = Preformatted(esc(text), mono)
    box = Table([[pre]], colWidths=[170*mm])
    box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0f2540')),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.whitesmoke),
        ('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),
        ('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),
        ('BOX',(0,0),(-1,-1),0.5, NAVY),
    ]))
    # white code text
    pre.style = mk('MonoW', fontName='Courier', fontSize=7.8, leading=10.8, textColor=colors.HexColor('#e7eef6'))
    pre.text = esc(text)
    story.append(box); SP(9)

def callout(text, color=TEAL_INK, bg=SOFT, label="NOTE"):
    inner = Paragraph('<b>%s &nbsp;</b> %s' % (esc(label), esc(text)),
                      mk('Call', fontName='Helvetica', fontSize=8.6, leading=12.5, textColor=INK))
    t = Table([[inner]], colWidths=[170*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1), bg),
        ('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),
        ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),
        ('LINEBEFORE',(0,0),(0,-1), 2.5, color),
    ]))
    story.append(t); SP(9)

# ----------------------------------------------------------------------------- diagrams
def rbox(g, x, y, w, h, title, sub=None, fill=WHITE, stroke=NAVY, tcol=NAVY, fs=8.5):
    g.add(Rect(x, y, w, h, rx=4, ry=4, fillColor=fill, strokeColor=stroke, strokeWidth=0.8))
    if sub:
        g.add(String(x+w/2, y+h-11, title, textAnchor='middle', fontName='Helvetica-Bold', fontSize=fs, fillColor=tcol))
        g.add(String(x+w/2, y+6, sub, textAnchor='middle', fontName='Helvetica', fontSize=6.6, fillColor=MUTED))
    else:
        g.add(String(x+w/2, y+h/2-3, title, textAnchor='middle', fontName='Helvetica-Bold', fontSize=fs, fillColor=tcol))

def arrow(g, x1, y1, x2, y2, col=MUTED):
    g.add(Line(x1, y1, x2, y2, strokeColor=col, strokeWidth=0.9))
    import math
    a = math.atan2(y2-y1, x2-x1); s = 4
    g.add(Polygon([x2, y2,
                   x2-s*math.cos(a-0.4), y2-s*math.sin(a-0.4),
                   x2-s*math.cos(a+0.4), y2-s*math.sin(a+0.4)],
                  fillColor=col, strokeColor=col))

def architecture_drawing():
    d = Drawing(470, 300)
    rbox(d, 150, 268, 170, 26, "Website Visitors  &  Admin Users", fill=SOFT, stroke=TEAL_INK, tcol=NAVY)
    rbox(d, 110, 222, 250, 28, "Next.js Frontend + Admin Dashboard", "Vercel Edge Network / CDN · ISR", fill=WHITE, stroke=NAVY, tcol=NAVY)
    rbox(d, 110, 168, 250, 28, "API Layer — Route Handlers", "REST · Zod validation · Auth.js · rate limiting", fill=colors.HexColor('#eaf4fb'), stroke=TEAL, tcol=TEAL_INK)
    rbox(d, 60, 112, 150, 26, "PostgreSQL", "Prisma ORM · managed (Neon)", fill=WHITE, stroke=GREEN, tcol=GREEN)
    rbox(d, 250, 112, 150, 26, "Redis (Upstash)", "rate-limit · cache · queue", fill=WHITE, stroke=PLUM, tcol=PLUM)
    # external column
    rbox(d, 388, 222, 78, 22, "Resend", "email", fill=SURFACE, stroke=MUTED, tcol=INK, fs=7.5)
    rbox(d, 388, 190, 78, 22, "Blob / S3", "media", fill=SURFACE, stroke=MUTED, tcol=INK, fs=7.5)
    rbox(d, 388, 158, 78, 22, "Analytics", "GA4 / Plausible", fill=SURFACE, stroke=MUTED, tcol=INK, fs=7.5)
    # arrows
    arrow(d, 235, 268, 235, 250)
    arrow(d, 235, 222, 235, 196)
    arrow(d, 200, 168, 150, 138)
    arrow(d, 270, 168, 320, 138)
    arrow(d, 360, 196, 388, 211)
    arrow(d, 360, 188, 388, 197)
    arrow(d, 360, 180, 388, 171)
    return d

def domain_map_drawing():
    d = Drawing(470, 360)
    groups = [
        ("Authentication & Access", NAVY,  ["users", "sessions", "audit_logs"]),
        ("Lead Management (CRM)",  TEAL_INK,["enquiries", "enquiry_notes"]),
        ("Content (CMS)",          GREEN,  ["posts", "categories", "tags", "post_tags",
                                            "case_studies", "services", "faqs", "industries", "testimonials"]),
        ("Marketing",              PLUM,   ["subscribers"]),
        ("System",                 MUTED,  ["media", "settings"]),
    ]
    # layout: two columns
    positions = [(8, 250, 220, 96), (240, 250, 222, 96),
                 (8, 8, 300, 232), (322, 120, 140, 60), (322, 8, 140, 96)]
    for (title, col, ents), (x, y, w, h) in zip(groups, positions):
        d.add(Rect(x, y, w, h, rx=5, ry=5, fillColor=WHITE, strokeColor=col, strokeWidth=1))
        d.add(Rect(x, y+h-18, w, 18, rx=5, ry=5, fillColor=col, strokeColor=col))
        d.add(Rect(x, y+h-18, w, 9, fillColor=col, strokeColor=col))
        d.add(String(x+8, y+h-13, title, fontName='Helvetica-Bold', fontSize=8, fillColor=WHITE))
        # entity chips
        cx, cy = x+8, y+h-34
        for i, e in enumerate(ents):
            cw = 4.9*len(e)+14
            if cx+cw > x+w-6:
                cx = x+8; cy -= 20
            d.add(Rect(cx, cy, cw, 14, rx=3, ry=3, fillColor=SURFACE, strokeColor=LINE))
            d.add(String(cx+cw/2, cy+4, e, textAnchor='middle', fontName='Courier', fontSize=7, fillColor=INK))
            cx += cw+6
    # a few relationship arrows
    arrow(d, 118, 250, 300, 250, col=LINE)            # users -> enquiries (approx)
    arrow(d, 240, 280, 228, 280, col=LINE)
    return d

# =============================================================================
# CONTENT
# =============================================================================

# ---- Cover (page 1) flowables (header/footer suppressed on p.1) -------------
story.append(Spacer(1, 56*mm))
story.append(Paragraph("Backend &amp; Database<br/>Design Specification", covT))
SP(8)
story.append(Paragraph("Double Helix Pharma UK Ltd — pharmaceutical quality &amp; compliance platform", covS))
SP(26)
cover_meta = Table([
    [Paragraph("<b>Document</b>", cell), Paragraph("Backend &amp; Database Design Specification", cell)],
    [Paragraph("<b>Version</b>", cell),  Paragraph(VERSION, cell)],
    [Paragraph("<b>Date</b>", cell),     Paragraph(DATE, cell)],
    [Paragraph("<b>Status</b>", cell),   Paragraph("For implementation hand-off", cell)],
    [Paragraph("<b>Audience</b>", cell), Paragraph("Backend / database engineer", cell)],
    [Paragraph("<b>Frontend</b>", cell), Paragraph("Next.js (App Router) — built &amp; deployed", cell)],
], colWidths=[32*mm, 120*mm])
cover_meta.setStyle(TableStyle([
    ('LINEBELOW',(0,0),(-1,-2),0.4,LINE),
    ('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),
    ('LEFTPADDING',(0,0),(0,-1),0),
]))
story.append(cover_meta)
SP(40)
story.append(Paragraph("Confidential — prepared for internal engineering use. This document specifies the "
    "backend services and relational database to be implemented behind the existing front-end. It is "
    "implementation-ready but technology choices may be adapted to the engineer's preference where noted.", small))
story.append(PageBreak())

# ---- TOC --------------------------------------------------------------------
toc = TableOfContents()
toc.levelStyles = [
    mk('TOC1', fontName='Helvetica-Bold', fontSize=10, leading=18, textColor=NAVY),
    mk('TOC2', fontName='Helvetica', fontSize=9, leading=14, textColor=INK, leftIndent=14),
]
story.append(Paragraph("Contents", h1))
SP(4)
story.append(toc)
story.append(PageBreak())

# ---- 1. Introduction --------------------------------------------------------
H1("1.  Introduction")
P("<b>Purpose.</b> This document defines the backend application and relational database required to "
  "support the Double Helix Pharma UK website beyond its current static / form-only state. It is written "
  "as a hand-off specification: a backend engineer should be able to implement the system from this "
  "document without further design work.")
P("<b>Scope.</b> In scope: the public API consumed by the website, the authenticated admin API and "
  "dashboard data model, the relational schema, integrations (email, media, analytics), security and "
  "data-protection requirements, and deployment topology. Out of scope: the front-end implementation "
  "(already built and deployed) and visual/UX design.")
H3("1.1  Intended audience")
bullets([
    "Backend / full-stack engineer implementing the API and database.",
    "Reviewer / architect validating the design before build.",
    "The site owner, as a record of what the platform stores and why (GDPR accountability).",
])
H3("1.2  How to read this document")
P("Sections 2–3 give the application and architecture context. Section 4 specifies the API surface. "
  "Section 5 is the authoritative database design (entity tables + relationships). Sections 6–9 cover "
  "data flows, security, non-functional requirements and infrastructure. Appendices provide copy-ready "
  "SQL/Prisma, a Mermaid ER diagram, and sample payloads.")
callout("Where a concrete technology is named (PostgreSQL, Prisma, Next.js Route Handlers, Auth.js, "
        "Upstash, Resend) it is a recommendation chosen to fit the existing Next.js/Vercel front-end. "
        "Equivalent substitutions are acceptable provided the data model and API contract are preserved.",
        label="ON TECH CHOICES")

# ---- 2. Application overview ------------------------------------------------
H1("2.  Application Overview")
P("Double Helix Pharma UK Ltd is a UK pharmaceutical quality &amp; compliance consultancy. The website is "
  "a lead-generation and authority platform: it presents services (GMP/GDP audits, contract QP/RP/RPi "
  "cover, QMS implementation, site readiness, supplier management, GDP distribution), captures enquiries, "
  "and is intended to grow an Insights/blog, Case Studies and Industries content library.")
H3("2.1  Current state")
bullets([
    "Front-end: Next.js (App Router), TypeScript, deployed on Vercel. 16 statically-rendered routes.",
    "Only existing server behaviour: a single contact-form endpoint that emails submissions via Resend; "
    "nothing is persisted.",
    "All services / FAQs / copy are currently hard-coded in the front-end (a single config module).",
])
H3("2.2  What the backend must add")
bullets([
    "Persist and manage enquiries (a lightweight CRM), not just email them.",
    "A content-management layer so Insights articles, Case Studies, Services, FAQs and Industries are "
    "editable without code deploys, and rendered via the front-end.",
    "Newsletter subscriptions with double opt-in.",
    "An authenticated admin dashboard (staff) with role-based access.",
    "Media upload/storage for content imagery.",
    "Audit logging and data-protection tooling (export/erase) appropriate to a compliance business.",
])
H3("2.3  Goals & non-goals")
table(["Goal", "Description"],
[
 ["Editable content", "Marketing can publish Insights/Case Studies without engineering."],
 ["Lead capture & tracking", "Every enquiry stored, status-tracked and attributable to a source page."],
 ["SEO continuity", "Dynamic content keeps the same metadata/JSON-LD contract the front-end already implements."],
 ["Compliance-grade", "Consent, retention, audit trail, least-privilege access."],
 ["Low operational overhead", "Serverless-first; managed Postgres; no servers to patch."],
], [38*mm, 132*mm])
P("<b>Non-goals (v1):</b> client portals/authentication for customers, billing/payments, a public API for "
  "third parties, and multi-tenant support. The schema does not preclude these but they are not built in v1.")

# ---- 3. System architecture -------------------------------------------------
H1("3.  System Architecture")
P("The system is serverless-first and co-located with the existing Vercel front-end. The browser talks to "
  "the Next.js app; server-side Route Handlers expose the API, validate input, enforce auth and talk to a "
  "managed PostgreSQL database via Prisma. Redis provides rate-limiting and caching; email, media storage "
  "and analytics are external managed services.")
story.append(architecture_drawing()); SP(4)
story.append(Paragraph("Figure 1 — High-level system architecture.", small)); SP(10)

H3("3.1  Recommended technology stack")
table(["Layer", "Choice", "Rationale"],
[
 ["Runtime / API", "Next.js Route Handlers (Node 20)", "Same repo/deploy as the front-end; typed end-to-end."],
 ["Language", "TypeScript (strict)", "Shared types between API and UI."],
 ["Database", "PostgreSQL 16 (managed — Neon)", "Relational integrity, JSONB, full-text search, branching."],
 ["ORM / migrations", "Prisma", "Type-safe queries + versioned migrations."],
 ["Validation", "Zod", "One schema for runtime validation + inferred TS types."],
 ["Auth", "Auth.js (NextAuth) — credentials + RBAC", "Mature session handling; httpOnly cookies."],
 ["Rate-limit / cache / queue", "Upstash Redis", "Serverless Redis; @upstash/ratelimit."],
 ["Transactional email", "Resend", "Already integrated in the front-end."],
 ["Media storage", "Vercel Blob or AWS S3", "Signed-URL uploads; CDN delivery."],
 ["Hosting / CI-CD", "Vercel + GitHub", "Preview deployments; zero-config Next.js."],
 ["Error / uptime", "Sentry + Better Uptime", "Tracing and alerting."],
], [30*mm, 56*mm, 84*mm])

H3("3.2  Architectural principles")
bullets([
    "Single source of truth: the database is authoritative; the front-end reads via the API (or server "
    "components) and revalidates (ISR/on-demand) on publish.",
    "Layered: handler (HTTP) → service (business logic) → repository (Prisma). Validation at the boundary.",
    "Stateless compute: no in-process state; sessions in signed cookies, shared state in Postgres/Redis.",
    "Least privilege: public vs admin APIs are separate; admin requires an authenticated session and role.",
    "Idempotent & safe: GET never mutates; public POSTs are rate-limited and spam-guarded.",
])

# ---- 4. Backend / API design ------------------------------------------------
H1("4.  Backend &amp; API Design")
H3("4.1  Conventions")
bullets([
    "Base path /api. JSON request/response, UTF-8. All times ISO-8601 UTC.",
    "Resource naming is plural and kebab-case (/api/case-studies).",
    "Admin endpoints live under /api/admin/* and require an authenticated session with a sufficient role.",
    "List endpoints support pagination (?page, ?limit, max 100), ?sort, and resource-specific filters; "
    "responses include a meta object with total/page/limit.",
    "Mutations validate with Zod and return the created/updated resource. Unknown fields are rejected.",
])
H3("4.2  Standard response envelope")
code('// success\n{ "data": { ... }, "meta": { "page": 1, "limit": 20, "total": 42 } }\n\n'
     '// error\n{ "error": { "code": "VALIDATION_ERROR",\n            "message": "Email is required",\n'
     '            "details": [{ "path": "email", "message": "Required" }] } }', "Response shape")
H3("4.3  HTTP status codes")
table(["Code", "Meaning / when used"],
[
 ["200 OK", "Successful GET / PATCH."],
 ["201 Created", "Resource created (enquiry, subscriber, post)."],
 ["204 No Content", "Successful DELETE."],
 ["400 Bad Request", "Malformed JSON / query."],
 ["401 Unauthorized", "Missing or invalid admin session."],
 ["403 Forbidden", "Authenticated but role not permitted."],
 ["404 Not Found", "Unknown resource / slug."],
 ["409 Conflict", "Unique constraint (duplicate slug / email)."],
 ["422 Unprocessable", "Zod validation failed."],
 ["429 Too Many Requests", "Rate limit exceeded."],
 ["500 Internal", "Unhandled — logged to Sentry, generic message returned."],
], [34*mm, 136*mm])

H3("4.4  Public API")
table(["Method & path", "Purpose", "Auth", "Notes"],
[
 ["POST /api/enquiries", "Submit contact form", "Public", "Rate-limited; honeypot; consent required; persists + emails."],
 ["POST /api/subscribers", "Newsletter sign-up", "Public", "Double opt-in; sends confirm email."],
 ["GET /api/subscribers/confirm", "Confirm subscription", "Token", "?token=…"],
 ["GET /api/subscribers/unsubscribe", "Unsubscribe", "Token", "?token=…"],
 ["GET /api/posts", "List published posts", "Public", "Paginated; ?category, ?tag, ?q."],
 ["GET /api/posts/{slug}", "Single post", "Public", "Published only; increments view counter."],
 ["GET /api/case-studies", "List case studies", "Public", "Published only."],
 ["GET /api/case-studies/{slug}", "Single case study", "Public", "Published only."],
 ["GET /api/services", "List services", "Public", "Ordered; published only."],
 ["GET /api/faqs", "List FAQs", "Public", "Grouped by category."],
 ["GET /api/industries", "List industries", "Public", "Published only."],
], [50*mm, 40*mm, 18*mm, 62*mm])

H3("4.5  Admin API (authenticated)")
table(["Method & path", "Purpose", "Min role"],
[
 ["POST /api/auth/login · /logout · GET /session", "Session lifecycle", "—"],
 ["GET /api/admin/enquiries", "List / filter / search enquiries", "viewer"],
 ["PATCH /api/admin/enquiries/{id}", "Update status / assignee", "editor"],
 ["POST /api/admin/enquiries/{id}/notes", "Add follow-up note", "editor"],
 ["GET·POST /api/admin/posts", "List / create posts", "editor"],
 ["PATCH·DELETE /api/admin/posts/{id}", "Update / delete post", "editor"],
 ["…/admin/case-studies, /services, /faqs, /industries, /testimonials", "Full CRUD (same shape)", "editor"],
 ["GET /api/admin/subscribers", "List / export subscribers (CSV)", "admin"],
 ["POST /api/admin/media", "Upload media (signed URL)", "editor"],
 ["GET /api/admin/audit-logs", "Read audit trail", "admin"],
 ["GET·PATCH /api/admin/settings", "Read / update site settings", "admin"],
 ["POST /api/admin/enquiries/{id}/erase", "GDPR erase of a record", "admin"],
], [78*mm, 62*mm, 30*mm])

H3("4.6  Validation, errors & middleware")
bullets([
    "Every handler parses input with a Zod schema; failures return 422 with field-level details.",
    "A shared error handler maps known errors (Prisma P2002 → 409, auth → 401/403) and logs the rest.",
    "Admin routes pass through an auth middleware that resolves the session and asserts the role.",
    "Public mutating routes pass through a rate-limit middleware (per IP + per route).",
    "All responses set strict security headers; CORS is closed (same-origin) by default.",
])
H3("4.7  Background & scheduled work")
table(["Job", "Trigger", "Action"],
[
 ["Enquiry notifications", "On POST /api/enquiries", "Email internal team + confirmation to sender (Resend)."],
 ["Subscription confirm", "On sign-up / confirm", "Send / honour double opt-in email."],
 ["Data retention sweep", "Daily cron (Vercel Cron)", "Soft-delete spam + expired unconfirmed subscribers; purge per policy."],
 ["Sitemap / ISR revalidate", "On content publish", "Trigger on-demand revalidation of affected routes."],
 ["Audit-log retention", "Monthly cron", "Archive logs older than retention window."],
], [42*mm, 44*mm, 84*mm])

# ---- 5. Database design -----------------------------------------------------
H1("5.  Database Design")
P("PostgreSQL with surrogate UUID primary keys (v7/ULID-ordered where possible for index locality). "
  "Conventions below apply to every table.")
H3("5.1  Conventions")
bullets([
    "Primary key id uuid (default gen_random_uuid()). Natural keys (slug, email) are unique but not the PK.",
    "Timestamps created_at and updated_at (timestamptz, default now()); updated_at maintained by trigger/ORM.",
    "Soft delete via deleted_at (timestamptz null) on user-content and enquiries; hard delete only on GDPR erase.",
    "Enumerations implemented as Postgres enum types (or text + check) — listed per table.",
    "Foreign keys are indexed; slugs and lookup columns are indexed; full-text search via tsvector on posts.",
    "Money/metrics and flexible attributes use jsonb. Email stored case-insensitively (citext).",
])
SP(2)
story.append(domain_map_drawing()); SP(4)
story.append(Paragraph("Figure 2 — Entity domain map (17 tables across five domains).", small)); SP(10)

H3("5.2  Relationships")
table(["Parent", "Child", "Cardinality", "Foreign key"],
[
 ["users", "enquiries", "1 : N (assignee)", "enquiries.assigned_to → users.id"],
 ["users", "enquiry_notes", "1 : N (author)", "enquiry_notes.author_id → users.id"],
 ["enquiries", "enquiry_notes", "1 : N", "enquiry_notes.enquiry_id → enquiries.id"],
 ["users", "posts", "1 : N (author)", "posts.author_id → users.id"],
 ["categories", "posts", "1 : N", "posts.category_id → categories.id"],
 ["posts", "tags", "N : N", "post_tags(post_id, tag_id)"],
 ["media", "posts / case_studies", "1 : N (cover)", "*.cover_image_id → media.id"],
 ["users", "media", "1 : N (uploader)", "media.uploaded_by → users.id"],
 ["users", "audit_logs", "1 : N (actor)", "audit_logs.actor_id → users.id"],
], [30*mm, 40*mm, 36*mm, 64*mm])

_ecount = [0]
def entity(name, desc, cols, enums=None):
    _ecount[0] += 1
    H3("5.3.%d  %s" % (_ecount[0], name))
    P(desc)
    table(["Column", "Type", "Constraints", "Description"],
          cols, [34*mm, 34*mm, 36*mm, 66*mm])
    if enums:
        P("<b>Enum %s:</b> %s" % (esc(enums[0]), esc(enums[1])), small)
        SP(4)

H2("5.3  Entity catalogue")

entity("users", "Staff accounts for the admin dashboard.",
[
 ["id", "uuid", "PK", "Surrogate key."],
 ["email", "citext", "unique, not null", "Login identifier."],
 ["password_hash", "text", "not null", "Argon2id hash."],
 ["full_name", "text", "not null", "Display name."],
 ["role", "user_role", "not null, default 'editor'", "Access level."],
 ["is_active", "boolean", "default true", "Disabled accounts cannot log in."],
 ["last_login_at", "timestamptz", "null", "Updated on login."],
 ["created_at / updated_at", "timestamptz", "default now()", "Audit timestamps."],
], ("user_role", "admin | editor | viewer"))

entity("sessions", "Server-side sessions (if DB session strategy is used; omit if JWT-only).",
[
 ["id", "uuid", "PK", ""],
 ["user_id", "uuid", "FK→users, not null", "Owner."],
 ["token_hash", "text", "unique, not null", "Hashed session token."],
 ["expires_at", "timestamptz", "not null", "Absolute expiry."],
 ["ip_address", "inet", "null", "Issued-from IP."],
 ["user_agent", "text", "null", "Client UA."],
 ["created_at", "timestamptz", "default now()", ""],
])

entity("enquiries", "Contact-form submissions — the lightweight CRM record.",
[
 ["id", "uuid", "PK", ""],
 ["name", "text", "not null", "Submitter name."],
 ["email", "citext", "not null", "Reply-to."],
 ["company", "text", "null", "Organisation."],
 ["phone", "text", "null", "Optional phone."],
 ["service", "text", "null", "Service of interest (matches a service slug/title)."],
 ["message", "text", "not null", "Enquiry body."],
 ["status", "enquiry_status", "default 'new'", "Pipeline state."],
 ["source", "text", "default 'contact_form'", "Origin channel."],
 ["page_path", "text", "null", "Page the form was submitted from."],
 ["consent", "boolean", "not null", "Explicit contact consent."],
 ["ip_address", "inet", "null", "Captured for spam/audit (PII — see §7)."],
 ["user_agent", "text", "null", "Client UA."],
 ["assigned_to", "uuid", "FK→users, null", "Owner."],
 ["created_at / updated_at / deleted_at", "timestamptz", "", "Lifecycle."],
], ("enquiry_status", "new | in_review | contacted | qualified | won | lost | spam"))

entity("enquiry_notes", "Internal follow-up notes attached to an enquiry.",
[
 ["id", "uuid", "PK", ""],
 ["enquiry_id", "uuid", "FK→enquiries, not null", "Parent enquiry."],
 ["author_id", "uuid", "FK→users, not null", "Note author."],
 ["body", "text", "not null", "Note text."],
 ["created_at", "timestamptz", "default now()", ""],
])

entity("posts", "Insights / blog articles (the primary SEO content type).",
[
 ["id", "uuid", "PK", ""],
 ["slug", "text", "unique, not null", "URL segment."],
 ["title", "text", "not null", "Headline."],
 ["excerpt", "text", "null", "Summary / list teaser."],
 ["body", "text", "not null", "Markdown/MDX content."],
 ["cover_image_id", "uuid", "FK→media, null", "Hero image."],
 ["author_id", "uuid", "FK→users, not null", "Author."],
 ["category_id", "uuid", "FK→categories, null", "Primary category."],
 ["status", "content_status", "default 'draft'", "Workflow state."],
 ["published_at", "timestamptz", "null", "Go-live time (supports scheduling)."],
 ["reading_minutes", "int", "default 0", "Computed read time."],
 ["meta_title / meta_description", "text", "null", "SEO overrides."],
 ["views", "int", "default 0", "View counter."],
 ["search_tsv", "tsvector", "generated", "Full-text search index."],
 ["created_at / updated_at / deleted_at", "timestamptz", "", "Lifecycle."],
], ("content_status", "draft | scheduled | published | archived"))

entity("categories", "Content taxonomy for posts.",
[
 ["id", "uuid", "PK", ""],
 ["slug", "text", "unique, not null", ""],
 ["name", "text", "not null", ""],
 ["description", "text", "null", ""],
])
entity("tags / post_tags", "Free-form tags and the post↔tag join table.",
[
 ["tags.id", "uuid", "PK", ""],
 ["tags.slug", "text", "unique, not null", ""],
 ["tags.name", "text", "not null", ""],
 ["post_tags.post_id", "uuid", "FK→posts", "Composite PK part 1."],
 ["post_tags.tag_id", "uuid", "FK→tags", "Composite PK part 2."],
])
entity("case_studies", "Anonymised engagement write-ups for credibility.",
[
 ["id", "uuid", "PK", ""],
 ["slug", "text", "unique, not null", ""],
 ["title", "text", "not null", ""],
 ["sector", "text", "null", "Industry/sector."],
 ["summary", "text", "null", "Teaser."],
 ["challenge / approach / outcome", "text", "null", "Narrative sections."],
 ["metrics", "jsonb", "null", "e.g. {\"findings_closed\": 12}."],
 ["cover_image_id", "uuid", "FK→media, null", ""],
 ["status", "content_status", "default 'draft'", ""],
 ["published_at", "timestamptz", "null", ""],
 ["meta_title / meta_description", "text", "null", "SEO."],
 ["created_at / updated_at / deleted_at", "timestamptz", "", ""],
])
entity("services", "CMS-managed service offerings (mirrors the six built pages).",
[
 ["id", "uuid", "PK", ""],
 ["slug", "text", "unique, not null", "Matches the front-end route."],
 ["title", "text", "not null", ""],
 ["short", "text", "not null", "Card summary."],
 ["body", "text", "null", "Long form / sections."],
 ["icon", "text", "null", "Icon key."],
 ["order_index", "int", "default 0", "Display order."],
 ["is_published", "boolean", "default true", ""],
 ["meta_title / meta_description", "text", "null", "SEO."],
 ["created_at / updated_at", "timestamptz", "", ""],
])
entity("faqs", "Question/answer pairs grouped by category.",
[
 ["id", "uuid", "PK", ""],
 ["question", "text", "not null", ""],
 ["answer", "text", "not null", ""],
 ["category", "text", "null", "e.g. 'General', 'Audits'."],
 ["order_index", "int", "default 0", ""],
 ["is_published", "boolean", "default true", ""],
 ["created_at / updated_at", "timestamptz", "", ""],
])
entity("industries", "Sector landing pages (planned growth content).",
[
 ["id", "uuid", "PK", ""],
 ["slug", "text", "unique, not null", ""],
 ["name", "text", "not null", ""],
 ["description / body", "text", "null", ""],
 ["order_index", "int", "default 0", ""],
 ["is_published", "boolean", "default true", ""],
])
entity("testimonials", "Short client quotes for social proof.",
[
 ["id", "uuid", "PK", ""],
 ["author_name", "text", "not null", ""],
 ["author_role / company", "text", "null", ""],
 ["quote", "text", "not null", ""],
 ["is_published", "boolean", "default true", ""],
 ["order_index", "int", "default 0", ""],
])
entity("subscribers", "Newsletter list with double opt-in.",
[
 ["id", "uuid", "PK", ""],
 ["email", "citext", "unique, not null", ""],
 ["status", "subscriber_status", "default 'pending'", ""],
 ["confirm_token / unsubscribe_token", "text", "unique", "Single-use tokens."],
 ["confirmed_at", "timestamptz", "null", ""],
 ["created_at", "timestamptz", "default now()", ""],
], ("subscriber_status", "pending | confirmed | unsubscribed"))
entity("media", "Uploaded assets (images for content).",
[
 ["id", "uuid", "PK", ""],
 ["url", "text", "not null", "CDN URL."],
 ["storage_key", "text", "not null", "Bucket key."],
 ["filename", "text", "not null", ""],
 ["alt_text", "text", "null", "Accessibility/SEO."],
 ["mime_type", "text", "not null", ""],
 ["width / height", "int", "null", ""],
 ["size_bytes", "bigint", "null", ""],
 ["uploaded_by", "uuid", "FK→users", ""],
 ["created_at", "timestamptz", "default now()", ""],
])
entity("audit_logs", "Append-only record of admin actions (accountability).",
[
 ["id", "uuid", "PK", ""],
 ["actor_id", "uuid", "FK→users, null", "Who (null = system)."],
 ["action", "text", "not null", "e.g. 'post.publish'."],
 ["entity_type", "text", "not null", "e.g. 'post'."],
 ["entity_id", "uuid", "null", "Affected row."],
 ["metadata", "jsonb", "null", "Before/after / context."],
 ["ip_address", "inet", "null", ""],
 ["created_at", "timestamptz", "default now()", ""],
])
entity("settings", "Singleton-style key/value site configuration.",
[
 ["key", "text", "PK", "e.g. 'contact', 'social'."],
 ["value", "jsonb", "not null", "Structured value."],
 ["updated_by", "uuid", "FK→users, null", ""],
 ["updated_at", "timestamptz", "default now()", ""],
])

# ---- 6. Data flows ----------------------------------------------------------
H1("6.  Key Data Flows")
H3("6.1  Contact-form submission")
bullets([
    "1. Visitor submits the form; the client checks the honeypot and posts JSON to POST /api/enquiries.",
    "2. Rate-limit middleware (per IP) admits the request; Zod validates the body; consent must be true.",
    "3. The enquiry row is inserted with status='new' and source/page_path/ip captured.",
    "4. Two emails are sent via Resend: an internal alert and a confirmation to the submitter.",
    "5. 201 is returned; the front-end redirects to /thank-you (conversion event).",
    "6. Staff later triage the enquiry in the dashboard (status + notes), with each change audit-logged.",
])
H3("6.2  Publishing content")
bullets([
    "1. Editor creates/edits a post in the dashboard (status='draft').",
    "2. On 'Publish', PATCH sets status='published', published_at=now(); an audit log is written.",
    "3. The API triggers on-demand revalidation of the affected front-end routes (and sitemap).",
    "4. The public GET endpoints / server components now serve the new content with full SEO metadata.",
])
H3("6.3  Newsletter double opt-in")
bullets([
    "1. POST /api/subscribers creates a row status='pending' with a confirm_token; a confirm email is sent.",
    "2. The recipient clicks the link → GET /confirm?token=… sets status='confirmed', confirmed_at=now().",
    "3. Every send includes an unsubscribe link bound to unsubscribe_token (one-click, sets 'unsubscribed').",
])

# ---- 7. Security & compliance ----------------------------------------------
H1("7.  Security &amp; Data Protection")
H3("7.1  Authentication & authorisation")
bullets([
    "Admin auth via Auth.js credentials provider; passwords hashed with Argon2id; sessions in httpOnly, "
    "Secure, SameSite=Lax cookies. Optional TOTP 2FA for admin role.",
    "Role-based access (admin > editor > viewer) enforced server-side on every /api/admin route.",
    "No customer-facing accounts in v1; the public API is unauthenticated and read-/submit-only.",
])
H3("7.2  Input, transport & abuse")
bullets([
    "All input validated with Zod; output encoded by the framework; parameterised queries via Prisma (no raw SQL concatenation).",
    "TLS everywhere (HSTS). Security headers: CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.",
    "Public POSTs rate-limited (e.g. 5/min/IP) via Upstash; honeypot already present; optional Cloudflare Turnstile.",
    "Secrets only in environment variables / Vercel project settings; never committed; rotated on exposure.",
])
H3("7.3  UK GDPR / Data Protection Act 2018")
bullets([
    "Lawful basis: legitimate interest / pre-contract for enquiries; consent for newsletter (double opt-in).",
    "Data minimisation: only the fields listed are collected; no special-category data.",
    "Retention: enquiries retained per policy (e.g. 24 months after last contact) then erased by the daily sweep; "
    "unconfirmed subscribers expire after 30 days.",
    "Data-subject rights: admin 'export' and 'erase' actions (POST …/erase) satisfy access &amp; erasure; "
    "audit_logs evidence accountability.",
    "Processors: Vercel (hosting), Neon (database), Resend (email), Upstash (transient) — all under DPAs; "
    "document international-transfer safeguards. This mirrors the published Privacy Policy.",
])
callout("PII lives in users, enquiries, enquiry_notes and subscribers. Restrict direct DB access, encrypt at "
        "rest (managed by the Postgres provider) and in transit, and keep these tables out of any analytics export.",
        label="PII LOCATION")

# ---- 8. Non-functional ------------------------------------------------------
H1("8.  Non-Functional Requirements")
table(["Attribute", "Target / approach"],
[
 ["Performance", "p95 API < 300 ms (excl. cold start); cache read-heavy public GETs (Redis + ISR)."],
 ["Availability", "≥ 99.9%; serverless auto-scale; managed DB with automated failover."],
 ["Scalability", "Stateless functions scale horizontally; DB connection pooling (PgBouncer / Prisma)."],
 ["Backups / DR", "Daily automated backups + point-in-time recovery (provider); restore runbook documented."],
 ["Observability", "Structured JSON logs, Sentry error tracking, uptime monitor, audit_logs for admin actions."],
 ["Accessibility / SEO", "API preserves the metadata + JSON-LD contract the front-end already renders."],
 ["Maintainability", "Typed end-to-end; Prisma migrations in version control; CI runs typecheck + tests."],
], [34*mm, 136*mm])

# ---- 9. Infrastructure ------------------------------------------------------
H1("9.  Infrastructure &amp; Deployment")
H3("9.1  Environments")
table(["Environment", "Purpose", "Database"],
[
 ["Development", "Local / per-engineer", "Local Postgres or Neon branch."],
 ["Preview", "Per pull-request (Vercel)", "Neon preview branch (ephemeral)."],
 ["Production", "Live site + admin", "Neon primary (backups + PITR)."],
], [34*mm, 78*mm, 58*mm])
H3("9.2  CI/CD")
bullets([
    "GitHub → Vercel: every PR gets a preview deployment; merge to main deploys production.",
    "CI pipeline: install → typecheck → lint → unit/integration tests → prisma migrate (deploy) → build.",
    "Database migrations run as a release step (prisma migrate deploy); never auto-apply on cold start.",
])
H3("9.3  Required environment variables")
table(["Variable", "Purpose"],
[
 ["DATABASE_URL", "Pooled Postgres connection string."],
 ["DIRECT_URL", "Direct (non-pooled) connection for migrations."],
 ["AUTH_SECRET", "Auth.js session/JWT signing secret."],
 ["RESEND_API_KEY", "Transactional email (already used)."],
 ["CONTACT_TO / CONTACT_FROM", "Enquiry notification addresses (already used)."],
 ["UPSTASH_REDIS_REST_URL / _TOKEN", "Rate-limit / cache."],
 ["BLOB_READ_WRITE_TOKEN  (or S3_*)", "Media storage credentials."],
 ["NEXT_PUBLIC_SITE_URL", "Canonical origin (already used by the front-end)."],
 ["SENTRY_DSN", "Error reporting."],
], [62*mm, 108*mm])

# ---- 10. Appendices ---------------------------------------------------------
H1("10.  Appendix A — Prisma schema (excerpt)")
code(
"""enum UserRole { admin editor viewer }
enum EnquiryStatus { new in_review contacted qualified won lost spam }
enum ContentStatus { draft scheduled published archived }

model User {
  id           String   @id @default(uuid()) @db.Uuid
  email        String   @unique
  passwordHash String
  fullName     String
  role         UserRole @default(editor)
  isActive     Boolean  @default(true)
  lastLoginAt  DateTime?
  enquiries    Enquiry[] @relation("assignee")
  posts        Post[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Enquiry {
  id         String        @id @default(uuid()) @db.Uuid
  name       String
  email      String
  company    String?
  phone      String?
  service    String?
  message    String
  status     EnquiryStatus @default(new)
  source     String        @default("contact_form")
  pagePath   String?
  consent    Boolean
  ipAddress  String?
  assignedTo String?       @db.Uuid
  assignee   User?         @relation("assignee", fields: [assignedTo], references: [id])
  notes      EnquiryNote[]
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt
  deletedAt  DateTime?
  @@index([status]) @@index([createdAt])
}

model Post {
  id          String        @id @default(uuid()) @db.Uuid
  slug        String        @unique
  title       String
  excerpt     String?
  body        String
  authorId    String        @db.Uuid
  author      User          @relation(fields: [authorId], references: [id])
  categoryId  String?       @db.Uuid
  status      ContentStatus @default(draft)
  publishedAt DateTime?
  views       Int           @default(0)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  @@index([status, publishedAt])
}""", "prisma/schema.prisma — representative models")

H1("11.  Appendix B — Mermaid ER diagram")
P("Paste into any Mermaid renderer to regenerate the full entity-relationship diagram.")
code(
"""erDiagram
  users ||--o{ enquiries : "assigned_to"
  users ||--o{ enquiry_notes : "author"
  enquiries ||--o{ enquiry_notes : "has"
  users ||--o{ posts : "author"
  categories ||--o{ posts : "categorises"
  posts ||--o{ post_tags : ""
  tags  ||--o{ post_tags : ""
  media ||--o{ posts : "cover"
  media ||--o{ case_studies : "cover"
  users ||--o{ media : "uploaded_by"
  users ||--o{ audit_logs : "actor"
  subscribers {
    uuid id
    citext email
    enum status
  }
  enquiries {
    uuid id
    citext email
    enum status
    timestamptz created_at
  }
  posts {
    uuid id
    text slug
    enum status
    timestamptz published_at
  }""", "ER diagram (Mermaid)")

H1("12.  Appendix C — Sample payloads")
code('POST /api/enquiries\n{\n  "name": "Jane Smith",\n  "email": "jane@acmebiotech.com",\n  "company": "Acme Biotech",\n'
     '  "service": "GMP & GDP Audits",\n  "message": "We need a supplier audit before an MHRA inspection.",\n'
     '  "consent": true,\n  "website": ""   // honeypot, must be empty\n}\n\n'
     '201 Created\n{ "data": { "id": "0190…", "status": "new", "createdAt": "2026-06-06T10:00:00Z" } }',
     "Create enquiry")

H1("13.  Assumptions &amp; Future Work")
bullets([
    "v1 assumes a small editorial team (single-digit users) and modest traffic; the design scales well beyond this.",
    "Content is Markdown/MDX rendered by the front-end; a richer block editor can be layered on later.",
    "Future: client portal & authenticated downloads, full-text site search, A/B testing, CRM/email-marketing integration, multi-language.",
    "If a headless CMS is preferred over the bespoke admin, the same entity model maps cleanly onto it; the public API contract should be preserved.",
])
SP(6)
P("— End of specification —", small)

# =============================================================================
# BUILD
# =============================================================================
W, Hh = A4
LM = RM = 20*mm

class Doc(BaseDocTemplate):
    def afterFlowable(self, f):
        if isinstance(f, Paragraph):
            st = f.style.name; txt = f.getPlainText()
            if st == 'H1': self.notify('TOCEntry', (0, txt, self.page))
            elif st == 'H2': self.notify('TOCEntry', (1, txt, self.page))

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
        canvas.drawString(LM, Hh-13*mm, "Double Helix Pharma UK — Backend & Database Design")
        canvas.drawRightString(W-RM, Hh-13*mm, "Confidential")
        canvas.line(LM, 13*mm, W-RM, 13*mm)
        canvas.drawString(LM, 9*mm, "v%s · %s" % (VERSION, DATE))
        canvas.drawRightString(W-RM, 9*mm, "Page %d" % (doc.page - 1))
    canvas.restoreState()

frame = Frame(LM, 18*mm, W-LM-RM, Hh-18*mm-20*mm, id='main')
doc = Doc(OUT, pagesize=A4, leftMargin=LM, rightMargin=RM, topMargin=22*mm, bottomMargin=18*mm,
          title="Double Helix Pharma UK — Backend & Database Design Specification",
          author="Double Helix Pharma UK Ltd")
doc.addPageTemplates([PageTemplate(id='main', frames=[frame], onPage=decorate)])
doc.multiBuild(story)
print("WROTE", OUT)
