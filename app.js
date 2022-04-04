const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Variables
const header = $('header h2');
const audio = $('#audio');
const cd = $('.cd');
const btnPlayer = $('.btn-toggle-play');
const playing = $('.player');
const progress = $('#progress');
const cdThumb = $('.cd-thumb');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const btnRep = $('.btn-repeat');
const btnRand = $('.btn-random');
const playlist = $('.playlist');



// App
const app = {
    songs: 
    [
            {
                name: 'Monody',
                singer: 'TheFatRat',
                path: './music/Monody.mp3'
            },
            {
                name: 'Nothing Stopping Me',
                singer: 'Vicetone',
                path: './music/NothingStoppingMe.mp3'
            },
            {
                name: 'Play',
                singer: 'Alan Walker',
                path: './music/PlayK391.mp3'
            },
            {
                name: 'Sign',
                singer: 'DEAMN',
                path: './music/Sign.mp3'
            },
            {
                name: 'Drive My Car',
                singer: 'DEAMN',
                path: './music/DriveMyCar.mp3'
            },
            {
                name: 'Xenogenesis',
                singer: 'TheFatRat',
                path: './music/Xenogenesis.mp3'
            },
            {
                name: 'G.D.F.R',
                singer: 'Flo Rida',
                path: './music/GDFR.mp3'
            },
            {
                name: 'Tropic Love',
                singer: 'No Copy Right Sound',
                path: './music/TropicLove.mp3'
            }
    ],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    render: function () {
        const data = this.songs.map(function (song, index) {
            return `
                <div class="song ${index === app.currentIndex ? 'active' : ''}">
                    <div class="thumb" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Soccer_ball.svg/2048px-Soccer_ball.svg.png')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playlist.innerHTML = data.join(''); 
    },



    handleEvent: function () {
        const cdWidth = cd.offsetWidth;

        // zoom CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCd = cdWidth - scrollTop;
            cd.style.width = newCd > 0 ? newCd + 'px' : 0; 
            cd.style.opacity = newCd / cdWidth;
        }

        // Play
        btnPlayer.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        audio.onplay = function () {
            app.isPlaying = true;
            playing.classList.add('playing');
            cdThumbAnimate.play();
        }

        audio.onpause = function () {
            app.isPlaying = false;
            playing.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        audio.ontimeupdate = function () {
            if (audio.duration !== NaN) {
                const progressPercent = Math.floor(audio.currentTime * 100 / audio.duration);
                progress.value = progressPercent;
            }
        }

        progress.onchange = function (event) {
            const seekTime = event.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], 
        {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        btnNext.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
        }

        btnPrev.onclick = function () {
            app.previousSong();
            audio.play();
            app.render(); 
        }

        btnRand.onclick = function () {
            app.isRandom = !app.isRandom;
            btnRand.classList.toggle('active', app.isRandom);
        }

        audio.onended = function () {
            if (app.isRepeat) {
                audio.load();
                audio.play();
            } else {
                btnNext.click();
            }

        }

        btnRep.onclick = function () {
            app.isRepeat = !app.isRepeat;
            btnRep.classList.toggle('active', app.isRepeat);
        }
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },

    loadCurrentSong: function () {
        header.textContent = this.currentSong.name;
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= app.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    previousSong: function () {
        this.currentIndex--;
        if (this.currentIndex <= 0) {
            this.currentIndex = app.songs.length - 1;
        }  
        this.loadCurrentSong();
    },

    randomSong: function () {
        var randIndex;
        do {
            randIndex = Math.floor(Math.random() * app.songs.length);
        } while (randIndex === this.currentIndex);
        this.currentIndex = randIndex;
        this.loadCurrentSong();
    },

    start: function () {
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();
    }
    
};

app.start();