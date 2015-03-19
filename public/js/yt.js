// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '100%',
		width: '100%',
		videoId: 'Oq8XQBNHzCo',
		playerVars: { 'autoplay': 1, 'controls': 0, 'showinfo': 0 },
		events: {
			'onStateChange': onPlayerStateChange
		}
	});
}
//loop
function onPlayerStateChange(event) {
	if (player.getPlayerState() == 0) {
		player.playVideo();
	}
}