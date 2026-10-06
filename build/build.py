"""
Building Wall Cutaway — build
Joins src/ into one standalone page: dist/index.html

  python build/build.py                         frames load from ../frames/ (local folder)
  python build/build.py --frames <url-or-path>  frames load from that folder or server
"""
import json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
read = lambda *a: open(P(*a), encoding='utf-8').read()

VERSION = read('VERSION').strip()
FRAMES = '../frames/'                                  # relative to dist/index.html
if '--frames' in sys.argv:
    FRAMES = sys.argv[sys.argv.index('--frames') + 1].rstrip('/') + '/'

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


def main():
    files = json.loads(read('src', 'data', 'frames.json'))
    frames = 'window.CUTAWAY_FRAMES=' + json.dumps({'base': FRAMES, 'files': files}, separators=(',', ':')) + ';'
    page = ('<!doctype html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            '<title>Inside the Wall | Building Wall Cutaway v%s</title>\n' % VERSION +
            '<meta name="robots" content="noindex, nofollow">\n' + FONTS +
            '<style>' + min_css(read('src', 'ui', 'ui.css')) + '</style>\n</head>\n<body>\n' +
            min_html(read('src', 'ui', 'ui.html')) + '\n' +
            '<script>' + frames + '</script>\n' +
            '<script>' + min_js(read('src', 'data', 'layers.js')) + '</script>\n' +
            '<script>' + min_js(read('src', 'engine', 'cutaway-engine.js')) + '</script>\n' +
            '<script>' + min_js(read('src', 'ui', 'ui.js')) + '</script>\n</body>\n</html>\n')
    os.makedirs(P('dist'), exist_ok=True)
    open(P('dist', 'index.html'), 'w', encoding='utf-8').write(page)
    print('dist/index.html  %d chars  (frames from %s)' % (len(page), FRAMES))


if __name__ == '__main__':
    main()
