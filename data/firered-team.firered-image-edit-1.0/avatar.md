### item

Flame-etched War Axe

### material

Volcanic Glass

### reasoning

FireRed Image Edit 1.0 suggests fiery, precision image-editing power; as a medium image model, a one- or two-handed war axe fits the ‘rework and carve’ motif without being oversized. A Salamander Warband (Ember Drakekin) can wield an axe easily in pixel-RPG combat. Volcanic Glass signals strong, heat-born potency appropriate for medium-tier power while complementing the FireRed theme.

### monster

Salamander Warband (Ember Drakekin)

### model id

firered-team.firered-image-edit-1.0

### model name

FireRed Image Edit 1.0

### model size

medium

### model modality

image

### generation model

openai/gpt-5.2

### generation system

You are the Creative Art Director for "modeldrop.fyi".

Your goal is to generate two distinct visual attributes (\[item] and \[material]) for an AI model based on the \[model name], \[model size], \[model modality] and the \[monster] holding the \[item].

\### 1. The Rules

\* \*\*Theme:\*\* Retro Dark Fantasy / Pixel Art RPG.

\* \*\*Wieldability (Crucial):\*\* Every generated \[item] \*\*must be holdable\*\* by the specific \[monster].

\* \*Incorrect:\* A building (Observatory), a room (Library), or fixed terrain.

\* \*Correct:\* A heavy object, a two-handed weapon, or a carried relic (e.g., A Giant holding a Ship Anchor).

\* \*\*Independence:\*\* The \[material] does not necessarily constitute the \[item]. They are two separate visual themes to be combined later.

\### 2. Input Parameters

You will receive:

\* \[model name] The specific AI model (e.g., "Sora v1", "Gemini Pro", "Stable Diffusion XL").

\* \[model size] The size of the AI model (\`small\`, \`medium\`, \`large\`).

\* \[model modality] The modality of the AI model (\`image\`, \`video\`, \`audio\`, \`3d\`).

\* \[monster] The creature holding the item (e.g., "Cybernetic Rat", "Forest Giant").

\### 3. Output Logic

\#### A. Item Selector

Select an object that represents the \*function\* of the \[model modality] and the \*scale\* of the \[model size].

\*Constraint:\* The item must be ergonomically appropriate for the \[monster] and fit the vibe of the \[model name].

\##### Examples:

\* \*\*Image (Weapons):\*\*

\* \*Small:\* Dagger, Whip, Hook, etc.

\* \*Medium:\* Hammer, Axe, Longsword, etc.

\* \*Large:\* Sledgehammer, War Banner, Totem, etc.

\* \*\*Video (Time/Vision Tools):\*\*

\* \*Small:\* Pocket Watch, Monocle, Kaleidescope, etc.

\* \*Medium:\* Lantern, Hand Mirror, Hourglass, etc.

\* \*Large:\* Grand Staff, Giant Astrolabe, Tower Shield (Reflective), etc.

\* \*\*Audio (Resonance Tools):\*\*

\* \*Small:\* Whistle, Tuning Fork, Shell, etc.

\* \*Medium:\* Hand Drum, Bell, Lute, etc.

\* \*Large:\* War Horn, Great Gong (Carried), Thunder Drum, etc.

\* \*\*3D (Sculpting/Construction Tools):\*\*

\* \*Small:\* Chisel, Compass, Prism, etc.

\* \*Medium:\* Anvil, Sculptor's Hammer, Astrolabe, etc.

\* \*Large:\* Stone Tablet, Architect's Obelisk, Runic Pillar (Carried), etc.

\#### B. Material Selector

Select a texture/element that represents the \*power level\* of the \[model size]. Max 2 words.

\### 4. Output Format

Return ONLY the JSON object.

\`\`\`json

{

"item": "String",

"material": "String",

"reasoning": "Short explanation connecting \[model name], \[model size], \[model modality] and \[monster] to \[item] and \[material]."

}

### generation prompt

model name: FireRed Image Edit 1.0

model size: medium

model modality: image

monster: Salamander Warband (Ember Drakekin)

### avatar raw url

https://modeldrop.shard.media/models/avatars/raw/firered-team.firered-image-edit-1.0.png

### avatar raw model

fal-ai/bytedance/seedream/v4.5/text-to-image

### avatar raw prompt

Volcanic Glass Salamander Warband (Ember Drakekin) holding Flame-etched War Axe

### avatar url

https://modeldrop.shard.media/models/avatars/firered-team.firered-image-edit-1.0.png

### avatar styleUrl

https://modeldrop.shard.media/models/avatars/style/reference.png

### avatar model

fal-ai/bytedance/seedream/v4.5/edit

### avatar prompt

Salamander Warband (Ember Drakekin) holding Flame-etched War Axe from image 1

dominant colors: Cinder Black, Blazing Scarlet

using image 2 as the style reference

What is a Style Reference?

A Style Reference is a way to capture the visual vibe of an existing image and apply it to new creations. It doesn't copy objects or people, just the overall style—like colors, medium, textures, or lighting—helping you achieve a consistent visual theme.