const BASE_API = "https://kitsu.io/api/edge";

async function fetchAnime(query) {
  try {
    const response = await fetch(`${BASE_API}/anime?filter[text]=${query}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}


async function displayAnime() {
  const query = document.getElementById("animeQuery").value.trim();
  const animeCardsContainer = document.getElementById("animeCards");

  // Clear existing cards
  animeCardsContainer.innerHTML = "";

  if (!query) {
    animeCardsContainer.innerHTML = "<p>Please enter an anime name to search.</p>";
    return;
  }

  const animeList = await fetchAnime(query);

  if (animeList.length === 0) {
    animeCardsContainer.innerHTML = "<p>No anime found. Try a different search term.</p>";
    return;
  }

  // Generate cards dynamically
  animeList.forEach(anime => {
    const animeTitle = anime.attributes.titles.en_jp || anime.attributes.titles.ja_jp || "Unknown Title";
    const animeImage = anime.attributes.posterImage?.medium || "https://via.placeholder.com/250x350?text=No+Image";
    const animeStartDate = anime.attributes.startDate || "Unknown Start Date";
    const animeSynopsis = anime.attributes.synopsis || "No synopsis available.";

    const card = `
      <div class="card">
        <img src="${animeImage}" alt="${animeTitle}">
        <div class="card-content">
          <h3>${animeTitle}</h3>
          <p><strong>Start Date:</strong> ${animeStartDate}</p>
          <p>${animeSynopsis.slice(0, 100)}...</p>
          <a href="https://kitsu.io/anime/${anime.id}" target="_blank">View More</a>
        </div>
      </div>
    `;

    animeCardsContainer.innerHTML += card;
  });
}
