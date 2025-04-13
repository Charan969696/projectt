const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Sample meal database (same as in frontend)
const mealDatabase = {
    diabetes: [
        {
            name: "Grilled Salmon with Vegetables",
            description: "High in omega-3 fatty acids and low in carbohydrates",
            image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            ingredients: ["Salmon", "Broccoli", "Carrots", "Olive oil", "Lemon"],
            calories: 350
        },
        {
            name: "Quinoa Salad",
            description: "High in protein and fiber, low glycemic index",
            image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            ingredients: ["Quinoa", "Cucumber", "Tomato", "Olive oil", "Lemon juice"],
            calories: 280
        }
    ],
    hypertension: [
        {
            name: "Mediterranean Chicken",
            description: "Low in sodium, rich in potassium",
            image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            ingredients: ["Chicken breast", "Olive oil", "Garlic", "Lemon", "Herbs"],
            calories: 320
        },
        {
            name: "Spinach and Berry Smoothie",
            description: "Rich in potassium and antioxidants",
            image: "https://images.unsplash.com/photo-1502741224143-90386d9418b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            ingredients: ["Spinach", "Blueberries", "Banana", "Almond milk", "Chia seeds"],
            calories: 250
        }
    ],
    default: [
        {
            name: "Balanced Buddha Bowl",
            description: "A well-rounded meal with all essential nutrients",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            ingredients: ["Brown rice", "Chickpeas", "Avocado", "Mixed vegetables", "Tahini"],
            calories: 400
        }
    ]
};

// API endpoint to get meal suggestions
app.post('/api/meal-suggestions', (req, res) => {
    const { healthIssues, dietaryPreference } = req.body;
    let suggestedMeals = [];
    
    // Convert health issues to lowercase and split by comma
    const issues = healthIssues.toLowerCase().split(',').map(issue => issue.trim());
    
    // Get meals based on health issues
    issues.forEach(issue => {
        if (mealDatabase[issue]) {
            suggestedMeals = [...suggestedMeals, ...mealDatabase[issue]];
        }
    });
    
    // If no specific meals found, use default meals
    if (suggestedMeals.length === 0) {
        suggestedMeals = mealDatabase.default;
    }
    
    // Filter based on dietary preference
    if (dietaryPreference === 'vegetarian') {
        suggestedMeals = suggestedMeals.filter(meal => 
            !meal.ingredients.some(ingredient => 
                ['chicken', 'salmon', 'meat'].includes(ingredient.toLowerCase())
            )
        );
    } else if (dietaryPreference === 'vegan') {
        suggestedMeals = suggestedMeals.filter(meal => 
            !meal.ingredients.some(ingredient => 
                ['chicken', 'salmon', 'meat', 'dairy', 'eggs'].includes(ingredient.toLowerCase())
            )
        );
    }
    
    res.json(suggestedMeals);
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 