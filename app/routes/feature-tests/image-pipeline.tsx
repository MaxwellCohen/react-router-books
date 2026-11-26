// Third-party: @unpic/react <Image> detects the wsrv.nl image CDN from the URL and
// generates a responsive srcset, width/height, and lazy loading.
import { Image } from '@unpic/react'
import { FeaturePage } from './shared'

const cover = 'https://wsrv.nl/?url=images.gr-assets.com/books/1447303603l/2767052.jpg&output=webp'

export default function ImagePipeline() {
  return (
    <FeaturePage title="Image pipeline" label="Third-party">
      <Image alt="Hero cover (priority)" data-testid="hero-img" height={480} layout="constrained" priority src={cover} width={320} />
      <div style={{ height: '2000px' }} />
      <Image alt="Offscreen cover" data-testid="offscreen-img" height={480} layout="constrained" src={cover} width={320} />
    </FeaturePage>
  )
}
