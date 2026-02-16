### item

Runed Time-Lantern

### material

Living Obsidian

### reasoning

Seedance 2.0 (video) suggests motion, frames, and temporal control—idealized as a lantern that casts and captures moving scenes; medium scale fits a one-handed relic a nimble Spriggan Code-Dancer can swing while weaving steps. Living Obsidian conveys medium-tier power with dark-fantasy, semi-sentient pixel shimmer that complements the model’s "dance" vibe.

### monster

Spriggan Code-Dancer

### model id

bytedance-seed.seedance-2.0

### model name

Seedance 2.0

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

\* \[model modality] The modality of the AI model (\`image\`, \`video\`, \`audio\`).

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

model name: Seedance 2.0

model size: medium

model modality: video

monster: Spriggan Code-Dancer

### avatar raw url

https://modeldrop.shard.media/models/avatars/raw/bytedance-seed.seedance-2.0.png

### avatar raw model

fal-ai/bytedance/seedream/v4.5/text-to-image

### avatar raw prompt

Living Obsidian Spriggan Code-Dancer holding Runed Time-Lantern

### avatar url

https://modeldrop.shard.media/models/avatars/bytedance-seed.seedance-2.0.png

### avatar styleUrl

https://modeldrop.shard.media/models/avatars/style/reference.png

### avatar model

fal-ai/bytedance/seedream/v4.5/edit

### avatar prompt

Spriggan Code-Dancer holding Runed Time-Lantern from image 1

dominant colors: Neon Jade, Midnight Violet

using image 2 as the style reference

What is a Style Reference?

A Style Reference is a way to capture the visual vibe of an existing image and apply it to new creations. It doesn't copy objects or people, just the overall style—like colors, medium, textures, or lighting—helping you achieve a consistent visual theme.