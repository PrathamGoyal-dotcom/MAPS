// Context Manager — Tracks conversation state for multi-turn interactions
// Remembers the last topic, entities, and enables follow-up questions.

const ContextManager = (function () {

  let context = {
    lastIntent: null,
    lastEntities: {},
    lastTopic: null,       // High-level topic: "workout", "nutrition", "membership", etc.
    conversationHistory: [], // Last N turns for reference
    userName: null,
    userGoal: null,         // bulking, cutting, general fitness, etc.
    userLevel: null,        // beginner, intermediate, advanced
    sessionStart: Date.now(),
    turnCount: 0,
    topicFollowUpCount: {},  // { "workout": 2, "nutrition": 1 } — how many follow-ups per topic
    lastExercise: null,      // Last specific exercise discussed
    shownContent: {}         // { "squat": ["steps", "mistakes"] } — what layers have been shown
  };

  const MAX_HISTORY = 20;

  // Map intents to high-level topics
  const INTENT_TOPIC_MAP = {
    workout_plan: "workout",
    muscle_group: "workout",
    experience_level: "workout",
    nutrition: "nutrition",
    supplements: "nutrition",
    hydration: "nutrition",
    tdee: "nutrition",
    membership: "membership",
    cancellation: "membership",
    freeze: "membership",
    guest_pass: "membership",
    discount: "membership",
    schedule: "schedule",
    peak_hours: "schedule",
    classes: "schedule",
    exercise_form: "exercise_form",
    food_calorie: "food",
    food_scan: "food",
    first_day: "faq",
    personal_trainer: "faq",
    equipment: "faq",
    etiquette: "faq",
    general_faq: "faq"
  };

  return {
    /**
     * Update context after processing a user message
     * @param {string} userMessage - The raw user message
     * @param {object} nlpResult - Result from NLPEngine.process()
     * @param {string} botResponse - The bot's response
     */
    update: function (userMessage, nlpResult, botResponse) {
      context.turnCount++;

      // Only update topic/intent for non-meta intents
      if (!["greeting", "goodbye", "followup", "thanks", "unknown", "empty"].includes(nlpResult.intent)) {
        // Reset follow-up count when topic changes
        const newTopic = INTENT_TOPIC_MAP[nlpResult.intent];
        if (newTopic && newTopic !== context.lastTopic) {
          context.topicFollowUpCount[newTopic] = 0;
        }
        context.lastIntent = nlpResult.intent;
        context.lastTopic = newTopic || context.lastTopic;

        // Merge entities (keep previous ones, override with new)
        if (nlpResult.entities && Object.keys(nlpResult.entities).length > 0) {
          context.lastEntities = { ...context.lastEntities, ...nlpResult.entities };
        }

        // Track last exercise
        if (nlpResult.entities && nlpResult.entities.exercise) {
          context.lastExercise = nlpResult.entities.exercise[0];
        }
      }

      // Increment follow-up count when follow-up intent is detected
      if (nlpResult.intent === "followup" && context.lastTopic) {
        context.topicFollowUpCount[context.lastTopic] = (context.topicFollowUpCount[context.lastTopic] || 0) + 1;
      }

      // Extract user level if mentioned
      if (nlpResult.entities && nlpResult.entities.experience) {
        context.userLevel = nlpResult.entities.experience[0];
      }

      // Extract nutrition goal if mentioned
      if (nlpResult.entities && nlpResult.entities.nutrition_goal) {
        context.userGoal = nlpResult.entities.nutrition_goal[0];
      }

      // Add to history
      context.conversationHistory.push({
        turn: context.turnCount,
        user: userMessage,
        intent: nlpResult.intent,
        entities: nlpResult.entities,
        bot: botResponse,
        timestamp: Date.now()
      });

      // Trim history
      if (context.conversationHistory.length > MAX_HISTORY) {
        context.conversationHistory = context.conversationHistory.slice(-MAX_HISTORY);
      }
    },

    /**
     * Resolve a follow-up question by returning the previous context
     * @param {object} nlpResult - The current NLP result (likely a followup intent)
     * @returns {object} - Resolved context with topic and entities to use
     */
    resolveFollowUp: function (nlpResult) {
      // If the follow-up contains new entities, merge them
      const mergedEntities = { ...context.lastEntities };
      if (nlpResult.entities) {
        for (const [key, val] of Object.entries(nlpResult.entities)) {
          mergedEntities[key] = val;
        }
      }

      return {
        lastIntent: context.lastIntent,
        lastTopic: context.lastTopic,
        entities: mergedEntities,
        userLevel: context.userLevel,
        userGoal: context.userGoal,
        followUpDepth: context.topicFollowUpCount[context.lastTopic] || 0,
        lastExercise: context.lastExercise,
        shownContent: context.shownContent
      };
    },

    /**
     * Get the current conversation context
     */
    getContext: function () {
      return { ...context };
    },

    /**
     * Get the last topic discussed
     */
    getLastTopic: function () {
      return context.lastTopic;
    },

    /**
     * Get the last intent
     */
    getLastIntent: function () {
      return context.lastIntent;
    },

    /**
     * Get user's fitness level if known
     */
    getUserLevel: function () {
      return context.userLevel;
    },

    /**
     * Get user's nutrition goal if known
     */
    getUserGoal: function () {
      return context.userGoal;
    },

    /**
     * Set user name
     */
    setUserName: function (name) {
      context.userName = name;
    },

    /**
     * Get turn count
     */
    getTurnCount: function () {
      return context.turnCount;
    },

    /**
     * Get follow-up depth for current topic
     */
    getFollowUpDepth: function () {
      return context.topicFollowUpCount[context.lastTopic] || 0;
    },

    /**
     * Get last exercise discussed
     */
    getLastExercise: function () {
      return context.lastExercise;
    },

    /**
     * Track which content layers have been shown for a key
     */
    markContentShown: function (key, layer) {
      if (!context.shownContent[key]) context.shownContent[key] = [];
      if (!context.shownContent[key].includes(layer)) {
        context.shownContent[key].push(layer);
      }
    },

    /**
     * Check what content has been shown for a key
     */
    getShownContent: function (key) {
      return context.shownContent[key] || [];
    },

    /**
     * Reset context (new conversation)
     */
    reset: function () {
      context = {
        lastIntent: null,
        lastEntities: {},
        lastTopic: null,
        conversationHistory: [],
        userName: null,
        userGoal: null,
        userLevel: null,
        sessionStart: Date.now(),
        turnCount: 0,
        topicFollowUpCount: {},
        lastExercise: null,
        shownContent: {}
      };
    },

    /**
     * Export conversation history (for analytics/debugging)
     */
    exportHistory: function () {
      return JSON.parse(JSON.stringify(context.conversationHistory));
    }
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContextManager;
}
