# Material Symbols ikon shriftini faqat ilovada ishlatilgan ikonlar bilan yig'ish (~100 KB o'rniga 4 MB).
# Yangi ikon qo'shilganda: npm i material-symbols (vaqtincha), pip install fonttools brotli,
#   python3 tools/subset-icons.py node_modules/material-symbols/material-symbols-outlined.woff2
import os, re, subprocess, sys
from fontTools.ttLib import TTFont
ROOT = os.path.dirname(os.path.abspath(__file__)) + '/..'
FULL = sys.argv[1] if len(sys.argv) > 1 else 'node_modules/material-symbols/material-symbols-outlined.woff2'
OUT = ROOT + '/fonts/material-symbols-outlined.woff2'

def lig_map(path):
    f = TTFont(path)
    rev = {g: chr(cp) for cp, g in f.getBestCmap().items() if cp < 128}
    out = {}
    for lookup in f['GSUB'].table.LookupList.Lookup:
        for st in lookup.SubTable:
            if st.LookupType == 7: st = st.ExtSubTable
            if getattr(st, 'LookupType', None) != 4: continue
            for first, ligs in st.ligatures.items():
                for lg in ligs:
                    chars = [rev.get(g) for g in [first] + lg.Component]
                    if None in chars: continue
                    out[''.join(chars)] = lg.LigGlyph
    return out

full = lig_map(FULL)
src = open(ROOT + '/app.js').read() + open(ROOT + '/index.html').read()
used = set(re.findall(r'material-symbols-outlined[^"]*">([a-z0-9_]+)<', src)) | set(re.findall(r"'([a-z0-9_]+)'", src))
names = sorted(u for u in used if u in full)
print(len(names), 'icons:', ' '.join(names))
glyphs = sorted({full[n] for n in names})
subprocess.run([sys.executable, '-m', 'fontTools.subset', FULL, '--glyphs=' + ','.join(glyphs),
  '--text=abcdefghijklmnopqrstuvwxyz0123456789_', '--no-layout-closure', '--layout-features=rlig,rclt,liga',
  '--flavor=woff2', '--output-file=' + OUT], check=True)
print('ligatures in output:', len(lig_map(OUT)), 'size:', os.path.getsize(OUT))
