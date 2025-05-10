class Ray {
    constructor(sketch, angle, initial) {
        this.sketch = sketch;
        // Instead of storing vec, calculate and store the end point directly
        this.vec = createVector(0, -50000).rotate(radians(angle));
        this.angle = angle;
        this.initial = initial;
        this.end = createVector(initial.x + this.vec.x, initial.y + this.vec.y);
        this.isReflected = false;
    }
    
    show() {
        if (!this.isReflected) {
            this.sketch.stroke(0, 255, 0);
            this.sketch.line(this.initial.x, this.initial.y, this.end.x, this.end.y);
        } else {
            this.sketch.stroke(255, 0, 0);
            this.sketch.line(this.initial.x, this.initial.y, this.end.x, this.end.y);
        }
    }

    showPoint(point) {
        this.sketch.fill(255, 0, 0);
        this.sketch.ellipse(point.x, point.y, 10, 10);
    }
    
    check(walls, from,depth, stack,distance) {
        if (depth <= 0) {
            return;
        }
        let isReflected = false;
        class tempWall {
            constructor(wall, pt) {
                this.wall = wall;
                this.pt = pt;
            }
        }
        let pts = [];
        for (let i = 0; i < walls.length; i++) {
            // Check if the wall is the same as the one we are checking against
            if (walls[i] === from) {
                continue;
            }
            const wall = walls[i];
            const pt = this.pointOfIntersection(wall);
            if (pt){
                pts.push(new tempWall(wall, pt));
            }
        }
        // closest point to the ray
        let closest = null;
        let minDist = Infinity;
        for (let i = 0; i < pts.length; i++) {
            const pt = pts[i].pt;
            const dist = this.initial.dist(pt);
            if (dist < minDist) {
                minDist = dist;
                closest = pts[i];
            }
        }
        if (closest) {
            this.showPoint(closest);
            let pt = closest.pt;
            let wall = closest.wall;

            let dist = this.initial.dist(pt);

            distance = dist+distance;
            stack.push([wall.label, distance]);
            isReflected = true;
            
            // Calculate normalized incident vector
            const incidentVec = createVector(pt.x - this.initial.x, pt.y - this.initial.y);
            const d = incidentVec.copy().normalize();
            
            // Calculate wall normal
            const wallVec = createVector(wall.end.x - wall.start.x, wall.end.y - wall.start.y);
            let normal = createVector(-wallVec.y, wallVec.x);
            normal.normalize();
            
            // Ensure normal points away from the incident ray
            if (normal.dot(d) < 0) {
                normal.mult(-1);
            }
            
            // Calculate reflection vector: r = d - 2(d·n)n
            const dot = d.dot(normal);
            const reflection = p5.Vector.sub(d, p5.Vector.mult(normal, 2 * dot));
            
            const offsetPt = createVector(
                pt.x + reflection.x * 1,
                pt.y + reflection.y * 1
            );
            
            this.end = pt;
            
            if(wall.label != "wall"){
                
            // Create and show reflected ray from the offset point
            const reflectedRay = new Ray(this.sketch, 0, pt);
            // Set end point directly instead of using vec
            reflectedRay.end = createVector(
                offsetPt.x + reflection.x * 50000,
                offsetPt.y + reflection.y * 50000
            );
            this.sketch.stroke(255, 0, 0);
            reflectedRay.check(walls, wall, depth - 1, stack, distance);
            }

        }else {
            stack.push(null)
        }
        this.isReflected = isReflected;
        this.show();
        this.end = createVector(this.initial.x + this.vec.x, this.initial.y + this.vec.y);
    }
    
    pointOfIntersection(wall) {
        var x1 = wall.start.x;
        var y1 = wall.start.y;
        var x2 = wall.end.x;
        var y2 = wall.end.y;
        var x3 = this.initial.x;
        var y3 = this.initial.y;
        var x4 = this.end.x;  // Use end directly
        var y4 = this.end.y;  // Use end directly

        var denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denom == 0) {
            return null;
        }
        var det1 = (x1 * y2 - y1 * x2);
        var det2 = (x3 * y4 - y3 * x4);
        var x = (det1 * (x3 - x4) - (x1 - x2) * det2) / denom;
        var y = (det1 * (y3 - y4) - (y1 - y2) * det2) / denom;
        var intersection = createVector(x, y);
        if (this.isPointOnLine(intersection, x1, y1, x2, y2) && this.isPointOnLine(intersection, x3, y3, x4, y4)) {
            return intersection;
        } else {
            return null;
        }
    }
    
    isPointOnLine(point, x1, y1, x2, y2) {
        return (point.x >= Math.min(x1, x2) && point.x <= Math.max(x1, x2) && point.y >= Math.min(y1, y2) && point.y <= Math.max(y1, y2));
    }

    setPosition(x, y) {
        this.initial.x = x;
        this.initial.y = y;
        this.end.x = x + this.vec.x;
        this.end.y = y + this.vec.y;
    }

    rotate(angle) {
        this.angle = angle;
        this.vec.rotate(radians(angle));
        this.end.x = this.initial.x + this.vec.x;
        this.end.y = this.initial.y + this.vec.y;
    }
}