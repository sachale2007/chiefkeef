new Vue({
    el: "#app",
    data() {
        return {
            audio: null,
            circleLeft: null,
            barWidth: null,
            duration: null,
            currentTime: null,
            isTimerPlaying: false,
            tracks: [
                {
                    name: "Chief Sosa",
                    artist: "Fuck N****z",
                    cover: "https://i1.sndcdn.com/artworks-000150436835-we51p4-t500x500.jpg",
                    source: "./music/FUCK.mp3",
                    url: "https://soundcloud.com/xxballinxx/chief-keef-fuck-niggaz",
                    favorited: false
                },
                {
                    name: "Chief Sosa",
                    artist: "Love Sosa",
                    cover: "https://i1.sndcdn.com/artworks-000039963889-fwtyui-t500x500.jpg",
                    source: "./music/LOVESOSA.mp3",
                    url: "https://soundcloud.com/chiefkeef/love-sosa1",
                    favorited: true
                },
				{
                    name: "Chief Sosa",
                    artist: "OBlock For Life",
                    cover: "https://i1.sndcdn.com/artworks-000037037944-1c9h6m-t500x500.jpg",
                    source: "./music/OBLOCK.mp3",
                    url: "https://soundcloud.com/chuy-7/chief-keef-oblock-for-life",
                    favorited: true
                },
				{
                    name: "Chief Sosa",
                    artist: "Hallelujah",
                    cover: "https://i1.sndcdn.com/artworks-000135379108-og7ygk-t500x500.jpg",
                    source: "./music/HALLELUJAH.mp3",
                    url: "https://soundcloud.com/chiefkeef/hallelujah",
                    favorited: true
                },
                {
                    name: "Chief Sosa",
                    artist: "Hate Being Sober",
                    cover: "https://i1.sndcdn.com/artworks-000036523424-soxvsa-t500x500.jpg",
                    source: "./music/SOBER.mp3",
                    url: "https://soundcloud.com/chuy-7/chief-keef-hate-being-sober",
                    favorited: false
                },
                {
                    name: "Ninja, CDNThe3rd, Dakotaz, FabvL & More",
                    artist: "Fortnite Rap Battle",
                    cover: "https://i1.sndcdn.com/artworks-000400897353-uppvu3-t500x500.jpg",
                    source: "./music/FORTNITE.mp3",
                    url: "https://soundcloud.com/user-424134029/the-fortnite-rap-battle-nerd-it-out-ninja",
                    favorited: false
                }
            ],
            currentTrack: null,
            currentTrackIndex: 0,
            transitionName: null
        };
        },
    methods: {
        play() {
            if (this.audio.paused) {
                this.audio.play();
                this.isTimerPlaying = true;
            } else {
                this.audio.pause();
                this.isTimerPlaying = false;
            }
        },
        generateTime() {
            let width = (100 / this.audio.duration) * this.audio.currentTime;
            this.barWidth = width + "%";
            this.circleLeft = width + "%";
            let durmin = Math.floor(this.audio.duration / 60);
            let dursec = Math.floor(this.audio.duration - durmin * 60);
            let curmin = Math.floor(this.audio.currentTime / 60);
            let cursec = Math.floor(this.audio.currentTime - curmin * 60);
            if (durmin < 10) {
                durmin = "0" + durmin;
            }
            if (dursec < 10) {
                dursec = "0" + dursec;
            }
            if (curmin < 10) {
                curmin = "0" + curmin;
            }
            if (cursec < 10) {
                cursec = "0" + cursec;
            }
            this.duration = durmin + ":" + dursec;
            this.currentTime = curmin + ":" + cursec;
            },
        updateBar(x) {
            let progress = this.$refs.progress;
            let maxduration = this.audio.duration;
            let position = x - progress.offsetLeft;
            let percentage = (100 * position) / progress.offsetWidth;
            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }
            this.barWidth = percentage + "%";
            this.circleLeft = percentage + "%";
            this.audio.currentTime = (maxduration * percentage) / 100;
            this.audio.play();
            },
        clickProgress(e) {
            this.isTimerPlaying = true;
            this.audio.pause();
            this.updateBar(e.pageX);
            },
        prevTrack() {
            this.transitionName = "scale-in";
            this.isShowCover = false;
            if (this.currentTrackIndex > 0) {
                this.currentTrackIndex--;
            } else {
                this.currentTrackIndex = this.tracks.length - 1;
            }
            this.currentTrack = this.tracks[this.currentTrackIndex];
            this.resetPlayer();
            },
        nextTrack() {
            this.transitionName = "scale-out";
            this.isShowCover = false;
            if (this.currentTrackIndex < this.tracks.length - 1) {
                this.currentTrackIndex++;
            } else {
                this.currentTrackIndex = 0;
            }
            this.currentTrack = this.tracks[this.currentTrackIndex];
            this.resetPlayer();
            },
        resetPlayer() {
            this.barWidth = 0;
            this.circleLeft = 0;
            this.audio.currentTime = 0;
            this.audio.src = this.currentTrack.source;
            setTimeout(() => {
                if(this.isTimerPlaying) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            }, 300);
            },
        favorite() {
            this.tracks[this.currentTrackIndex].favorited = !this.tracks[
                this.currentTrackIndex
            ].favorited;
        }
    },
    created() {
        let vm = this;
        this.currentTrack = this.tracks[0];
        this.audio = new Audio();
        this.audio.src = this.currentTrack.source;
        this.audio.ontimeupdate = function() {
            vm.generateTime();
        };
        this.audio.onloadedmetadata = function() {
            vm.generateTime();
        };
        this.audio.onended = function() {
            vm.nextTrack();
            this.isTimerPlaying = true;
        };

        // this is optional (for preload covers)
        for (let index = 0; index < this.tracks.length; index++) {
            const element = this.tracks[index];
            let link = document.createElement('link');
            link.rel = "prefetch";
            link.href = element.cover;
            link.as = "image"
            document.head.appendChild(link)
        }
    }
});