RANDY'S SWITCHABLE AMENDMENTS
Import Randy_Amendments.json with the new Import amendment pack button. Every amendment starts OFF. Import merges by ID and leaves your existing versions unchanged.

GOOD STARTING COMBINATIONS
Krea/Qwen still: One prompt + Rich detail + Photographic reality (if desired).
3D source: One prompt + Image-to-3D source + the desired visual style.
First/last images: One prompt + First and last reference images + Character lock.
MiniMax I2V: One prompt + Animate the image + Character lock + optional Loopable motion.
Story setup: Story Creator World and setup + one audio choice.
Full script: Complete scene script + Character lock + one audio choice.
Chain: Chain Director matching Parts + Character lock + optional Loopable motion.
Pony: Pony organized tag prompt + One prompt OR Separate negative field.

Same-group choices replace one another: negative format, visual style, image task, MiniMax mode and audio. Other switches can combine. Avoid turning on everything: start with 2–4 relevant choices. Toggle model-specific options only for the matching card.

Built-in negatives are your preferred wording style; they do NOT activate a real negative-conditioning input. Positive wording such as intact hands and an unlettered background is generally clearer than placing a long list of defects into the positive prompt.

FACE
Choose a character, then use Upload chat face in the panel. Select a local PNG, JPEG or WebP. The image is resized to 256 pixels and stored for that card. It appears in the panel and the Goblin header above the normal Hermes composer while that chat is enabled. It is not sent to the model and does not replace Hermes's own assistant-message avatar. This is a still portrait, not an animated or talking face.

UPGRADE
Run INSTALL_WINDOWS.bat from the extracted v3.1 folder. Previous plugin.js is backed up under a unique filename. Existing cards/settings use the same plugin ID and remain in Hermes storage. Restart or reload desktop plugins afterward. If you use a custom desktop-plugins folder, copy goblin-roleplay/plugin.js to that existing folder instead.

Validation: syntax, amendment import/validation/deduplication, mutually exclusive toggles, prompt inclusion, session scoping and image-type limits tested locally. Live Hermes layout, browser image decoding and Windows installer require local verification.
