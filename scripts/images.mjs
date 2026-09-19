// Generates WebP versions (full up to 2200px + 1000px thumb) of public/assets/art/*.jpg and prints sizes.
import sharp from 'sharp'
import { readdirSync } from 'node:fs'

const dir = 'public/assets/art'
for (const f of readdirSync(dir).filter((n) => /\.jpe?g$/i.test(n))) {
  const base = f.replace(/\.jpe?g$/i, '')
  const img = sharp(`${dir}/${f}`)
  const { width, height } = await img.metadata()
  await img.clone().resize({ width: 2200, withoutEnlargement: true }).webp({ quality: 92 }).toFile(`${dir}/${base}.webp`)
  const full = await sharp(`${dir}/${base}.webp`).metadata()
  console.log(base, `full ${full.width}x${full.height}`)
  const t = await img.clone().resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 90 }).toFile(`${dir}/${base}-thumb.webp`)
  console.log(base, `${width}x${height}`, `thumb ${t.width}x${t.height}`)
}
