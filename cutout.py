"""Background removal. Uses rembg if installed (best quality), else OpenCV GrabCut."""
import sys, numpy as np, cv2
src = sys.argv[1] if len(sys.argv)>1 else "public/images/faiz-original.png"
out = sys.argv[2] if len(sys.argv)>2 else "public/images/faiz-cutout.png"
try:
    from rembg import remove
    from PIL import Image
    remove(Image.open(src).convert("RGB")).save(out); print("rembg ok"); sys.exit()
except ImportError:
    pass
img = cv2.imread(src); h,w = img.shape[:2]
mask = np.full((h,w), cv2.GC_PR_BGD, np.uint8)
mask[int(h*.08):, int(w*.2):int(w*.88)] = cv2.GC_PR_FGD
mask[int(h*.3):int(h*.95), int(w*.38):int(w*.7)] = cv2.GC_FGD
# sample background colour from top corners and mark similar pixels as sure background
lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
bg = np.median(np.concatenate([lab[:80,:80].reshape(-1,3), lab[:80,-80:].reshape(-1,3)]),0)
d = np.linalg.norm(lab-bg,axis=2)
mask[d<10] = cv2.GC_BGD
mask[:int(h*.05),:] = cv2.GC_BGD; mask[:, :int(w*.15)] = cv2.GC_BGD; mask[:, int(w*.92):] = cv2.GC_BGD
bgm=np.zeros((1,65));fgm=np.zeros((1,65))
cv2.grabCut(img,mask,None,bgm,fgm,8,cv2.GC_INIT_WITH_MASK)
m = np.where((mask==1)|(mask==3),255,0).astype(np.uint8)
n,lbl,st,_ = cv2.connectedComponentsWithStats(m)
if n>1: m = np.where(lbl==1+np.argmax(st[1:,4]),255,0).astype(np.uint8)
ff=m.copy(); fm=np.zeros((h+2,w+2),np.uint8); cv2.floodFill(ff,fm,(0,0),255)
m = m | cv2.bitwise_not(ff)  # fill interior holes (white shirt)
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9,9),np.uint8))
m = cv2.erode(m, np.ones((3,3),np.uint8))
m = cv2.GaussianBlur(m,(0,0),1.6)
rgba = np.dstack([img, m]); cv2.imwrite(out, rgba); print("grabcut ok")
