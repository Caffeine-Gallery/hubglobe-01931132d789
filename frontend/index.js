import { backend } from "declarations/backend";

async function initialize() {
    try {
        const continents = await backend.getAllContinents();
        const loading = document.getElementById('loading');
        const container = document.getElementById('continents-container');
        
        loading.style.display = 'none';
        
        for (const continent of continents) {
            const section = createContinentSection(continent);
            container.appendChild(section);
            loadContinentData(continent);
        }
    } catch (error) {
        console.error('Failed to initialize:', error);
    }
}

function createContinentSection(continent) {
    const section = document.createElement('section');
    section.className = 'continent-section mb-5';
    section.innerHTML = `
        <h2 class="continent-title">${continent}</h2>
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h3>Hubs</h3>
                        <div id="hubs-${continent}" class="hubs-container">
                            <div class="spinner-border spinner-border-sm" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h3>News</h3>
                        <div id="news-${continent}" class="news-container">
                            <div class="spinner-border spinner-border-sm" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    return section;
}

async function loadContinentData(continent) {
    try {
        const hubs = await backend.getHubsByContinent(continent);
        const news = await fetchNewsForContinent(continent);

        // Group hubs by country
        const hubsByCountry = groupByCountry(hubs);
        
        // Update hubs
        const hubsContainer = document.getElementById(`hubs-${continent}`);
        hubsContainer.innerHTML = Object.entries(hubsByCountry).map(([country, countryHubs]) => `
            <div class="country-section">
                <h4 class="country-title">${country}</h4>
                ${countryHubs.map(hub => `
                    <div class="hub-item">
                        <h5>${hub.name}</h5>
                        <p>${hub.description}</p>
                        <div class="hub-details">
                            <p><strong>Location:</strong> ${hub.location}</p>
                            <p><strong>Contact:</strong> ${hub.contact}</p>
                            <a href="${hub.website}" target="_blank" class="btn btn-primary btn-sm">Visit Website</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('') || '<p>No hubs available in this region.</p>';

        // Update news
        const newsContainer = document.getElementById(`news-${continent}`);
        newsContainer.innerHTML = news.length ? news.map(article => `
            <div class="news-item">
                <h4>${article.title}</h4>
                <p>${article.description}</p>
                <small>${new Date(article.publishedAt).toLocaleDateString()}</small>
                ${article.url ? `<a href="${article.url}" target="_blank" class="btn btn-link">Read more</a>` : ''}
            </div>
        `).join('') : '<p>No news available for this region.</p>';

    } catch (error) {
        console.error(`Failed to load data for ${continent}:`, error);
    }
}

function groupByCountry(hubs) {
    return hubs.reduce((acc, hub) => {
        if (!acc[hub.country]) {
            acc[hub.country] = [];
        }
        acc[hub.country].push(hub);
        return acc;
    }, {});
}

async function fetchNewsForContinent(continent) {
    try {
        // Using a public news API that doesn't require authentication
        const response = await fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=5&title_contains=${continent}`);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Failed to fetch news:', error);
        return [];
    }
}

// Initialize the application
initialize();
