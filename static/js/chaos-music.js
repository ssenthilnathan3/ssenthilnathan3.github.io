(function () {
  var player = document.getElementById("regional-player");
  var artwork = document.getElementById("music-artwork");
  var artworkWrapper = document.querySelector(".artwork-wrapper");
  var title = document.getElementById("music-title");
  var artist = document.getElementById("music-artist");
  var playBtn = document.getElementById("music-play-btn");
  var shuffleBtn = document.getElementById("music-shuffle-btn");
  var playIcon = document.getElementById("play-icon");
  var pauseIcon = document.getElementById("pause-icon");
  var progressBar = document.getElementById("progress-bar");
  var progressContainer = document.querySelector(".progress-container");

  var isPlaying = false;
  var preloaded = false;
  var artists = ["Radiohead", "AC/DC", "The Beatles"];

  async function playRandomSong(autoplay) {
    if (!player || !title || !artist) return;

    title.innerText = "Loading...";
    artist.innerText = "listen to a song?";
    if (artwork) {
      artwork.src = "";
    }

    var chosenArtist = artists[Math.floor(Math.random() * artists.length)];
    var url = `https://itunes.apple.com/search?term=${encodeURIComponent(chosenArtist)}&country=US&media=music&limit=50`;

    try {
      var response = await fetch(url);
      var data = await response.json();

      if (data.results && data.results.length > 0) {
        var randomIndex = Math.floor(Math.random() * data.results.length);
        var track = data.results[randomIndex];

        player.src = track.previewUrl;
        title.innerText = track.trackName;
        artist.innerText = track.artistName;
        if (artwork) artwork.src = track.artworkUrl100;

        preloaded = true;
        if (autoplay) {
          playAudio();
        } else {
          isPlaying = false;
          updateUI();
        }
      } else {
        title.innerText = "No songs found";
        artist.innerText = chosenArtist;
      }
    } catch (error) {
      console.error("Error fetching music:", error);
      title.innerText = "Failed to load";
      artist.innerText = "Check connection";
    }
  }

  function playAudio() {
    if (!player) return;
    player
      .play()
      .then(function () {
        isPlaying = true;
        updateUI();
      })
      .catch(function (e) {
        console.log("Autoplay blocked or failed:", e);
        isPlaying = false;
        updateUI();
      });
  }

  function pauseAudio() {
    if (!player) return;
    player.pause();
    isPlaying = false;
    updateUI();
  }

  function updateUI() {
    if (isPlaying) {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
      if (artworkWrapper) artworkWrapper.style.animationPlayState = "running";
    } else {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
      if (artworkWrapper) artworkWrapper.style.animationPlayState = "paused";
    }
  }

  if (playBtn) {
    playBtn.addEventListener("click", function () {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", function () {
      playRandomSong(true);
    });
  }

  if (player) {
    player.addEventListener("timeupdate", function () {
      if (player.duration) {
        var pct = (player.currentTime / player.duration) * 100;
        if (progressBar) progressBar.style.width = pct + "%";
      }
    });

    player.addEventListener("ended", function () {
      isPlaying = false;
      updateUI();
      if (progressBar) progressBar.style.width = "0%";
      // Automatically load another song for continuous chaos!
      playRandomSong(true);
    });
  }

  if (progressContainer && player) {
    progressContainer.addEventListener("click", function (e) {
      var rect = progressContainer.getBoundingClientRect();
      var clickX = e.clientX - rect.left;
      var width = rect.width;
      var pct = clickX / width;
      if (player.duration) {
        player.currentTime = pct * player.duration;
      }
    });
  }

  window.startChaosMusic = function () {
    if (preloaded) {
      playAudio();
    } else {
      playRandomSong(true);
    }
  };

  window.stopChaosMusic = function () {
    pauseAudio();
  };
})();
