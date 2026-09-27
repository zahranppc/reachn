#!/usr/bin/env python3
"""Build index.html from src/. Usage: python3 build.py [--missing]
Inlines CSS, JS, the logo sprite and the Arabic dictionary into one file.
--missing prints every visible English string that has no Arabic entry."""
import json, re, sys, pathlib
from html.parser import HTMLParser

R = pathlib.Path(__file__).parent
S = R / 'src'
WM = '<svg class="wm" viewBox="0 0 1000 168.19" role="img" aria-label="WalaPlus"><use href="#wp-wm"/></svg>'
ARC = '<svg viewBox="0 0 100 37.31" aria-hidden="true"><use href="#wp-arc"/></svg>'
PWR = '<span class="pwr" data-notr>Powered by <span class="rn">Reach<b>N</b></span></span>'
SUBS = {'{{WM}}': WM, '{{ARC}}': ARC, '{{PWRD}}': PWR.replace('class="pwr"', 'class="pwr on-dark"'), '{{PWR}}': PWR}
HEAD = '''<title>ReachN</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
'''
norm = lambda s: re.sub(r'\s+', ' ', s.strip())


class Strings(HTMLParser):
    """Collects translatable text chunks and attributes, skipping data-notr subtrees."""
    VOID = {'input', 'br', 'img', 'meta', 'link', 'hr', 'use', 'path'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip, self.stack, self.out = 0, [], []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag not in self.VOID:
            notr = 'data-notr' in a or tag in ('script', 'style', 'svg')
            self.stack.append(notr)
            self.skip += notr
        if not self.skip:
            for k in ('placeholder', 'aria-label', 'data-toast'):
                if a.get(k):
                    self.out.append(norm(a[k]))

    def handle_endtag(self, tag):
        if tag not in self.VOID and self.stack:
            self.skip -= self.stack.pop()

    def handle_data(self, d):
        if not self.skip and norm(d):
            self.out.append(norm(d))


def js_strings(js):
    """String literals in app.js that reach the screen: a rough but useful net."""
    out = []
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'", js):
        s = m.group(1)
        if re.search(r'[A-Za-z]{3,} [A-Za-z]', s) and not re.search(r'[<>{}=$]|^#|^\[|querySelector|https?:', s):
            out.append(norm(s))
    return out


def main():
    page = (S / 'page.html').read_text()
    js = (S / 'app.js').read_text()
    ar = json.loads((S / 'ar.json').read_text()) if (S / 'ar.json').exists() else {}
    for k, v in SUBS.items():
        page, js = page.replace(k, v), js.replace(k, v)
    js_src = js
    js = js.replace('/*{{ARJSON}}*/{}', json.dumps(ar, ensure_ascii=False, separators=(',', ':')))
    html = (HEAD + '<style>\n' + (S / 'styles.css').read_text() + '</style>\n\n' + (S / 'sprite.html').read_text() + '\n\n'
            + page + '\n<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>\n<script>\n' + js + '</script>\n')
    assert '{{' not in html.replace('{{ARJSON}}', ''), 'unreplaced placeholder'
    # artifact.html is the fragment the Claude artifact host wraps; index.html is the full document for GitHub Pages
    (R / 'artifact.html').write_text(html)
    doc = ('<!doctype html>\n<html lang="en" dir="ltr">\n<head>\n<meta charset="utf-8">\n'
           '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
           '<meta name="description" content="ReachN: NFC business cards, wallet passes, email signatures, campaigns and lead capture for every employee.">\n'
           + html.replace('<svg style="position:absolute', '</head>\n<body>\n<svg style="position:absolute', 1) + '</body>\n</html>\n')
    (R / 'index.html').write_text(doc)
    print(f'index.html  {len(doc):,} bytes  ·  {len(ar)} Arabic entries')
    if '--missing' in sys.argv:
        p = Strings(); p.feed(page)
        seen, miss = set(), []
        for s in p.out + js_strings(js_src):
            if s not in seen and s not in ar and re.search(r'[A-Za-z]{2}', s):
                seen.add(s); miss.append(s)
        print(f'{len(miss)} strings without Arabic:')
        for s in miss:
            print(json.dumps(s, ensure_ascii=False))


if __name__ == '__main__':
    main()
