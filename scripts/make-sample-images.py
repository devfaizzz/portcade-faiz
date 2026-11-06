"""Generates labelled placeholder images. Replace the PNGs in public/images/projects/ with real screenshots (same file names)."""
from PIL import Image, ImageDraw, ImageFont
import glob
W, H = 1600, 1000
LIME, INK, BG, PANEL, LINE = (198,255,61), (242,239,230), (13,14,12), (24,26,21), (52,55,46)
fp = (glob.glob('/usr/share/fonts/**/DejaVuSans-Bold.ttf', recursive=True) or [None])[0]
def font(n): return ImageFont.truetype(fp, n) if fp else ImageFont.load_default(n)
items = {
 'voiceup': ('VoiceUp', 'Civic issue reporting platform'),
 'career': ('AI Career Advisor Agent', 'Agentic career roadmap workflow'),
 'gitdecodex': ('GitDecodeX AI', 'GitHub repository analyzer'),
 'llmopt': ('LLMOpt', 'Carbon-aware multi-LLM framework'),
}
for key, (title, sub) in items.items():
    im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im)
    for x in range(0, W, 50): d.line([(x,0),(x,H)], fill=(20,22,18))
    for y in range(0, H, 50): d.line([(0,y),(W,y)], fill=(20,22,18))
    x0, y0, x1, y1 = 140, 120, W-140, H-120
    d.rounded_rectangle([x0,y0,x1,y1], 28, fill=PANEL, outline=LINE, width=3)
    d.rounded_rectangle([x0,y0,x1,y0+70], 28, fill=(32,35,28)); d.rectangle([x0,y0+40,x1,y0+70], fill=(32,35,28))
    for i,c in enumerate([(255,95,87),(254,188,46),(40,200,64)]): d.ellipse([x0+30+i*34,y0+24,x0+50+i*34,y0+44], fill=c)
    d.rounded_rectangle([x0+180,y0+18,x1-40,y0+52], 14, fill=(20,22,18))
    # neutral wireframe blocks (no fake data)
    d.rounded_rectangle([x0+40,y0+110,x0+330,y1-40], 18, outline=LINE, width=3)
    for i in range(5): d.rounded_rectangle([x0+64,y0+140+i*70,x0+300,y0+176+i*70], 10, fill=(34,37,30))
    d.rounded_rectangle([x0+370,y0+110,x1-40,y0+330], 18, outline=LINE, width=3)
    d.rounded_rectangle([x0+370,y0+360,x0+740,y1-40], 18, outline=LINE, width=3)
    d.rounded_rectangle([x0+780,y0+360,x1-40,y1-40], 18, outline=LINE, width=3)
    d.text((x0+400,y0+140), title, font=font(58), fill=INK)
    d.text((x0+402,y0+225), sub, font=font(28), fill=(154,154,146))
    d.rounded_rectangle([x0+400,y0+280,x0+660,y0+316], 18, fill=LIME)
    d.text((x0+420,y0+287), 'SAMPLE IMAGE', font=font(20), fill=(16,19,10))
    msg = f'Replace with your screenshot: public/images/projects/{key}.png'
    d.text((W//2, y1+50), msg, font=font(26), fill=(154,154,146), anchor='mm')
    im.save(f'public/images/projects/{key}.png', optimize=True)
print('ok')
