//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

// const mongoose=require ("mongoose");
const app = express();

const mongoose = require('mongoose');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const uri="mongodb+srv://ritulprasad:Ritul%401234@cluster0.62ciuz2.mongodb.net/?retryWrites=true&w=majority"


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

const itemsSchema={
  name:String
};
const Item=mongoose.model("Item",itemsSchema);
const Item1={
  name:"Welcome to the todolist"
};
const Item2={
  name:"Click + button to add items"
};
const Item3={
  name:"click delete to remove item"
};

// const defaultItems=[Item1,Item2,Item3];
// Item.insertMany(defaultItems)
//       .then(function () {
//         console.log("Successfully saved default items to DB");
//       })
//       .catch(function (err) {
//         console.log(err);
//       });

async function saveDefaultItems() {
  const defaultItems = [Item1, Item2, Item3];

  try {
    const existingItems = await Item.find({ $or: defaultItems.map(item => ({ name: item.name })) });
    const newItems = defaultItems.filter(item => !existingItems.some(existingItem => existingItem.name === item.name));
    
    if (newItems.length > 0) {
      await Item.insertMany(newItems);
      console.log("Successfully saved default items to DB");
    } else {
      console.log("No new items to save");
    }
  } catch (err) {
    console.log(err);
  }
}

saveDefaultItems();





app.get("/", function(req, res) {

 
  Item.find({}).then(function(FoundItems){
    
    res.render("list", {listTitle: "Today", newListItems:FoundItems});

  })
   .catch(function(err){
    console.log(err);
  })

});


app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item=new Item({
    name:itemName
  });
  item.save();
  res.redirect("/");

});



app.post("/delete", function (req, res) {
  const checkItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkItemId)
    .then(() => {
      console.log("Successfully deleted checked item");
      res.redirect("/");
    })
    .catch((err) => {
      console.error("Error deleting checked item:", err);
      // Handle the error and send an appropriate response
      res.status(500).send("Error deleting item");
    });
});










app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(4000, function() {
  console.log("Server started on port 4000");
});
