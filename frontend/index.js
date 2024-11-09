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
                        <h3>ICP News</h3>
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
        const [hubs, news] = await Promise.all([
            fetchHubsData(continent),
            fetchICPNews(continent)
        ]);

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
                <small>${new Date(article.date).toLocaleDateString()}</small>
                ${article.url ? `<a href="${article.url}" target="_blank" class="btn btn-link">Read more</a>` : ''}
            </div>
        `).join('') : '<p>No ICP news available for this region.</p>';

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

async function fetchHubsData(continent) {
    try {
        // Proxy endpoint to fetch data from icphubs.org
        const response = await fetch(`https://api.icphubs.org/hubs?continent=${encodeURIComponent(continent)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch hubs data');
        }
        const data = await response.json();
        return data.hubs || [];
    } catch (error) {
        console.error('Failed to fetch hubs:', error);
        // Fallback to backend data if API fails
        return backend.getHubsByContinent(continent);
    }
}

async function fetchICPNews(continent) {
    try {
        const sources = [
            fetchDfinityBlogPosts(),
            fetchICPBlogPosts(),
            fetchMediumPosts()
        ];

        const allNews = await Promise.all(sources);
        const combinedNews = allNews.flat().sort((a, b) => b.date - a.date);
        
        // Filter news by continent if possible, otherwise return all
        return combinedNews.slice(0, 5); // Limit to 5 most recent articles
    } catch (error) {
        console.error('Failed to fetch ICP news:', error);
        return [];
    }
}

async function fetchDfinityBlogPosts() {
    try {
        const response = await fetch('https://blog.dfinity.org/feed');
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const items = xml.querySelectorAll('item');
        
        return Array.from(items).map(item => ({
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent,
            date: new Date(item.querySelector('pubDate').textContent).getTime(),
            url: item.querySelector('link').textContent
        }));
    } catch (error) {
        console.error('Failed to fetch DFINITY blog posts:', error);
        return [];
    }
}

async function fetchICPBlogPosts() {
    try {
        const response = await fetch('https://internetcomputer.org/blog/feed.xml');
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const items = xml.querySelectorAll('item');
        
        return Array.from(items).map(item => ({
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent,
            date: new Date(item.querySelector('pubDate').textContent).getTime(),
            url: item.querySelector('link').textContent
        }));
    } catch (error) {
        console.error('Failed to fetch ICP blog posts:', error);
        return [];
    }
}

async function fetchMediumPosts() {
    try {
        const response = await fetch('https://medium.com/feed/@dfinity');
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const items = xml.querySelectorAll('item');
        
        return Array.from(items).map(item => ({
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent,
            date: new Date(item.querySelector('pubDate').textContent).getTime(),
            url: item.querySelector('link').textContent
        }));
    } catch (error) {
        console.error('Failed to fetch Medium posts:', error);
        return [];
    }
}

// Initialize the application
initialize();
