var s = ( sketch ) => {

    let x = 100;
    let y = 100;
    let audioCanvas, analyzer;

    sketch.setup = () => {
        sketch.createCanvas(0, 0);
        analyzer = new p5.FFT();
    };

    sketch.draw = () => {
        sketch.clear();
        sketch.stroke(150);
        sketch.noFill();

        let spectrum = analyzer.analyze();

        sketch.beginShape();
        for (let i = 0; i < spectrum.length; i+=6) {
            sketch.vertex(sketch.map(i,0,spectrum.length,0,sketch.width), sketch.map(spectrum[i], 0, 255, 0, sketch.height/2));
        }
        sketch.endShape();

        sketch.beginShape();
        for (let i = spectrum.length; i > 0 ; i-=6) {
            sketch.vertex(sketch.map(i,0,spectrum.length,sketch.width,0), sketch.map(spectrum[i], 0, 255, sketch.height, sketch.height/2));
        }
        sketch.endShape();
    };

    sketch.resize = (w,h) => {
        sketch.resizeCanvas(w,h);
        audioCanvas = sketch.select('#audioPlayer');
        analyzer.setInput(audioCanvas);
    }
};
var audio = document.getElementById('audioPlayer');
var timeTotal = 0;
var timeCurrent = 0;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
} else {
    // var canvas_player = new p5(s, 'canvas_player');
}

$('.left .item .icon').on('click', (e) => {
    var $parent = $(e.target).parent().parent();
    if(!$(e.target).hasClass('playing') && !$parent.hasClass('active')){
        $('.left .item.active').removeClass('active');
        $parent.addClass('active');
        $(e.target).addClass('playing');
        var url = $(e.target).attr('data-url');
        var img = $(e.target).attr('data-img');
        var json = $(e.target).attr('data-json');
        if(img) {
            $('.backImg').css({'background-image': 'url("' + img + '")'})
        }
        if(json) {
            $.getJSON('./json/' + json + '.json', data => {
                var subsContainer = document.getElementsByClassName("subsContainer")[0];
                var child = subsContainer.lastElementChild;
                while (child) { 
                    subsContainer.removeChild(child); 
                    child = subsContainer.lastElementChild; 
                }
                for(let i = 0; i < data.length; i++){
                    let node = document.createElement("div");
                    var square = document.createElement("span");
                    var leftPos = ((data[i].tiempo * 100)/timeTotal);
                    node.setAttribute('style', 'left: '+leftPos+'%');
                    node.appendChild(square);
                    node.setAttribute('data-notice', data[i].contenido);
                    node.addEventListener('click', (e, elem) => {
                        var notice = document.getElementsByClassName("notice")[0];
                        notice.innerHTML = node.getAttribute('data-notice');
                        
                    })
                    subsContainer.appendChild(node);  
                }
            })
        }
        $('.playerContainer').hide();
        audio.src = url;
        var promise = audio.play();
        promise.then(() => {
            console.log('play');
        }).catch(err => {
            console.log(err);
        })
    }
    else if(!$(e.target).hasClass('playing')){
        $(e.target).addClass('playing');
        audio.play();
    }
    else{
        $(e.target).removeClass('playing');
        audio.pause();
    }
})

audio.oncanplaythrough = () => {
    audio.play();
    $('.playerContainer').show();
    timeTotal = audio.duration;
    var width = document.getElementById('canvas_player').offsetWidth;
    var height = document.getElementById('canvas_player').offsetHeight;
    $('.line').off('click');
    $('.line').on('click', function(e){
        var parentOffset = $(e.target).offset(); 
        var relX = e.pageX - parentOffset.left;
        var total = $(e.target).width();
    
        var resp = (relX * timeTotal) / total;
    
        audio.currentTime = resp;
    })
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    } else {
        // canvas_player.resize(width, height);
    }
}

audio.ontimeupdate = () => {
    timeCurrent = audio.currentTime;
    timeTotal = audio.duration;
    updateTimeText(timeCurrent, timeTotal);
}


function updateTimeText(current, total) {
    var timeTxt = document.getElementsByClassName("time")[0];
    var line = document.getElementsByClassName("current")[0];

    var porcentaje = ((current * 100)/total);

    line.setAttribute('style', 'width: '+porcentaje+'%');
    timeTxt.innerHTML = this.secondsTimeSpanToHMS(current) + "/" + this.secondsTimeSpanToHMS(total);
}

function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s/3600);
    s -= h*3600;
    var m = Math.floor(s/60);
    s -= m*60;

    s = Math.floor(s);
    return (h < 10 ? '0'+h : h)+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s);
}


