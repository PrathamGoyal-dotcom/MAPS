// Gym Chatbot Knowledge Base
// This module contains all domain knowledge the chatbot uses to answer queries.

const KnowledgeBase = {

  // ─── WORKOUT PLANS ───
  workouts: {
    beginner: {
      fullBody: {
        name: "Beginner Full Body (3 days/week)",
        days: ["Monday", "Wednesday", "Friday"],
        exercises: [
          "Goblet Squats — 3x12",
          "Dumbbell Bench Press — 3x10",
          "Lat Pulldown — 3x10",
          "Dumbbell Shoulder Press — 3x10",
          "Dumbbell Rows — 3x10 each arm",
          "Plank — 3x30 seconds",
          "Walking Lunges — 2x12 each leg"
        ],
        tips: "Rest 60-90 seconds between sets. Focus on learning proper form before increasing weight."
      },
      cardio: {
        name: "Beginner Cardio Plan",
        schedule: "3-4 days/week, 20-30 minutes",
        options: [
          "Brisk walking on treadmill (incline 2-4%)",
          "Stationary bike — moderate pace",
          "Elliptical — low resistance",
          "Swimming — easy laps"
        ],
        tips: "Keep your heart rate at 60-70% of max (220 minus your age). Build duration before intensity."
      }
    },
    intermediate: {
      upperLower: {
        name: "Upper/Lower Split (4 days/week)",
        schedule: {
          "Upper A (Mon)": ["Barbell Bench Press — 4x8", "Barbell Rows — 4x8", "Overhead Press — 3x10", "Face Pulls — 3x15", "Bicep Curls — 3x12", "Tricep Pushdowns — 3x12"],
          "Lower A (Tue)": ["Barbell Squats — 4x8", "Romanian Deadlifts — 3x10", "Leg Press — 3x12", "Leg Curls — 3x12", "Calf Raises — 4x15", "Hanging Leg Raises — 3x12"],
          "Upper B (Thu)": ["Incline Dumbbell Press — 4x10", "Pull-Ups — 4x8", "Lateral Raises — 3x15", "Cable Rows — 3x12", "Hammer Curls — 3x12", "Overhead Tricep Extension — 3x12"],
          "Lower B (Fri)": ["Front Squats — 4x8", "Sumo Deadlifts — 3x8", "Bulgarian Split Squats — 3x10 each", "Leg Extensions — 3x12", "Seated Calf Raises — 4x15", "Cable Crunches — 3x15"]
        },
        tips: "Rest 90-120 seconds for compound lifts, 60 seconds for isolation. Progressive overload each week."
      },
      ppl: {
        name: "Push/Pull/Legs (6 days/week)",
        schedule: {
          "Push (Mon/Thu)": ["Bench Press — 4x6", "Overhead Press — 4x8", "Incline DB Press — 3x10", "Lateral Raises — 4x15", "Tricep Dips — 3x10", "Cable Flyes — 3x12"],
          "Pull (Tue/Fri)": ["Deadlifts — 4x5", "Pull-Ups — 4x8", "Barbell Rows — 4x8", "Face Pulls — 3x15", "Barbell Curls — 3x10", "Rear Delt Flyes — 3x15"],
          "Legs (Wed/Sat)": ["Squats — 4x6", "Leg Press — 4x10", "Romanian Deadlifts — 3x10", "Walking Lunges — 3x12 each", "Leg Curls — 3x12", "Calf Raises — 4x15"]
        },
        tips: "This is a high-volume program. Make sure you're eating and sleeping enough to recover."
      }
    },
    advanced: {
      powerbuilding: {
        name: "Powerbuilding Program (5 days/week)",
        focus: "Combines strength on main lifts with hypertrophy accessories",
        schedule: {
          "Day 1 — Heavy Squat": ["Back Squat — 5x3 @85%", "Pause Squats — 3x5", "Leg Press — 4x10", "GHR — 3x12", "Ab Wheel — 3x10"],
          "Day 2 — Heavy Bench": ["Bench Press — 5x3 @85%", "Close Grip Bench — 3x8", "DB Flyes — 3x12", "Lateral Raises — 4x15", "Tricep Pushdowns — 4x12"],
          "Day 3 — Heavy Deadlift": ["Deadlift — 5x3 @85%", "Deficit Deadlifts — 3x5", "Barbell Rows — 4x8", "Pull-Ups — 4x10", "Face Pulls — 3x15"],
          "Day 4 — Volume Upper": ["Overhead Press — 4x8", "Incline DB Press — 4x10", "Cable Rows — 4x12", "Lateral Raises — 4x15", "Arm Superset — 3x12"],
          "Day 5 — Volume Lower": ["Front Squats — 4x8", "Bulgarian Splits — 3x10", "Leg Curls — 4x12", "Calf Raises — 5x15", "Hanging Leg Raises — 3x15"]
        },
        tips: "Track your main lift numbers weekly. Deload every 4th week by reducing volume 40%."
      }
    },
    muscleGroups: {
      chest: ["Bench Press", "Incline Press", "DB Flyes", "Cable Crossovers", "Push-Ups", "Dips"],
      back: ["Deadlifts", "Pull-Ups", "Barbell Rows", "Lat Pulldown", "Cable Rows", "T-Bar Rows"],
      shoulders: ["Overhead Press", "Lateral Raises", "Front Raises", "Face Pulls", "Arnold Press", "Reverse Flyes"],
      legs: ["Squats", "Leg Press", "Lunges", "Romanian Deadlifts", "Leg Curls", "Leg Extensions", "Calf Raises"],
      arms: ["Barbell Curls", "Hammer Curls", "Tricep Pushdowns", "Overhead Extensions", "Concentration Curls", "Skull Crushers"],
      core: ["Planks", "Hanging Leg Raises", "Cable Crunches", "Ab Wheel", "Russian Twists", "Dead Bugs"]
    }
  },

  // ─── NUTRITION ───
  nutrition: {
    goals: {
      bulking: {
        calories: "TDEE + 300-500 calories (lean bulk) or TDEE + 500-1000 (aggressive bulk)",
        macros: { protein: "1g per lb bodyweight", carbs: "2-3g per lb bodyweight", fat: "0.4-0.5g per lb bodyweight" },
        mealTiming: "Eat every 3-4 hours. Pre-workout meal 1-2 hours before training. Post-workout within 1 hour.",
        foods: ["Chicken breast", "Rice", "Pasta", "Eggs", "Oats", "Sweet potato", "Ground beef", "Whole milk", "Peanut butter", "Bananas"],
        tips: "Aim for 0.5-1 lb weight gain per week. If gaining faster, you're likely adding excess fat."
      },
      cutting: {
        calories: "TDEE - 300-500 calories (moderate deficit)",
        macros: { protein: "1.2g per lb bodyweight (higher to preserve muscle)", carbs: "1-1.5g per lb bodyweight", fat: "0.3-0.4g per lb bodyweight" },
        mealTiming: "High protein at every meal. Larger meals around training. Consider intermittent fasting if it helps adherence.",
        foods: ["Chicken breast", "Fish (tilapia, cod)", "Egg whites", "Greek yogurt", "Vegetables", "Rice cakes", "Berries", "Lean ground turkey"],
        tips: "Aim for 0.5-1 lb weight loss per week. Keep protein high to preserve muscle. Don't cut calories too aggressively."
      },
      maintenance: {
        calories: "Eat at your TDEE (Total Daily Energy Expenditure)",
        macros: { protein: "0.8-1g per lb bodyweight", carbs: "2g per lb bodyweight", fat: "0.4g per lb bodyweight" },
        tips: "Great for body recomposition. Focus on progressive overload in training while keeping weight stable."
      }
    },
    supplements: {
      essential: [
        { name: "Creatine Monohydrate", dose: "5g daily", benefit: "Increases strength, power, and muscle cell hydration. Most researched supplement." },
        { name: "Whey Protein", dose: "1-2 scoops (25-50g)", benefit: "Convenient protein source. Best post-workout or when you can't eat whole food." },
        { name: "Vitamin D", dose: "2000-5000 IU daily", benefit: "Most people are deficient. Supports bone health, immunity, and mood." }
      ],
      optional: [
        { name: "Caffeine", dose: "200-400mg pre-workout", benefit: "Improves energy, focus, and performance. Take 30-60 min before training." },
        { name: "Fish Oil (Omega-3)", dose: "2-3g EPA/DHA daily", benefit: "Reduces inflammation, supports heart and joint health." },
        { name: "Magnesium", dose: "200-400mg before bed", benefit: "Aids sleep quality and muscle recovery." }
      ],
      avoid: "Most fat burners, testosterone boosters, and BCAAs (if you eat enough protein) are not worth the money."
    },
    hydration: {
      general: "Drink at least 0.5 oz per lb of bodyweight daily. More if you train hard or live in hot climate.",
      training: "Drink 16-20 oz water 2 hours before training. Sip 7-10 oz every 15-20 minutes during training.",
      signs: "If your urine is dark yellow, you're dehydrated. Aim for pale yellow."
    },
    tdeeFormula: "Mifflin-St Jeor: Men = 10×weight(kg) + 6.25×height(cm) - 5×age - 5. Women = 10×weight(kg) + 6.25×height(cm) - 5×age - 161. Multiply by activity factor: Sedentary 1.2, Light 1.375, Moderate 1.55, Active 1.725, Very Active 1.9"
  },

  // ─── MEMBERSHIP ───
  membership: {
    plans: [
      { name: "Basic", price: "$29/month", features: ["Gym floor access", "Locker room", "Free WiFi", "Standard hours (6AM-10PM)"], contract: "Month-to-month" },
      { name: "Premium", price: "$49/month", features: ["Everything in Basic", "All group classes", "Sauna & steam room", "Extended hours (5AM-11PM)", "1 guest pass/month"], contract: "Month-to-month" },
      { name: "VIP", price: "$79/month", features: ["Everything in Premium", "Personal trainer consultation (1/month)", "Towel service", "24/7 access", "Unlimited guest passes", "Nutrition planning session"], contract: "3-month minimum" }
    ],
    policies: {
      cancellation: "Basic and Premium can be cancelled anytime with 30 days notice. VIP requires completion of 3-month minimum term.",
      freeze: "You can freeze your membership for up to 3 months per year. $10/month freeze fee applies.",
      guestPass: "Day passes available for $15. Premium members get 1 free guest pass/month. VIP get unlimited.",
      studentDiscount: "20% off any plan with valid student ID.",
      seniorDiscount: "15% off any plan for members 65+.",
      familyPlan: "Add family members at 50% off each additional membership."
    },
    signup: "You can sign up online, at the front desk, or through our app. Bring a valid ID and payment method."
  },

  // ─── SCHEDULE & CLASSES ───
  schedule: {
    gymHours: {
      "Monday-Friday": "5:00 AM - 11:00 PM",
      "Saturday": "6:00 AM - 10:00 PM",
      "Sunday": "7:00 AM - 9:00 PM",
      "Holidays": "8:00 AM - 6:00 PM (check website for closures)"
    },
    peakHours: {
      peak: "5:00 PM - 8:00 PM weekdays",
      moderate: "7:00 AM - 9:00 AM weekdays, 9:00 AM - 12:00 PM weekends",
      quiet: "10:00 AM - 3:00 PM weekdays, after 5:00 PM weekends",
      tip: "If you prefer a less crowded gym, try coming during off-peak hours."
    },
    classes: [
      { name: "HIIT Blast", duration: "45 min", days: ["Monday", "Wednesday", "Friday"], time: "6:30 AM & 5:30 PM", level: "All levels", description: "High-intensity interval training. Burns maximum calories in minimum time." },
      { name: "Yoga Flow", duration: "60 min", days: ["Tuesday", "Thursday", "Saturday"], time: "7:00 AM & 6:00 PM", level: "All levels", description: "Vinyasa-style yoga focusing on flexibility, balance, and mindfulness." },
      { name: "Spin Cycle", duration: "45 min", days: ["Monday", "Wednesday", "Friday"], time: "7:00 AM & 6:00 PM", level: "All levels", description: "Indoor cycling class with interval training and climbs." },
      { name: "CrossFit WOD", duration: "60 min", days: ["Monday", "Tuesday", "Thursday", "Friday"], time: "6:00 AM, 12:00 PM, 5:00 PM", level: "Intermediate+", description: "Functional fitness combining weightlifting, gymnastics, and cardio." },
      { name: "Boxing Basics", duration: "45 min", days: ["Tuesday", "Thursday"], time: "5:30 PM", level: "All levels", description: "Learn boxing fundamentals while getting a killer cardio workout." },
      { name: "Pilates Core", duration: "50 min", days: ["Wednesday", "Saturday"], time: "8:00 AM", level: "All levels", description: "Mat-based pilates focusing on core strength and posture." },
      { name: "Zumba", duration: "55 min", days: ["Monday", "Wednesday"], time: "7:00 PM", level: "All levels", description: "Dance fitness party with Latin and international music." },
      { name: "Strength 101", duration: "60 min", days: ["Tuesday", "Thursday", "Saturday"], time: "10:00 AM", level: "Beginner", description: "Learn proper lifting form and build foundational strength." }
    ]
  },

  // ─── EXERCISE FORM GUIDES ───
  exerciseForm: {
    squat: {
      name: "Barbell Back Squat",
      muscles: "Quads, Glutes, Hamstrings, Core",
      video: "https://www.youtube.com/embed/bEv6CCg2BC8",
      thumbnail: "https://img.youtube.com/vi/bEv6CCg2BC8/hqdefault.jpg",
      steps: ["Position bar on upper traps, grip wider than shoulders", "Feet shoulder-width apart, toes slightly out (15-30°)", "Brace core, take a deep breath", "Push hips back and bend knees simultaneously", "Descend until hip crease is below knee (parallel or deeper)", "Drive through mid-foot to stand back up", "Exhale at the top"],
      commonMistakes: ["Knees caving inward — push knees out over toes", "Leaning too far forward — keep chest up", "Not hitting depth — work on ankle and hip mobility", "Rising onto toes — drive through mid-foot/heels", "Rounding lower back — brace core harder, reduce weight"],
      cues: "Sit back like sitting in a chair. Spread the floor with your feet. Chest up, core tight.",
      proTips: ["Try box squats to learn proper depth", "Use a resistance band above knees to fix knee cave", "Film yourself from the side to check your form", "Warm up with goblet squats before loading the barbell"],
      warmUp: ["5 min light cardio (bike or walk)", "Bodyweight squats — 2x10", "Goblet squats with light dumbbell — 2x8", "Empty barbell squats — 2x5, then gradually add weight"],
      funFact: "The world record squat is over 1,300 lbs (590 kg) by Ray Williams. The squat is often called the 'King of All Exercises' because it works more muscles simultaneously than almost any other movement."
    },
    deadlift: {
      name: "Conventional Deadlift",
      muscles: "Hamstrings, Glutes, Lower Back, Traps, Forearms",
      video: "https://www.youtube.com/embed/op9kVnSso6Q",
      thumbnail: "https://img.youtube.com/vi/op9kVnSso6Q/hqdefault.jpg",
      steps: ["Stand with feet hip-width, bar over mid-foot", "Hinge at hips, grip bar just outside knees", "Shoulders slightly in front of the bar", "Take slack out of the bar, engage lats", "Drive through the floor, keeping bar close to body", "Lock out by squeezing glutes at the top", "Reverse the movement to lower the bar"],
      commonMistakes: ["Rounding the lower back — keep neutral spine", "Bar drifting away from body — drag it up your shins/thighs", "Jerking the bar — take the slack out first", "Hyperextending at the top — just stand tall", "Starting with hips too low — this isn't a squat"],
      cues: "Push the floor away. Bar stays glued to your body. Squeeze oranges in your armpits.",
      proTips: ["Use chalk or mixed grip for heavy sets", "Practice Romanian deadlifts to build the hip hinge pattern", "Wear long socks to protect shins from bar scraping", "Try sumo deadlift if conventional doesn't feel natural for your body type"],
      warmUp: ["Hip circles — 10 each direction", "Cat-cow stretches — 10 reps", "Romanian deadlifts with light dumbbell — 2x8", "Deadlifts with empty bar — 2x5, then add weight gradually"],
      funFact: "Eddie Hall was the first person to deadlift 500 kg (1,102 lbs). The deadlift uses about 70% of your total muscle mass, making it the ultimate full-body strength exercise."
    },
    benchPress: {
      name: "Barbell Bench Press",
      muscles: "Chest, Front Delts, Triceps",
      video: "https://www.youtube.com/embed/rT7DgCr-3pg",
      thumbnail: "https://img.youtube.com/vi/rT7DgCr-3pg/hqdefault.jpg",
      steps: ["Lie on bench, eyes under the bar", "Grip bar slightly wider than shoulder width", "Arch upper back, squeeze shoulder blades together", "Unrack bar, lower to mid-chest with control", "Touch chest lightly (don't bounce)", "Press up and slightly back toward face", "Lock out arms at the top"],
      commonMistakes: ["Flaring elbows 90° — keep them at 45-75°", "Bouncing bar off chest — pause briefly at the bottom", "Lifting hips off bench — keep butt planted", "Not retracting shoulder blades — squeeze them together", "Inconsistent bar path — lower to same spot each rep"],
      cues: "Bend the bar. Leg drive through your feet. Chest up to meet the bar.",
      proTips: ["Always use a spotter for heavy sets", "Try pause reps (2-sec pause on chest) to build strength off the chest", "Use dumbbells to fix strength imbalances between sides", "Grip width affects which muscles work hardest — wider = more chest, narrower = more triceps"],
      warmUp: ["Arm circles — 10 each direction", "Band pull-aparts — 2x15", "Push-ups — 2x10", "Empty barbell bench — 2x10, then add weight gradually"],
      funFact: "The bench press is the most popular exercise in gyms worldwide. Monday is often called 'International Chest Day' because so many people bench on Mondays!"
    },
    overheadPress: {
      name: "Overhead Press (OHP)",
      muscles: "Shoulders, Triceps, Upper Chest, Core",
      video: "https://www.youtube.com/embed/2yjwXTZQDDI",
      thumbnail: "https://img.youtube.com/vi/2yjwXTZQDDI/hqdefault.jpg",
      steps: ["Grip bar at shoulder width, bar resting on front delts", "Take a breath and brace core", "Press bar straight up, moving head back to clear the bar", "Once bar passes forehead, push head through", "Lock out overhead with bar over mid-foot", "Lower with control back to shoulders"],
      commonMistakes: ["Excessive back lean — brace core, squeeze glutes", "Pressing around the face — move head, not bar path", "Not locking out — full extension overhead", "Using leg drive (unless doing push press)"],
      cues: "Bar travels in a straight line. Head through the window at the top.",
      proTips: ["The OHP is the hardest lift to progress — don't get discouraged by slow gains", "Try seated overhead press to isolate shoulders without core compensation", "Use microplates (1.25 lb) to progress in smaller increments", "Z-press (seated on floor) is an amazing variation for core and shoulder stability"],
      warmUp: ["Band dislocates — 2x10", "Light dumbbell lateral raises — 2x12", "Empty bar press — 2x8"],
      funFact: "Before the bench press became popular in the 1950s, the overhead press was THE measure of upper body strength. Old-time strongmen like Eugen Sandow were judged primarily on their pressing ability."
    },
    pullUp: {
      name: "Pull-Up",
      muscles: "Lats, Biceps, Rear Delts, Core",
      video: "https://www.youtube.com/embed/eGo4IYlbE5g",
      thumbnail: "https://img.youtube.com/vi/eGo4IYlbE5g/hqdefault.jpg",
      steps: ["Grip bar slightly wider than shoulders, palms facing away", "Hang with arms fully extended, shoulders engaged (not shrugging)", "Pull by driving elbows down and back", "Chin over the bar at the top", "Lower with control to full extension", "Avoid swinging or kipping"],
      commonMistakes: ["Not using full range — go all the way down", "Using momentum/kipping — strict and controlled", "Shrugging shoulders — depress and retract scapula", "Only doing half reps — chin must clear the bar"],
      cues: "Drive elbows to your back pockets. Chest to the bar.",
      proTips: ["Can't do a pull-up yet? Start with band-assisted pull-ups or negatives (jump up, lower slowly)", "Chin-ups (palms facing you) are easier and work biceps more", "Add a weight belt once you can do 3x10 bodyweight", "Dead hangs for 30-60 seconds build grip strength and decompress the spine"],
      warmUp: ["Dead hangs — 2x20 seconds", "Band-assisted pull-ups — 2x5", "Scapular pull-ups (just retract shoulder blades while hanging) — 2x8"],
      funFact: "The world record for most pull-ups in 24 hours is 7,715! Pull-ups are used as a fitness test in most military branches worldwide."
    },
    row: {
      name: "Barbell Bent-Over Row",
      muscles: "Upper Back, Lats, Rear Delts, Biceps",
      video: "https://www.youtube.com/embed/FWJR5Ve8bnQ",
      thumbnail: "https://img.youtube.com/vi/FWJR5Ve8bnQ/hqdefault.jpg",
      steps: ["Hinge at hips ~45°, slight knee bend", "Grip bar shoulder width or slightly wider", "Pull bar to lower chest/upper belly", "Squeeze shoulder blades at the top", "Lower with control"],
      commonMistakes: ["Standing too upright — maintain hip hinge", "Using body momentum — stay strict", "Pulling to belly button — aim higher on torso", "Rounding upper back — keep chest proud"],
      cues: "Chest proud, pull elbows past your torso. Squeeze the back at the top.",
      proTips: ["Try Pendlay rows (from the floor each rep) for explosive power", "Use straps for heavy rows so grip doesn't limit your back training", "Single-arm dumbbell rows let you focus on mind-muscle connection", "Supinated grip (palms up) rows target the lower lats more"],
      warmUp: ["Band pull-aparts — 2x15", "Face pulls with light band — 2x12", "Light dumbbell rows — 2x10 each arm"],
      funFact: "Arnold Schwarzenegger credited barbell rows as one of his key back exercises. A strong back is essential for posture — especially important if you sit at a desk all day!"
    }
  },

  // ─── GENERAL FAQ ───
  faq: {
    firstDay: {
      q: "What should I bring on my first day?",
      a: "Bring comfortable workout clothes, athletic shoes (closed-toe), a water bottle, a towel, and a lock for the locker. You'll get a tour of the facility and can ask any questions at the front desk."
    },
    personalTrainer: {
      q: "Do you have personal trainers?",
      a: "Yes! We have certified personal trainers available. VIP members get 1 free consultation/month. Training packages start at $50/session or $180/month for 4 sessions. Ask the front desk to match you with a trainer based on your goals."
    },
    dresscode: {
      q: "What's the dress code?",
      a: "Wear athletic clothing and closed-toe shoes (no sandals or jeans). Clean clothes required. Some areas require specific footwear — e.g., lifting shoes for the platform area."
    },
    equipment: {
      q: "What equipment do you have?",
      a: "Full free weight section (dumbbells 5-120 lbs, barbells, power racks, benches), cable machines, smith machines, full cardio floor (treadmills, bikes, ellipticals, rowers), functional training area, stretching zone, and group fitness studio."
    },
    etiquette: {
      q: "What's the gym etiquette?",
      a: "Wipe down equipment after use, re-rack your weights, don't hog equipment during peak hours (work in if someone asks), use headphones for music, don't give unsolicited advice, and keep phone calls outside the gym floor."
    },
    injuries: {
      q: "What if I get injured?",
      a: "Stop exercising immediately. Notify a staff member. First aid kits are available at the front desk. For serious injuries, staff will call emergency services. Consider consulting a physiotherapist before returning to training."
    },
    parking: {
      q: "Is there parking?",
      a: "Yes, free parking is available in our lot. During peak hours, overflow parking is available on the street. Bike racks are also available."
    },
    wifi: {
      q: "Is there WiFi?",
      a: "Yes, free WiFi is available. Network name and password are posted at the front desk."
    },
    lockers: {
      q: "How do lockers work?",
      a: "Day-use lockers are free — bring your own lock. Monthly locker rental is available for $10/month. Do not leave belongings overnight in day-use lockers."
    },
    age: {
      q: "What's the minimum age?",
      a: "Members must be 16+ to use the gym independently. Ages 14-15 can use the gym with a parent/guardian present. Under 14 are not permitted on the gym floor."
    }
  },

  // ─── GREETING / FALLBACK ───
  greetings: [
    "Hey there! 💪 I'm your gym assistant. I can help you with workout plans, nutrition advice, membership info, class schedules, exercise form tips, and more. What can I help you with?",
    "Welcome! 🏋️ I'm here to help with anything gym-related — workouts, nutrition, membership, schedules, exercise form, you name it. What's on your mind?",
    "Hi! 👋 I'm your fitness buddy. Ask me about workouts, nutrition, membership plans, class schedules, or proper exercise form. How can I help?"
  ],
  fallback: [
    "I'm not sure I understand. Could you try rephrasing? I can help with: workouts, nutrition, membership, class schedules, exercise form, or general gym questions.",
    "Hmm, I didn't quite get that. Try asking me about workout plans, nutrition tips, membership info, gym schedules, or exercise form.",
    "I'm not sure about that one. Here are some things I can help with:\n• Workout plans & splits\n• Nutrition & supplements\n• Membership & pricing\n• Class schedules\n• Exercise form guides\n• General gym FAQ"
  ],
  goodbye: [
    "See you at the gym! 💪 Stay consistent!",
    "Have a great workout! 🏋️ Remember, consistency beats intensity.",
    "Take care! Remember — the best workout is the one you actually do. 💪"
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KnowledgeBase;
}
