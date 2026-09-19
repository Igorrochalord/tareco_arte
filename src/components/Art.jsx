import { useEffect, useRef } from 'react'

// Renders a gallery item: a plain <img>, or a canvas when the item is a crop of a larger image.
export default function Art({ item, className = '', ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!item.crop) return
    const [x, y, w, h] = item.crop
    const img = new Image()
    img.onload = () => {
      const cv = ref.current
      if (!cv) return
      cv.width = w
      cv.height = h
      cv.getContext('2d').drawImage(img, x, y, w, h, 0, 0, w, h)
    }
    img.src = item.src
  }, [item])

  if (item.crop) return <canvas ref={ref} className={className} {...rest} />
  return <img src={item.thumb || item.src} width={item.w} height={item.h} loading="lazy" decoding="async" alt={item.title || ''} className={className} draggable="false" {...rest} />
}
