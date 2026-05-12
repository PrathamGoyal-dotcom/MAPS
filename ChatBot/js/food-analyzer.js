// Food Analyzer — Camera capture + TensorFlow.js MobileNet food recognition + calorie lookup

const FoodAnalyzer = (function () {
  let model = null;
  let isModelLoading = false;
  let modelReady = false;

  // ─── Load MobileNet model ───
  async function loadModel() {
    if (modelReady || isModelLoading) return;
    isModelLoading = true;
    try {
      model = await mobilenet.load({ version: 2, alpha: 1.0 });
      modelReady = true;
      console.log("MobileNet model loaded successfully");
    } catch (err) {
      console.error("Failed to load MobileNet:", err);
    }
    isModelLoading = false;
  }

  // ─── Classify an image element ───
  async function classifyImage(imgElement) {
    if (!modelReady) {
      await loadModel();
    }
    if (!model) throw new Error("Model failed to load");

    const predictions = await model.classify(imgElement, 5);
    return predictions; // [{ className, probability }]
  }

  // ─── Match predictions to food database ───
  function matchToFood(predictions) {
    const results = [];

    for (const pred of predictions) {
      const classNames = pred.className.toLowerCase().split(",").map(function (s) { return s.trim(); });

      for (const cn of classNames) {
        // Direct match in FoodClassMap
        for (const [key, foodKey] of Object.entries(FoodClassMap)) {
          if (cn.includes(key.toLowerCase())) {
            const food = FoodDatabase[foodKey];
            if (food && !results.find(function (r) { return r.key === foodKey; })) {
              results.push({
                key: foodKey,
                food: food,
                confidence: pred.probability,
                matchedClass: pred.className
              });
            }
          }
        }

        // Direct match in FoodDatabase by name
        for (const [key, food] of Object.entries(FoodDatabase)) {
          if (cn.includes(food.name.toLowerCase()) || food.name.toLowerCase().includes(cn)) {
            if (!results.find(function (r) { return r.key === key; })) {
              results.push({
                key: key,
                food: food,
                confidence: pred.probability,
                matchedClass: pred.className
              });
            }
          }
        }
      }
    }

    return results;
  }

  // ─── Format calorie analysis response ───
  function formatAnalysis(matches) {
    if (matches.length === 0) {
      return {
        text: "🍽️ **Hmm, I couldn't clearly identify the food in this image.**\n\nTry these tips for better results:\n• Make sure the food is well-lit and centered\n• Get closer to the food\n• Avoid cluttered backgrounds\n\nOr you can type the food name directly! For example: *\"calories in chicken breast\"*",
        suggestions: ["Scan again", "Calories in rice", "Calories in chicken", "Calories in pizza"],
        foods: []
      };
    }

    let text = "📸 **Food Detected!** Here's your calorie breakdown:\n\n";
    const allFoods = [];

    for (const match of matches.slice(0, 3)) {
      const f = match.food;
      const confidencePercent = (match.confidence * 100).toFixed(0);

      text += `**${f.name}** (${confidencePercent}% match)\n`;
      text += `📏 Serving: ${f.serving}\n\n`;
      text += `| Nutrient | Amount |\n`;
      text += `|----------|--------|\n`;
      text += `| 🔥 Calories | **${f.calories} kcal** |\n`;
      text += `| 🥩 Protein | ${f.protein}g |\n`;
      text += `| 🍚 Carbs | ${f.carbs}g |\n`;
      text += `| 🧈 Fat | ${f.fat}g |\n`;
      text += `| 🌾 Fiber | ${f.fiber}g |\n`;
      text += `| 🍬 Sugar | ${f.sugar}g |\n\n`;

      // Fitness verdict
      const proteinRatio = f.protein / Math.max(f.calories, 1) * 100;
      if (f.calories === 0) {
        text += "✅ Zero calories — drink up!\n\n";
      } else if (proteinRatio > 15 && f.fat < f.protein) {
        text += "✅ **Great gym food!** High protein, good for muscle building.\n\n";
      } else if (f.calories < 100 && f.fiber > 2) {
        text += "✅ **Healthy choice!** Low calorie, high fiber.\n\n";
      } else if (f.calories > 400) {
        text += "⚠️ **High calorie** — enjoy in moderation if you're cutting.\n\n";
      } else {
        text += "👍 Moderate choice — fits most nutrition plans.\n\n";
      }

      allFoods.push(f.name);
    }

    if (matches.length > 1) {
      const totalCals = matches.slice(0, 3).reduce(function (sum, m) { return sum + m.food.calories; }, 0);
      text += `**📊 Total estimated: ~${totalCals} kcal**\n`;
    }

    return {
      text: text,
      suggestions: ["Scan another food", "Bulking diet", "Cutting diet", "Calculate TDEE"],
      foods: allFoods
    };
  }

  // ─── Lookup food by name (text search) ───
  function lookupByName(query) {
    const lowerQuery = query.toLowerCase().replace(/calories?\s*(in|of|for)?\s*/i, "").trim();

    // Direct key match
    for (const [key, food] of Object.entries(FoodDatabase)) {
      if (key.toLowerCase() === lowerQuery || food.name.toLowerCase() === lowerQuery) {
        return formatAnalysis([{ key: key, food: food, confidence: 1.0, matchedClass: "text search" }]);
      }
    }

    // Partial match
    const matches = [];
    for (const [key, food] of Object.entries(FoodDatabase)) {
      if (food.name.toLowerCase().includes(lowerQuery) || lowerQuery.includes(food.name.toLowerCase()) || lowerQuery.includes(key.toLowerCase())) {
        matches.push({ key: key, food: food, confidence: 0.9, matchedClass: "text search" });
      }
    }

    if (matches.length > 0) {
      return formatAnalysis(matches);
    }

    return {
      text: "🍽️ I don't have **\"" + lowerQuery + "\"** in my database yet. Here are some foods I can analyze:\n\n" +
        "**Popular:** Pizza, Burger, Rice, Chicken, Pasta, Eggs, Salmon\n" +
        "**Fruits:** Apple, Banana, Orange, Mango, Strawberry\n" +
        "**Indian:** Biryani, Dal, Roti, Paneer, Curry\n" +
        "**Gym Foods:** Protein shake, Greek yogurt, Quinoa, Avocado\n\n" +
        "Or snap a photo with the 📷 button!",
      suggestions: ["Calories in chicken", "Calories in rice", "Calories in pizza", "Scan food"],
      foods: []
    };
  }

  // ─── PUBLIC API ───
  return {
    /**
     * Initialize — start loading the ML model in background
     */
    init: function () {
      loadModel();
    },

    /**
     * Check if the model is ready
     */
    isReady: function () {
      return modelReady;
    },

    /**
     * Analyze a food image
     * @param {HTMLImageElement} imgElement
     * @returns {Promise<{text, suggestions, foods}>}
     */
    analyzeImage: async function (imgElement) {
      try {
        const predictions = await classifyImage(imgElement);
        const matches = matchToFood(predictions);
        return formatAnalysis(matches);
      } catch (err) {
        console.error("Food analysis error:", err);
        return {
          text: "❌ **Analysis failed.** The image couldn't be processed. Try again with a clearer photo.",
          suggestions: ["Scan again", "Type food name"],
          foods: []
        };
      }
    },

    /**
     * Look up calories by food name (text-based)
     * @param {string} query
     * @returns {{text, suggestions, foods}}
     */
    lookupByName: lookupByName,

    /**
     * Get all available foods (for autocomplete / listing)
     */
    getAllFoods: function () {
      return Object.values(FoodDatabase).map(function (f) { return f.name; });
    }
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FoodAnalyzer;
}
