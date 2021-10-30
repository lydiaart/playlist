let plTitle;
let plId;
let videoIds = [];

let btnSearch = document.querySelector("#search-btn");
let btnConnectSpotify = document.querySelector("#connect-spotify");
let btnCreate = document.querySelector("#create-btn");
let txtSearch = document.querySelector("#search-query");
let searchResultsEl = document.querySelector("#search-results");
let plProgressEl = document.querySelector("#playlist-progress");

btnConnectSpotify.addEventListener("click", redirectToSpotifyAuthorizeEndpoint);
//btnAuth.addEventListener("click", authenticate);
btnCreate.addEventListener("click", spotifyCreatePlaylistFromArtists);
//btnUpdate.addEventListener("click", updatePlaylist);
btnSearch.addEventListener("click", searchEvents);
btnSearch.addEventListener("keypress", searchEventsKey);

function searchEventsKey(event) {
    if (event.keycode == 13) {
        searchEvents(event);
    }
}

function searchEvents(event) {
    console.log('searching ' + txtSearch.value);
    event.preventDefault();
    let query = txtSearch.value;
    // fill array with artists
    getArtistNameList(query);
}