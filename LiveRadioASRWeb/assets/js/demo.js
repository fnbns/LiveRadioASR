var eventSource;
soundManager.setup({
    url:'swf/',
  onready: function() {
  },
  ontimeout: function() {
    // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
  }
});

function addtext(newtext) {
     document.getElementById("transcriptionBox").value += newtext;
}
function clearTextArea(){
    document.getElementById("transcriptionBox").value = '';
}

var radioSound;
//Second radioPlay method
var radioPlay1 = function ($url){
    if($url == 'RRA'){
        $radioURL = 'http://89.238.227.6:8000/;';
        $eventSourceURL = "http://dev.speed.pub.ro:11100/base/radioPlayerServer?radioname=RRA"
    }else if($url == 'RRI'){
        $radioURL = 'http://stream2.srr.ro:8052/;'
        $eventSourceURL = "http://dev.speed.pub.ro:11100/base/radioPlayerServer?radioname=RRI"
    }else if($url == 'RRC'){
        $radioURL = 'http://89.238.227.6:8012/;'
        $eventSourceURL = "http://dev.speed.pub.ro:11100/base/radioPlayerServer?radioname=RRC"
    }else if($url == 'RC'){
        $radioURL = 'http://89.238.227.6:8332/;'
        $eventSourceURL = "http://dev.speed.pub.ro:11100/base/radioPlayerServer?radioname=RCT"
    }

    soundManager.stopAll();
    clearTextArea();
    //creating radio sound from input URL
    var radio = soundManager.createSound({
    url: $radioURL
    });
    radioSound = radio;
    radio.play({
    onfinish: function() {
   // once sound has loaded and played, unload and destroy it.(clear the memory)
   
   this.destruct(); // will also try to unload before destroying.
 }




});

    
    //stop eq animation 
    $(".bar").stop();
    //start eq animation
    eq();

    if(eventSource !== undefined){
        eventSource.close();
    }
        if((typeof EventSource)==="undefined")
                {
                    alert("display","SSE Not supported on your browser");
                    return;
                }
    eventSource = new EventSource($eventSourceURL);
    eventSource.onopen = function (e) {
        console.log("Waiting message..");
    };
    eventSource.onerror = function (e) {
     //   alert("Transcription for selected radio is not available");
    };
  
    eventSource.onmessage=function (e) {
        addtext(" ");
        addtext(e.data);
    };

    }


function radioStop(){
    soundManager.stopAll();
    $(".bar").stop();
     if(eventSource !== undefined){
        eventSource.close();
    }
}

function eq(){
       $(".bar").each(function (i) {
       fluctuate($(this));
        }); 
}

var soundVolume ;



var setVolume = function($soundVolume){
    radioSound.setVolume($soundVolume);
}
    
    $.fn.knobKnob = function(props){
    
        var options = $.extend({
            snap: 0,
            value: 0,
            turn: function(){}
        }, props || {});
    
        var tpl = '<div class="knob">\
                <div class="top"></div>\
                <div class="base"></div>\
            </div>';
    
        return this.each(function(){
            
            var el = $(this);
            el.append(tpl);
            
            var knob = $('.knob',el),
                knobTop = knob.find('.top'),
                startDeg = -1,
                currentDeg = 0,
                rotation = 0,
                lastDeg = 0,
                doc = $(document);
            
            if(options.value > 0 && options.value <= 359){
                rotation = currentDeg = options.value;
                knobTop.css('transform','rotate('+(currentDeg)+'deg)');
                options.turn(currentDeg/359);
            }
            
            knob.on('mousedown touchstart', function(e){
            
                e.preventDefault();
            
                var offset = knob.offset();
                var center = {
                    y : offset.top + knob.height()/2,
                    x: offset.left + knob.width()/2
                };
                
                var a, b, deg, tmp,
                    rad2deg = 180/Math.PI;
                
                knob.on('mousemove.rem touchmove.rem',function(e){
                    
                    e = (e.originalEvent.touches) ? e.originalEvent.touches[0] : e;
                    
                    a = center.y - e.pageY;
                    b = center.x - e.pageX;
                    deg = Math.atan2(a,b)*rad2deg;
                    
                    // we have to make sure that negative
                    // angles are turned into positive:
                    if(deg<0){
                        deg = 180 + deg;
                    }
                    //sets the volume
                    soundVolume = deg;
                    setVolume(soundVolume);
                    // Save the starting position of the drag
                    if(startDeg == -1){
                        startDeg = deg;
                    }
                    
                    // Calculating the current rotation
                    tmp = Math.floor((deg-startDeg) + rotation);
                    
                    // Making sure the current rotation
                    // stays between 0 and 359
                    if(tmp < 0){
                        tmp = 180 + tmp;
                    }
                    else if(tmp > 179){
                        tmp = tmp % 180;
                    }
                    
                    // Snapping in the off position:
                    if(options.snap && tmp < options.snap){
                        tmp = 0;
                    }
                    
                    // This would suggest we are at an end position;
                    // we need to block further rotation.
                    if(Math.abs(tmp - lastDeg) > 180){
                        return false;
                    }
                    
                    currentDeg = tmp;
                    lastDeg = tmp;
        
                    knobTop.css('transform','rotate('+(currentDeg)+'deg)');
                    options.turn(currentDeg/179);
                });
            
                doc.on('mouseup.rem  touchend.rem',function(){
                    knob.off('.rem');
                    doc.off('.rem');
                    
                    // Saving the current rotation
                    rotation = currentDeg;
                    
                    // Marking the starting degree as invalid
                    startDeg = -1;
                });
            
            });
        });
    };
