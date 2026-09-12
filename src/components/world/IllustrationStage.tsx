import type { CSSProperties, ReactNode } from 'react';
import './illustration-stage.css';

export type StageLayer = { id: string; content: ReactNode; depth?: number; className?: string };

export type IllustrationStageProps = {
  layers: StageLayer[];
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/** A shallow, parallax-ready stage for painted 2.5D scenes. */
export function IllustrationStage({ layers, className = '', style, children }: IllustrationStageProps) {
  return <div className={`illustration-stage ${className}`} style={style}>
    <div className="illustration-stage__layers" aria-hidden="true">
      {layers.map((layer) => <div key={layer.id} className={`illustration-stage__layer ${layer.className ?? ''}`} style={{ '--depth': layer.depth ?? 0 } as CSSProperties}>{layer.content}</div>)}
    </div>
    <div className="illustration-stage__content">{children}</div>
  </div>;
}
