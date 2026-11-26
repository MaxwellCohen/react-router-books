import { FeaturePage } from './shared'

export default function MultiHost() {
  return (
    <FeaturePage title="Multi-host deployment" label="Third-party">
      <p>
        Build-time only. The same app builds for Node (<code>@react-router/serve</code>), Cloudflare
        (<code>CLOUDFLARE=1</code>, <code>@cloudflare/vite-plugin</code>), Netlify (<code>NETLIFY=1</code>,
        <code>@netlify/vite-plugin-react-router</code>) and Vercel (<code>VERCEL=1</code>,
        <code>@vercel/react-router</code> preset).
      </p>
    </FeaturePage>
  )
}
