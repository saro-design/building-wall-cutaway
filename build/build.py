"""
Building Wall Cutaway — build
Turns src/ into the two blocks pasted into Webflow, plus local preview pages.

  python build/build.py            -> dist/ from the version in VERSION
  python build/build.py --release  -> also snapshots dist/ into releases/v<VERSION>/

Webflow:  dist/webflow/head.html   -> Page settings > Custom code > Inside <head> tag
          dist/webflow/footer.html -> Page settings > Custom code > Before </body> tag
"""
import json, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
read = lambda *a: open(P(*a), encoding='utf-8').read()

VERSION = read('VERSION').strip()
CDN = 'https://cdn.prod.website-files.com/6727c4f2f702337c9ec0a033/'
LOCAL_FRAMES = '../../frames/'          # relative to dist/preview/
WEBFLOW_LIMIT = 50000                                  # characters per custom-code block

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700'
         '&family=Barlow:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap">\n')


def min_css(t):
    t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r'\s*([{};,>])\s*', r'\1', t)
    return t.replace(';}', '}').strip()


def min_js(t):
    """Minify with terser if installed (npm i -g terser); otherwise ship as is."""
    try:
        r = subprocess.run(['terser', '-c', '-m', '--comments', '/^!/'], input=t, capture_output=True, text=True, check=True)
        return r.stdout
    except Exception:
        return t


def min_html(t):
    return re.sub(r'>\s+<', '><', t).strip()


def frames_js(base, files):
    return 'window.CUTAWAY_FRAMES=' + json.dumps({'base': base, 'files': files}, separators=(',', ':'), ensure_ascii=False) + ';'


def blocks(frames):
    tag = '<!-- Building Wall Cutaway v%s | engine %s | ui %s -->\n' % (VERSION, 'src/engine/cutaway-engine.js', 'src/ui/*')
    head = (tag + '<meta name="robots" content="noindex, nofollow">\n' + FONTS +
            '<style>' + min_css(read('src', 'ui', 'ui.css')) + '</style>\n')
    foot = (tag + min_html(read('src', 'ui', 'ui.html')) + '\n' +
            '<script>' + frames + '</script>\n' +
            '<script>' + min_js(read('src', 'data', 'layers.js')) + '</script>\n' +
            '<script>' + min_js(read('src', 'engine', 'cutaway-engine.js')) + '</script>\n' +
            '<script>' + min_js(read('src', 'ui', 'ui.js')) + '</script>\n')
    return head, foot


def page(head, foot, title):
    return ('<!doctype html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            '<title>%s</title>\n%s</head>\n<body>\n%s</body>\n</html>\n' % (title, head, foot))


def write(rel, text):
    path = P(*rel.split('/'))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf-8').write(text)
    return len(text)


def main():
    files = json.loads(read('src', 'data', 'frames.json'))
    head, foot = blocks(frames_js(CDN, files))
    for name, text in (('head', head), ('footer', foot)):
        n = write('dist/webflow/%s.html' % name, text)
        flag = '' if n < WEBFLOW_LIMIT else '   <-- OVER WEBFLOW LIMIT'
        print('webflow/%s.html  %6d chars%s' % (name, n, flag))

    write('dist/preview/index.html', page(head, foot, 'Inside the Wall v%s (Webflow frames)' % VERSION))
    local = [f.split('_', 1)[-1] for f in files]
    lh, lf = blocks(frames_js(LOCAL_FRAMES, local))
    write('dist/preview/index-local.html', page(lh, lf, 'Inside the Wall v%s (local frames)' % VERSION))
    print('preview/index.html, preview/index-local.html')

    if '--release' in sys.argv:
        dst = P('releases', 'v' + VERSION)
        if os.path.exists(dst):
            sys.exit('releases/v%s already exists. Bump VERSION first.' % VERSION)
        shutil.copytree(P('dist'), dst)
        shutil.copytree(P('src'), os.path.join(dst, 'src'))
        print('snapshot -> releases/v%s' % VERSION)


if __name__ == '__main__':
    main()
