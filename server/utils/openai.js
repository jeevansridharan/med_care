const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze a single medicine using OpenAI GPT
 * @param {string} medicineName
 * @param {string} language - 'en' or 'ta'
 * @returns {Promise<Object>} - Structured medicine info
 */
const analyzeMedicine = async (medicineName, language = 'en') => {
    const languageInstruction = language === 'ta'
        ? 'Respond entirely in Tamil language (தமிழ்). Use Tamil script for all text fields.'
        : 'Respond in English.';

    const prompt = `
You are a medical information assistant. Analyze the medicine "${medicineName}" and return ONLY a valid JSON object with this exact structure:

{
  "medicine": "${medicineName}",
  "purpose": "Brief purpose of the medicine",
  "benefits": ["benefit1", "benefit2", "benefit3"],
  "sideEffects": ["side effect 1", "side effect 2", "side effect 3"],
  "warnings": ["warning 1", "warning 2"],
  "typicalDosage": "Typical dosage information",
  "category": "Drug category (e.g., Analgesic, Antibiotic)"
}

${languageInstruction}

Return ONLY the JSON. No markdown, no code blocks, no extra text.
If the input is not a medicine, return: {"medicine": "${medicineName}", "error": "Not a recognized medicine"}
`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 600,
    });

    const content = response.choices[0].message.content.trim();

    try {
        return JSON.parse(content);
    } catch {
        // Try to extract JSON if there's extra text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        throw new Error(`Failed to parse AI response for ${medicineName}`);
    }
};

/**
 * Check drug interactions between multiple medicines
 * @param {string[]} medicines - Array of medicine names
 * @param {string} language - 'en' or 'ta'
 * @returns {Promise<Object>} - Interaction analysis
 */
const checkDrugInteractions = async (medicines, language = 'en') => {
    if (medicines.length < 2) {
        return { interactions: [], message: language === 'ta' ? 'இடைவினைகளை சரிபார்க்க குறைந்தது 2 மருந்துகள் தேவை.' : 'At least 2 medicines are needed to check interactions.' };
    }

    const languageInstruction = language === 'ta'
        ? 'Respond entirely in Tamil language (தமிழ்). Use Tamil script for all text fields.'
        : 'Respond in English.';

    const prompt = `
You are a clinical pharmacist. Analyze the drug interactions for the following medicines: ${medicines.join(', ')}.

Return ONLY a valid JSON object:
{
  "medicines": ${JSON.stringify(medicines)},
  "interactions": [
    {
      "medicines": ["medicine1", "medicine2"],
      "severity": "mild | moderate | severe",
      "description": "Description of the interaction",
      "recommendation": "What to do"
    }
  ],
  "overallRisk": "low | moderate | high",
  "summary": "Brief overall summary"
}

${languageInstruction}
Return ONLY the JSON. If no interactions found, return empty interactions array.
`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
    });

    const content = response.choices[0].message.content.trim();
    try {
        return JSON.parse(content);
    } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        throw new Error('Failed to parse drug interaction response');
    }
};

/**
 * Translate medicine info to Tamil using OpenAI
 * @param {Object} medicineData - English medicine data
 * @returns {Promise<Object>} - Tamil translated data
 */
const translateToTamil = async (medicineData) => {
    const prompt = `
Translate the following medicine information to Tamil (தமிழ்). Return ONLY valid JSON with the same structure.

Input JSON:
${JSON.stringify(medicineData, null, 2)}

Return the exact same JSON structure but with all string values translated to Tamil.
Return ONLY the JSON. No extra text.
`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
    });

    const content = response.choices[0].message.content.trim();
    try {
        return JSON.parse(content);
    } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        throw new Error('Failed to parse translation response');
    }
};

module.exports = { analyzeMedicine, checkDrugInteractions, translateToTamil };
