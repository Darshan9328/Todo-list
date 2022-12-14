//jshint esversion:6
//libraries
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];


const url =
  `mongodb+srv://db1:qwe123@cluster0.8ufdxde.mongodb.net/?retryWrites=true&w=majority`;


const connectionParams={
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })


// Itemschema
const itemsSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
       }
    })
// item model call
const Item =mongoose.model("Item",itemsSchema);



//making list schema fo taking list
const listSchema  ={
  name :String,
  items:[itemsSchema]
};

//model of the list
const List =mongoose.model("List",listSchema);

//all the itmes
const Item1= new Item({
  name:"Welcome to your To-Do-List"
});
const Item2=new Item({
  name:"Hit the + Icon and Add list"
});
const Item3=new Item({
   name:"✔️ click and remove"
});

//making list to insertmany items in database
const defaultItems  =[Item1,Item2,Item3];



//check  if list length is 0 then  insert manual list in fouditems
app.get("/", function(req, res) {
 Item.find({},function(err,foundItems){
  if(foundItems.length===0){
    Item.insertMany(defaultItems ,(err)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log("Inserted");
      }
    })
    res.redirect("/");
  }
  else{
    res.render("list", {listTitle: "Today", newListItems: foundItems});

  }
})
})

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName=req.body.list;

   const item=new Item({
     name:itemName
   });

   if(listName==="Today"){
     item.save();
     res.redirect("/");
   }
   else{
     List.findOne({ name: listName }, function (err, foundList){
      foundList.items.push(item);
       foundList.save();
       res.redirect(`/${listName}`);   //check terminate the favicon.ico errors
     })
   }

  //  item.save();
});

//to delete any list in the foundList
app.post("/delete",function(req,res){
  const id=req.body.checkbox;
  const listName=req.body.listName;

  if(listName==='Today'){
    Item.findByIdAndRemove(id, (err) => {  //find the list in foundList and remove the list
          if (!err) {
              console.log('Sucsessfully deleted ' );
          }
      });
      res.redirect('/');
  }
  else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:id}}},function(err,foundList){
      if(!err)
      {
        res.redirect(`/${listName}`);
      }
    })

  }


})



//check if searchable item is present or not if not ten create a new item and insert into list
app.get("/:customListName",function(req,res){
  const newListName =_.capitalize(req.params.customListName);
   console.log(newListName);

   List.findOne({name:newListName },function(err,foundList){
     if(!err){
       if(!foundList){
         const list =new List({
           name:newListName ,
           items:defaultItems
         });
         list.save();
          // res.render("list", {listTitle: list.name, newListItems: list.items});
          res.redirect("/" + newListName);
       }
       else{
         res.render("list",{listTitle: foundList.name,newListItems:foundList.items});


       }
     }
   })
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {   ///for starting server at port numbr 3000
  console.log("Server started successfully");
});
