// Travel Recommendation JavaScript

// Global variable to store travel data
let travelData = {};

// Load travel data from JSON file
async function loadTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        travelData = await response.json();
        console.log('Travel data loaded successfully:', travelData);
    } catch (error) {
        console.error('Error loading travel data:', error);
        // Fallback data if JSON file is not available
        travelData = {
            countries: [
                {
                    id: 1,
                    name: "Australia",
                    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "A vast country known for its diverse landscapes, from the Outback to beautiful coastlines, vibrant cities, and unique wildlife.",
                    timeZone: "Australia/Sydney"
                },
                {
                    id: 2,
                    name: "Japan",
                    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "Land of the rising sun, featuring ancient traditions, modern technology, beautiful cherry blossoms, and exquisite cuisine.",
                    timeZone: "Asia/Tokyo"
                }
            ],
            temples: [
                {
                    id: 1,
                    name: "Angkor Wat, Cambodia",
                    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d77ecd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "The largest religious monument in the world, this ancient temple complex showcases the grandeur of the Khmer Empire.",
                    timeZone: "Asia/Phnom_Penh"
                },
                {
                    id: 2,
                    name: "Kyoto Temples, Japan",
                    imageUrl: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "Ancient Buddhist and Shinto temples set in serene gardens, representing centuries of Japanese spiritual tradition.",
                    timeZone: "Asia/Tokyo"
                }
            ],
            beaches: [
                {
                    id: 1,
                    name: "Bora Bora, French Polynesia",
                    imageUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "A tropical paradise with crystal-clear turquoise waters, overwater bungalows, and pristine white sand beaches.",
                    timeZone: "Pacific/Tahiti"
                },
                {
                    id: 2,
                    name: "Santorini, Greece",
                    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "Famous for its stunning sunsets, white-washed buildings, and dramatic cliffs overlooking the Aegean Sea.",
                    timeZone: "Europe/Athens"
                }
            ]
        };
    }
}

// Page navigation function
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Show/hide search container based on page
    const searchContainer = document.getElementById('searchContainer');
    if (searchContainer) {
        if (pageId === 'home') {
            searchContainer.style.display = 'flex';
        } else {
            searchContainer.style.display = 'none';
        }
    }
}

// Search recommendations function
function searchRecommendations() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }

    console.log('Searching for:', searchTerm);
    let results = [];
    
    // Keyword matching with variations
    if (matchesKeyword(searchTerm, ['beach', 'beaches'])) {
        results = travelData.beaches || [];
        console.log('Found beaches:', results);
    } else if (matchesKeyword(searchTerm, ['temple', 'temples'])) {
        results = travelData.temples || [];
        console.log('Found temples:', results);
    } else if (matchesKeyword(searchTerm, ['country', 'countries', 'nation', 'nations'])) {
        results = travelData.countries || [];
        console.log('Found countries:', results);
    } else {
        // Search across all categories
        results = searchAllCategories(searchTerm);
        console.log('General search results:', results);
    }

    displayResults(results);
}

// Helper function to match keywords with variations
function matchesKeyword(searchTerm, keywords) {
    return keywords.some(keyword => searchTerm.includes(keyword));
}

// Search across all categories
function searchAllCategories(searchTerm) {
    const allItems = [
        ...(travelData.beaches || []),
        ...(travelData.temples || []),
        ...(travelData.countries || [])
    ];
    
    return allItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );
}

// Display search results
function displayResults(results) {
    const container = document.getElementById('resultsContainer');
    if (!container) {
        console.error('Results container not found');
        return;
    }
    
    if (results.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; width: 100%; grid-column: 1 / -1;">
                <p style="font-size: 1.2rem; color: #666; margin: 2rem 0;">
                    No recommendations found. Try searching for "beach", "temple", or "country".
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = results.map(item => `
        <div class="result-card">
            <img src="${item.imageUrl}" alt="${item.name}" class="result-image" onerror="this.src='https://via.placeholder.com/400x250?text=Image+Not+Available'">
            <div class="result-content">
                <h3 class="result-title">${item.name}</h3>
                <p class="result-description">${item.description}</p>
                ${item.timeZone ? `<div class="time-display" id="time-${item.id}">Loading local time...</div>` : ''}
            </div>
        </div>
    `).join('');

    // Display local times for destinations
    results.forEach(item => {
        if (item.timeZone) {
            displayLocalTime(item.id, item.timeZone);
        }
    });
}

// Display local time for destinations
function displayLocalTime(itemId, timeZone) {
    try {
        const options = { 
            timeZone: timeZone, 
            hour12: true, 
            hour: 'numeric', 
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        };
        const localTime = new Date().toLocaleTimeString('en-US', options);
        const timeElement = document.getElementById(`time-${itemId}`);
        if (timeElement) {
            timeElement.textContent = `Local Time: ${localTime}`;
        }
    } catch (error) {
        console.error('Error displaying time for timezone:', timeZone, error);
        const timeElement = document.getElementById(`time-${itemId}`);
        if (timeElement) {
            timeElement.textContent = 'Time unavailable';
        }
    }
}

// Clear search results
function clearResults() {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
    
    console.log('Search results cleared');
}

// Form submission handler
function submitForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const message = document.getElementById('message')?.value || '';
    
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon.`);
    
    // Reset form
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    
    if (nameField) nameField.value = '';
    if (emailField) emailField.value = '';
    if (messageField) messageField.value = '';
}

// Event listeners for search functionality
function initializeEventListeners() {
    // Search button click
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchRecommendations);
    }
    
    // Clear button click
    const clearBtn = document.querySelector('.btn-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearResults);
    }
    
    // Enter key in search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchRecommendations();
            }
        });
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('nav a[onclick]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const onclick = this.getAttribute('onclick');
            if (onclick) {
                eval(onclick);
            }
        });
    });
}

// Initialize the application
function initializeApp() {
    console.log('Initializing Travel Recommendation App...');
    
    // Load travel data
    loadTravelData();
    
    // Set up event listeners
    initializeEventListeners();
    
    // Show home page by default
    showPage('home');
    
    console.log('App initialized successfully');
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for global access (if needed)
window.showPage = showPage;
window.searchRecommendations = searchRecommendations;
window.clearResults = clearResults;
window.submitForm = submitForm;