// Food Calorie Database — Nutritional data for common foods
// Each entry has serving size, calories, and full macro breakdown

const FoodDatabase = {
  // ─── FRUITS ───
  apple: { name: "Apple", serving: "1 medium (182g)", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19 },
  banana: { name: "Banana", serving: "1 medium (118g)", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14 },
  orange: { name: "Orange", serving: "1 medium (131g)", calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12 },
  strawberry: { name: "Strawberries", serving: "1 cup (152g)", calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3, sugar: 7 },
  lemon: { name: "Lemon", serving: "1 medium (58g)", calories: 17, protein: 0.6, carbs: 5.4, fat: 0.2, fiber: 1.6, sugar: 1.5 },
  pineapple: { name: "Pineapple", serving: "1 cup (165g)", calories: 82, protein: 0.9, carbs: 22, fat: 0.2, fiber: 2.3, sugar: 16 },
  mango: { name: "Mango", serving: "1 cup (165g)", calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, sugar: 23 },

  // ─── VEGETABLES ───
  broccoli: { name: "Broccoli", serving: "1 cup cooked (156g)", calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, sugar: 2.2 },
  cauliflower: { name: "Cauliflower", serving: "1 cup (107g)", calories: 27, protein: 2.1, carbs: 5.3, fat: 0.3, fiber: 2.1, sugar: 2 },
  bellPepper: { name: "Bell Pepper", serving: "1 medium (119g)", calories: 31, protein: 1, carbs: 7, fat: 0.3, fiber: 2.1, sugar: 5 },
  mushroom: { name: "Mushrooms", serving: "1 cup (70g)", calories: 15, protein: 2.2, carbs: 2.3, fat: 0.2, fiber: 0.7, sugar: 1.4 },
  cucumber: { name: "Cucumber", serving: "1 cup (104g)", calories: 16, protein: 0.7, carbs: 3.1, fat: 0.2, fiber: 0.5, sugar: 1.7 },
  spinach: { name: "Spinach", serving: "1 cup cooked (180g)", calories: 41, protein: 5.3, carbs: 6.7, fat: 0.5, fiber: 4.3, sugar: 0.8 },

  // ─── PROTEINS ───
  chickenBreast: { name: "Chicken Breast (grilled)", serving: "100g", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
  chickenWing: { name: "Chicken Wing", serving: "1 wing (34g)", calories: 99, protein: 9.4, carbs: 0, fat: 6.6, fiber: 0, sugar: 0 },
  steak: { name: "Beef Steak (sirloin)", serving: "100g", calories: 206, protein: 26, carbs: 0, fat: 11, fiber: 0, sugar: 0 },
  salmon: { name: "Salmon (cooked)", serving: "100g", calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0 },
  tuna: { name: "Tuna (canned)", serving: "100g", calories: 116, protein: 26, carbs: 0, fat: 0.8, fiber: 0, sugar: 0 },
  egg: { name: "Egg (whole)", serving: "1 large (50g)", calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0, sugar: 0.2 },
  shrimp: { name: "Shrimp", serving: "100g", calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, sugar: 0 },
  tofu: { name: "Tofu", serving: "100g", calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, sugar: 0.7 },

  // ─── FAST FOOD / PREPARED ───
  pizza: { name: "Pizza (cheese slice)", serving: "1 slice (107g)", calories: 272, protein: 12, carbs: 34, fat: 10, fiber: 2.3, sugar: 3.6 },
  hamburger: { name: "Hamburger", serving: "1 burger (226g)", calories: 540, protein: 34, carbs: 40, fat: 27, fiber: 1.5, sugar: 11 },
  cheeseburger: { name: "Cheeseburger", serving: "1 burger (250g)", calories: 620, protein: 38, carbs: 42, fat: 33, fiber: 1.5, sugar: 12 },
  hotDog: { name: "Hot Dog", serving: "1 with bun (98g)", calories: 290, protein: 11, carbs: 24, fat: 17, fiber: 0.8, sugar: 4 },
  frenchFries: { name: "French Fries", serving: "medium (117g)", calories: 365, protein: 4, carbs: 48, fat: 17, fiber: 4, sugar: 0.3 },
  burrito: { name: "Burrito", serving: "1 burrito (300g)", calories: 450, protein: 22, carbs: 50, fat: 18, fiber: 6, sugar: 4 },
  taco: { name: "Taco", serving: "1 taco (170g)", calories: 210, protein: 10, carbs: 21, fat: 10, fiber: 2.5, sugar: 2 },
  sandwich: { name: "Sandwich (deli)", serving: "1 sandwich (250g)", calories: 360, protein: 22, carbs: 38, fat: 14, fiber: 3, sugar: 6 },

  // ─── GRAINS & CARBS ───
  rice: { name: "White Rice (cooked)", serving: "1 cup (186g)", calories: 206, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sugar: 0 },
  brownRice: { name: "Brown Rice (cooked)", serving: "1 cup (195g)", calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.7 },
  pasta: { name: "Pasta (cooked)", serving: "1 cup (140g)", calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5, sugar: 0.8 },
  bread: { name: "Bread (white)", serving: "1 slice (25g)", calories: 67, protein: 2, carbs: 13, fat: 0.8, fiber: 0.6, sugar: 1.3 },
  oatmeal: { name: "Oatmeal (cooked)", serving: "1 cup (234g)", calories: 154, protein: 5.4, carbs: 27, fat: 2.6, fiber: 4, sugar: 1.1 },
  potato: { name: "Potato (baked)", serving: "1 medium (173g)", calories: 161, protein: 4.3, carbs: 37, fat: 0.2, fiber: 3.8, sugar: 1.7 },
  sweetPotato: { name: "Sweet Potato", serving: "1 medium (114g)", calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.8, sugar: 7 },

  // ─── DAIRY ───
  milk: { name: "Milk (whole)", serving: "1 cup (244ml)", calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0, sugar: 12 },
  cheese: { name: "Cheddar Cheese", serving: "1 slice (28g)", calories: 113, protein: 7, carbs: 0.4, fat: 9.3, fiber: 0, sugar: 0.1 },
  yogurt: { name: "Greek Yogurt", serving: "1 cup (245g)", calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, sugar: 6 },
  iceCream: { name: "Ice Cream (vanilla)", serving: "1/2 cup (66g)", calories: 137, protein: 2.3, carbs: 16, fat: 7.3, fiber: 0.5, sugar: 14 },

  // ─── SNACKS & DRINKS ───
  popcorn: { name: "Popcorn (air-popped)", serving: "3 cups (24g)", calories: 93, protein: 3, carbs: 19, fat: 1.1, fiber: 3.5, sugar: 0.2 },
  chips: { name: "Potato Chips", serving: "1 oz (28g)", calories: 152, protein: 2, carbs: 15, fat: 10, fiber: 1, sugar: 0.1 },
  chocolate: { name: "Chocolate Bar", serving: "1 bar (44g)", calories: 235, protein: 3, carbs: 26, fat: 13, fiber: 1.5, sugar: 22 },
  donut: { name: "Donut (glazed)", serving: "1 donut (60g)", calories: 269, protein: 3, carbs: 31, fat: 15, fiber: 0.7, sugar: 15 },
  cookie: { name: "Chocolate Chip Cookie", serving: "1 cookie (40g)", calories: 190, protein: 2, carbs: 25, fat: 9, fiber: 1, sugar: 14 },
  proteinBar: { name: "Protein Bar", serving: "1 bar (60g)", calories: 200, protein: 20, carbs: 22, fat: 7, fiber: 3, sugar: 6 },
  coffee: { name: "Coffee (black)", serving: "1 cup (237ml)", calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
  soda: { name: "Soda (cola)", serving: "1 can (355ml)", calories: 140, protein: 0, carbs: 39, fat: 0, fiber: 0, sugar: 39 },
  juice: { name: "Orange Juice", serving: "1 cup (248ml)", calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sugar: 21 },
  water: { name: "Water", serving: "1 cup (237ml)", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 },

  // ─── NUTS & SEEDS ───
  almonds: { name: "Almonds", serving: "1 oz (28g)", calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2 },
  peanutButter: { name: "Peanut Butter", serving: "2 tbsp (32g)", calories: 188, protein: 7, carbs: 7, fat: 16, fiber: 1.5, sugar: 3 },
  walnuts: { name: "Walnuts", serving: "1 oz (28g)", calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9, sugar: 0.7 },

  // ─── INDIAN / ASIAN ───
  naan: { name: "Naan Bread", serving: "1 piece (90g)", calories: 262, protein: 8.7, carbs: 45, fat: 5.1, fiber: 1.8, sugar: 3 },
  dal: { name: "Dal (lentils)", serving: "1 cup (198g)", calories: 230, protein: 18, carbs: 40, fat: 0.8, fiber: 15.6, sugar: 3.6 },
  paneer: { name: "Paneer", serving: "100g", calories: 265, protein: 18, carbs: 1.2, fat: 21, fiber: 0, sugar: 0 },
  biryani: { name: "Chicken Biryani", serving: "1 cup (250g)", calories: 350, protein: 18, carbs: 45, fat: 12, fiber: 2, sugar: 3 },
  roti: { name: "Roti/Chapati", serving: "1 piece (40g)", calories: 104, protein: 3.4, carbs: 18, fat: 2.5, fiber: 2, sugar: 0.5 },
  curryChicken: { name: "Chicken Curry", serving: "1 cup (250g)", calories: 305, protein: 24, carbs: 12, fat: 18, fiber: 2.5, sugar: 4 },
  friedRice: { name: "Fried Rice", serving: "1 cup (200g)", calories: 238, protein: 6, carbs: 35, fat: 8, fiber: 1, sugar: 2 },
  sushi: { name: "Sushi Roll", serving: "6 pieces (200g)", calories: 280, protein: 12, carbs: 40, fat: 7, fiber: 2, sugar: 8 },

  // ─── HEALTHY / GYM FOODS ───
  proteinShake: { name: "Protein Shake (whey)", serving: "1 scoop + water", calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0, sugar: 1 },
  avocado: { name: "Avocado", serving: "1/2 medium (68g)", calories: 114, protein: 1.4, carbs: 6, fat: 10.5, fiber: 4.6, sugar: 0.5 },
  quinoa: { name: "Quinoa (cooked)", serving: "1 cup (185g)", calories: 222, protein: 8, carbs: 39, fat: 3.6, fiber: 5, sugar: 1.6 },
  salad: { name: "Garden Salad (w/dressing)", serving: "2 cups (200g)", calories: 150, protein: 4, carbs: 12, fat: 10, fiber: 3, sugar: 5 }
};

// MobileNet ImageNet food class mappings → FoodDatabase keys
const FoodClassMap = {
  // Fruits
  "banana": "banana", "orange": "orange", "lemon": "lemon", "strawberry": "strawberry",
  "pineapple": "pineapple", "Granny Smith": "apple", "fig": "apple",
  // Vegetables
  "broccoli": "broccoli", "cauliflower": "cauliflower", "bell pepper": "bellPepper",
  "mushroom": "mushroom", "cucumber": "cucumber", "head cabbage": "broccoli",
  "zucchini": "cucumber", "acorn squash": "potato", "spaghetti squash": "potato",
  // Proteins
  "hen": "chickenBreast", "cock": "chickenBreast", "meat loaf": "steak",
  // Prepared food
  "pizza": "pizza", "cheeseburger": "cheeseburger", "hamburger": "hamburger",
  "hotdog": "hotDog", "hot dog": "hotDog", "burrito": "burrito", "taco": "taco",
  "French loaf": "bread", "bagel": "bread",
  // Desserts & snacks
  "ice cream": "iceCream", "ice lolly": "iceCream", "chocolate sauce": "chocolate",
  "dough": "donut", "pretzel": "donut", "chocolate syrup": "chocolate",
  // Dairy
  "eggnog": "milk", "cup": "coffee", "espresso": "coffee",
  // Other
  "plate": "salad", "tray": "salad", "pot pie": "burrito",
  "guacamole": "avocado", "carbonara": "pasta", "spaghetti": "pasta",
  "soup bowl": "dal", "consomme": "dal"
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FoodDatabase, FoodClassMap };
}
