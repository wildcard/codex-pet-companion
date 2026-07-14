import { forwardRef, useEffect, useRef } from 'react';
import { defineCodexPetCompanion, type CodexPetCompanionElement } from './component.js';
import type { CodexPetCompanionConfig } from './types.js';

defineCodexPetCompanion();

export interface CodexPetCompanionReactProps extends CodexPetCompanionConfig {
  className?: string;
}

export const CodexPetCompanion = forwardRef<CodexPetCompanionElement, CodexPetCompanionReactProps>(function CodexPetCompanion(props, forwardedRef) {
  const localRef = useRef<CodexPetCompanionElement>(null);
  useEffect(() => {
    if (!localRef.current) return;
    localRef.current.config = props;
    if (typeof forwardedRef === 'function') forwardedRef(localRef.current);
    else if (forwardedRef) forwardedRef.current = localRef.current;
  }, [forwardedRef, props]);
  return <codex-pet-companion ref={localRef} className={props.className} mode={props.mode ?? 'floating'} />;
});

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'codex-pet-companion': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { mode?: 'floating' | 'inline' };
    }
  }
}
