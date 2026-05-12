// NLP Engine — Intent classification, entity extraction, fuzzy matching
// This module processes user input and determines what the user is asking about.

const NLPEngine = (function () {

  // ─── STOP WORDS ───
  const STOP_WORDS = new Set([
    "i", "me", "my", "myself", "we", "our", "you", "your", "he", "she", "it",
    "they", "them", "what", "which", "who", "whom", "this", "that", "these",
    "those", "am", "is", "are", "was", "were", "be", "been", "being", "have",
    "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the",
    "and", "but", "if", "or", "because", "as", "until", "while", "of", "at",
    "by", "for", "with", "about", "between", "through", "during", "before",
    "after", "above", "below", "to", "from", "up", "down", "in", "out", "on",
    "off", "over", "under", "again", "further", "then", "once", "here",
    "there", "when", "where", "why", "how", "all", "both", "each", "few",
    "more", "most", "other", "some", "such", "no", "nor", "not", "only",
    "own", "same", "so", "than", "too", "very", "s", "t", "can", "will",
    "just", "don", "should", "now", "d", "ll", "m", "o", "re", "ve", "y",
    "ain", "aren", "couldn", "didn", "doesn", "hadn", "hasn", "haven",
    "isn", "ma", "mightn", "mustn", "needn", "shan", "shouldn", "wasn",
    "weren", "won", "wouldn", "please", "thanks", "thank", "could", "would",
    "like", "want", "need", "also", "really", "actually", "basically"
  ]);

  // ─── INTENT DEFINITIONS ───
  // Each intent has keywords (scored) and patterns (regex, higher confidence)
  const INTENTS = {
    greeting: {
      keywords: ["hi", "hello", "hey", "howdy", "sup", "hola", "greetings", "morning", "afternoon", "evening"],
      patterns: [/^(hi|hello|hey|howdy|yo|sup|hola|greetings)\b/i, /good\s*(morning|afternoon|evening)/i, /what'?s?\s*up/i],
      priority: 1
    },
    goodbye: {
      keywords: ["bye", "goodbye", "later", "cya", "see ya", "farewell", "leaving", "gotta go"],
      patterns: [/\b(bye|goodbye|see\s*y(a|ou)|farewell|gotta\s*go|take\s*care)\b/i],
      priority: 1
    },

    // Workout intents
    workout_plan: {
      keywords: ["workout", "routine", "split", "program", "training", "plan", "exercise", "regimen", "schedule", "session", "lifting"],
      patterns: [/workout\s*(plan|routine|split|program)/i, /training\s*(plan|program|split|routine)/i, /exercise\s*(plan|routine|program)/i, /what\s*should\s*i\s*(do|train|work)/i, /how\s*(should|do)\s*i\s*(train|work\s*out|lift)/i],
      priority: 3
    },
    muscle_group: {
      keywords: ["chest", "back", "shoulders", "legs", "arms", "biceps", "triceps", "core", "abs", "glutes", "quads", "hamstrings", "calves", "traps", "lats", "delts"],
      patterns: [/exercise[s]?\s*(for|to\s*(work|hit|target))\s*/i, /how\s*(do|to|can)\s*i\s*(work|train|hit|target|grow)\s*(my|the)?\s*/i, /best\s*(exercises?|movements?)\s*for/i],
      priority: 3
    },
    experience_level: {
      keywords: ["beginner", "intermediate", "advanced", "newbie", "new", "started", "starting", "experienced", "pro"],
      patterns: [/i'?m?\s*(a\s*)?(beginner|newbie|new|just\s*start)/i, /beginner\s*(workout|plan|routine)/i, /advanced\s*(workout|plan|routine)/i, /intermediate\s*(workout|plan|routine)/i],
      priority: 2
    },

    // Nutrition intents
    nutrition: {
      keywords: ["nutrition", "diet", "food", "eat", "eating", "meal", "meals", "calories", "calorie", "macros", "protein", "carbs", "carbohydrates", "fat", "fats", "bulk", "bulking", "cut", "cutting", "maintenance", "maintain"],
      patterns: [/what\s*should\s*i\s*eat/i, /how\s*(much|many)\s*(protein|calories|carbs|fat)/i, /meal\s*(plan|prep|timing)/i, /(bulking|cutting|bulk|cut)\s*(diet|food|meal|nutrition)?/i, /macro[s]?\s*(split|ratio|breakdown)/i, /nutrition\s*(advice|tip|guide|plan)/i],
      priority: 3
    },
    supplements: {
      keywords: ["supplement", "supplements", "creatine", "whey", "protein powder", "preworkout", "pre-workout", "bcaa", "vitamin", "fish oil", "caffeine", "magnesium"],
      patterns: [/what\s*supplements?\s*(should|do|to)/i, /do\s*i\s*need\s*supplements?/i, /(best|good|recommended)\s*supplements?/i, /should\s*i\s*take\s*(creatine|whey|protein|supplements?)/i],
      priority: 3
    },
    hydration: {
      keywords: ["water", "hydration", "hydrate", "drink", "drinking", "fluid", "dehydrated"],
      patterns: [/how\s*much\s*(water|fluid)/i, /staying?\s*hydrated/i],
      priority: 2
    },
    tdee: {
      keywords: ["tdee", "bmr", "metabolism", "calorie calculator", "maintenance calories"],
      patterns: [/how\s*(many|much)\s*calories\s*(do\s*i|should\s*i|to)/i, /calculate\s*(my\s*)?(tdee|calories|bmr)/i, /what'?s?\s*my\s*(tdee|bmr|maintenance)/i],
      priority: 3
    },

    // Membership intents
    membership: {
      keywords: ["membership", "member", "join", "signup", "sign up", "register", "registration", "plan", "pricing", "price", "cost", "fee", "subscription"],
      patterns: [/membership\s*(plan|price|cost|fee|option|tier)/i, /how\s*(much|do)\s*(does\s*it|to)\s*(cost|join|sign)/i, /(sign|join)\s*(up|the\s*gym)/i, /pricing\s*(plan|option|tier)/i, /what\s*(are|do)\s*(the|your)\s*(plan|membership|price)/i],
      priority: 3
    },
    cancellation: {
      keywords: ["cancel", "cancellation", "quit", "stop", "end", "terminate", "leave"],
      patterns: [/cancel\s*(my\s*)?(membership|subscription|plan)/i, /how\s*(do|can|to)\s*i?\s*cancel/i, /want\s*to\s*(cancel|quit|stop|leave)/i],
      priority: 3
    },
    freeze: {
      keywords: ["freeze", "pause", "hold", "suspend", "temporary"],
      patterns: [/(freeze|pause|hold|suspend)\s*(my\s*)?(membership|account|subscription)/i, /put\s*(my\s*)?(membership|account)\s*on\s*hold/i],
      priority: 3
    },
    guest_pass: {
      keywords: ["guest", "visitor", "friend", "bring", "day pass", "trial"],
      patterns: [/(guest|visitor|day)\s*pass/i, /bring\s*(a\s*)?(friend|guest|someone)/i, /trial\s*(pass|membership|day)/i],
      priority: 3
    },
    discount: {
      keywords: ["discount", "student", "senior", "family", "promo", "coupon", "offer", "deal", "special"],
      patterns: [/(student|senior|family|group)\s*(discount|price|rate)/i, /any\s*(discount|promo|deal|offer|special)/i],
      priority: 2
    },

    // Schedule intents
    schedule: {
      keywords: ["hours", "open", "close", "time", "schedule", "timing", "when"],
      patterns: [/(gym|opening|closing)\s*(hours?|time|schedule)/i, /when\s*(do\s*you|are\s*you|is\s*the\s*gym)\s*(open|close)/i, /what\s*(time|are)\s*(do\s*you|the|your)\s*(hours?|open|close)/i],
      priority: 3
    },
    peak_hours: {
      keywords: ["busy", "crowded", "peak", "quiet", "empty", "rush", "packed", "crowd"],
      patterns: [/when\s*is\s*(it|the\s*gym)\s*(busy|crowded|quiet|empty|packed)/i, /peak\s*(hours?|time)/i, /best\s*time\s*to\s*(go|come|visit|workout|work\s*out|avoid)/i, /least\s*(busy|crowded)/i],
      priority: 3
    },
    classes: {
      keywords: ["class", "classes", "yoga", "spinning", "spin", "hiit", "crossfit", "boxing", "pilates", "zumba", "group", "session"],
      patterns: [/(group\s*)?(class|classes)\s*(schedule|today|available|offered)/i, /what\s*classes\s*(do\s*you|are)/i, /(yoga|spinning|spin|hiit|crossfit|boxing|pilates|zumba)\s*(class)?/i, /when\s*is\s*(the\s*)?(yoga|spinning|hiit|crossfit|boxing|pilates|zumba)/i],
      priority: 3
    },

    // Exercise form intents
    exercise_form: {
      keywords: ["form", "technique", "proper", "correctly", "right way", "how to do"],
      patterns: [/how\s*(do|to)\s*(i\s*)?(do|perform)\s*(a\s*)?(squat|deadlift|bench|press|pull\s*up|row)/i, /(proper|correct|good|right)\s*(form|technique|way)\s*(for|to)/i, /(squat|deadlift|bench\s*press|overhead\s*press|pull[\s-]?up|row)\s*(form|technique|tips?|cues?|guide)/i, /am\s*i\s*(doing|squatting|deadlifting|benching|pressing)\s*(it\s*)?(right|correctly|wrong)/i],
      priority: 3
    },

    // FAQ intents
    first_day: {
      keywords: ["first day", "first time", "new member", "just joined", "getting started", "start"],
      patterns: [/(first|1st)\s*(day|time|visit)/i, /just\s*(joined|signed|started)/i, /new\s*(member|to\s*the\s*gym|here)/i, /what\s*(do|should)\s*i\s*(bring|know|expect|do)\s*(on\s*my\s*first|as\s*a\s*new)/i, /getting\s*started/i],
      priority: 3
    },
    personal_trainer: {
      keywords: ["personal trainer", "trainer", "pt", "coaching", "coach", "one on one", "1 on 1"],
      patterns: [/personal\s*train(er|ing)/i, /do\s*you\s*have\s*(personal\s*)?trainer/i, /hire\s*a\s*trainer/i, /need\s*a\s*(personal\s*)?trainer/i],
      priority: 3
    },
    equipment: {
      keywords: ["equipment", "machines", "weights", "dumbbells", "barbell", "treadmill", "bike", "rack", "bench", "cable"],
      patterns: [/what\s*(equipment|machines?|weights?)\s*(do\s*you|are)/i, /do\s*you\s*have\s*(a\s*)?(squat\s*rack|bench|treadmill|dumbbells|barbells|cable)/i],
      priority: 3
    },
    etiquette: {
      keywords: ["etiquette", "rules", "behavior", "manners", "wipe", "rerack", "re-rack"],
      patterns: [/gym\s*(etiquette|rules|manners)/i, /what\s*are\s*the\s*rules/i],
      priority: 2
    },
    general_faq: {
      keywords: ["locker", "parking", "wifi", "dress code", "clothes", "age", "injury", "injured", "hurt"],
      patterns: [/(locker|parking|wifi|dress\s*code|age\s*(limit|requirement)|minimum\s*age)/i],
      priority: 2
    },

    // Food / calorie intents
    food_calorie: {
      keywords: ["calories", "calorie", "kcal", "nutritional", "nutrition info", "how many calories", "food info", "macros in"],
      patterns: [/calories?\s*(in|of|for)\s*/i, /how\s*many\s*(calories|kcal)\s*(in|does|do|are)/i, /nutritional?\s*(info|value|facts?)\s*(of|for|in)/i, /macros?\s*(in|of|for)\s*/i, /what'?s?\s*(in|the\s*calories)\s*/i],
      priority: 4
    },
    food_scan: {
      keywords: ["scan", "camera", "photo", "picture", "snap", "capture", "photograph", "image"],
      patterns: [/scan\s*(my\s*)?(food|meal|plate|dish)/i, /(take|snap|capture)\s*(a\s*)?(photo|picture|pic)\s*(of\s*)?(my\s*)?(food|meal)?/i, /food\s*(scan|camera|photo)/i, /(use|open)\s*(the\s*)?camera/i, /scan\s*again/i, /scan\s*another/i],
      priority: 4
    },

    // Follow-up / context
    followup: {
      keywords: ["more", "else", "another", "different", "other", "alternative", "also", "details", "elaborate", "explain"],
      patterns: [/tell\s*me\s*more/i, /what\s*else/i, /any(thing)?\s*(else|more|other)/i, /more\s*(info|information|details|about)/i, /can\s*you\s*(elaborate|explain)/i, /go\s*(on|ahead)/i],
      priority: 1
    },
    thanks: {
      keywords: ["thanks", "thank", "thx", "appreciate", "helpful", "great", "awesome", "perfect", "cool"],
      patterns: [/thank\s*(you|s)/i, /that'?s?\s*(helpful|great|awesome|perfect)/i, /appreciate\s*(it|that|you)/i],
      priority: 1
    }
  };

  // ─── ENTITY DEFINITIONS ───
  const ENTITIES = {
    muscle_group: {
      chest: ["chest", "pecs", "pectoral"],
      back: ["back", "lats", "latissimus", "traps", "trapezius", "rhomboids"],
      shoulders: ["shoulders", "delts", "deltoids", "shoulder"],
      legs: ["legs", "quads", "quadriceps", "hamstrings", "glutes", "calves", "leg"],
      arms: ["arms", "biceps", "triceps", "forearms", "arm"],
      core: ["core", "abs", "abdominals", "obliques"]
    },
    exercise: {
      squat: ["squat", "squats", "squatting"],
      deadlift: ["deadlift", "deadlifts", "deadlifting", "dead lift"],
      benchPress: ["bench press", "bench", "benching"],
      overheadPress: ["overhead press", "ohp", "shoulder press", "military press", "pressing overhead"],
      pullUp: ["pull up", "pullup", "pull-up", "pullups", "pull ups", "chin up", "chinup"],
      row: ["row", "rows", "rowing", "bent over row", "barbell row"]
    },
    experience: {
      beginner: ["beginner", "newbie", "new", "starting", "started", "never", "first time", "noob"],
      intermediate: ["intermediate", "some experience", "few months", "been training", "a while"],
      advanced: ["advanced", "experienced", "years", "competitive", "powerlifter", "bodybuilder", "pro"]
    },
    nutrition_goal: {
      bulking: ["bulk", "bulking", "gain", "gaining", "mass", "size", "bigger", "grow", "weight gain", "muscle gain"],
      cutting: ["cut", "cutting", "lose", "losing", "lean", "shred", "shredded", "fat loss", "weight loss", "slim", "tone", "toned"],
      maintenance: ["maintain", "maintenance", "sustain", "recomp", "recomposition", "stay the same"]
    },
    day: {
      monday: ["monday", "mon"],
      tuesday: ["tuesday", "tue", "tues"],
      wednesday: ["wednesday", "wed"],
      thursday: ["thursday", "thu", "thurs"],
      friday: ["friday", "fri"],
      saturday: ["saturday", "sat"],
      sunday: ["sunday", "sun"]
    },
    class_name: {
      hiit: ["hiit", "high intensity", "interval training", "hiit blast"],
      yoga: ["yoga", "yoga flow"],
      spin: ["spin", "spinning", "spin cycle", "cycling", "cycle"],
      crossfit: ["crossfit", "cross fit", "wod"],
      boxing: ["boxing", "box"],
      pilates: ["pilates", "pilates core"],
      zumba: ["zumba", "dance fitness", "dance"],
      strength101: ["strength 101", "strength class", "strength basics", "lifting class"]
    }
  };

  // ─── TOKENIZER ───
  function tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s'-]/g, " ")
      .split(/\s+/)
      .filter(t => t.length > 0);
  }

  function removeStopWords(tokens) {
    return tokens.filter(t => !STOP_WORDS.has(t));
  }

  // ─── LEVENSHTEIN DISTANCE (for fuzzy matching) ───
  function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function fuzzyMatch(token, target, threshold) {
    threshold = threshold || 2;
    if (token.length < 3) return token === target;
    return levenshtein(token, target) <= threshold;
  }

  // ─── INTENT CLASSIFICATION ───
  function classifyIntent(text) {
    const tokens = tokenize(text);
    const cleanTokens = removeStopWords(tokens);
    const lowerText = text.toLowerCase();
    const scores = {};

    // Pattern matching (higher confidence)
    for (const [intent, config] of Object.entries(INTENTS)) {
      scores[intent] = { score: 0, matchedKeywords: [], matchedPatterns: false };

      if (config.patterns) {
        for (const pattern of config.patterns) {
          if (pattern.test(lowerText)) {
            scores[intent].score += 10 * (config.priority || 1);
            scores[intent].matchedPatterns = true;
            break;
          }
        }
      }
    }

    // Keyword matching
    for (const [intent, config] of Object.entries(INTENTS)) {
      for (const keyword of config.keywords) {
        // Multi-word keyword check
        if (keyword.includes(" ")) {
          if (lowerText.includes(keyword)) {
            scores[intent].score += 3 * (config.priority || 1);
            scores[intent].matchedKeywords.push(keyword);
          }
        } else {
          // Single word — check tokens (exact + fuzzy)
          for (const token of cleanTokens) {
            if (token === keyword) {
              scores[intent].score += 2 * (config.priority || 1);
              scores[intent].matchedKeywords.push(keyword);
            } else if (fuzzyMatch(token, keyword, 1)) {
              scores[intent].score += 1 * (config.priority || 1);
              scores[intent].matchedKeywords.push(keyword + " (fuzzy)");
            }
          }
        }
      }
    }

    // Sort by score
    const ranked = Object.entries(scores)
      .filter(([, v]) => v.score > 0)
      .sort((a, b) => b[1].score - a[1].score);

    if (ranked.length === 0) {
      return { intent: "unknown", confidence: 0, allIntents: [] };
    }

    const topIntent = ranked[0];
    const maxPossible = Math.max(topIntent[1].score, 1);
    const confidence = Math.min(topIntent[1].score / 15, 1); // Normalize to 0-1

    return {
      intent: topIntent[0],
      confidence: confidence,
      score: topIntent[1].score,
      matchedKeywords: topIntent[1].matchedKeywords,
      matchedPatterns: topIntent[1].matchedPatterns,
      allIntents: ranked.slice(0, 3).map(([name, data]) => ({ name, score: data.score }))
    };
  }

  // ─── ENTITY EXTRACTION ───
  function extractEntities(text) {
    const lowerText = text.toLowerCase();
    const found = {};

    for (const [entityType, entityMap] of Object.entries(ENTITIES)) {
      for (const [entityValue, synonyms] of Object.entries(entityMap)) {
        for (const synonym of synonyms) {
          if (synonym.includes(" ")) {
            if (lowerText.includes(synonym)) {
              if (!found[entityType]) found[entityType] = [];
              if (!found[entityType].includes(entityValue)) {
                found[entityType].push(entityValue);
              }
            }
          } else {
            const regex = new RegExp("\\b" + synonym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\b", "i");
            if (regex.test(lowerText)) {
              if (!found[entityType]) found[entityType] = [];
              if (!found[entityType].includes(entityValue)) {
                found[entityType].push(entityValue);
              }
            }
          }
        }
      }
    }

    return found;
  }

  // ─── PUBLIC API ───
  return {
    /**
     * Process user input and return intent + entities
     * @param {string} text - User input text
     * @returns {{ intent: string, confidence: number, entities: object, allIntents: array }}
     */
    process: function (text) {
      if (!text || text.trim().length === 0) {
        return { intent: "empty", confidence: 1, entities: {}, allIntents: [] };
      }

      const intentResult = classifyIntent(text);
      const entities = extractEntities(text);

      return {
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        score: intentResult.score,
        matchedKeywords: intentResult.matchedKeywords,
        matchedPatterns: intentResult.matchedPatterns,
        entities: entities,
        allIntents: intentResult.allIntents
      };
    },

    // Expose for testing
    tokenize: tokenize,
    extractEntities: extractEntities,
    classifyIntent: classifyIntent
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NLPEngine;
}
