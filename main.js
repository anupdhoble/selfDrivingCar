
//Car Types:
//AI - AI model will self drive the car
//KEYS - Keyboard arrow keys can be used to drive car
//DUMMY - Traffic dummy cars





const carCanvas =document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas =document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx =carCanvas.getContext("2d");
const networkCtx =networkCanvas.getContext("2d");
const road = new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=5;
const cars=generateCars(N);
this.bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")
        );

        if(i!=0){
            NeuralNetworks.mutate(cars[i].brain,0.05);//0.1 is amount to mutate
        }
    }
    }
    


const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(1),-300,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(0),-700,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(0),-900,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(2),-900,30,50,"DUMMY",1),
];//traffic are cars in array

animate();

//we need to save the good controllable cars from all ai driven cars , we do so in local storage
function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}
 
function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y) // there is need to spread cars array as Math function dont support arrays
        )
    );//acts like fitness function 2:17:20 in yt video

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }

    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }

    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);


    requestAnimationFrame(animate); //calls animate function again and again;
}