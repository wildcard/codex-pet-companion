import React from 'react';
import { createRoot } from 'react-dom/client';
import { CodexPetCompanion } from 'codex-pet-companion/react';

createRoot(document.getElementById('root')).render(<main><h1>React site</h1><CodexPetCompanion mode="inline" manifestUrl="/pets/kavana/pet.json" /></main>);
