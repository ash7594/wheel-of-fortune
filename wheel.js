var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");

var windowWidth = window.innerWidth * 0.98,
	windowHeight = window.innerHeight * 0.96,
	windowCX = windowWidth/2,
	windowCY = windowHeight/2,
	windowA = 0;

canvas.width = windowWidth;
canvas.height = windowHeight;

function polygonPar() {
    this.x = windowCX;
    this.y = windowCY;
    this.r = 200; //5 * entity.r;
    this.c = "rgba(0,0,0,1)"; //lineColour
    this.w = 3;  //linewidth
	this.sectors = 6;
}

var wheel = new polygonPar();

function polygonRender() {
	for (var j=0; j<wheel.sectors; j++) {
		ctx.beginPath();
		ctx.moveTo(windowCX, windowCY);
		ctx.lineTo(
				windowCX + wheel.r * Math.cos((windowA + j * 360 / wheel.sectors) * Math.PI / 180),
				windowCY + wheel.r * Math.sin((windowA + j * 360 / wheel.sectors) * Math.PI / 180));
		ctx.arc(windowCX, windowCY, wheel.r, (windowA + j * 360 / wheel.sectors) * Math.PI / 180, (windowA + (j+1) * 360 / wheel.sectors) * Math.PI / 180);
		ctx.lineTo(windowCX, windowCY);
		ctx.strokeStyle = wheel.c;
		ctx.lineWidth = wheel.w;
		ctx.stroke();
		ctx.fillStyle = (j%2)?"rgb(0,0,0)":"rgb(255,255,255)";
		ctx.fill();
		ctx.closePath();
	}
}

function render() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    polygonRender();
    windowA++;
}

function variableBar() {
	var gui = new dat.GUI();
	gui.add(wheel, 'r', 100, 300).name('Radius');
	gui.add(wheel, 'sectors').min(2).max(50).step(2).name('Sectors');
	gui.add(wheel, 'w', 1, 5).name('LineWidth');
}

variableBar();
setInterval(render,10);
