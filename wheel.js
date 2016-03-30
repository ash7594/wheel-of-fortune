var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");

var windowWidth = window.innerWidth * 0.98,
	windowHeight = window.innerHeight * 0.96,
	windowCX = windowWidth/2,
	windowCY = windowHeight/2,
	windowA = 0,
	wheelRad = 200;

var pivotInverseRad = 10;

var pointerRad = 50,
	pointerSectors = 8,
	pointerInitialAngle = 90;

canvas.width = windowWidth;
canvas.height = windowHeight;

function polygonPar(sectors) {
    this.x = windowCX;
    this.y = windowCY;
    this.r = wheelRad; //5 * entity.r;
    this.c = "rgba(0,0,0,1)"; //lineColour
    this.w = 3;  //linewidth
	this.sectors = sectors;
}

function pointerClass() {
	this.x = windowCX;
	this.y = windowCY - wheelRad - pointerRad + pivotInverseRad;
	this.r = pointerRad;
	this.sectors = pointerSectors;
	this.innerAng = (360 / pointerSectors) / 2;
	this.a = pointerInitialAngle;
	this.angMoved = 0;
	this.c = "rgb(255,150,0)";
}

var wheel = new polygonPar(6),
	pointer = new pointerClass();

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

	for (var j=0; j<wheel.sectors; j++) {
		ctx.beginPath();
		ctx.arc(
				windowCX + (wheel.r - pivotInverseRad) * Math.cos((windowA + j * 360 / wheel.sectors) * Math.PI / 180),
				windowCY + (wheel.r - pivotInverseRad) * Math.sin((windowA + j * 360 / wheel.sectors) * Math.PI / 180),
				(wheel.r - pivotInverseRad) / 35,
				0, 2 * Math.PI);
		ctx.fillStyle = "rgb(255,0,0)";
		ctx.fill();
		ctx.closePath();	
	}
}

function collision() {
	pointer.a--;
	pointer.angMoved++;
	if (pointer.r - (pointer.r * Math.cos(pointer.angMoved * Math.PI / 180)) >= (wheel.r - pivotInverseRad)/35) {
		
	}
}

function pointerRender() {
	ctx.beginPath();
	ctx.moveTo(pointer.x, pointer.y);
	ctx.lineTo(pointer.x + pointer.r * Math.cos(pointer.a * Math.PI / 180), pointer.y + pointer.r * Math.sin(pointer.a * Math.PI / 180));
	ctx.strokeStyle = pointer.c;
	ctx.stroke();
	ctx.closePath();
}

function render() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    polygonRender();
	pointerRender();
    windowA = (windowA+1)%360;
	if ((windowA + (360 / wheel.sectors) / 2) % (360 / wheel.sectors) == 0)
		collision();		
}

function variableBar() {
	var gui = new dat.GUI();
	gui.add(wheel, 'r', 100, 300).name('Radius');
	gui.add(wheel, 'sectors').min(2).max(50).step(2).name('Sectors');
	gui.add(wheel, 'w', 1, 5).name('LineWidth');
}

variableBar();
setInterval(render,10);
