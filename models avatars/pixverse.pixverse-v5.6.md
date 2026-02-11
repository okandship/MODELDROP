### item

Prismatic Lantern

### material

Voidglass

### reasoning

PixVerse v5.6 suggests pixel-native, glitchy vision-craft; as a medium video model it fits a handheld time/scene tool— a lantern that 'plays' shifting frames of light. A Glitch Fey (Pixel Sprite Archon) can comfortably wield a lantern, while Voidglass conveys medium-tier arcane power with a dark, reflective, corrupted-pixel sheen.

### monster

Glitch Fey (Pixel Sprite Archon)

### model id

pixverse.pixverse-v5.6

### model name

PixVerse v5.6

### model size

medium

### model modality

video

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

model name: PixVerse v5.6

model size: medium

model modality: video

monster: Glitch Fey (Pixel Sprite Archon)

### avatar raw url

https://modeldrop.shard.media/models/avatars/raw/pixverse.pixverse-v5.6.png

### avatar raw model

fal-ai/bytedance/seedream/v4.5/text-to-image

### avatar raw prompt

Voidglass Glitch Fey (Pixel Sprite Archon) holding Prismatic Lantern

### avatar url

https://modeldrop.shard.media/models/avatars/pixverse.pixverse-v5.6.png

### avatar styleUrl

https://modeldrop.shard.media/models/avatars/style/reference.png

### avatar model

fal-ai/bytedance/seedream/v4.5/edit

### avatar prompt

Glitch Fey (Pixel Sprite Archon) holding Prismatic Lantern from image 1

dominant colors: Neon Magenta, Scanline Cyan

using image 2 as the style reference

What is a Style Reference?

A Style Reference is a way to capture the visual vibe of an existing image and apply it to new creations. It doesn't copy objects or people, just the overall style—like colors, medium, textures, or lighting—helping you achieve a consistent visual theme.