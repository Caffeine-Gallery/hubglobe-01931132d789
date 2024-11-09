import Int "mo:base/Int";

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
    type Hub = {
        id: Text;
        name: Text;
        continent: Text;
        country: Text;
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
        country: Text;
        date: Int;
    };

    private stable var hubEntries : [(Text, Hub)] = [];
    private stable var newsEntries : [(Text, NewsArticle)] = [];

    private var hubs = HashMap.HashMap<Text, Hub>(10, Text.equal, Text.hash);
    private var news = HashMap.HashMap<Text, NewsArticle>(10, Text.equal, Text.hash);

    private func initializeData() {
        let sampleHubs : [Hub] = [
            {
                id = "hub1";
                name = "London ICP Hub";
                continent = "Europe";
                country = "United Kingdom";
                description = "The main ICP hub in London";
                location = "London, UK";
                website = "https://london.icp.hub";
                contact = "london@icphub.org";
            },
            {
                id = "hub2";
                name = "Singapore ICP Hub";
                continent = "Asia";
                country = "Singapore";
                description = "Singapore's premier ICP community center";
                location = "Singapore";
                website = "https://singapore.icp.hub";
                contact = "singapore@icphub.org";
            },
            {
                id = "hub3";
                name = "Berlin ICP Hub";
                continent = "Europe";
                country = "Germany";
                description = "Berlin's blockchain innovation center";
                location = "Berlin, Germany";
                website = "https://berlin.icp.hub";
                contact = "berlin@icphub.org";
            }
        ];

        let sampleNews : [NewsArticle] = [
            {
                id = "news1";
                title = "European ICP Summit Announced";
                content = "Major ICP summit to be held in Paris this summer";
                continent = "Europe";
                country = "France";
                date = Time.now();
            },
            {
                id = "news2";
                title = "Asian Blockchain Week Features ICP";
                content = "ICP takes center stage at Asian Blockchain Week";
                continent = "Asia";
                country = "Singapore";
                date = Time.now();
            }
        ];

        for (hub in sampleHubs.vals()) {
            hubs.put(hub.id, hub);
        };

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

    public query func getHubsByContinent(continent: Text) : async [Hub] {
        let hubBuffer = Buffer.Buffer<Hub>(0);
        for ((_, hub) in hubs.entries()) {
            if (hub.continent == continent) {
                hubBuffer.add(hub);
            };
        };
        Buffer.toArray(hubBuffer)
    };

    public query func getAllContinents() : async [Text] {
        let continents = ["North America", "South America", "Europe", "Asia", "Africa", "Oceania"];
        continents
    };
}
