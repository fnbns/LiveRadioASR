(function() { 
    //global variables will be available only inside this closure 
    var isStartMove = false, knob, lBar, rBar, pos, center, pin; 
     
    //calculates control's position related to top left corner of the page 
    function findPos(obj) { 
        var curleft = curtop = 0; 
        if (obj.offsetParent) { 
            do { 
                curleft += obj.offsetLeft; 
                curtop += obj.offsetTop; 
            } while (obj = obj.offsetParent); 
        } 
        return {X: curleft, Y: curtop}; 
    }
 
    //user touch the knob 
    function onKnobTouchStart(e){ 
        if (!e) var e = window.event; 
        isStartMove = true; 
    }
 
    //user is moving his finger (mouse), so do update UI accordingly 
    function onKnobTouchMove(e){ 
        if (!e) var e = window.event; 
        if(isStartMove){ 
            var a = Math.atan2((e.pageY - center.Y), (e.pageX - center.X)) * 180 / Math.PI; //calculate angle 
            var b = (a >= 90 ? a - 90 : 270 + a); //shift angle, so 0 will be on the same place as usual 270 
            displayProgress(b);   
			//change volume from soundmanager     
        } 
    } 
	function displayProgress(a){    
        if(a >= 0 && a <= 180){ 
           /* progressBar.style.clip ="rect(0px, 140px, 280px, 0px)";//show left part of the progress bar 
            progressBar.style.webkitTransform ="rotate(30deg)"; 
            lBar.style.webkitTransform = "rotate(" + -1 * (180 - a)     + "deg)";        
            rBar.style.display = "none";        
        */
			volumeDinamic.style.webkitTransform("rotate(30deg)");
		} 
        else if(a > 180 && a < 300){ 
          /*  progressBar.style.clip ="rect(0px, 280px, 280px, 0px)";//show right part of the progress bar 
            rBar.style.display = "block"; //show right part of the progress bar 
            lBar.style.webkitTransform = "rotate(0deg)"; //left part of the progress bar is static until user make volume lower than a half 
            rBar.style.webkitTransform = "rotate(" + a + "deg)"; 
        */
			volumeDinamic.style.webkitTransform = "rotate("+a+"deg)";
		} 
}
     
    //user removed finger from screen (mouseup event on desktop) 
    function onKnobTouchEnd(e){ 
        if (!e) var e = window.event; 
        isStartMove = false; 
    }
window.onload = function(){ 
        //find elements on a page 
        knob = document.getElementById('test'); 
       /* progressBar = document.getElementById('progress-bar'); 
        lBar = document.getElementById('l-bar'); 
        rBar = document.getElementById('r-bar'); 
        */
		knob.addEventListener('touchstart', onKnobTouchStart, false); 
        knob.addEventListener('touchmove', onKnobTouchMove, false); 
        knob.addEventListener('touchend', onKnobTouchEnd, false); 
        pos = findPos(knob);//find position of the element on the page 
        center = {X: pos.X + knob.offsetWidth / 2, Y: pos.Y + knob.offsetHeight / 2}; //calculate center of the knob (and control itself) 
        displayProgress(0);    //display progress at 0 degree from start 
    }; 
})();