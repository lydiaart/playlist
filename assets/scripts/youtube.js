// Called to authenticate the user to access the API 
// that allows us to modify their youtube playlist
async function authenticate() {
    try {
        await gapi.auth2.getAuthInstance()
            .signIn({ scope: "https://www.googleapis.com/auth/youtube" });
        console.log("Sign-in successful"); 
        loadClient();
    } catch (err) {
        console.log("Error signing in", err);
    }
}

// Loads the google client with the youtube API
async function loadClient() {
    gapi.client.setApiKey("AIzaSyCjC_Evg4pGy3IELojH3Tm24NcuGrsOKCI");
    try {
        await gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        console.log("GAPI client loaded for API");
        btnAuth.disabled=true;
        btnCreate.disabled=false;
    } catch (err) {
        console.error("Error loading GAPI client for API", err);
    }
}

// Creates a new playlist in the user's account
async function createPlaylist() {
    try {
        let response = await gapi.client.youtube.playlists.insert({
            "part": [
                "snippet,status"
            ],
            "resource": {
                "snippet": {
                    "title": "Playlister " + new Date().getTime(),
                    "description": "New playlist",
                    "tags": [
                        "sample playlist",
                        "API call"
                    ],
                    "defaultLanguage": "en"
                },
                "status": {
                    "privacyStatus": "private"
                }
            }
        });
        console.log("Response", response);

        plTitle = response.result.snippet.title;
        plId = response.result.id;
        console.log("Playlist Title: " + plTitle);
        console.log("Playlist ID: " + plId);
        btnCreate.disabled=true;
        btnUpdate.disabled=false;
    } catch (err) {
        console.error("Execute error", err);
    }
}

// Makes updates to the playlist title and tags and 
// then calls insert video to add videos to the playlist
async function updatePlaylist() {
    try {
        plTitle = "Updated playlist " + new Date().getTime();
        let response = await gapi.client.youtube.playlists.update({
            "part": [
                "snippet,status,contentDetails"
            ],
            "resource": {
                "id": plId,
                "snippet": {
                    "title": plTitle,
                    "description": "Updated playlist",
                    "tags": [
                        "Songkick API",
                        "Playlister"
                    ]
                },
                "status": {
                    "privacyStatus": "private"
                }
            }
        });
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        for (let i = 0; i < videoIds.length; i++) {
            await insertVideo(i, videoIds[i]);
        }
        showPlayListLink();
    } catch (err) {
        console.error("Execute error", err);
    }
}

// Adds videos to the playlist at position 0
// This will push existing videos to the end of the playlist
// Updates the playlist link to YouTube
async function insertVideo(pos, videoId) {
    try {
        let response = await gapi.client.youtube.playlistItems.insert({
            "part": [
                "snippet"
            ],
            "resource": {
                "snippet": {
                    "playlistId": plId,
                    "position": pos,
                    "resourceId": {
                        "kind": "youtube#video",
                        "videoId": videoId
                    }
                }
            }
        })
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
    } catch (err) {
        console.error("Execute error", err);
    }
}

gapi.load("client:auth2", async function () {
    try {
        //var localhost = "762278068311-tf0f00kql9cm5hdhu2scjgdfg1mqm822.apps.googleusercontent.com";
        var github = "762278068311-stoa3fflppk9o9qfdr2cf57mro3s7b4m.apps.googleusercontent.com"
        let gauth = gapi.auth2.init({ client_id: github });
        await gauth;
        if (gauth.isSignedIn.get()) {
            console.log("already signed in");
            btnAuth.disabled=true;
            loadClient();
            // maybe add an option for the user to sign out
        }
    } catch (err) {
        console.error("Error loading GAPI client for API", err);
    }
});