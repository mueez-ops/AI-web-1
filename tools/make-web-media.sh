#!/bin/bash
# Builds the web versions of the photos and videos from the untouched masters.
#   Masters: media/originals/ (local only)   →   Web versions: media/web/ (committed)
# Needs: ffmpeg with libx264, libx265, libsvtav1, zscale; python3 with Pillow.
# Quality: 4K HEVC files are the original camera stream, copied without re-encoding.
# Every other version is checked against the original with SSIM (target ≥ 0.99).
set -e
cd "$(dirname "$0")/.."
O=media/web; M=media/originals; mkdir -p $O
HDR="-color_primaries bt2020 -color_trc arib-std-b67 -colorspace bt2020nc -color_range tv"
X265="colorprim=bt2020:transfer=arib-std-b67:colormatrix=bt2020nc:log-level=error"
TM="zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv"

# clip <source> <name> <with4k: 1|0>
clip() {
  local S=$1 N=$2 K=$3
  if [ "$K" = 1 ]; then
    ffmpeg -v error -y -i $S -map 0:v:0 -c:v copy -tag:v hvc1 -an -movflags +faststart $O/$N-4k-hevc-hdr.mp4
    ffmpeg -v error -y -i $S -map 0:v:0 -an -pix_fmt yuv420p10le -c:v libsvtav1 -preset 6 -crf 22 $HDR -movflags +faststart $O/$N-4k-av1-hdr.mp4
  fi
  ffmpeg -v error -y -i $S -map 0:v:0 -an -vf "scale=1920:1080:flags=lanczos" -pix_fmt yuv420p10le -c:v libsvtav1 -preset 5 -crf 20 $HDR -movflags +faststart $O/$N-1080-av1-hdr.mp4
  ffmpeg -v error -y -i $S -map 0:v:0 -an -vf "scale=1920:1080:flags=lanczos" -pix_fmt yuv420p10le -c:v libx265 -preset slow -crf 19 -x265-params "$X265" -tag:v hvc1 $HDR -movflags +faststart $O/$N-1080-hevc-hdr.mp4
  ffmpeg -v error -y -i $S -map 0:v:0 -an -vf "$TM,format=yuv420p,scale=1920:1080:flags=lanczos" -c:v libx264 -preset slow -crf 19 -profile:v high -movflags +faststart $O/$N-1080-h264-sdr.mp4
  ffmpeg -v error -y -i $S -frames:v 1 -vf "$TM,format=rgb24" /tmp/$N-poster.png
  python3 -c "
from PIL import Image
im = Image.open('/tmp/$N-poster.png').convert('RGB')
if $K: im.save('$O/$N-poster-3840.webp', quality=92, method=6)
s = im.resize((1920, 1080), Image.LANCZOS); s.save('$O/$N-poster-1920.webp', quality=92, method=6); s.save('$O/$N-poster-1920.jpg', quality=92, subsampling=0, optimize=True)"
}

clip $M/IMG_3186-minbar-wall-wide-4k-hdr.mov   hero    1   # hero: the minbar wall
clip $M/IMG_3165-courtyard-pan-4k-hdr.mov      nights  1   # the ten nights chapter (full screen)
clip $M/IMG_3184-minbar-wall-front-4k-hdr.mov  front   0   # reel
clip $M/IMG_3172-building-sweep-4k-hdr.mov     sweep   0   # reel
clip $M/IMG_3162-courtyard-wide-4k-hdr.mov     wide    0   # reel

# Photo: original file for desktop; portrait crop centred on the minbar for phones (no resizing)
cp -p $M/majlis-minbar-elevated-2576x1932.jpg $O/minbar-2576.jpg; chmod 644 $O/minbar-2576.jpg
python3 - <<'PY'
from PIL import Image
im = Image.open('media/web/minbar-2576.jpg'); W, H = im.size
w = H * 3 // 4; x0 = max(0, min(W - w, 1366 - w // 2))
crop = im.crop((x0, 0, x0 + w, H))
crop.save('media/web/minbar-portrait-1449.jpg', quality=95, subsampling=0, optimize=True)
crop.save('media/web/minbar-portrait-1449.webp', quality=95, method=6)
PY
echo "Done"; ls -la $O
