var ray;
var walls = [];
var numOfWalls = 1;
var widths = 1000,
    heights = 500;

var currentWall = null;

var click = 0;

var clickTypes = ["none", "start", "end"];

var colors = {
    "first": [255, 255, 255],
    "second": [255, 0, 0],
    "third": [0, 255, 0],
    "fourth": [0, 0, 255],
    "wall": [0,0,0]
};

class Wall {
    constructor(x1, x2, y1, y2, label) {
        this.label = label;
        this.start = createVector(x1, y1);
        this.end = createVector(x2, y2);
    }
    show() {
        stroke(255);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
}

class Camera {
    constructor(x, y, sketch,arc) {
        this.sketch = sketch;
        this.x = x;
        this.y = y;
        this.numOfRays = 500;
        this.rays = [];
        this.angle = 85;

        for(var i = 85-arc/2; i < 85+arc/2; i+=arc/this.numOfRays) {
            this.rays.push(new Ray(this.sketch, i, createVector(x, y)));
        }

        this.scene = [];
        this.maxDistance = 1000;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        for (var i = 0; i < this.rays.length; i++) {
            this.rays[i].setPosition(x, y);
        }
    }

    check(walls, wall, depth) {
        for (var ray of this.rays) {
            let stack = [];
            ray.check(walls, wall, depth, stack, 0);
            if (stack.length > 0) {
                this.scene.push(stack);
            } else {
                this.scene.push(null);
            }
        }
    }
    show() {
        
    stroke(255);
    fill(0, 0, 0);
    rect(500, 0, 500, 500);
        let width = 500/this.numOfRays;
        for (var j = 0; j < this.scene.length; j++) {
            let toDraw = this.scene[j];
            if (toDraw != null) {
                let dist = 0;
                for (var i = 0; i < toDraw.length; i++) {
                    if (toDraw[i] == null) {
                        continue;
                    }
                    let label = toDraw[i][0];
                    dist = toDraw[i][1];
                    let height = this.sketch.map(dist, 0, this.maxDistance, 500, 0);
                    if (height > 0) {
                        let color = colors[label];
                        this.sketch.noStroke();
                        this.sketch.fill(color[0], color[1], color[2]);
                        this.sketch.rect(500 + j*width , 250 - height/2, width,height);
                    }
                }
            }
        }
        this.scene = [];
    }

    rotate(angle) {
        for (var i = 0; i < this.rays.length; i++) {
            this.rays[i].rotate(angle);
        }
    }
}

let camera;

function setup() {
    createCanvas(widths, heights);
    frameRate(60);
    let wall1 = new Wall(300, 500, 100, 300,"first");
    walls.push(wall1);
    let wall2 = new Wall(500, 300, 300, 500,"second");
    walls.push(wall2);
    let wall3 = new Wall(100, 300, 300, 500,"third");
    walls.push(wall3);

    // making a circle of walls

    let center = createVector(250, 250);
    let radius = 50;
    let numWalls = 10;
    let angle = TWO_PI / numWalls;

    for (let i = 0; i < numWalls; i++) {
        let x1 = center.x + radius * cos(i * angle);
        let y1 = center.y + radius * sin(i * angle);
        let x2 = center.x + radius * cos((i + 1) * angle);
        let y2 = center.y + radius * sin((i + 1) * angle);
        walls.push(new Wall(x1, x2, y1, y2, "fourth"));
    }

    // let border1 = new Wall(1, 0, 0, heights, "wall");
    // walls.push(border1);
    // let border2 = new Wall(0, widths/2, 1, 0, "wall");
    // walls.push(border2);
    // let border3 = new Wall(1, widths/2, heights, heights+1, "wall");
    // walls.push(border3);
    // let border4 = new Wall(widths/2+1, widths/2, 0, heights, "wall");
    // walls.push(border4);

    // ray = new Ray(this, 85, createVector(250, 250));
    camera = new Camera(250, 250,this, 65);
    background(0);
}

function draw() {
    background(0);
    noStroke();
    fill(255, 0, 0);
    text(frameRate(), 10, 10);

    circle(mouseX, mouseY, 5);


    let center = createVector(mouseX, mouseY);
    let length = 50;
    let detail = 10;
    let arc = 60;
    let angle = radians(arc);

    let walls1 = [];

    let start = createVector(center.x + length * cos(0), center.y + length * sin(0));
    let end = createVector(center.x + length * cos(angle), center.y + length * sin(angle));

    for (let i = 0; i < detail; i++) {
        let t = i / (detail - 1);
        let t2 = (i + 1) / (detail - 1);
        let x1 = doSomeMath(t, end.x, start.x);
        let y1 = doSomeMath(t, end.y, start.y);
        let x2 = doSomeMath(t2, end.x, start.x);
        let y2 = doSomeMath(t2, end.y, start.y);
        walls1.push(new Wall(x1, x2, y1, y2, "fourth"));
    }

    for (let i = 0; i < walls1.length; i++) {
        walls1[i].show();
    }


    // // if(click == 1) {
    // //     currentWall.end.x = mouseX;
    // //     currentWall.end.y = mouseY;
    // //     walls.push(currentWall);
    // // }
    // for (var i = 0; i < walls.length; i++) {
    //     walls[i].show();
    // }

    // if(keyIsDown(LEFT_ARROW)) {
    //     camera.rotate(-1);
    // }
    // if(keyIsDown(RIGHT_ARROW)) {
    //     camera.rotate(1);
    // }

    // // ray.check(walls,null,3);
    // camera.check(walls, null, 5);
    // camera.show();
    // camera.setPosition(mouseX, mouseY);
    // if (click == 1) {
    //     walls.pop();
    // }
}

function doSomeMath(t, start, end) {
    return start+(end-start)*t;
}

// function mousePressed() {
//     if (mouseX > 0 && mouseX < widths && mouseY > 0 && mouseY < heights) {
//         if (click == 0) {
//             currentWall=new Wall(mouseX, mouseX, mouseY, mouseY);
//             click = 1;
//         } else if (click == 1) {
//             walls.push(currentWall);
//             currentWall = [];
//             click = 0;
//         }
//     }
// }

// arrow pressed