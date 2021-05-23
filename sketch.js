
var dog,sadDog,happyDog;
var milk;
var foodS, foodStock;
var fedTime, lastFed, feed, addFood;    


function preload(){
  sadDog=loadImage("images/Dog.png");
  happyDog=loadImage("images/happydog.png"); 
  bowlImg = loadImage("images/milkbowl.png")

  drink = loadSound("sound.mp3")
}

function setup() {
  database = firebase.database()
  createCanvas(1000,400);
  
  milk = new Food();

  foodStock = database.ref('food');
  foodStock.on("value", readStock);

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  bowl = createSprite(8000,3700);
  bowl.addImage(bowlImg);
  bowl.scale = 0.1

  feed = createButton("Feed the dog");
  feed.position(600,152);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(950,152);
  addFood.mousePressed(addFoods);


}

function draw() {
  background(46,139,87);

  milk.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data){
    lastFed = data.val();
  })

  fill(255,255,254);
  textSize(15);
  if (lastFed >= 12) {
    text("Last Feed: " + lastFed %12 + "PM", 300, 35);
  }
  else if(lastFed === "") {
    text("HUNGRY ",300,35)
  }
  else if(lastFed == 0) {
    text("Last Feed: 12AM ", 300, 35);
  }
  else {
    text("Last Feed:  " + lastFed + "AM", 300, 35);
  }

  text("food stock = "+foodS,630,35)
  drawSprites();

}

//function to read Stock
function readStock(data){
  foodS = data.val();
  milk.updateFoodStock(foodS);
}

//function to update food stock and last fed time
  function feedDog() {
    if(foodS > 0){
      dog.addImage(happyDog);
      drink.play();

      milk.updateFoodStock(milk.getFoodStock()-1);
      database.ref('/').update({
        food: milk.getFoodStock(),
        FeedTime : hour()
      })

     dog.x = 880;
     dog.y = 340
     bowl.x = 800
     bowl.y = 370
    }  
  }

//function to add food in stock
function addFoods(){
  dog.addImage(sadDog);
  dog.x = 800;
  dog.y = 200
  bowl.x = 10000
  bowl.y = 10000
  foodS++;
  database.ref('/').update({
    food: foodS
  })
}


