import * as THREE from 'three';

/**
 * Procedural texture generators for authentic Gothic Abbey materials
 * Zero external image dependencies
 */

export function createStoneCobblestoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base stone tone
  ctx.fillStyle = '#292524';
  ctx.fillRect(0, 0, 512, 512);

  // Tiles grid
  const cols = 8;
  const rows = 8;
  const tw = 512 / cols;
  const th = 512 / rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const offsetX = (y % 2) * (tw / 2);
      const px = (x * tw + offsetX) % 512;
      const py = y * th;

      // Slight random stone shades
      const shade = 40 + Math.floor(Math.random() * 25);
      ctx.fillStyle = `rgb(${shade}, ${shade - 2}, ${shade - 4})`;
      ctx.fillRect(px + 2, py + 2, tw - 4, th - 4);

      // Edge bevel highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(px + 2, py + 2, tw - 4, 3);
      ctx.fillRect(px + 2, py + 2, 3, th - 4);

      // Edge shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(px + 2, py + th - 5, tw - 4, 3);
      ctx.fillRect(px + tw - 5, py + 2, 3, th - 4);
    }
  }

  // Noise specks
  for (let i = 0; i < 4000; i++) {
    const nx = Math.random() * 512;
    const ny = Math.random() * 512;
    const alpha = Math.random() * 0.08;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.fillRect(nx, ny, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createGothicStainedGlassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark lead tracery background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 256, 256);

  // Concentric rose window petals
  const cx = 128;
  const cy = 128;
  const numPetals = 8;
  const colors = ['#dc2626', '#2563eb', '#f59e0b', '#10b981', '#9333ea'];

  for (let r = 110; r > 10; r -= 24) {
    for (let i = 0; i < numPetals; i++) {
      const angle = (i * Math.PI * 2) / numPetals;
      const angleNext = ((i + 1) * Math.PI * 2) / numPetals;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angleNext);
      ctx.closePath();
      ctx.fillStyle = colors[(i + Math.floor(r / 20)) % colors.length];
      ctx.fill();

      // Lead border
      ctx.strokeStyle = '#1e1b18';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }

  // Golden sacred center
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#fef08a';
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 3;
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createStoneWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c1917';
  ctx.fillRect(0, 0, 512, 512);

  const rows = 12;
  const cols = 6;
  const rh = 512 / rows;
  const cw = 512 / cols;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const offset = (y % 2) * (cw / 2);
      const px = (x * cw + offset) % 512;
      const py = y * rh;

      const v = 32 + Math.floor(Math.random() * 20);
      ctx.fillStyle = `rgb(${v}, ${v - 1}, ${v - 2})`;
      ctx.fillRect(px + 2, py + 2, cw - 4, rh - 4);

      // Mortar shadow
      ctx.strokeStyle = '#0c0a09';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 1, py + 1, cw - 2, rh - 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
