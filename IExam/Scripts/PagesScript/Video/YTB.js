startIconRotation = function () {
    console.log("test test sure check");

    var link = getFavicon();
    var progress = 0.0;//set in EachSec and used in drawProgress
    var f = 1; //Scale used in render (x,y=16*f)
    var s = document.createElement("canvas");
    s.width = 16 * f;
    s.height = 16 * f;
    var i = s.getContext("2d");
    var p = null;//previous image64
    var static = true;
    var ytState;

    function setIcon(e) {
        e !== p && (p = e, setTimeout(function () {
            document.getElementsByTagName('head')[0].removeChild(link);
            link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = e;
            document.getElementsByTagName('head')[0].appendChild(link);
        }, 1))
    }

    function render() {
        clear();
        drawGrayCircle();
        drawProgress();
        drawCenter();
        setIcon(s.toDataURL());
    }

    function clear() {
        i.clearRect(0, 0, 16 * f, 16 * f);
    }

    function drawGrayCircle() {
        i.beginPath();
        i.moveTo(16 * f - 1, 8 * f);
        i.arc(8 * f, 8 * f, 7 * f, 0, 2 * Math.PI, !1);
        i.lineWidth = 2 * f;
        i.strokeStyle = "rgba(120, 120, 120, 0.2)";
        i.stroke();
    }

    function drawProgress() {
        i.beginPath();
        i.moveTo(8 * f, f);
        i.arc(8 * f, 8 * f, 7 * f, .5 * -Math.PI, Math.PI * (-.5 + 2 * progress), !1);
        i.lineWidth = 2 * f;
        i.strokeStyle = "rgba(39, 141, 186, 1)";
        i.stroke();
        i.beginPath();
        i.moveTo(8 * f, 2.5 * f);
        i.arc(8 * f, 8 * f, 5.5 * f, .5 * -Math.PI, Math.PI * (-.5 + 2 * progress), !1);
        i.lineWidth = f;
        i.strokeStyle = "rgba(39, 141, 186, 0.3)";
        i.stroke();
    }

    function drawCenter() {

        if (ytState == 0) {//Stopped
            i.beginPath();
            i.rect(4.5 * f, 4.5 * f, 7 * f, 7 * f);
            i.fillStyle = "rgba(255,51,51,1)";
            i.fill();
        }

        if (ytState == 1) {//Playing
            i.beginPath();
            i.moveTo(12.5 * f, 8 * f);
            i.lineTo(5.5 * f, 12 * f);
            i.lineTo(5.5 * f, 4 * f);
            i.fillStyle = "rgba(255,51,51,1)";
            i.fill();
        }
        if (ytState == 2) {//Pauseds
            i.beginPath();
            i.rect(4.5 * f, 4.5 * f, 2.5 * f, 7 * f);
            i.fillStyle = "rgba(255,51,51,1)";
            i.fill();

            i.beginPath();
            i.rect(9 * f, 4.5 * f, 2.5 * f, 7 * f);
            i.fillStyle = "rgba(255,51,51,1)";
            i.fill();
        }

        if (ytState == 3) {//Buffering
            i.beginPath();
            i.rect(6 * f, 3.5 * f, 4 * f, 7 * f);
            i.fillStyle = "rgba(255,51,51,1)";
            i.fill();

            i.beginPath();
            i.moveTo(8 * f, 12.5 * f);
            i.lineTo(12.5 * f, 8 * f);
            i.lineTo(3.5 * f, 8 * f);
            i.fillStyle = "rgba(255,51,51,1)";
            i.fill();
        }
    }


    function eachSec() {

        if (ytplayer) {

            ytState = ytplayer.getPlayerState();


            if (ytState == 1) {//video is playing
                var time = Math.floor(ytplayer.getCurrentTime());
                var dura = Math.floor(ytplayer.getDuration());
                progress = time / dura;
                if (static) {
                    static = false;
                }
            } else {
                if (!static) {
                    render();
                    static = true;
                }
            }
            if (!static) {
                render();
            }

        }
    }

    function getFavicon() {
        var favicon = undefined;
        var nodeList = document.getElementsByTagName("link");
        for (var i = 0; i < nodeList.length; i++) {
            if ((nodeList[i].getAttribute("rel") == "icon") || (nodeList[i].getAttribute("rel") == "shortcut icon")) {
                favicon = nodeList[i];
            }
        }
        return favicon;
    }

    var ytplayer = document.getElementById("movie_player");
    var loop = setInterval(function () { eachSec() }, 1000);

}