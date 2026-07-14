# React

Install `codex-pet-companion`, then use the thin adapter:

```tsx
import { CodexPetCompanion } from 'codex-pet-companion/react';

export function Pet() {
  return <CodexPetCompanion mode="floating" manifestUrl="/codex-pets/my-pet/pet.json" />;
}
```

Keep app-specific dialogue and links in props. Use a ref only when the host must call `play`, `sleep`, `wake`, `tuck`, or `recall`.
