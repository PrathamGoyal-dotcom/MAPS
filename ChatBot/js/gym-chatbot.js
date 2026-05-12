// GymChatBot — Main chatbot core with clean public API for integration
// This is the single entry point that your team integrates with.

const GymChatBot = (function () {

  let initialized = false;
  let config = {
    typingDelay: 500,        // ms delay before responding (simulate thinking)
    confidenceThreshold: 0.15, // Below this → fallback response
    enableContext: true,      // Multi-turn conversation tracking
    enableSuggestions: true,  // Return quick-reply suggestions
    onMessage: null,          // Callback: function({ text, suggestions, intent, entities })
    onTypingStart: null,      // Callback: function()
    onTypingEnd: null,        // Callback: function()
    onError: null             // Callback: function(error)
  };

  // ─── RESPONSE GENERATORS ───
  // Each function returns { text: string, suggestions: string[] }

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function handleGreeting() {
    return {
      text: randomItem(KnowledgeBase.greetings),
      suggestions: ["Workout plans", "Nutrition advice", "Membership info", "Class schedule", "Exercise form tips"]
    };
  }

  function handleGoodbye() {
    return {
      text: randomItem(KnowledgeBase.goodbye),
      suggestions: []
    };
  }

  function handleThanks() {
    const responses = [
      "You're welcome! 💪 Anything else I can help with?",
      "Happy to help! Let me know if you have more questions. 🏋️",
      "Anytime! What else would you like to know?",
      "Glad I could help! Feel free to ask anything else."
    ];
    return {
      text: randomItem(responses),
      suggestions: ["Workout plans", "Nutrition tips", "Class schedule"]
    };
  }

  function handleWorkoutPlan(entities) {
    const level = (entities.experience && entities.experience[0]) || ContextManager.getUserLevel() || null;
    const kb = KnowledgeBase.workouts;

    if (level === "beginner") {
      const plan = kb.beginner.fullBody;
      return {
        text: `Here's a great **${plan.name}**:\n\n📋 **Schedule:** ${plan.days.join(", ")}\n\n**Exercises:**\n${plan.exercises.map(e => "• " + e).join("\n")}\n\n💡 **Tip:** ${plan.tips}`,
        suggestions: ["Beginner cardio plan", "Intermediate workout", "Nutrition for beginners"]
      };
    }

    if (level === "intermediate") {
      const ul = kb.intermediate.upperLower;
      let text = `Here's an **${ul.name}**:\n\n`;
      for (const [day, exercises] of Object.entries(ul.schedule)) {
        text += `**${day}:**\n${exercises.map(e => "• " + e).join("\n")}\n\n`;
      }
      text += `💡 **Tip:** ${ul.tips}`;
      return {
        text: text,
        suggestions: ["Push/Pull/Legs split", "Advanced program", "Nutrition for muscle gain"]
      };
    }

    if (level === "advanced") {
      const pb = kb.advanced.powerbuilding;
      let text = `Here's the **${pb.name}**:\n\n📌 *${pb.focus}*\n\n`;
      for (const [day, exercises] of Object.entries(pb.schedule)) {
        text += `**${day}:**\n${exercises.map(e => "• " + e).join("\n")}\n\n`;
      }
      text += `💡 **Tip:** ${pb.tips}`;
      return {
        text: text,
        suggestions: ["Nutrition for strength", "Exercise form guides", "Supplement advice"]
      };
    }

    // No level specified — ask
    return {
      text: "I'd love to recommend a workout plan! What's your experience level?\n\n• **Beginner** — New to the gym or less than 6 months\n• **Intermediate** — 6 months to 2 years of consistent training\n• **Advanced** — 2+ years of serious training",
      suggestions: ["Beginner workout", "Intermediate workout", "Advanced workout"]
    };
  }

  function handlePPL() {
    const ppl = KnowledgeBase.workouts.intermediate.ppl;
    let text = `Here's the **${ppl.name}**:\n\n`;
    for (const [day, exercises] of Object.entries(ppl.schedule)) {
      text += `**${day}:**\n${exercises.map(e => "• " + e).join("\n")}\n\n`;
    }
    text += `💡 **Tip:** ${ppl.tips}`;
    return {
      text: text,
      suggestions: ["Upper/Lower split", "Nutrition for this plan", "Exercise form tips"]
    };
  }

  function handleMuscleGroup(entities) {
    const groups = entities.muscle_group;
    if (!groups || groups.length === 0) {
      return {
        text: "Which muscle group are you interested in? I can suggest exercises for:\n\n• Chest\n• Back\n• Shoulders\n• Legs\n• Arms\n• Core",
        suggestions: ["Chest exercises", "Back exercises", "Leg exercises", "Arm exercises"]
      };
    }

    const kb = KnowledgeBase.workouts.muscleGroups;
    let text = "";
    for (const group of groups) {
      if (kb[group]) {
        text += `**${group.charAt(0).toUpperCase() + group.slice(1)} Exercises:**\n${kb[group].map(e => "• " + e).join("\n")}\n\n`;
      }
    }
    if (!text) {
      return {
        text: "I don't have specific exercises for that muscle group. Try asking about chest, back, shoulders, legs, arms, or core.",
        suggestions: ["Chest exercises", "Back exercises", "Leg exercises"]
      };
    }
    text += "Want me to explain proper form for any of these?";
    return {
      text: text.trim(),
      suggestions: ["Squat form", "Deadlift form", "Bench press form"]
    };
  }

  function handleNutrition(entities) {
    const goal = (entities.nutrition_goal && entities.nutrition_goal[0]) || ContextManager.getUserGoal() || null;
    const kb = KnowledgeBase.nutrition.goals;

    if (goal === "bulking") {
      const info = kb.bulking;
      return {
        text: `**Bulking Nutrition Guide** 🍗\n\n**Calories:** ${info.calories}\n\n**Macros:**\n• Protein: ${info.macros.protein}\n• Carbs: ${info.macros.carbs}\n• Fat: ${info.macros.fat}\n\n**Meal Timing:** ${info.mealTiming}\n\n**Best Foods:**\n${info.foods.map(f => "• " + f).join("\n")}\n\n💡 **Tip:** ${info.tips}`,
        suggestions: ["Calculate my TDEE", "Bulking supplements", "Bulking workout plan"]
      };
    }

    if (goal === "cutting") {
      const info = kb.cutting;
      return {
        text: `**Cutting Nutrition Guide** 🥗\n\n**Calories:** ${info.calories}\n\n**Macros:**\n• Protein: ${info.macros.protein}\n• Carbs: ${info.macros.carbs}\n• Fat: ${info.macros.fat}\n\n**Meal Timing:** ${info.mealTiming}\n\n**Best Foods:**\n${info.foods.map(f => "• " + f).join("\n")}\n\n💡 **Tip:** ${info.tips}`,
        suggestions: ["Calculate my TDEE", "Best supplements", "Cardio plans"]
      };
    }

    if (goal === "maintenance") {
      const info = kb.maintenance;
      return {
        text: `**Maintenance Nutrition** ⚖️\n\n**Calories:** ${info.calories}\n\n**Macros:**\n• Protein: ${info.macros.protein}\n• Carbs: ${info.macros.carbs}\n• Fat: ${info.macros.fat}\n\n💡 **Tip:** ${info.tips}`,
        suggestions: ["Calculate my TDEE", "Workout plans", "Supplement advice"]
      };
    }

    // No goal specified
    return {
      text: "I can help with nutrition! What's your current goal?\n\n• **Bulking** — Gaining muscle and size\n• **Cutting** — Losing fat while keeping muscle\n• **Maintenance** — Staying at current weight\n\nOr ask me about specific topics like macros, meal timing, or supplements!",
      suggestions: ["Bulking diet", "Cutting diet", "Maintenance diet", "Supplements"]
    };
  }

  function handleSupplements() {
    const kb = KnowledgeBase.nutrition.supplements;
    let text = "**Supplement Guide** 💊\n\n**Essential (Evidence-Based):**\n";
    for (const supp of kb.essential) {
      text += `\n• **${supp.name}** — ${supp.dose}\n  ${supp.benefit}\n`;
    }
    text += "\n**Optional but Helpful:**\n";
    for (const supp of kb.optional) {
      text += `\n• **${supp.name}** — ${supp.dose}\n  ${supp.benefit}\n`;
    }
    text += `\n⚠️ **Skip:** ${kb.avoid}`;
    return {
      text: text,
      suggestions: ["Nutrition advice", "Workout plans", "Hydration tips"]
    };
  }

  function handleHydration() {
    const kb = KnowledgeBase.nutrition.hydration;
    return {
      text: `**Hydration Guide** 💧\n\n**Daily Intake:** ${kb.general}\n\n**During Training:** ${kb.training}\n\n**How to Check:** ${kb.signs}`,
      suggestions: ["Nutrition advice", "Supplement guide", "Workout plans"]
    };
  }

  function handleTDEE() {
    return {
      text: `**How to Calculate Your TDEE** 🔢\n\n${KnowledgeBase.nutrition.tdeeFormula}\n\n**Example:** A 25-year-old male, 180 lbs (82 kg), 5'10" (178 cm), moderately active:\n• BMR = 10×82 + 6.25×178 - 5×25 - 5 = **1,808 cal**\n• TDEE = 1,808 × 1.55 = **~2,802 cal/day**\n\nOnce you know your TDEE:\n• **Bulk:** Add 300-500 calories\n• **Cut:** Subtract 300-500 calories\n• **Maintain:** Eat at TDEE`,
      suggestions: ["Bulking diet", "Cutting diet", "Macro breakdown"]
    };
  }

  function handleMembership() {
    const plans = KnowledgeBase.membership.plans;
    let text = "**Membership Plans** 🏢\n\n";
    for (const plan of plans) {
      text += `**${plan.name} — ${plan.price}**\n`;
      text += plan.features.map(f => "• " + f).join("\n");
      text += `\n📝 ${plan.contract}\n\n`;
    }
    text += `\n**How to Sign Up:** ${KnowledgeBase.membership.signup}`;
    return {
      text: text,
      suggestions: ["Student discount", "Cancel membership", "Guest passes", "Freeze membership"]
    };
  }

  function handleCancellation() {
    return {
      text: `**Cancellation Policy** 📋\n\n${KnowledgeBase.membership.policies.cancellation}`,
      suggestions: ["Freeze membership", "Membership plans", "Contact us"]
    };
  }

  function handleFreeze() {
    return {
      text: `**Membership Freeze** ❄️\n\n${KnowledgeBase.membership.policies.freeze}`,
      suggestions: ["Cancel membership", "Membership plans"]
    };
  }

  function handleGuestPass() {
    return {
      text: `**Guest & Day Passes** 🎫\n\n${KnowledgeBase.membership.policies.guestPass}`,
      suggestions: ["Membership plans", "Gym hours"]
    };
  }

  function handleDiscount() {
    const p = KnowledgeBase.membership.policies;
    return {
      text: `**Available Discounts** 🏷️\n\n• **Student:** ${p.studentDiscount}\n• **Senior (65+):** ${p.seniorDiscount}\n• **Family:** ${p.familyPlan}`,
      suggestions: ["Membership plans", "Sign up"]
    };
  }

  function handleSchedule() {
    const hours = KnowledgeBase.schedule.gymHours;
    let text = "**Gym Hours** 🕐\n\n";
    for (const [day, time] of Object.entries(hours)) {
      text += `• **${day}:** ${time}\n`;
    }
    return {
      text: text,
      suggestions: ["Peak hours", "Class schedule", "Membership plans"]
    };
  }

  function handlePeakHours() {
    const ph = KnowledgeBase.schedule.peakHours;
    return {
      text: `**Gym Traffic Guide** 📊\n\n🔴 **Peak (Busiest):** ${ph.peak}\n🟡 **Moderate:** ${ph.moderate}\n🟢 **Quiet (Best Time):** ${ph.quiet}\n\n💡 ${ph.tip}`,
      suggestions: ["Gym hours", "Class schedule"]
    };
  }

  function handleClasses(entities) {
    const kb = KnowledgeBase.schedule.classes;

    // Check if asking about a specific class
    if (entities.class_name && entities.class_name.length > 0) {
      const className = entities.class_name[0];
      const classMap = {
        hiit: "HIIT Blast", yoga: "Yoga Flow", spin: "Spin Cycle",
        crossfit: "CrossFit WOD", boxing: "Boxing Basics",
        pilates: "Pilates Core", zumba: "Zumba", strength101: "Strength 101"
      };
      const targetName = classMap[className];
      const cls = kb.find(c => c.name === targetName);
      if (cls) {
        return {
          text: `**${cls.name}** 🏃\n\n• **Duration:** ${cls.duration}\n• **Days:** ${cls.days.join(", ")}\n• **Time:** ${cls.time}\n• **Level:** ${cls.level}\n• **Description:** ${cls.description}`,
          suggestions: ["All classes", "Gym hours", "Membership plans"]
        };
      }
    }

    // Check if asking about a specific day
    if (entities.day && entities.day.length > 0) {
      const dayName = entities.day[0];
      const dayCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      const dayClasses = kb.filter(c => c.days.includes(dayCapitalized));

      if (dayClasses.length > 0) {
        let text = `**Classes on ${dayCapitalized}** 📅\n\n`;
        for (const cls of dayClasses) {
          text += `• **${cls.name}** — ${cls.time} (${cls.duration}, ${cls.level})\n`;
        }
        return { text, suggestions: ["All classes", "Gym hours"] };
      } else {
        return {
          text: `No classes scheduled on ${dayCapitalized}. Check other days!`,
          suggestions: ["Monday classes", "Tuesday classes", "All classes"]
        };
      }
    }

    // Show all classes
    let text = "**Group Fitness Classes** 🏃\n\n";
    for (const cls of kb) {
      text += `**${cls.name}** (${cls.duration})\n• ${cls.days.join(", ")} at ${cls.time}\n• Level: ${cls.level}\n\n`;
    }
    text += "Ask me about any specific class for more details!";
    return {
      text: text,
      suggestions: ["HIIT class", "Yoga class", "CrossFit class", "Peak hours"]
    };
  }

  function handleExerciseForm(entities) {
    const kb = KnowledgeBase.exerciseForm;

    if (entities.exercise && entities.exercise.length > 0) {
      const exerciseName = entities.exercise[0];
      const exercise = kb[exerciseName];

      if (exercise) {
        let text = `**${exercise.name} — Form Guide** 📝\n\n`;
        text += `**Muscles Worked:** ${exercise.muscles}\n\n`;

        // Include video
        if (exercise.video) {
          text += `[video:${exercise.video}]\n\n`;
        }

        text += "**Steps:**\n";
        exercise.steps.forEach((step, i) => {
          text += `${i + 1}. ${step}\n`;
        });
        text += "\n**Common Mistakes:**\n";
        text += exercise.commonMistakes.map(m => "❌ " + m).join("\n");
        text += `\n\n🎯 **Cues:** ${exercise.cues}`;

        text += "\n\n💡 *Say \"tell me more\" for pro tips, warm-up routine, and a fun fact!*";

        // Mark content layers as shown
        ContextManager.markContentShown(exerciseName, "steps");
        ContextManager.markContentShown(exerciseName, "mistakes");

        const otherExercises = Object.keys(kb).filter(k => k !== exerciseName);
        const suggestionMap = { squat: "Squat form", deadlift: "Deadlift form", benchPress: "Bench press form", overheadPress: "OHP form", pullUp: "Pull-up form", row: "Row form" };
        const suggestions = ["Tell me more", ...otherExercises.slice(0, 2).map(e => suggestionMap[e] || e)];

        return { text, suggestions };
      }
    }

    // No specific exercise — list available
    return {
      text: "I can help with proper form for these exercises — complete with **video tutorials** 🎬:\n\n• Barbell Back Squat\n• Conventional Deadlift\n• Barbell Bench Press\n• Overhead Press\n• Pull-Ups\n• Barbell Rows\n\nWhich one would you like to learn about?",
      suggestions: ["Squat form", "Deadlift form", "Bench press form", "Pull-up form"]
    };
  }

  function handleFirstDay() {
    return {
      text: KnowledgeBase.faq.firstDay.a,
      suggestions: ["Gym etiquette", "What equipment?", "Beginner workout"]
    };
  }

  function handlePersonalTrainer() {
    return {
      text: KnowledgeBase.faq.personalTrainer.a,
      suggestions: ["Membership plans", "Beginner workout", "Class schedule"]
    };
  }

  function handleEquipment() {
    return {
      text: KnowledgeBase.faq.equipment.a,
      suggestions: ["Exercise form guides", "Workout plans", "Class schedule"]
    };
  }

  function handleEtiquette() {
    return {
      text: KnowledgeBase.faq.etiquette.a,
      suggestions: ["First day tips", "Gym hours", "Equipment"]
    };
  }

  function handleGeneralFAQ(text) {
    const lowerText = text.toLowerCase();
    const faq = KnowledgeBase.faq;

    if (/locker/i.test(lowerText)) return { text: faq.lockers.a, suggestions: ["Gym hours", "Membership"] };
    if (/park/i.test(lowerText)) return { text: faq.parking.a, suggestions: ["Gym hours", "Membership"] };
    if (/wifi|wi-fi/i.test(lowerText)) return { text: faq.wifi.a, suggestions: ["Gym hours", "Equipment"] };
    if (/dress|cloth|wear/i.test(lowerText)) return { text: faq.dresscode.a, suggestions: ["First day tips", "Etiquette"] };
    if (/age|old|young|minor|kid|child/i.test(lowerText)) return { text: faq.age.a, suggestions: ["Membership plans", "First day tips"] };
    if (/injur|hurt|pain/i.test(lowerText)) return { text: faq.injuries.a, suggestions: ["Personal trainer", "Exercise form"] };

    // Generic FAQ list
    return {
      text: "Here are some common questions I can answer:\n\n• What should I bring on my first day?\n• Dress code policy\n• Locker information\n• Parking availability\n• WiFi access\n• Age requirements\n• Injury protocol\n• Gym etiquette",
      suggestions: ["First day tips", "Locker info", "Parking", "Age requirements"]
    };
  }

  function handleFollowUp(nlpResult, userText) {
    const resolved = ContextManager.resolveFollowUp(nlpResult);
    const depth = resolved.followUpDepth;

    if (!resolved.lastTopic) {
      return {
        text: "Sure thing! What topic would you like to explore? I'm ready to dive deep into any of these 💪",
        suggestions: ["Workout plans", "Nutrition", "Membership", "Class schedule", "Exercise form"]
      };
    }

    const lowerText = userText.toLowerCase();

    // ── Exercise form follow-ups (layered content) ──
    if (resolved.lastTopic === "exercise_form") {
      const exerciseKey = resolved.lastExercise || (resolved.entities.exercise && resolved.entities.exercise[0]);
      if (exerciseKey) {
        const exercise = KnowledgeBase.exerciseForm[exerciseKey];
        if (exercise) {
          const shown = ContextManager.getShownContent(exerciseKey);
          const suggestionMap = { squat: "Squat form", deadlift: "Deadlift form", benchPress: "Bench press form", overheadPress: "OHP form", pullUp: "Pull-up form", row: "Row form" };
          const others = Object.keys(KnowledgeBase.exerciseForm).filter(k => k !== exerciseKey).slice(0, 2).map(e => suggestionMap[e] || e);

          // Layer 1: Pro tips
          if (!shown.includes("proTips") && exercise.proTips) {
            ContextManager.markContentShown(exerciseKey, "proTips");
            let text = `**${exercise.name} — Pro Tips** 🎯\n\nNice, you want to go deeper! Here are some advanced tips:\n\n`;
            text += exercise.proTips.map(t => "💡 " + t).join("\n");
            text += "\n\n*Want the warm-up routine or a fun fact? Keep going!*";
            return { text, suggestions: ["Tell me more", ...others] };
          }

          // Layer 2: Warm-up routine
          if (!shown.includes("warmUp") && exercise.warmUp) {
            ContextManager.markContentShown(exerciseKey, "warmUp");
            let text = `**${exercise.name} — Warm-Up Routine** 🔥\n\nNever skip the warm-up! Here's what I recommend before ${exercise.name.toLowerCase()}:\n\n`;
            text += exercise.warmUp.map((w, i) => `${i + 1}. ${w}`).join("\n");
            text += "\n\n*One more — want a fun fact about this exercise?*";
            return { text, suggestions: ["Tell me more", ...others] };
          }

          // Layer 3: Fun fact
          if (!shown.includes("funFact") && exercise.funFact) {
            ContextManager.markContentShown(exerciseKey, "funFact");
            let text = `**${exercise.name} — Did You Know?** 🧠\n\n${exercise.funFact}\n\nThat's everything I've got on the ${exercise.name.toLowerCase()}! Want to learn about another exercise?`;
            return { text, suggestions: others.length > 0 ? others : ["Workout plans", "Nutrition"] };
          }

          // All layers shown
          return {
            text: `I've shared everything I know about the ${exercise.name}! 🏆 You're practically an expert now. Want to check out another exercise or switch topics?`,
            suggestions: [...others, "Workout plans", "Nutrition"]
          };
        }
      }
      return handleExerciseForm(resolved.entities);
    }

    // ── Workout follow-ups ──
    if (resolved.lastTopic === "workout") {
      if (/cardio/i.test(lowerText)) {
        const cardio = KnowledgeBase.workouts.beginner.cardio;
        return {
          text: `**${cardio.name}** 🏃\n\n**Schedule:** ${cardio.schedule}\n\n**Options:**\n${cardio.options.map(o => "• " + o).join("\n")}\n\n💡 **Tip:** ${cardio.tips}`,
          suggestions: ["Workout plans", "Nutrition"]
        };
      }
      if (/ppl|push.*pull|pull.*push/i.test(lowerText)) return handlePPL();

      // Progressive workout follow-ups
      const workoutLayers = [
        { text: "Great question! Here's something else to consider 🤔\n\n**Recovery Tips:**\n• Sleep 7-9 hours per night — this is when muscles actually grow\n• Take at least 1-2 rest days per week\n• Stretch or do yoga on rest days for active recovery\n• If you're constantly sore, you might be overtraining — listen to your body\n\nWant nutrition advice to complement your training?", suggestions: ["Nutrition advice", "Supplements", "Exercise form"] },
        { text: "Here's another angle on your training 💡\n\n**Progressive Overload — The Key to Growth:**\n• Add 2.5-5 lbs to the bar each week on main lifts\n• If you can't add weight, add 1 more rep per set\n• Track your lifts in a notebook or app — what gets measured gets managed\n• Deload every 4-6 weeks (reduce volume 40%) to let your body recover\n\nRemember: consistency > intensity. Showing up 4x/week beats going hard once and burning out.", suggestions: ["Calculate TDEE", "Class schedule", "Exercise form"] },
        { text: "One more thing that most beginners overlook 🧠\n\n**Mind-Muscle Connection:**\n• Focus on the muscle you're targeting, not just moving the weight\n• Slow down your reps — use 2-3 seconds on the lowering phase\n• Squeeze the muscle at the top of each rep\n• Leave your ego at the door — lighter weight with good form beats heavy weight with bad form\n\nYou've got a solid foundation! Want to explore something else?", suggestions: ["Nutrition", "Membership", "Exercise form"] }
      ];

      const idx = Math.min(depth - 1, workoutLayers.length - 1);
      if (idx >= 0 && idx < workoutLayers.length) return workoutLayers[idx];
      return handleWorkoutPlan(resolved.entities);
    }

    // ── Nutrition follow-ups ──
    if (resolved.lastTopic === "nutrition") {
      if (nlpResult.entities.nutrition_goal) return handleNutrition(nlpResult.entities);

      const nutritionLayers = [
        { text: "Let me share some practical meal prep tips! 🍱\n\n**Meal Prep 101:**\n• Cook protein in bulk on Sunday (chicken, ground turkey, eggs)\n• Prep rice/potatoes in large batches — they reheat well\n• Pre-portion into containers for the week\n• Keep healthy snacks ready: Greek yogurt, protein bars, almonds, fruit\n• Prep takes 2-3 hours once/week but saves hours daily\n\nWant to know about supplements or hydration?", suggestions: ["Supplements", "Hydration tips", "Calculate TDEE"] },
        { text: "Here's something most people get wrong about nutrition 🤯\n\n**Common Nutrition Myths Busted:**\n• ❌ \"Eating fat makes you fat\" — Healthy fats are essential\n• ❌ \"You need to eat every 2 hours\" — Meal timing matters less than total daily intake\n• ❌ \"Carbs are bad\" — Carbs fuel your workouts and recovery\n• ❌ \"Protein shakes are necessary\" — Whole food is always better, shakes are just convenient\n• ✅ The #1 rule: Total calories and protein are what matter most\n\nWant to calculate your specific calorie needs?", suggestions: ["Calculate TDEE", "Supplements", "Workout plans"] }
      ];

      const idx = Math.min(depth - 1, nutritionLayers.length - 1);
      if (idx >= 0 && idx < nutritionLayers.length) return nutritionLayers[idx];
      return handleNutrition(resolved.entities);
    }

    // ── Membership follow-ups ──
    if (resolved.lastTopic === "membership") {
      const memberLayers = [
        { text: "Here's my honest recommendation 💯\n\n**Which plan is right for you?**\n• **Just starting out?** → Basic is perfect. Get comfortable first.\n• **Love group classes?** → Premium is great value with unlimited classes.\n• **Serious about results?** → VIP with the trainer consultation is worth every penny.\n\n💡 **Pro tip:** Start with Basic for a month, then upgrade if you want more. No pressure!", suggestions: ["Student discount", "Guest passes", "Class schedule"] },
        { text: "Some insider tips about getting the most from your membership 🎯\n\n• Ask the front desk about any ongoing promotions — they often have unadvertised deals\n• Refer a friend and both of you might get a discount (ask about referral programs)\n• Many gyms offer a free trial day — great way to test before committing\n• Download the gym app (if available) for class bookings and workout tracking\n\nAnything else I can help with?", suggestions: ["Gym hours", "Equipment", "Workout plans"] }
      ];

      const idx = Math.min(depth - 1, memberLayers.length - 1);
      if (idx >= 0 && idx < memberLayers.length) return memberLayers[idx];
      return { text: "I've covered everything about membership! Want to explore workouts, nutrition, or classes instead?", suggestions: ["Workout plans", "Nutrition", "Class schedule"] };
    }

    // ── Schedule follow-ups ──
    if (resolved.lastTopic === "schedule") {
      if (depth === 1) {
        return handlePeakHours();
      }
      return handleClasses(resolved.entities);
    }

    // ── FAQ follow-ups ──
    if (resolved.lastTopic === "faq") {
      return handleGeneralFAQ(userText);
    }

    return {
      text: "I've shared the key info on that topic! Want to switch gears? I can help with workouts, nutrition, membership, schedules, or exercise form 💪",
      suggestions: ["Workout plans", "Nutrition", "Membership"]
    };
  }

  function handleFallback() {
    return {
      text: randomItem(KnowledgeBase.fallback),
      suggestions: ["Workout plans", "Nutrition advice", "Membership info", "Class schedule", "Exercise form"]
    };
  }

  // ─── FOOD CALORIE HANDLERS ───
  function handleFoodCalorie(userText) {
    if (typeof FoodAnalyzer !== 'undefined') {
      return FoodAnalyzer.lookupByName(userText);
    }
    return {
      text: "🍽️ I can look up calories for you! Just tell me the food name, like *\"calories in chicken breast\"* or use the 📷 camera button to scan your food.",
      suggestions: ["Calories in rice", "Calories in chicken", "Scan food", "Calories in pizza"]
    };
  }

  function handleFoodScan() {
    return {
      text: "📸 **Food Scanner Ready!**\n\nClick the 📷 camera button below to snap a photo of your food and I'll analyze the calories and macros for you!\n\n💡 **Tips for best results:**\n• Make sure the food is well-lit\n• Get close to the food\n• One food item at a time works best\n\nYou can also type the food name directly, like *\"calories in banana\"*",
      suggestions: ["Calories in pizza", "Calories in rice", "Calories in chicken breast"],
      triggerCamera: true
    };
  }

  // ─── MAIN RESPONSE ROUTER ───
  function generateResponse(nlpResult, userText) {
    const { intent, confidence, entities } = nlpResult;

    // Low confidence → fallback
    if (intent === "unknown" || confidence < config.confidenceThreshold) {
      return handleFallback();
    }

    switch (intent) {
      case "greeting": return handleGreeting();
      case "goodbye": return handleGoodbye();
      case "thanks": return handleThanks();

      case "workout_plan":
      case "experience_level":
        return handleWorkoutPlan(entities);

      case "muscle_group":
        return handleMuscleGroup(entities);

      case "nutrition":
        return handleNutrition(entities);

      case "supplements":
        return handleSupplements();

      case "hydration":
        return handleHydration();

      case "tdee":
        return handleTDEE();

      case "membership":
        return handleMembership();

      case "cancellation":
        return handleCancellation();

      case "freeze":
        return handleFreeze();

      case "guest_pass":
        return handleGuestPass();

      case "discount":
        return handleDiscount();

      case "schedule":
        return handleSchedule();

      case "peak_hours":
        return handlePeakHours();

      case "classes":
        return handleClasses(entities);

      case "exercise_form":
        return handleExerciseForm(entities);

      case "first_day":
        return handleFirstDay();

      case "personal_trainer":
        return handlePersonalTrainer();

      case "equipment":
        return handleEquipment();

      case "etiquette":
        return handleEtiquette();

      case "general_faq":
        return handleGeneralFAQ(userText);

      case "food_calorie":
        return handleFoodCalorie(userText);

      case "food_scan":
        return handleFoodScan();

      case "followup":
        return handleFollowUp(nlpResult, userText);

      case "empty":
        return {
          text: "It looks like you didn't type anything. How can I help you?",
          suggestions: ["Workout plans", "Nutrition", "Membership"]
        };

      default:
        return handleFallback();
    }
  }

  // ─── PUBLIC API ───
  return {
    /**
     * Initialize the chatbot with optional configuration
     * @param {object} options - Configuration options
     */
    init: function (options) {
      if (options) {
        config = { ...config, ...options };
      }
      if (config.enableContext) {
        ContextManager.reset();
      }
      initialized = true;
    },

    /**
     * Send a message to the chatbot and get a response
     * @param {string} message - User's message text
     * @returns {Promise<{text: string, suggestions: string[], intent: string, confidence: number, entities: object}>}
     */
    send: function (message) {
      return new Promise(function (resolve, reject) {
        try {
          if (!initialized) {
            GymChatBot.init();
          }

          // Process through NLP
          const nlpResult = NLPEngine.process(message);

          // Generate response
          const response = generateResponse(nlpResult, message);

          // Update context
          if (config.enableContext) {
            ContextManager.update(message, nlpResult, response.text);
          }

          // Build result
          const result = {
            text: response.text,
            suggestions: config.enableSuggestions ? (response.suggestions || []) : [],
            intent: nlpResult.intent,
            confidence: nlpResult.confidence,
            entities: nlpResult.entities,
            timestamp: Date.now()
          };

          // Simulate typing delay
          if (config.typingDelay > 0) {
            if (config.onTypingStart) config.onTypingStart();
            setTimeout(function () {
              if (config.onTypingEnd) config.onTypingEnd();
              if (config.onMessage) config.onMessage(result);
              resolve(result);
            }, config.typingDelay);
          } else {
            if (config.onMessage) config.onMessage(result);
            resolve(result);
          }

        } catch (error) {
          if (config.onError) config.onError(error);
          reject(error);
        }
      });
    },

    /**
     * Send a message synchronously (no typing delay)
     * @param {string} message - User's message text
     * @returns {{text: string, suggestions: string[], intent: string, confidence: number, entities: object}}
     */
    sendSync: function (message) {
      if (!initialized) {
        GymChatBot.init();
      }

      const nlpResult = NLPEngine.process(message);
      const response = generateResponse(nlpResult, message);

      if (config.enableContext) {
        ContextManager.update(message, nlpResult, response.text);
      }

      return {
        text: response.text,
        suggestions: config.enableSuggestions ? (response.suggestions || []) : [],
        intent: nlpResult.intent,
        confidence: nlpResult.confidence,
        entities: nlpResult.entities,
        timestamp: Date.now()
      };
    },

    /**
     * Get the welcome/greeting message
     * @returns {{text: string, suggestions: string[]}}
     */
    getWelcomeMessage: function () {
      return handleGreeting();
    },

    /**
     * Reset the conversation context
     */
    resetConversation: function () {
      ContextManager.reset();
    },

    /**
     * Get the current conversation context
     * @returns {object}
     */
    getContext: function () {
      return ContextManager.getContext();
    },

    /**
     * Export conversation history
     * @returns {array}
     */
    getHistory: function () {
      return ContextManager.exportHistory();
    },

    /**
     * Update configuration
     * @param {object} options
     */
    configure: function (options) {
      config = { ...config, ...options };
    },

    /**
     * Debug: process text through NLP only (no response generation)
     * @param {string} text
     * @returns {object} NLP result
     */
    debug: function (text) {
      return NLPEngine.process(text);
    },

    /**
     * Get the chatbot version
     */
    version: "1.0.0"
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GymChatBot;
}
