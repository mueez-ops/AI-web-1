#!/bin/bash
# Builds the web versions of the photos and video from the untouched masters.
#   Masters: media/originals/   →   Web versions: media/web/
# media/originals/ stays local; media/web/ is committed and served by the site.
# Needs: ffmpeg with libx264, libx265, libsvtav1, zscale; python3 with Pillow.
# Quality targets (measured 2026-10-12, SSIM vs the original):
#   4K HEVC  = original stream, copied without re-encoding (identical)
#   4K AV1   = 0.993 · 1080 AV1 = 0.990 · 1080 HEVC = 0.990 · posters ≥ 0.992
set -e
cd "$(dirname "$0")/.."
SRC=media/originals/IMG_3186-minbar-wall-wide-4k-hdr.mov
PHOTO=media/originals/majlis-minbar-elevated-2576x1932.jpg
O=media/web; mkdir -p $O
HDR="-color_primaries bt2020 -color_trc arib-std-b67 -colorspace bt2020nc -color_range tv"
X265="colorprim=bt2020:transfer=arib-std-b67:colormatrix=bt2020nc:log-level=error"
TM="zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv"

# Hero video
ffmpeg -v error -y -i $SRC -map 0:v:0 -c:v copy -tag:v hvc1 -an -movflags +faststart $O/hero-4k-hevc-hdr.mp4
ffmpeg -v error -y -i $SRC -map 0:v:0 -an -pix_fmt yuv420p10le -c:v libsvtav1 -preset 6 -crf 22 $HDR -movflags +faststart $O/hero-4k-av1-hdr.mp4
ffmpeg -v error -y -i $SRC -map 0:v:0 -an -vf "scale=1920:1080:flags=lanczos" -pix_fmt yuv420p10le -c:v libsvtav1 -preset 5 -crf 20 $HDR -movflags +faststart $O/hero-1080-av1-hdr.mp4
ffmpeg -v error -y -i $SRC -map 0:v:0 -an -vf "scale=1920:1080:flags=lanczos" -pix_fmt yuv420p10le -c:v libx265 -preset slow -crf 19 -x265-params "$X265" -tag:v hvc1 $HDR -movflags +faststart $O/hero-1080-hevc-hdr.mp4
ffmpeg -v error -y -i $SRC -map 0:v:0 -an -vf "$TM,format=yuv420p,scale=1920:1080:flags=lanczos" -c:v libx264 -preset slow -crf 19 -profile:v high -movflags +faststart $O/hero-1080-h264-sdr.mp4

# Hero posters (first frame, tone-mapped for normal screens)
ffmpeg -v error -y -i $SRC -frames:v 1 -vf "$TM,format=rgb24" /tmp/poster-3840.png
python3 - <<'PY'
from PIL import Image
im = Image.open('/tmp/poster-3840.png').convert('RGB')
im.save('media/web/hero-poster-3840.webp', quality=92, method=6)
small = im.resize((1920, 1080), Image.LANCZOS)
small.save('media/web/hero-poster-1920.webp', quality=92, method=6)
small.save('media/web/hero-poster-1920.jpg', quality=92, subsampling=0, optimize=True)
PY

# Signature photo: the original as-is for desktop, a portrait crop (no resizing) for phones
cp -p $PHOTO $O/minbar-2576.jpg
python3 - <<'PY'
from PIL import Image
im = Image.open('media/web/minbar-2576.jpg'); W, H = im.size
w = H * 3 // 4; x0 = max(0, min(W - w, 1366 - w // 2))   # centred on the minbar
crop = im.crop((x0, 0, x0 + w, H))
crop.save('media/web/minbar-portrait-1449.jpg', quality=95, subsampling=0, optimize=True)
crop.save('media/web/minbar-portrait-1449.webp', quality=95, method=6)
PY
echo "Done. Files in $O:"; ls -la $O
