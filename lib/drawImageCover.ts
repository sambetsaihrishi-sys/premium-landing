/**
 * Draws `img` onto `ctx` reproducing CSS `object-fit: cover` behavior:
 * the image is scaled up (never letterboxed) to fill the canvas box
 * and center-cropped on whichever axis overflows.
 */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  boxWidth: number,
  boxHeight: number,
  alpha = 1
) {
  if (!img.naturalWidth || !img.naturalHeight) return;

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = boxWidth / boxHeight;

  let sx: number, sy: number, sw: number, sh: number;

  if (imgRatio > boxRatio) {
    // Image is wider than the box — crop left/right
    sh = img.naturalHeight;
    sw = sh * boxRatio;
    sy = 0;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    // Image is taller than the box — crop top/bottom
    sw = img.naturalWidth;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.naturalHeight - sh) / 2;
  }

  const prevAlpha = ctx.globalAlpha;
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, boxWidth, boxHeight);
  ctx.globalAlpha = prevAlpha;
}
