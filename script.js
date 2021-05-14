const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "T_PLAYER";
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {

            name:'Anh Khong Tha Thu',
            singer: 'Đình Dũng',
            path: './assets/music/song1.mp3',
            image:'./assets/img/7.jpg'
        },
        {

            name:'Cau Hen Cau The',
            singer: 'Đình Dũng',
            path: './assets/music/song2.mp3',
            image:'./assets/img/4.jpg'
        },
        {

            name:'Tinh Ban Dieu Ky',
            singer: 'AMEE',
            path: './assets/music/song3.mp3',
            image:'./assets/img/1.jpg'
        },
        {

            name:'Tren Tinh Ban Duoi Tinh Yeu',
            singer: 'MIN',
            path: './assets/music/song4.mp3',
            image:'./assets/img/6.jpg'
        },
        {

            name:'Sai Gon Dau Long Qua',
            singer: 'Hoàng Duyên',
            path: './assets/music/song5.mp3',
            image:'./assets/img/3.jpg'
        },
        {

            name:'Phai Chang Em Da Yeu',
            singer: 'Juky San',
            path: './assets/music/song6.mp3',
            image:'./assets/img/5.jpg'
        },
        {

            name:'Ngay Chua Giong Bao',
            singer: 'Bùi Lan Hương',
            path: './assets/music/song7.mp3',
            image:'./assets/img/9.jpg'
        },
        {

            name:'Chi La Khong Cung Nhau',
            singer: 'Tăng Phúc',
            path: './assets/music/song8.mp3',
            image:'./assets/img/8.jpg'
        },
        {

            name:'Laylalay',
            singer: 'Jack',
            path: './assets/music/song9.mp3',
            image:'./assets/img/2.jpg'
        }

    ],
    setConfig: function(key,value){
        this.config[key]=value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));


    },

    render: function(){
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
            <div class="thumb" 
            style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
              
            `
        })
        playlist.innerHTML = htmls.join('');

    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })

    },
    handleEvents: function(){
        const _this = this;
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth
        // xử lý CD quay/ dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform:'rotate(360deg)'}
        ],{
            duration: 200000,
            interations: Infinity
        })
        cdThumbAnimate.pause();
        // xử lý phóng to/thu nhỏ CD

        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth/cdWidth;
        }
        // xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else
            {
                audio.play();
            }
            
           
        }
        // khi song được play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play();
        }
        // khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor((audio.currentTime / audio.duration)*100);
                progress.value = progressPercent;
            }


        }
        // xử lý khi tua song
        progress.onchange = function(e){
            const seekTime = (audio.duration / 100)* e.target.value;
            audio.currentTime = seekTime;
        }
        // khi next bài hát
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{

                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // xử lý lặp lại song
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat',_this.isRepeat);
            repeatBtn.classList.toggle('active',_this.isRepeat);

        }

        // xử lý next song khi audio ended
        audio.onended = function(e){
            if(_this.isRepeat){
                 audio.play();
            }else{

                nextBtn.click();
                
            }

        }

        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();

                }

                //  xử lý khi click vào option
                if(e.target.closest('.option')){


                }

            } 
        }
        // khi prev bài hát
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{

                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // xử lý bật/ tắt random
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom);
            
        }

    },
    scrollToActiveSong: function(){
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
                behavier: 'smooth',
                block: 'nearest',
            })

        },300)

    },
    loadCurrentSong: function(){
        

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

    },
    loadConfig: function(){
        this.isRandom == this.config.isRandom;
        this.isRepeat == this.config.isRepeat;

    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
           this.currentIndex ===0;
        }
        this.loadCurrentSong();

    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
           this.currentIndex === this.songs.length - 1;
        }
        this.loadCurrentSong();

    },
    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random()* this.songs.length);
        }while(newIndex===this.currentIndex)

        this.currentIndex === newIndex;

        this.loadCurrentSong();

    },

    start: function(){
        this.loadConfig();
        // định nghĩa các thuộc tính cho object
        this.defineProperties();

        // lắng nghe/ xử lý các sự kiện(DOM event)
        this.handleEvents();

        // tải thông tin bài hát vào UI
        this.loadCurrentSong();

        // render playlist
        this.render();

    }
}

app.start();