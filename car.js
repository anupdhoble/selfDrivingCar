class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;


        this.speed = 0;
        this.acceleration = 0.1;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        this.useBrain = controlType == "AI";

        this.img = new Image();
        this.img.src = "car.png";




        if (controlType != "DUMMY") {//No need for sensor for fummy cars in traffic
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetworks(
                [this.sensor.rayCount, 6, 4]
            );//rayCount as first layer , 6 hidden layer, 4 utput layer for left right up down controls;
        }

        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(
                s => s == null ? 0 : 1 - s.offset
            );
            const outputs = NeuralNetworks.feedForward(offsets, this.brain);
            // console.log(outputs);

            if (this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    #createPolygon() {//for collison detection of corners
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });
        return points;
    }



    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }
        if (this.speed < -this.maxSpeed / 2) {//'-' is negative sign which indicates car is going backwards
            this.speed = -this.maxSpeed / 2;
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        //!BUG solved
        //? if the speed becomes less than zero the reverse friction and forward friction never let car to stop , instead it move at a very small rate rather than stooping (speed at < friction)
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            //?Flip is used so that when reversing ,by turing left stering will go in opposit direction by reversing
            if (this.controls.right) {
                this.angle -= 0.01 * flip;
            }
            if (this.controls.left) {
                this.angle += 0.01 * flip;
            }
        }



        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx, color, drawSensor = false) {

        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }

        // if (this.damaged) {
        //     ctx.fillStyle = "gray";
        // }
        // else {
        //     ctx.fillStyle = color;
        // }
        // ctx.beginPath();
        // ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        // for (let i = 1; i < this.polygon.length; i++) {
        //     ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        // }
        // ctx.fill();

        //After adding car image
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.drawImage(this.img,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height);
        ctx.restore();
    }
}