const carCanvas =document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas =document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx =carCanvas.getContext("2d");
const networkCtx =networkCanvas.getContext("2d");
const road = new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=100;
const cars=generateCars(N);


const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",1)
];//traffic are cars in array

animate();



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

    const bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y) // there is need to spread cars array as Math function dont support arrays
        )
    );

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