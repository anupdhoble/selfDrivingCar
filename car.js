class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.angle=0;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=5;
        this.friction=0.05;

       



        this.controls=new Controls();
    }
    update(){
        this.#move();
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }
        if(this.speed<-this.maxSpeed/2){//'-' is negative sign which indicates car is going backwards
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        //!BUG solved
        //? if the speed becomes less than zero the reverse friction and forward friction never let car to stop , instead it move at a very small rate rather than stooping (speed at < friction)
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }
        
        if(this.speed!=0){
            const flip=this.speed>0?1:-1; 
            //?Flip is used so that when reversing ,by turing left stering will go in opposit direction by reversing
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
        }    

        

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();

        ctx.restore();
    }
}