import Int "mo:base/Int";

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
    // Types
    type Hub = {
        id: Text;
        name: Text;
        continent: Text;
        description: Text;
        location: Text;
        website: Text;
        contact: Text;
    };

    type NewsArticle = {
        id: Text;
        title: Text;
        content: Text;
        continent: Text;
        date: Int;
    };

    // Stable storage
    private stable var hubEntries : [(Text, Hub)] = [];
    private stable var newsEntries : [(Text, NewsArticle)] = [];

    // In-memory storage
    private var hubs = HashMap.HashMap<Text, Hub>(10, Text.equal, Text.hash);
    private var news = HashMap.HashMap<Text, NewsArticle>(10, Text.equal, Text.hash);

    // Initialize data
    private func initializeData() {
        // Sample hubs data
        let sampleHubs : [Hub] = [
            {
                id = "hub1";
                name = "London ICP Hub";
                continent = "Europe";
                description = "The main ICP hub in London";
                location = "London, UK";
                website = "https://london.icp.hub";
                contact = "london@icphub.org";
            },
            {
                id = "hub2";
                name = "Singapore ICP Hub";
                continent = "Asia";
                description = "Singapore's premier ICP community center";
                location = "Singapore";
                website = "https://singapore.icp.hub";
                contact = "singapore@icphub.org";
            }
        ];

        // Sample news data
        let sampleNews : [NewsArticle] = [
            {
                id = "news1";
                title = "European ICP Summit Announced";
                content = "Major ICP summit to be held in Paris this summer";
                continent = "Europe";
                date = Time.now();
            },
            {
                id = "news2";
                title = "Asian Blockchain Week Features ICP";
                content = "ICP takes center stage at Asian Blockchain Week";
                continent = "Asia";
                date = Time.now();
            }
        ];

        // Initialize hubs
        for (hub in sampleHubs.vals()) {
            hubs.put(hub.id, hub);
        };

        // Initialize news
        for (article in sampleNews.vals()) {
            news.put(article.id, article);
        };
    };

    system func preupgrade() {
        hubEntries := Iter.toArray(hubs.entries());
        newsEntries := Iter.toArray(news.entries());
    };

    system func postupgrade() {
        for ((id, hub) in hubEntries.vals()) {
            hubs.put(id, hub);
        };
        for ((id, article) in newsEntries.vals()) {
            news.put(id, article);
        };
        if (hubEntries.size() == 0) {
            initializeData();
        };
    };

    // Query functions
    public query func getHubsByContinent(continent: Text) : async [Hub] {
        let hubBuffer = Buffer.Buffer<Hub>(0);
        for ((_, hub) in hubs.entries()) {
            if (hub.continent == continent) {
                hubBuffer.add(hub);
            };
        };
        Buffer.toArray(hubBuffer)
    };

    public query func getNewsByContinent(continent: Text) : async [NewsArticle] {
        let newsBuffer = Buffer.Buffer<NewsArticle>(0);
        for ((_, article) in news.entries()) {
            if (article.continent == continent) {
                newsBuffer.add(article);
            };
        };
        Buffer.toArray(newsBuffer)
    };

    public query func getAllContinents() : async [Text] {
        let continents = ["North America", "South America", "Europe", "Asia", "Africa", "Oceania"];
        continents
    };
}
