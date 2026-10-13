"""Deterministic, project-specific SVG artwork. No external inputs."""
from pathlib import Path
import math
out = Path(__file__).resolve().parents[1] / 'public' / 'graphics'
colors = {'atlas-console':'#64baff','orion-release':'#a492ff','beacon-docs':'#64d8b7','quartz-api':'#e4b377'}
for name, color in colors.items():
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><defs><radialGradient id="bg"><stop stop-color="{color}" stop-opacity=".19"/><stop offset="1" stop-color="#070d17"/></radialGradient><linearGradient id="line" x2="1" y2="1"><stop stop-color="{color}"/><stop offset="1" stop-color="#6686db" stop-opacity=".15"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="5"/></filter></defs><rect width="640" height="400" fill="#080e18"/><rect width="640" height="400" fill="url(#bg)"/>']
    for x in range(20,640,32):
        for y in range(20,400,32):
            svg.append(f'<circle cx="{x}" cy="{y}" r=".8" fill="{color}" opacity=".16"/>')
    if name == 'atlas-console':
        svg.append(f'<circle cx="320" cy="195" r="127" fill="none" stroke="{color}" opacity=".35" filter="url(#glow)" stroke-width="9"/>')
        svg.append(f'<circle cx="320" cy="195" r="127" fill="#11283b" fill-opacity=".6" stroke="{color}" stroke-opacity=".8"/>')
        for i in range(-5,6):
            w=127*math.sqrt(1-(i/6)**2)
            svg.append(f'<ellipse cx="320" cy="{195+i*21}" rx="{w}" ry="{14*(1-abs(i)/7)}" fill="none" stroke="{color}" opacity=".37"/>')
        for w in [30,65,98]:
            svg.append(f'<ellipse cx="320" cy="195" rx="{w}" ry="127" fill="none" stroke="{color}" opacity=".4"/>')
        svg.append(f'<ellipse cx="320" cy="195" rx="202" ry="46" transform="rotate(-27 320 195)" fill="none" stroke="{color}" opacity=".5"/><circle cx="490" cy="97" r="5" fill="#d5f5ff"/>')
    elif name == 'orion-release':
        for i in range(24):
            y=115+i*7
            svg.append(f'<path d="M -30 {y+100} Q 130 {y-110} 290 {y+15} T 680 {y-55}" fill="none" stroke="url(#line)" opacity="{.15+i*.025}"/>')
        svg.append(f'<path d="M 90 285 L 218 219 L 306 240 L 426 121 L 546 85" fill="none" stroke="{color}" stroke-width="2"/>')
        for x,y in [(90,285),(218,219),(306,240),(426,121),(546,85)]:
            svg.append(f'<circle cx="{x}" cy="{y}" r="12" fill="{color}" opacity=".15"/><circle cx="{x}" cy="{y}" r="4" fill="#ded9ff"/>')
    elif name == 'beacon-docs':
        for i in range(5):
            x=166+i*17;y=62+i*17
            svg.append(f'<rect x="{x}" y="{y}" width="230" height="218" rx="14" fill="#0f2228" stroke="{color}" stroke-opacity="{.15+i*.14}"/>')
        for i,w in enumerate([130,100,143,120,80]):
            svg.append(f'<rect x="263" y="{169+i*24}" width="{w}" height="3" rx="2" fill="{color}" opacity="{.7-i*.09}"/>')
        svg.append(f'<path d="M 379 120 L 411 91 L 444 120 L 411 149 Z" fill="#122c2b" stroke="{color}"/><circle cx="411" cy="120" r="5" fill="#b0f5df"/>')
    else:
        points=[(320,60),(451,137),(451,273),(320,344),(189,273),(189,137),(320,200)]
        for a,b in [(0,1),(1,2),(2,3),(3,4),(4,5),(5,0),(0,6),(1,6),(2,6),(3,6),(4,6),(5,6)]:
            x,y=points[a];u,v=points[b]
            svg.append(f'<path d="M{x} {y} L{u} {v}" stroke="{color}" opacity=".6"/>')
        for j,(x,y) in enumerate(points):
            svg.append(f'<circle cx="{x}" cy="{y}" r="{24 if j==6 else 14}" fill="#251f1b" stroke="{color}"/><circle cx="{x}" cy="{y}" r="4" fill="#ffe1b4"/>')
        svg.append(f'<ellipse cx="320" cy="200" rx="240" ry="50" fill="none" stroke="{color}" stroke-dasharray="3 7" opacity=".25"/>')
    svg.append('</svg>')
    (out / f'{name}-v2.svg').write_text(''.join(svg))
