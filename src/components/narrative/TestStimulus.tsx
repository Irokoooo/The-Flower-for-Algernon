import { useState } from 'react';
import { resolveVisualAsset } from '../../core/visual-registry';

/** One objective card across phases: interpretation belongs to the shared graph. */
export function TestStimulus() {
  const [enlarged, setEnlarged] = useState(false);
  const src = resolveVisualAsset('test-inkblot');
  if (!src) return <p>They are preparing the card. / 测试卡正在准备。</p>;
  return <figure className={`test-stimulus ${enlarged ? 'is-enlarged' : ''}`}>
    <button type="button" aria-label={enlarged ? 'Return card / 收回测试卡' : 'Look closely at the ink / 仔细看墨迹'} aria-expanded={enlarged} onClick={() => setEnlarged(value => !value)}>
      <img src={src} alt="Uneven dark ink on pale paper. / 浅色纸上的不规则深色墨迹。" />
    </button>
    <figcaption>{enlarged ? 'Take your time. / 慢慢看。' : 'Look at the paper. / 看看这张纸。'} <span>{enlarged ? 'Click to return / 点击收回' : 'Click to look closer / 点击近看'}</span></figcaption>
  </figure>;
}
