# AION implementation trail

Reference: user-supplied character sheet and two scenes. White armor, glossy dark visor and turquoise accents (#00D1C1 / #0F172A / #FFFFFF).

Figma: https://www.figma.com/design/ppYV4XWRhjXlDVLw1m96oD?node-id=7-70
Expression component set 7:15, review 7:70. Six editable variants: Happy, Listening, Thinking, Speaking, Curious and Wink. One primitive/semantic token collection; instance review visually inspected.

ElevenLabs agent: agent_3101m3ykp4tfft0s82w2hc442tfe
Voice: Daniel / onwK4e9ZLuTAKqWW03F9, an existing premade voice. No custom voice or performer clone. Bilingual instructions and greeting/language overrides. Limits: 10 sessions/day, 2 concurrent, 180 seconds maximum. Audio recording disabled; transcript retention 7 days. User confirmed the Free plan. ElevenLabs provider is development-preview only, with preview origin allowlists. Production uses browser speech synthesis for deterministic local guidance; it makes no provider calls. Provider fees and license depend on the user's subscription; the connector exposes no quota or subscription inspection. No unlimited-free claim.

Body: procedural Three.js embodiment inspired by the references, not an exact photorealistic reconstruction. A generated Meshy GLB/rig remains pending account authorization. No paid Meshy tasks were submitted or credits consumed. Tripo tools are not available in this session.

Acceptance: successful Next.js build including strict TypeScript. Browser preview fallback and local topic responses verified. This cloud browser disables WebGL; actual 3D rendering remains unverified on a WebGL-capable device. Live preview text session connected, greeted, answered a mobile-app question correctly and ended. Audio/microphone round-trip not exercised. User messages are rendered locally in text mode.
