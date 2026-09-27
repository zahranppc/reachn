#!/usr/bin/env python3
"""Generate docs/ReachN-product-document.html (English + Arabic) from src/page.html and src/ar.json."""
import json, re, html, pathlib
from html.parser import HTMLParser

R = pathlib.Path(__file__).parent
AR = json.loads((R / 'src/ar.json').read_text())
norm = lambda s: re.sub(r'\s+', ' ', s.strip())
BLOCK = {'h1', 'h2', 'h3', 'p', 'li', 'summary', 'b'}
SKIP = {'a', 'button', 'form', 'nav', 'header', 'footer', 'svg', 'table', 'select', 'label'}
VOID = {'input', 'br', 'img', 'meta', 'link', 'hr', 'use', 'path'}


class Pages(HTMLParser):
    """Walks the website pages and emits (page, tag, [text chunks]) in reading order."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.page, self.skip, self.stack, self.cur, self.out, self.label = None, 0, [], None, [], False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'main':
            self.page = a.get('data-page')
        if tag in VOID:
            return
        cls = a.get('class', '')
        kind = None
        if tag in SKIP:
            kind = 'skip'; self.skip += 1
        elif self.page and not self.skip and self.cur is None:
            if tag in BLOCK or (tag == 'div' and 'price' in cls):
                kind = 'block'
                t = 'label' if ('eyebrow' in cls) else ('price' if tag == 'div' else tag)
                self.cur = [t, []]
            elif tag == 'span' and 'k' in cls.split():
                kind = 'block'; self.cur = ['label', []]
        self.stack.append((tag, kind))

    def handle_endtag(self, tag):
        if tag in VOID or not self.stack:
            return
        t, kind = self.stack.pop()
        if kind == 'skip':
            self.skip -= 1
        elif kind == 'block' and self.cur:
            if self.cur[1]:
                self.out.append((self.page, self.cur[0], self.cur[1]))
            self.cur = None
        if tag == 'main':
            self.page = None

    def handle_data(self, d):
        if self.cur is not None and not self.skip and norm(d):
            self.cur[1].append(norm(d))


def tr(chunks, lang):
    parts = [AR.get(c, c) if lang == 'ar' else c for c in chunks]
    return html.escape(' '.join(parts)).replace(' .', '.').replace(' ,', ',')


PAGES = [('home', 'Home page', 'الصفحة الرئيسية'), ('features', 'Features page', 'صفحة المزايا'), ('business', 'Business page', 'صفحة الشركات'),
         ('enterprise', 'Enterprise page', 'صفحة المؤسسات الكبرى'), ('pricing', 'Pricing page', 'صفحة الأسعار'), ('faq', 'FAQ page', 'صفحة الأسئلة الشائعة'),
         ('demo', 'Book a demo page', 'صفحة طلب العرض التجريبي')]

INTERNAL = [
    ('Login', 'Everyone', 'Sign in with the work account or company SSO. Two roles: HR super admin and employee.',
     'الدخول', 'الجميع', 'الدخول بحساب العمل أو عبر SSO. صلاحيتان: مدير الموارد البشرية والموظف.'),
    ('Employees', 'HR super admin', 'Roster with kit status per employee: photo, email, phone, LinkedIn, wallet and NFC card. Import roster, remind incomplete, order cards.',
     'الموظفون', 'مدير الموارد البشرية', 'قائمة الموظفين وحالة حقيبة كل موظف: الصورة والبريد والجوال و LinkedIn والمحفظة وبطاقة NFC. استيراد القائمة، تذكير غير المكتملين، طلب البطاقات.'),
    ('Brand and templates', 'HR super admin', 'Logo, colors, card design, company details, legal disclaimer and license number. Several locked templates per brand, region or division.',
     'الهوية والقوالب', 'مدير الموارد البشرية', 'الشعار والألوان وتصميم البطاقة وبيانات الشركة وإخلاء المسؤولية ورقم الترخيص. قوالب مقفلة متعددة لكل علامة أو منطقة أو قطاع.'),
    ('Campaigns', 'HR super admin', 'Create a campaign with a headline, caption, creative and channels, then push it to all employees. Shares, reach and top sharers.',
     'الحملات', 'مدير الموارد البشرية', 'إنشاء حملة بعنوان ونص وتصميم وقنوات ثم إرسالها لكل الموظفين. المشاركات والوصول وأكثر الموظفين مشاركة.'),
    ('LinkedIn publisher', 'HR super admin', 'Publish company news to the company LinkedIn page. Six post types: new hire welcome, new vacancy, promotion, work anniversary, company news, event. Post written in English or Arabic from a template, with a branded creative. Publish now, schedule or save a draft. Option to push the same post to employees as a campaign.',
     'النشر على LinkedIn', 'مدير الموارد البشرية', 'نشر أخبار الشركة على صفحتها في LinkedIn. ستة أنواع: ترحيب بموظف جديد، وظيفة شاغرة، ترقية، ذكرى انضمام، خبر، فعالية. النص يُكتب بالعربية أو الإنجليزية من قالب مع تصميم بهوية الشركة. نشر فوري أو جدولة أو مسودة. وخيار لإرسال المنشور نفسه للموظفين كحملة.'),
    ('Leads and contacts', 'HR super admin', 'Company contact book. Every contact captured by employees with source, event, qualification and CRM status. Filter by event, export CSV, enrich missing details.',
     'العملاء المحتملون وجهات الاتصال', 'مدير الموارد البشرية', 'دفتر جهات اتصال الشركة. كل جهة سجّلها الموظفون مع المصدر والفعالية والتصنيف وحالة CRM. تصفية حسب الفعالية، تصدير CSV، استكمال البيانات الناقصة.'),
    ('Analytics', 'HR super admin', 'Card views, contacts saved, wallet adds and campaign shares. Results by event with estimated pipeline. Contact sources. Most active employees.',
     'التحليلات', 'مدير الموارد البشرية', 'مشاهدات البطاقات ومرات الحفظ وإضافات المحفظة ومشاركات الحملات. النتائج حسب الفعالية مع قيمة الفرص التقديرية. مصادر جهات الاتصال. الموظفون الأكثر نشاطاً.'),
    ('Integrations', 'HR super admin', 'Connect CRM (Salesforce, HubSpot, Microsoft Dynamics 365, Zoho CRM, Pipedrive), directory and sign-on (Microsoft Entra ID, Okta, Active Directory, SAML SSO, SCIM), email (Google Workspace, Microsoft 365, Outlook Contacts), LinkedIn company page, Zapier, webhooks and the ReachN API.',
     'الربط', 'مدير الموارد البشرية', 'ربط CRM (Salesforce و HubSpot و Microsoft Dynamics 365 و Zoho CRM و Pipedrive)، والدليل المؤسسي والدخول (Microsoft Entra ID و Okta و Active Directory و SAML SSO و SCIM)، والبريد (Google Workspace و Microsoft 365 و Outlook Contacts)، وصفحة الشركة في LinkedIn، و Zapier و Webhooks و ReachN API.'),
    ('Card orders', 'HR super admin', 'NFC card print batches with template, status and delivery address.',
     'طلبات البطاقات', 'مدير الموارد البشرية', 'دفعات طباعة بطاقات NFC مع القالب والحالة وعنوان التسليم.'),
    ('Settings', 'HR super admin', 'Fields employees can edit, signature layouts offered, signature deployment to Google Workspace and Microsoft 365, sharing options, share flow and lead form, seats and billing, data export, Powered by ReachN attribution.',
     'الإعدادات', 'مدير الموارد البشرية', 'الحقول التي يعدّلها الموظف، تصاميم التوقيع المتاحة، تعميم التوقيع على Google Workspace و Microsoft 365، خيارات المشاركة، مسار المشاركة ونموذج التسجيل، التراخيص والفواتير، تصدير البيانات، وعلامة Powered by ReachN.'),
    ('My profile and card', 'Employee', 'Edit name, photo, work phone and LinkedIn URL. Title, company and work email are HR only. Live NFC card with QR. Share employee card, share contact card, add to Apple Wallet or Google Wallet, send to Apple Watch, add a home-screen widget.',
     'ملفي وبطاقتي', 'الموظف', 'تعديل الاسم والصورة وجوال العمل ورابط LinkedIn. المسمى والشركة وبريد العمل للموارد البشرية فقط. بطاقة NFC مع QR تتحدث مباشرة. مشاركة بطاقة الموظف وبطاقة التواصل، والإضافة إلى Apple Wallet أو Google Wallet، والإرسال إلى Apple Watch، وإضافة ودجت.'),
    ('My brand kit', 'Employee', 'Email signature with three layouts (Classic, Compact, Banner), virtual background, cover banner and event badge. Copy, download or print.',
     'حقيبة هويتي', 'الموظف', 'توقيع البريد بثلاثة تصاميم (كلاسيكي، مختصر، بانر)، خلفية الاجتماعات، صورة الغلاف، وبطاقة الفعالية. نسخ أو تحميل أو طباعة.'),
    ('Campaigns', 'Employee', 'Feed of company campaigns. Edit the caption, then share on LinkedIn, X or WhatsApp with one button.',
     'الحملات', 'الموظف', 'صفحة حملات الشركة. تعديل النص ثم المشاركة على LinkedIn أو X أو WhatsApp بزر واحد.'),
    ('My contacts', 'Employee', 'Scan a badge, a paper card or a QR code, with the current event selected. Works offline. AI meeting notes with summary and follow-up. List of contacts captured by the employee.',
     'جهات اتصالي', 'الموظف', 'مسح بطاقة فعالية أو بطاقة ورقية أو رمز QR مع تحديد الفعالية الحالية. يعمل بلا إنترنت. ملاحظات الاجتماع بالذكاء الاصطناعي مع ملخص ومتابعة. قائمة الجهات التي سجّلها الموظف.'),
    ('Public contact card', 'Anyone who taps or scans', 'Same design as the printed card. Save contact, send details back through the lead form, add to Apple Wallet or Google Wallet. Carries Powered by ReachN.',
     'البطاقة العامة', 'كل من يلمس البطاقة أو يمسحها', 'بتصميم البطاقة المطبوعة نفسه. حفظ البيانات، إرسال البيانات عبر نموذج التسجيل، الإضافة إلى Apple Wallet أو Google Wallet. وتحمل علامة Powered by ReachN.'),
]

T = {
    'en': dict(title='ReachN product document', sub='Website content and internal pages · English and Arabic', part='Part 1 · English',
               ov='1. Overview', ovp=['ReachN is an employee brand platform. Each employee has one profile. From that profile the platform produces an NFC business card with a QR code, a digital contact card, a wallet pass, an email signature, a virtual background, a cover banner and an event badge.',
                                      'HR runs the platform as super admin. HR also pushes company campaigns for employees to share and publishes company news to LinkedIn. Employees capture the people they meet, and every contact goes to the company CRM.',
                                      'Every shared material, digital or printed, carries a "Powered by ReachN" mark.'],
               web='2. Website content', internal='3. Internal pages', cols=('Page', 'Who uses it', 'What it does'),
               open='4. Decisions still open', openl=['Pricing on the website is a draft: SAR 9 and SAR 15 per employee per month, SAR 35 per NFC card.', 'Security and compliance statements need legal and technical confirmation before launch.', 'The reachn.com domain and hello@reachn.com address are placeholders.', 'The demo workspace uses the WalaPlus brand and sample data.'],
               links='Live site', ),
    'ar': dict(title='وثيقة منتج ReachN', sub='محتوى الموقع والصفحات الداخلية', part='الجزء الثاني · العربية',
               ov='1. نظرة عامة', ovp=['ReachN منصة لهوية الموظفين. لكل موظف ملف واحد. ومن هذا الملف تُصمَّم بطاقة عمل NFC مع رمز QR، وبطاقة تواصل رقمية، وبطاقة في المحفظة، وتوقيع بريد، وخلفية اجتماعات، وصورة غلاف، وبطاقة فعالية.',
                                      'الموارد البشرية تدير المنصة بصلاحية المدير العام. وترسل حملات الشركة ليشاركها الموظفون، وتنشر أخبار الشركة على LinkedIn. والموظف يسجّل بيانات من يقابلهم، وكل جهة اتصال تصل إلى CRM الشركة.',
                                      'كل مادة تُشارَك، رقمية أو مطبوعة، تحمل علامة «Powered by ReachN».'],
               web='2. محتوى الموقع', internal='3. الصفحات الداخلية', cols=('الصفحة', 'المستخدم', 'الوظيفة'),
               open='4. قرارات لم تُحسم', openl=['الأسعار في الموقع مبدئية: 9 و 15 ريالاً لكل موظف شهرياً، و 35 ريالاً لبطاقة NFC.', 'عبارات الأمن والامتثال تحتاج تأكيداً قانونياً وتقنياً قبل الإطلاق.', 'النطاق reachn.com والبريد hello@reachn.com مؤقتان.', 'مساحة العمل التجريبية تستخدم هوية WalaPlus وبيانات تجريبية.'],
               links='الموقع'),
}


def build(blocks, lang):
    """One language as a flat list of (kind, payload). Kinds: h1 h2 h3 h4 p pb pi li table."""
    t, i, o = T[lang], (3 if lang == 'ar' else 0), []
    plain = lambda chunks: re.sub(r' ([.,])', r'\1', ' '.join(AR.get(c, c) if lang == 'ar' else c for c in chunks))
    o += [('h1', t['part']), ('h2', t['ov'])] + [('p', x) for x in t['ovp']]
    o += [('p', t['links'] + ': https://zahranppc.github.io/reachn/' + ('?lang=ar' if lang == 'ar' else '')), ('h2', t['web'])]
    kind = {'h1': 'h4', 'h2': 'h4', 'h3': 'pb', 'b': 'pb', 'summary': 'pb', 'price': 'pb', 'label': 'pi', 'li': 'li', 'p': 'p'}
    for page, en, ar in PAGES:
        o.append(('h3', ar if lang == 'ar' else en))
        o += [(kind[tag], plain(ch)) for pg, tag, ch in blocks if pg == page]
    o += [('h2', t['internal']), ('table', [list(t['cols'])] + [[r[i], r[i + 1], r[i + 2]] for r in INTERNAL])]
    o += [('h2', t['open'])] + [('li', x) for x in t['openl']]
    return o


def to_html(parts):
    o = ['<!doctype html><html><head><meta charset="utf-8"><title>ReachN product document</title></head><body style="font-family:Arial,sans-serif">',
         '<p style="font-size:26pt"><b>ReachN product document</b></p>']
    for lang, items in parts:
        d = ' dir="rtl" style="text-align:right"' if lang == 'ar' else ''
        tags = {'h1': 'h1', 'h2': 'h2', 'h3': 'h3', 'h4': 'h4', 'p': 'p', 'pb': 'p', 'pi': 'p', 'li': 'li'}
        for k, v in items:
            if k == 'table':
                o.append(f'<table border="1" cellpadding="6" cellspacing="0"{" dir=rtl" if lang == "ar" else ""}>' + ''.join(
                    '<tr>' + ''.join(f'<t{"h" if n == 0 else "d"}{d}>{html.escape(c)}</t{"h" if n == 0 else "d"}>' for c in row) + '</tr>' for n, row in enumerate(v)) + '</table>')
                continue
            x = html.escape(v)
            x = f'<b>{x}</b>' if k == 'pb' else f'<i>{x}</i>' if k == 'pi' else x
            o.append(f'<{tags[k]}{d}>{x}</{tags[k]}>')
        o.append('<hr>')
    return '\n'.join(o) + '</body></html>'


def to_docx(parts, path):
    """Minimal Word file written by hand: real heading styles, bullets, tables and right-to-left paragraphs."""
    import zipfile
    from xml.sax.saxutils import escape as e
    W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'

    def run(text, rtl, b=False, i=False):
        pr = ('<w:b/><w:bCs/>' if b else '') + ('<w:i/><w:iCs/>' if i else '') + ('<w:rtl/>' if rtl else '')
        return f'<w:r><w:rPr>{pr}</w:rPr><w:t xml:space="preserve">{e(text)}</w:t></w:r>'

    def para(text, rtl, style=None, b=False, i=False, bullet=False):
        pr = (f'<w:pStyle w:val="{style}"/>' if style else '') + ('<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>' if bullet else '') + ('<w:bidi/>' if rtl else '')
        return f'<w:p><w:pPr>{pr}</w:pPr>{run(text, rtl, b, i)}</w:p>'

    body = [para('ReachN product document', False, 'Title'),
            para('Website content and internal pages · English and Arabic · 27 September 2026', False),
            para('وثيقة منتج ReachN · محتوى الموقع والصفحات الداخلية · بالعربية والإنجليزية', True)]
    st = {'h1': 'Heading1', 'h2': 'Heading2', 'h3': 'Heading3', 'h4': 'Heading4'}
    for n, (lang, items) in enumerate(parts):
        rtl = lang == 'ar'
        if n:
            body.append('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
        for k, v in items:
            if k == 'table':
                rows = ''
                for r, row in enumerate(v):
                    cells = ''.join(f'<w:tc><w:tcPr><w:tcW w:w="{w}" w:type="dxa"/></w:tcPr>{para(c, rtl, b=(r == 0 or ci == 0))}</w:tc>' for ci, (c, w) in enumerate(zip(row, (2200, 1900, 5200))))
                    rows += f'<w:tr>{cells}</w:tr>'
                border = ''.join(f'<w:{s} w:val="single" w:sz="4" w:space="0" w:color="999999"/>' for s in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'))
                body.append(f'<w:tbl><w:tblPr>{"<w:bidiVisual/>" if rtl else ""}<w:tblW w:w="9300" w:type="dxa"/><w:tblBorders>{border}</w:tblBorders>'
                            f'<w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr>{rows}</w:tbl>')
                body.append(para('', rtl))
            else:
                body.append(para(v, rtl, st.get(k), b=(k == 'pb'), i=(k == 'pi'), bullet=(k == 'li')))
    doc = f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document {W}><w:body>{"".join(body)}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1300" w:right="1300" w:bottom="1300" w:left="1300" w:header="700" w:footer="700" w:gutter="0"/></w:sectPr></w:body></w:document>'

    def style(sid, name, size, bold=False, before=0, after=120, based='Normal', outline=None, color='111111'):
        return (f'<w:style w:type="paragraph" w:styleId="{sid}"><w:name w:val="{name}"/>' + (f'<w:basedOn w:val="{based}"/><w:next w:val="Normal"/>' if sid != 'Normal' else '')
                + f'<w:pPr><w:spacing w:before="{before}" w:after="{after}"/>' + (f'<w:keepNext/><w:outlineLvl w:val="{outline}"/>' if outline is not None else '') + '</w:pPr>'
                + f'<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>' + ('<w:b/><w:bCs/>' if bold else '') + f'<w:color w:val="{color}"/><w:sz w:val="{size}"/><w:szCs w:val="{size}"/></w:rPr></w:style>')
    styles = (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles {W}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>'
              + style('Normal', 'Normal', 22) + style('Title', 'Title', 52, True, 0, 200) + style('Heading1', 'heading 1', 40, True, 360, 160, outline=0, color='2447F9')
              + style('Heading2', 'heading 2', 30, True, 320, 120, outline=1) + style('Heading3', 'heading 3', 26, True, 280, 100, outline=2, color='2447F9')
              + style('Heading4', 'heading 4', 23, True, 220, 80, outline=3) + '</w:styles>')
    numbering = (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering {W}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/>'
                 '<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl>'
                 '</w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>')
    ct = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
          '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'
          '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
          '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
          '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>')
    rel = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    rels = f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="{rel}/officeDocument" Target="word/document.xml"/></Relationships>'
    drels = f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="{rel}/styles" Target="styles.xml"/><Relationship Id="rId2" Type="{rel}/numbering" Target="numbering.xml"/></Relationships>'
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
        for name, data in (('[Content_Types].xml', ct), ('_rels/.rels', rels), ('word/document.xml', doc), ('word/styles.xml', styles), ('word/numbering.xml', numbering), ('word/_rels/document.xml.rels', drels)):
            z.writestr(name, data)


def main():
    p = Pages(); p.feed((R / 'src/page.html').read_text())
    parts = [(l, build(p.out, l)) for l in ('en', 'ar')]
    (R / 'docs').mkdir(exist_ok=True)
    (R / 'docs/ReachN-product-document.html').write_text(to_html(parts))
    to_docx(parts, R / 'docs/ReachN-product-document.docx')
    print('docs written:', sum(len(i) for _, i in parts), 'blocks')


if __name__ == '__main__':
    main()
