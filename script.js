// DOM Elements
const healthForm = document.getElementById('health-form');
const mealSuggestions = document.getElementById('meal-suggestions');
const healthInfoForm = document.getElementById('health-info-form');
const mealCardsContainer = document.getElementById('meal-cards-container');

// Functions
function openHealthForm() {
    healthForm.classList.remove('hidden');
    document.querySelector('.hero').classList.add('hidden');
}

async function getMealSuggestions(healthIssues, dietaryPreference) {
    try {
        const response = await fetch('http://localhost:5000/api/meal-suggestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                healthIssues,
                dietaryPreference
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch meal suggestions');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

function displayMealSuggestions(meals) {
    mealCardsContainer.innerHTML = '';
    
    if (meals.length === 0) {
        mealCardsContainer.innerHTML = '<p class="no-meals">No meal suggestions found. Please try different health issues or dietary preferences.</p>';
        mealSuggestions.classList.remove('hidden');
        healthForm.classList.add('hidden');
        return;
    }
    
    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';
        
        mealCard.innerHTML = `
            <img src="${meal.image}" alt="${meal.name}">
            <div class="meal-card-content">
                <h3>${meal.name}</h3>
                <p>${meal.description}</p>
                <p><strong>Ingredients:</strong> ${meal.ingredients.join(', ')}</p>
                <p><strong>Calories:</strong> ${meal.calories}</p>
            </div>
        `;
        
        mealCardsContainer.appendChild(mealCard);
    });
    
    mealSuggestions.classList.remove('hidden');
    healthForm.classList.add('hidden');
}

// Event Listeners
healthInfoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const healthIssues = document.getElementById('health-issues').value;
    const dietaryPreference = document.getElementById('dietary-preference').value;
    
    const suggestedMeals = await getMealSuggestions(healthIssues, dietaryPreference);
    displayMealSuggestions(suggestedMeals);
}); 