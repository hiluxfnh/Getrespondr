import Parser from "rss-parser";

const parser = new Parser({
  timeout: 20000,
  headers: {
    "User-Agent": "GetRespondr-ClimateAgent/1.0 (crisis coordination platform)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

export const TRUSTED_SOURCES = [
  {
    id: "reliefweb-disasters",
    name: "ReliefWeb Disasters",
    type: "government",
    url: "https://reliefweb.int/disasters/rss.xml",
  },
  {
    id: "nasa-earth",
    name: "NASA Earth Observatory",
    type: "news",
    url: "https://earthobservatory.nasa.gov/feeds/earth-observatory.rss",
  },
  {
    id: "nyt-climate",
    name: "NY Times Climate",
    type: "news",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml",
  },
  {
    id: "phys-earth",
    name: "Phys.org Earth News",
    type: "news",
    url: "https://phys.org/rss-feed/earth-news/",
  },
];

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isClimateRelated(text) {
  const normalized = text.toLowerCase();
  return /climate|flood|wildfire|fire|heatwave|heat wave|drought|hurricane|cyclone|typhoon|storm|earthquake|landslide|tsunami|emergency|evacuat|disaster|extreme weather|sea level|melting|carbon|emission|warming|tornado|blizzard|ice|permafrost|monsoon|rainfall|mudslide|air quality|smoke|contamination|infrastructure failure|power outage|water shortage/.test(
    normalized
  );
}

export async function fetchFeedArticles(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || [])
      .slice(0, 12)
      .map((item) => {
        const title = stripHtml(item.title);
        const description = stripHtml(item.contentSnippet || item.content || item.summary);
        const combined = `${title} ${description}`;

        if (!isClimateRelated(combined)) {
          return null;
        }

        return {
          externalId: `${source.id}:${item.guid || item.link || item.title}`,
          sourceId: source.id,
          sourceName: source.name,
          sourceType: source.type,
          sourceUrl: item.link || "",
          title,
          description: description.slice(0, 1200),
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        };
      })
      .filter(Boolean);
  } catch (error) {
    const status = error.statusCode || error.response?.status;
    const detail = status ? `HTTP ${status}` : error.message;
    console.warn(`[feed] Failed to fetch ${source.name}: ${detail}`);
    return [];
  }
}

export async function scanAllSources() {
  const results = await Promise.all(TRUSTED_SOURCES.map(fetchFeedArticles));
  const articles = results.flat();

  const seen = new Set();
  return articles.filter((article) => {
    if (seen.has(article.externalId)) {
      return false;
    }
    seen.add(article.externalId);
    return true;
  });
}
