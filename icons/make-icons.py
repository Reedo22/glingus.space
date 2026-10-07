# Pixel-art icons: each grid char is a palette colour, '.' = transparent.
import sys, os
out = sys.argv[1]
P = {'k':'#000000','w':'#ffffff','s':'#c0c0c0','g':'#808080','y':'#ffff00','o':'#c0a000',
     'b':'#0000ff','n':'#000080','c':'#00ffff','t':'#008080','r':'#ff0000','m':'#800000',
     'G':'#00ff00','d':'#008000','p':'#800080','P':'#ff00ff'}
ICONS = {
'computer': """
................
..kkkkkkkkkkkk..
..kwwwwwwwwwgk..
..kwkkkkkkkwgk..
..kwkttttbkwgk..
..kwkttbbtkwgk..
..kwkbtttckwgk..
..kwkkkkkkkwgk..
..kwwwwwwwwwgk..
..kggggggggggk..
...kkkkkkkkkk...
.....kssssk.....
..kkkkkkkkkkkk..
..kwwwwwwwwwwgk.
..kssssssGsssgk.
..kkkkkkkkkkkkk.
""",
'folder': """
................
................
..kkkkk.........
.kyyyyyk........
kyywwwwykkkkkkk.
kywyyyyyyyyyyyok
kwyyyyyyyyyyyyok
kwyyyyyyyyyyyyok
kwyyyyyyyyyyyyok
kwyyyyyyyyyyyyok
kwyyyyyyyyyyyyok
kwyyyyyyyyyyyyok
kwyyyyyyyyyyyyok
kooooooooooooook
.kkkkkkkkkkkkkk.
................
""",
'notepad': """
..k.k.k.k.k.k...
.kkkkkkkkkkkkk..
.kwwwwwwwwwwwgk.
.kwkkkkkkkkwwgk.
.kwwwwwwwwwwwgk.
.kwkkkkkkkwwwgk.
.kwwwwwwwwwwwgk.
.kwkkkkkkkkkwgk.
.kwwwwwwwwwwwgk.
.kwkkkkkkwwwwgk.
.kwwwwwwwwwwwgk.
.kwkkkkkkkkwwgk.
.kwwwwwwwwwwwgk.
.kggggggggggggk.
.kkkkkkkkkkkkkk.
................
""",
'film': """
................
kkkkkkkkkkkkkkkk
kwkwkwkwkwkwkwkk
kkkkkkkkkkkkkkkk
kgnnnnnnnnnnnngk
kgnPPpppppppbngk
kgnPppppppbbcngk
kgnpppppbbbccngk
kgnpppbbbbcccngk
kgnpbbbbbccccngk
kgnnnnnnnnnnnngk
kkkkkkkkkkkkkkkk
kwkwkwkwkwkwkwkk
kkkkkkkkkkkkkkkk
................
................
""",
'info': """
................
.....kkkkkk.....
...kkbbbbbbkk...
..kbbbbwwbbbbk..
.kbbbbbwwbbbbbk.
.kbbbbbbbbbbbbk.
kbbbbbwwwbbbbbbk
kbbbbbbwwbbbbbbk
kbbbbbbwwbbbbbbk
kbbbbbbwwbbbbbbk
.kbbbbbwwbbbbbk.
.kbbbbwwwwbbbbk.
..kbbbbbbbbbbk..
...kkbbbbbbkk...
.....kkkkkk.....
................
""",
'start': """
................
.....rrrdd......
....rrrrddd.....
....rrrrddd.....
...rrrrddd......
...bbbbyyy......
..bbbbyyyy......
..bbbbyyyy......
.bbbbyyyy.......
................
""",
}
os.makedirs(out, exist_ok=True)
for name, art in ICONS.items():
    rows = [r for r in art.strip('\n').split('\n')]
    h, w = len(rows), max(len(r) for r in rows)
    rects = []
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch != '.':
                rects.append(f'<rect x="{x}" y="{y}" width="1" height="1" fill="{P[ch]}"/>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
           f'width="{w*2}" height="{h*2}" shape-rendering="crispEdges">' + ''.join(rects) + '</svg>\n')
    open(os.path.join(out, name + '.svg'), 'w').write(svg)
    print(name, w, h)
