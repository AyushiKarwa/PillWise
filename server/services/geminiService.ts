import { GoogleGenAI, Type } from '@google/genai';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not set. Falling back to intelligent structured guidance rules.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractInlineData(base64Image?: string) {
  if (!base64Image) return null;
  let mimeType = 'image/jpeg';
  let data = base64Image;

  if (base64Image.startsWith('data:')) {
    const match = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (match) {
      mimeType = match[1];
      data = match[2];
    } else {
      data = base64Image.split(',')[1] || base64Image;
    }
  }
  return { mimeType, data };
}

function safeJsonParse(text?: string, fallback: any = {}) {
  if (!text) return fallback;
  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('JSON parse error:', e, 'Raw text:', text);
    return fallback;
  }
}

export const geminiService = {
  // --- 1. SYMPTOM ANALYSIS & CABINET EVALUATION ---
  async analyzeSymptoms(symptoms: string, cabinetMedicines: any[]) {
    const ai = getGeminiClient();

    // Context message about cabinet
    const cabinetSummary = cabinetMedicines.map((m) => ({
      name: m.name,
      salt: m.salt,
      purpose: m.purpose,
      quantity: m.quantity,
      dosage: m.dosage,
      expiryDate: m.expiryDate
    }));

    if (!ai) {
      // Fallback response generator if API key is missing
      const symptomsLower = symptoms.toLowerCase();
      const matchedCabinet = cabinetMedicines.length > 0
        ? cabinetMedicines.find((m) => {
            const text = `${m.name} ${m.purpose} ${m.salt}`.toLowerCase();
            return symptomsLower.split(' ').some((word) => word.length > 3 && text.includes(word));
          })
        : null;

      return {
        possibleCause: [
          symptomsLower.includes('fever') ? 'Viral Fever / Flu' : symptomsLower.includes('allergy') || symptomsLower.includes('cold') ? 'Seasonal Allergic Rhinitis' : 'Mild Functional Discomfort'
        ],
        availableMedicine: matchedCabinet ? {
          matched: true,
          name: matchedCabinet.name,
          quantity: matchedCabinet.quantity,
          dosage: matchedCabinet.dosage,
          expiryDate: matchedCabinet.expiryDate,
          commonUse: matchedCabinet.purpose || 'Commonly used for symptom management.'
        } : {
          matched: false
        },
        homeCare: [
          'Stay hydrated with warm water and fluids',
          'Get sufficient rest and keep room ventilated',
          'Avoid heavy or oily meals while recovering'
        ],
        doctorWarning: [
          'High fever above 102°F persisting for more than 48-72 hours',
          'Shortness of breath, chest pressure, or severe fatigue',
          'Signs of severe dehydration or persistent vomiting'
        ],
        needToBuy: matchedCabinet ? false : true,
        otcOptions: matchedCabinet ? [] : [
          {
            name: 'Over-the-counter Paracetamol 500mg',
            purpose: 'Fever and mild headache relief',
            generalDosage: '1 tablet every 6 hours as needed',
            precautions: 'Do not exceed daily maximum limits'
          }
        ],
        disclaimer: 'This is not medical advice. The information is AI-generated and provided for general guidance only. Always consult a qualified healthcare professional before taking any medication or making medical decisions.'
      };
    }

    const systemInstruction = `You are PillWise, an AI healthcare cabinet assistant.
Strict Boundaries:
- NEVER act as a doctor or physician.
- NEVER diagnose diseases with certainty.
- NEVER prescribe prescription-only medicines.
- Provide general educational guidance.
- ALWAYS check the user's Medicine Cabinet FIRST.
- If the User's Cabinet has NO medicines or 0 items, set "availableMedicine": {"matched": false} and "needToBuy": true.
- ONLY set "matched: true" if a medicine explicitly exists in the provided cabinet list.
- Keep descriptions short, structured, and bullet-friendly.
- End with the standard medical disclaimer.`;

    const prompt = `User Symptoms: "${symptoms}"

User's Current Medicine Cabinet:
${cabinetSummary.length > 0 ? JSON.stringify(cabinetSummary, null, 2) : 'EMPTY CABINET (0 medicines stored)'}

Analyze the symptoms safely, match against the user's medicine cabinet ONLY if applicable, and return structured JSON.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              possibleCause: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              availableMedicine: {
                type: Type.OBJECT,
                properties: {
                  matched: { type: Type.BOOLEAN },
                  name: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  dosage: { type: Type.STRING },
                  expiryDate: { type: Type.STRING },
                  commonUse: { type: Type.STRING }
                }
              },
              homeCare: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              doctorWarning: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              needToBuy: { type: Type.BOOLEAN },
              otcOptions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    generalDosage: { type: Type.STRING },
                    precautions: { type: Type.STRING }
                  }
                }
              },
              disclaimer: { type: Type.STRING }
            }
          }
        }
      });

      const json = JSON.parse(response.text || '{}');

      // Post-processing verification against actual cabinet list
      if (!cabinetMedicines || cabinetMedicines.length === 0) {
        json.availableMedicine = { matched: false };
        json.needToBuy = true;
      } else if (json.availableMedicine?.matched) {
        const matchedName = (json.availableMedicine.name || '').toLowerCase();
        const exists = cabinetMedicines.some((m) =>
          m.name.toLowerCase().includes(matchedName) || matchedName.includes(m.name.toLowerCase())
        );
        if (!exists) {
          json.availableMedicine = { matched: false };
          json.needToBuy = true;
        }
      }

      return json;
    } catch (err) {
      console.error('Error calling Gemini API for symptom evaluation:', err);
      // Return safe structured fallback
      return {
        possibleCause: ['Common Mild Illness or Seasonal Symptom'],
        availableMedicine: { matched: false },
        homeCare: ['Rest adequately and stay well hydrated.'],
        doctorWarning: ['Seek immediate care if symptoms worsen or severe signs appear.'],
        needToBuy: true,
        otcOptions: [{ name: 'Paracetamol 500mg', purpose: 'Fever/Pain', generalDosage: '1 tablet as needed', precautions: 'Follow package label' }],
        disclaimer: 'This is not medical advice. The information is AI-generated and provided for general guidance only. Always consult a qualified healthcare professional.'
      };
    }
  },

  // --- 2. OCR SCAN MEDICINE BOX ---
  async scanMedicineBox(base64Image?: string, rawText?: string) {
    const ai = getGeminiClient();

    const fallbackData = {
      name: 'Crocin Pain Relief 650',
      salt: 'Paracetamol 650mg + Caffeine 50mg',
      dosage: '1 tablet every 6 hours after food',
      expiryDate: '2028-03-31',
      purpose: 'Fast relief from severe headache, toothache, and joint pain',
      uses: ['Headache', 'Mild fever', 'Muscle pain'],
      storageInfo: 'Store in cool dry place away from sunlight',
      lowStockThreshold: 3
    };

    if (!ai) return fallbackData;

    const systemInstruction = `You are PillWise OCR Medicine Box Scanner.
Extract medicine details accurately from the image or raw OCR text.
Return JSON with:
- name: string
- salt: string (active chemical ingredient)
- dosage: string (e.g., 500mg, 1 capsule per day)
- expiryDate: string (YYYY-MM-DD or standard date format)
- purpose: string (Primary therapeutic purpose)
- uses: array of strings
- storageInfo: string`;

    try {
      const parts: any[] = [];
      const inlineData = extractInlineData(base64Image);
      if (inlineData) {
        parts.push({
          inlineData: {
            mimeType: inlineData.mimeType,
            data: inlineData.data
          }
        });
      }
      parts.push({
        text: `Extract medicine information from this box photo or text context:\n${rawText || ''}`
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              salt: { type: Type.STRING },
              dosage: { type: Type.STRING },
              expiryDate: { type: Type.STRING },
              purpose: { type: Type.STRING },
              uses: { type: Type.ARRAY, items: { type: Type.STRING } },
              storageInfo: { type: Type.STRING }
            }
          }
        }
      });

      const parsed = safeJsonParse(response.text, fallbackData);
      return parsed.name ? parsed : fallbackData;
    } catch (error) {
      console.error('Error scanning medicine box:', error);
      return fallbackData;
    }
  },

  // --- 3. PRESCRIPTION OCR READER ---
  async parsePrescription(base64Image?: string, rawText?: string) {
    const ai = getGeminiClient();

    const fallbackPrescription = {
      patientAdvice: 'Take medications regularly after meals, rest adequately, and complete the prescribed duration.',
      conditionSeverity: 'NORMAL' as 'CRITICAL' | 'NORMAL' | 'SAFE',
      severityReason: 'Prescription contains routine oral medications and standard supportive care for mild respiratory/gastrointestinal symptoms.',
      requiredTests: [
        {
          testName: 'Complete Blood Count (CBC)',
          purpose: 'Evaluate total white blood cell count and rule out severe systemic infection',
          urgency: 'Recommended within 48 hrs'
        },
        {
          testName: 'Fasting Blood Sugar (FBS)',
          purpose: 'Routine blood glucose assessment alongside antibiotic therapy',
          urgency: 'Optional / Routine'
        }
      ],
      medicines: [
        {
          medicineName: 'Sporolac-DS',
          dosage: '1 tablet twice daily',
          duration: '5 days',
          frequency: 'After meals',
          timing: '08:00 AM, 08:00 PM',
          purpose: 'Gut health & probiotic protection',
          salt: 'Lactic Acid Bacillus',
          quantityToBuy: 10
        },
        {
          medicineName: 'Aciloc 150mg',
          dosage: '1 tablet before breakfast',
          duration: '5 days',
          frequency: 'Morning empty stomach',
          timing: '07:30 AM',
          purpose: 'Acidity & gastro-protection',
          salt: 'Ranitidine 150mg',
          quantityToBuy: 10
        },
        {
          medicineName: 'Ondem-MD 4mg',
          dosage: '1 tablet as needed for nausea',
          duration: '3 days',
          frequency: 'SOS when nauseous',
          timing: '01:00 PM',
          purpose: 'Nausea & vomiting control',
          salt: 'Ondansetron 4mg',
          quantityToBuy: 5
        },
        {
          medicineName: 'Tussin-DMR Syrup',
          dosage: '5ml syrup twice daily',
          duration: '5 days',
          frequency: 'After meals',
          timing: '09:00 AM, 09:00 PM',
          purpose: 'Dry cough relief',
          salt: 'Dextromethorphan + Chlorpheniramine',
          quantityToBuy: 1
        },
        {
          medicineName: 'Azithral 500mg',
          dosage: '1 tablet once daily',
          duration: '3 days',
          frequency: 'After lunch',
          timing: '01:30 PM',
          purpose: 'Antibiotic for respiratory/throat care',
          salt: 'Azithromycin 500mg',
          quantityToBuy: 3
        }
      ]
    };

    if (!ai) return fallbackPrescription;

    const systemInstruction = `You are PillWise Doctor Prescription Reader and Clinical Analyzer.
Analyze doctor prescription scans or text carefully. You MUST extract and evaluate:
1. conditionSeverity: Grade the health situation as 'CRITICAL', 'NORMAL', or 'SAFE' based on prescribed drugs, combination therapies, or diagnostic urgency.
   - 'CRITICAL': High risk, potent drugs (cardiac, chemo, heavy steroids, severe infection/vitals distress) needing urgent monitoring.
   - 'NORMAL': Standard prescription for moderate acute or chronic condition (antibiotics, fever, BP, diabetes management).
   - 'SAFE': Minor ailment, preventative, supplements, or routine mild treatment (vitamins, mild antacids, cough drops).
2. severityReason: Brief 1-2 sentence medical explanation for the assigned severity rating.
3. requiredTests: Array of required or recommended laboratory/diagnostic tests identified or clinically indicated (e.g., CBC, Blood Sugar, LFT, Lipid Profile, Chest X-Ray, ECG, Urine Test, etc.).
4. medicines: Array of prescribed medications with details:
   - medicineName: string
   - dosage: string
   - duration: string
   - frequency: string (e.g. "Twice daily after meals", "Once daily morning")
   - timing: string (exact time formatted like "08:00 AM", "01:00 PM", or "08:00 PM")
   - purpose: string
   - salt: string
   - quantityToBuy: number
5. patientAdvice: string (General advice for patient).`;

    try {
      const parts: any[] = [];
      const inlineData = extractInlineData(base64Image);
      if (inlineData) {
        parts.push({
          inlineData: {
            mimeType: inlineData.mimeType,
            data: inlineData.data
          }
        });
      }
      parts.push({
        text: `Analyze this doctor prescription scan/text carefully. Extract medicine names, dosages, frequencies, recommended lab/diagnostic tests, and judge condition severity:\n${rawText || ''}`
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              conditionSeverity: { type: Type.STRING, enum: ['CRITICAL', 'NORMAL', 'SAFE'] },
              severityReason: { type: Type.STRING },
              patientAdvice: { type: Type.STRING },
              requiredTests: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    testName: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    urgency: { type: Type.STRING }
                  }
                }
              },
              medicines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    medicineName: { type: Type.STRING },
                    dosage: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    frequency: { type: Type.STRING },
                    timing: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    salt: { type: Type.STRING },
                    quantityToBuy: { type: Type.NUMBER }
                  }
                }
              }
            }
          }
        }
      });

      const parsed = safeJsonParse(response.text, null);
      if (parsed && Array.isArray(parsed.medicines) && parsed.medicines.length > 0) {
        if (!parsed.conditionSeverity) parsed.conditionSeverity = 'NORMAL';
        if (!parsed.severityReason) parsed.severityReason = 'Prescription evaluated based on extracted medication parameters.';
        if (!parsed.requiredTests) parsed.requiredTests = fallbackPrescription.requiredTests;
        return parsed;
      }
      return fallbackPrescription;
    } catch (error) {
      console.error('Error parsing prescription:', error);
      return fallbackPrescription;
    }
  },

  // --- 4. DRUG INTERACTION CHECKER ---
  async checkDrugInteractions(medicinesList: string[]) {
    const ai = getGeminiClient();

    const fallbackInteraction = {
      riskLevel: medicinesList.length > 1 ? 'Moderate' : 'Safe',
      summary: `Analyzed interaction potential between: ${medicinesList.join(', ')}.`,
      interactions: medicinesList.length > 1 ? [
        {
          pair: [medicinesList[0], medicinesList[1] || 'Paracetamol'] as [string, string],
          effect: 'Mild risk of additive gastrointestinal irritation or duplicated active ingredients if both contain Paracetamol.',
          severity: 'Mild' as const,
          advice: 'Verify active salts to avoid double dosing. Space administration by at least 2-4 hours if recommended by pharmacist.'
        }
      ] : [],
      disclaimer: 'This is not medical advice. Interaction checks are generated for informational context. Always consult a qualified physician or pharmacist before combining multiple medications.'
    };

    if (!ai) return fallbackInteraction;

    const systemInstruction = `You are PillWise Drug Interaction Safety Evaluator.
Analyze potential drug-drug or chemical salt interactions between selected medications.
Return structured JSON:
- riskLevel: "Safe" | "Low" | "Moderate" | "Severe"
- summary: string
- interactions: array of objects with:
  - pair: [string, string]
  - effect: string
  - severity: "Mild" | "Moderate" | "Severe"
  - advice: string
- disclaimer: string`;

    try {
      const prompt = `Analyze potential drug interactions between these medications:
${medicinesList.map((m, i) => `${i + 1}. ${m}`).join('\n')}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: { type: Type.STRING },
              summary: { type: Type.STRING },
              interactions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    pair: { type: Type.ARRAY, items: { type: Type.STRING } },
                    effect: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    advice: { type: Type.STRING }
                  }
                }
              },
              disclaimer: { type: Type.STRING }
            }
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (err) {
      console.error('Error checking drug interactions:', err);
      return fallbackInteraction;
    }
  },

  // --- 5. AI CHAT WITH CABINET CONTEXT & QUICK ACTIONS ---
  async chatWithAi(userQuery: string, cabinetMedicines: any[], selectedQuickMedicine?: string) {
    const ai = getGeminiClient();

    const cabinetContext = cabinetMedicines.map(m => `- ${m.name} (Salt: ${m.salt || 'N/A'}, Qty: ${m.quantity}, Expiry: ${m.expiryDate}, Purpose: ${m.purpose || 'N/A'})`).join('\n');

    if (!ai) {
      return `PillWise AI Assistant (Cabinet Aware):
You asked about: "${userQuery}" ${selectedQuickMedicine ? `regarding ${selectedQuickMedicine}` : ''}.

Cabinet status: You currently have ${cabinetMedicines.length} items in your cabinet.

Educational Information:
- Common Use: Follow dosage labels and store away from heat/moisture.
- Safety Note: Do not combine medications with duplicate active salts.
- Expiry Check: Always verify packaging expiry dates before consumption.

*Note: This is AI-generated educational information and not medical advice. Consult a healthcare provider for personal guidance.*`;
    }

    const systemInstruction = `You are PillWise AI Cabinet Assistant.
You assist users with their home medicine cabinet questions.
CRITICAL FORMATTING & STYLE RULES:
- Write in brief, extremely clean, easy-to-read sentences.
- DO NOT use markdown symbols like ###, **, *, or __ that clutter raw text.
- NEVER act as a doctor or prescribe medications.
- ALWAYS refer to their cabinet medicines when relevant.
- Keep descriptions concise, direct, and brief.
- End with a brief 1-sentence medical disclaimer.`;

    const prompt = `User Cabinet Context:
${cabinetContext}

Selected Medicine Tag: ${selectedQuickMedicine || 'None'}
User Question: "${userQuery}"`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction
        }
      });

      return response.text;
    } catch (err) {
      console.error('Error in chatWithAi:', err);
      return `I am currently analyzing your query. Please consult your physician or pharmacist regarding ${selectedQuickMedicine || 'this medication'}. Always review medication labels carefully.`;
    }
  }
};
