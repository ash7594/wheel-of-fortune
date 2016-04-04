const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI * 0.5;
// canvas settings
var viewWidth = window.innerWidth,
    viewHeight = window.innerHeight,
    viewCenterX = viewWidth * 0.5,
    viewCenterY = viewHeight * 0.5,
    drawingCanvas = document.getElementById("canvas"),
    ctx,
    timeStep = (1/60),
    time = 0;

var ppm = (viewWidth < viewHeight) ? viewWidth/25 : viewHeight/25,
    physicsWidth = viewWidth / ppm,
    physicsHeight = viewHeight / ppm,
    physicsCenterX = physicsWidth * 0.5,
    physicsCenterY = physicsHeight * 0.5;

var world;

var wheel,
    arrow,
    mouseBody,
    mouseConstraint;

var arrowMaterial,
    pinMaterial,
    contactMaterial;

var wheelSpinning = false,
    wheelStopped = true;

var texts = [
	"counting",
	"delta",
	"colors",
	"browns",
	"counting",
	"delta",
	"colors",
	"browns",
	"counting",
	"delta",
	"colors",
	"browns"
];

window.onload = function() {
    initDrawingCanvas();
    initPhysics();

    requestAnimationFrame(loop);
};

window.addEventListener("resize", function() {
	location.reload();
});

function initDrawingCanvas() {
    drawingCanvas.width = viewWidth;
    drawingCanvas.height = viewHeight;
    ctx = drawingCanvas.getContext('2d');

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent) ) {
		//alert("yo");
		console.log("mobile");
    	drawingCanvas.addEventListener('touchmove', touch_updateMouseBodyPosition, false);
    	drawingCanvas.addEventListener('touchstart', touch_checkStartDrag, false);
    	drawingCanvas.addEventListener('touchend', touch_checkEndDrag, false);
    	drawingCanvas.addEventListener('touchcancel', touch_checkEndDrag, false);
	} else {
		console.log("desktop");
		drawingCanvas.addEventListener('mousemove', updateMouseBodyPosition);
		drawingCanvas.addEventListener('mousedown', checkStartDrag);
		drawingCanvas.addEventListener('mouseup', checkEndDrag);
		drawingCanvas.addEventListener('mouseout', checkEndDrag);
	}
}

function touch_updateMouseBodyPosition(e) {
	e.preventDefault();
    var p = touch_getPhysicsCoord(e.changedTouches[0]);
    mouseBody.position[0] = p.x;
    mouseBody.position[1] = p.y;
}

function touch_checkStartDrag(e) {
	e.preventDefault();
	var touches = e.changedTouches;
	for (var j=0; j<touches.length; j++) {
		var touch = touches[j];
		var p = touch_getPhysicsCoord(touch);
		mouseBody.position[0] = p.x;
		mouseBody.position[1] = p.y;

		if (world.hitTest(mouseBody.position, [wheel.body])[0]) {

			mouseConstraint = new p2.RevoluteConstraint(mouseBody, wheel.body, {
				worldPivot:mouseBody.position,
							collideConnected:false
			});

			world.addConstraint(mouseConstraint);
			break;
		}
	}

    if (wheelSpinning === true) {
        wheelSpinning = false;
        wheelStopped = true;
    }
}

function touch_checkEndDrag(e) {
	e.preventDefault();
    if (mouseConstraint) {
        world.removeConstraint(mouseConstraint);
        mouseConstraint = null;

        if (wheelSpinning === false && wheelStopped === true) {
            if ( Math.abs(wheel.body.angularVelocity) > 7.5) {
                wheelSpinning = true;
                wheelStopped = false;
                console.log('good spin');
            }
            else {
                console.log('sissy');
            }
        }
    }
}

function updateMouseBodyPosition(e) {
    var p = getPhysicsCoord(e);
    mouseBody.position[0] = p.x;
    mouseBody.position[1] = p.y;
}

function checkStartDrag(e) {
	console.log(mouseBody.position);
    if (world.hitTest(mouseBody.position, [wheel.body])[0]) {

        mouseConstraint = new p2.RevoluteConstraint(mouseBody, wheel.body, {
            worldPivot:mouseBody.position,
            collideConnected:false
        });

        world.addConstraint(mouseConstraint);
    }

    if (wheelSpinning === true) {
        wheelSpinning = false;
        wheelStopped = true;
    }
}

function checkEndDrag(e) {
    if (mouseConstraint) {
        world.removeConstraint(mouseConstraint);
        mouseConstraint = null;

        if (wheelSpinning === false && wheelStopped === true) {
            if ( Math.abs(wheel.body.angularVelocity) > 7.5) {
                wheelSpinning = true;
                wheelStopped = false;
                console.log('good spin');
            }
            else {
                console.log('sissy');
            }
        }
    }
}

function getPhysicsCoord(e) {
    var rect = drawingCanvas.getBoundingClientRect(),
        x = (e.clientX - rect.left) / ppm,
        y = physicsHeight - (e.clientY - rect.top) / ppm;

    return {x:x, y:y};
}

function touch_getPhysicsCoord(e) {
    var rect = drawingCanvas.getBoundingClientRect(),
        x = (e.pageX - rect.left) / ppm,
        y = physicsHeight - (e.pageY - rect.top) / ppm;

    return {x:x, y:y};
}

function initPhysics() {
    world = new p2.World();
    world.solver.iterations = 100;
    world.solver.tolerance = 0;

    arrowMaterial = new p2.Material();
    pinMaterial = new p2.Material();
    contactMaterial = new p2.ContactMaterial(arrowMaterial, pinMaterial, {
        friction:0.0,
        restitution:0.1
    });
    world.addContactMaterial(contactMaterial);

    var wheelRadius = 8,
        wheelX = physicsCenterX,
        wheelY = physicsCenterY,
        arrowX = wheelX,
        arrowY = wheelY + wheelRadius + 2;

    wheel = new Wheel(wheelX, wheelY, wheelRadius, 12, 0.25, 7.5);
    wheel.body.angle = (Math.PI / 32.5);
    wheel.body.angularVelocity = 5;
    arrow = new Arrow(arrowX, arrowY, 2, 4);
    mouseBody = new p2.Body();

    world.addBody(mouseBody);
}

//function spawnPartices() {
//    for (var i = 0; i < 200; i++) {
//        var p0 = new Point(viewCenterX, viewCenterY - 64);
//        var p1 = new Point(viewCenterX, 0);
//        var p2 = new Point(Math.random() * viewWidth, Math.random() * viewCenterY);
//        var p3 = new Point(Math.random() * viewWidth, viewHeight + 64);
//
//        particles.push(new Particle(p0, p1, p2, p3));
//    }
//}

function update() {
//    particles.forEach(function(p) {
//        p.update();
//        if (p.complete) {
//            particles.splice(particles.indexOf(p), 1);
//        }
//    });

    // p2 does not support continuous collision detection :(
    // but stepping twice seems to help
    // considering there are only a few bodies, this is ok for now.
    world.step(timeStep * 0.5);
    world.step(timeStep * 0.5);

    if (wheelSpinning === true && wheelStopped === false &&
        wheel.body.angularVelocity < 1 && arrow.hasStopped()) {

        var win = wheel.gotLucky();

        wheelStopped = true;
        wheelSpinning = false;

        wheel.body.angularVelocity = 0;

        if (win) {
            //spawnPartices();
        }
    }
}

function draw() {
    // ctx.fillStyle = '#fff';
    ctx.clearRect(0, 0, viewWidth, viewHeight);

    wheel.draw();
    arrow.draw();

//    particles.forEach(function(p) {
//        p.draw();
//    });
}

function loop() {
    update();
    draw();

    requestAnimationFrame(loop);
}

/////////////////////////////
// wheel of fortune
/////////////////////////////
function Wheel(x, y, radius, segments, pinRadius, pinDistance) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.segments = segments;
    this.pinRadius = pinRadius;
    this.pinDistance = pinDistance;

    this.pX = this.x * ppm;
    this.pY = (physicsHeight - this.y) * ppm;
    this.pRadius = this.radius * ppm;
    this.pPinRadius = this.pinRadius * ppm;
    this.pPinPositions = [];

    this.deltaPI = TWO_PI / this.segments;

    this.createBody();
    this.createPins();
}
Wheel.prototype = {
    createBody:function() {
        this.body = new p2.Body({mass:1, position:[this.x, this.y]});
        this.body.angularDamping = 0.0;
        this.body.addShape(new p2.Circle(this.radius));
        this.body.shapes[0].sensor = true; //TODO use collision bits instead

        var axis = new p2.Body({position:[this.x, this.y]});
        var constraint = new p2.LockConstraint(this.body, axis);
        constraint.collideConnected = false;

        world.addBody(this.body);
        world.addBody(axis);
        world.addConstraint(constraint);
    },
    createPins:function() {
        var l = this.segments,
            pin = new p2.Circle(this.pinRadius);

        pin.material = pinMaterial;

        for (var i = 0; i < l; i++) {
            var x = Math.cos(i / l * TWO_PI) * this.pinDistance,
                y = Math.sin(i / l * TWO_PI) * this.pinDistance;

            this.body.addShape(pin, [x, y]);
            this.pPinPositions[i] = [x * ppm, -y * ppm];
        }
    },
    gotLucky:function() {
        var currentRotation = wheel.body.angle % TWO_PI,
            currentSegment = Math.floor(currentRotation / this.deltaPI);

        return (currentSegment % 2 === 0);
    },
    draw:function() {
        ctx.save();
        ctx.translate(this.pX, this.pY);

        ctx.rotate(-this.body.angle);

		var offset = 12;
		ctx.drawImage(colorwheel, -(this.pRadius+offset), -(this.pRadius+offset), 2*(this.pRadius+offset), 2*(this.pRadius+offset));
//        for (var i = 0; i < this.segments; i++) {
//            ctx.fillStyle = (i % 2 === 0) ? '#BD4932' : '#FFFAD5';
//            ctx.beginPath();
//            ctx.arc(0, 0, this.pRadius, i * this.deltaPI, (i + 1) * this.deltaPI);
//            ctx.lineTo(0, 0);
//            ctx.closePath();
//            ctx.fill();
//        }

		ctx.rotate((360/12 * Math.PI / 180) / 2);
		ctx.font = ppm + "px Arial";
		for (var i = 0; i < this.segments; i++) {
			ctx.fillText(texts[i], this.pRadius/3, this.pRadius/25);
			ctx.rotate(360/12 * Math.PI / 180);
		}
		ctx.rotate((360/12 * Math.PI / 180) / 2);

        ctx.fillStyle = '#000000';

        this.pPinPositions.forEach(function(p) {
            ctx.beginPath();
            ctx.arc(p[0], p[1], this.pPinRadius, 0, TWO_PI);
            ctx.fill();
        }, this);

        ctx.restore();
    }
};
/////////////////////////////
// arrow on top of the wheel of fortune
/////////////////////////////
function Arrow(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.verts = [];

    this.pX = this.x * ppm;
    this.pY = (physicsHeight - this.y) * ppm;
    this.pVerts = [];

    this.createBody();
}
Arrow.prototype = {
    createBody:function() {
        this.body = new p2.Body({mass:0.5, position:[this.x, this.y]});
        this.body.addShape(this.createArrowShape());

        var axis = new p2.Body({position:[this.x, this.y]});
        var constraint = new p2.RevoluteConstraint(this.body, axis, {
            worldPivot:[this.x, this.y]
        });
        constraint.collideConnected = false;
		constraint.setLimits(-HALF_PI, HALF_PI);

        var left = new p2.Body({position:[this.x - 2, this.y]});
        var right = new p2.Body({position:[this.x + 2, this.y]});
        var leftConstraint = new p2.DistanceConstraint(this.body, left, {
            localAnchorA:[-this.w * 2, this.h * 0.25],
            collideConnected:false
        });
        var rightConstraint = new p2.DistanceConstraint(this.body, right, {
            localAnchorA:[this.w * 2, this.h * 0.25],
            collideConnected:false
        });
        var s = 32,
            r = 4;

        leftConstraint.setStiffness(s);
        leftConstraint.setRelaxation(r);
        rightConstraint.setStiffness(s);
        rightConstraint.setRelaxation(r);

        world.addBody(this.body);
        world.addBody(axis);
        world.addConstraint(constraint);
        world.addConstraint(leftConstraint);
        world.addConstraint(rightConstraint);
    },

    createArrowShape:function() {
        this.verts[0] = [0, this.h * 0.25];
        this.verts[1] = [-this.w * 0.5, 0];
        this.verts[2] = [0, -this.h * 0.75];
        this.verts[3] = [this.w * 0.5, 0];

        this.pVerts[0] = [this.verts[0][0] * ppm, -this.verts[0][1] * ppm];
        this.pVerts[1] = [this.verts[1][0] * ppm, -this.verts[1][1] * ppm];
        this.pVerts[2] = [this.verts[2][0] * ppm, -this.verts[2][1] * ppm];
        this.pVerts[3] = [this.verts[3][0] * ppm, -this.verts[3][1] * ppm];

        var shape = new p2.Convex(this.verts);
        shape.material = arrowMaterial;

        return shape;
    },
    hasStopped:function() {
        var angle = Math.abs(this.body.angle % TWO_PI);

        return (angle < 1e-3 || (TWO_PI - angle) < 1e-3);
    },
    draw:function() {
        ctx.save();
        ctx.translate(this.pX, this.pY);
        ctx.rotate(-this.body.angle);

		ctx.drawImage(colorarrow, -this.h/3*ppm, -this.h/4*ppm, 1.9*this.h/3*ppm, this.h*ppm);
//        ctx.fillStyle = '#401911';
//
//        ctx.beginPath();
//        ctx.moveTo(this.pVerts[0][0], this.pVerts[0][1]);
//        ctx.lineTo(this.pVerts[1][0], this.pVerts[1][1]);
//        ctx.lineTo(this.pVerts[2][0], this.pVerts[2][1]);
//        ctx.lineTo(this.pVerts[3][0], this.pVerts[3][1]);
//        ctx.closePath();
//        ctx.fill();

        ctx.restore();
    }
};
