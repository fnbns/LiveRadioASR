// JavaScript Document
function fluctuate(bar) {
    var hgt = Math.random() * 60;
    hgt += 1;
    var t = hgt * 9;
    
    bar.animate({
        height: hgt
    }, t, function() {
        fluctuate($(this));
    });
}

$(".bar").each(function(i) {
    fluctuate($(this));
});