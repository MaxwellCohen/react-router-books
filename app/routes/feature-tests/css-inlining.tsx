// Manual CSS inlining: Vite's `?inline` query returns the stylesheet as a string,
// which we render into a <style> tag. No <link rel=stylesheet> is emitted for it.
import inlineCss from './css-inlining.css?inline'
import { FeaturePage } from './shared'

export default function CssInlining() {
  return (
    <FeaturePage title="CSS inlining" label="Manual">
      <style dangerouslySetInnerHTML={{ __html: inlineCss }} />
      <div className="ft-inline-marker" data-testid="inline-box">
        Styled by an inline &lt;style&gt; (Vite ?inline import).
      </div>
    </FeaturePage>
  )
}
