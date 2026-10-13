"""
Building Cutaway — build
Joins src/ into one page and assembles a deployable dist/ (Cloudflare Pages):

  dist/index.html    the whole experience, frames loaded from frames/
  dist/frames/       copy of frames/
  dist/assets/       copy of assets/
  dist/_headers      long cache for /frames/* and /assets/*

  python3 build/build.py                         default, as run by Cloudflare
  python3 build/build.py --frames <url-or-path>  load frames from elsewhere (frames/ is then not copied)

Terser is used to minify the JS if it is installed (npm i -g terser); otherwise the JS ships as is.
"""
import json, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
read = lambda *a: open(P(*a), encoding='utf-8').read()

VERSION = read('VERSION').strip()
FRAMES = 'frames/'                                     # relative to dist/index.html
if '--frames' in sys.argv:
    FRAMES = sys.argv[sys.argv.index('--frames') + 1].rstrip('/') + '/'

TITLE = 'Through-wall SFS, layer by layer | Performance Technology Group'
DESCRIPTION = ('Fire, thermal and acoustic insulation for the building envelope. '
               'Scroll through a cutaway of the through-wall SFS system, layer by layer.')
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap">\n')
# Engine config the UI owns: blend the phone layout into the page colour (paper)
CONFIG = "window.CUTAWAY_CONFIG={narrowFade:['rgba(244,245,244,1)','rgba(244,245,244,1)']};"
HEADERS = ('/frames/*\n  Cache-Control: public, max-age=31536000, immutable\n'
           '/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n')


def min_css(t):
    t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r'\s*([{};,>])\s*', r'\1', t)
    return t.replace(';}', '}').strip()


def min_js(t):
    """Minify with terser if installed; otherwise ship as is."""
    try:
        r = subprocess.run(['terser', '-c', '-m', '--comments', '/^!/'], input=t, capture_output=True,
                           text=True, encoding='utf-8', check=True, shell=(os.name == 'nt'))
        return r.stdout or t
    except Exception:
        return t


def min_html(t):
    t = re.sub(r'<!--.*?-->', '', t, flags=re.S)
    return re.sub(r'>\s+<', '><', t).strip()


def copy_dir(name):
    if os.path.isdir(P(name)):
        shutil.copytree(P(name), P('dist', name))
        return len(os.listdir(P('dist', name)))
    print('warning: %s/ not found, skipped' % name)
    return 0


def main():
    files = json.loads(read('src', 'data', 'frames.json'))
    frames = 'window.CUTAWAY_FRAMES=' + json.dumps({'base': FRAMES, 'files': files}, separators=(',', ':')) + ';'
    first = FRAMES + files[min(10, len(files) - 1)]          # engine shows frameStart (10) first
    page = ('<!doctype html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            '<title>%s</title>\n<meta name="description" content="%s">\n' % (TITLE, DESCRIPTION) +
            '<meta name="generator" content="Building Cutaway v%s">\n' % VERSION +
            '<meta name="robots" content="noindex, nofollow">\n'
            '<meta name="theme-color" content="#F4F5F4">\n'
            '<link rel="icon" href="assets/ptg-logo.png">\n'
            '<link rel="preload" as="image" href="%s" fetchpriority="high">\n' % first + FONTS +
            '<style>' + min_css(read('src', 'ui', 'ui.css')) + '</style>\n</head>\n<body>\n' +
            min_html(read('src', 'ui', 'ui.html')) + '\n' +
            '<script>' + frames + CONFIG + '</script>\n' +
            '<script>' + min_js(read('src', 'data', 'layers.js')) + '</script>\n' +
            '<script>' + min_js(read('src', 'engine', 'cutaway-engine.js')) + '</script>\n' +
            '<script>' + min_js(read('src', 'ui', 'ui.js')) + '</script>\n</body>\n</html>\n')

    shutil.rmtree(P('dist'), ignore_errors=True)
    os.makedirs(P('dist'))
    open(P('dist', 'index.html'), 'w', encoding='utf-8', newline='\n').write(page)
    open(P('dist', '_headers'), 'w', encoding='utf-8', newline='\n').write(HEADERS)
    n_assets = copy_dir('assets')
    n_frames = copy_dir('frames') if FRAMES == 'frames/' else 0
    print('dist/index.html  %d chars  v%s  (frames from %s)' % (len(page), VERSION, FRAMES))
    print('dist/assets/     %d files' % n_assets)
    print('dist/frames/     %d files' % n_frames)
    print('dist/_headers    long cache for /frames/* and /assets/*')


if __name__ == '__main__':
    main()
