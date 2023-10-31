const List = require("../Models/listModel");

exports.renderListPage = (req, res) => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; 
    const year = currentDate.getFullYear() % 10000; 
    const formattedDay = (day < 10) ? `0${day}` : day;
    const formattedMonth = (month < 10) ? `0${month}` : month;
    const formattedDate = `${formattedDay}:${formattedMonth}:${year}`;
    List.findOne({ "name": formattedDate }, (err, foundItems) => {
        if (err) {
            console.log(err);
        } else {
            if(!foundItems){
                const list = new List({
                    name: formattedDate,
                    ItemList: [],
                });
                list.save();
                res.redirect('/');
            }else{
                res.render("list", { listTitle: formattedDate, newListItems: foundItems.ItemList });
            }
            
        }
        
    })
};

exports.insertItem = (req, res) => {
    console.log("Data from the insert", req.body)
    let listName = req.body.name;
    List.findOne({ "name": listName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: listName,
                    ItemList: [{ "Item": req.body.newItem }],
                });
                list.save();
                // res.redirect('/');
            }
            else {
                foundList.ItemList.push({ "Item": req.body.newItem });
                foundList.save();
                // res.redirect('/');
            }
        }
        res.redirect('/');
        
    })
};

exports.deleteItem = (req, res) => {
    List.findOne({ "name": req.body.name }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                console.log("List not found");
            }
            else {
                console.log("List found", foundList);
                foundList.ItemList.pull({ _id: req.body.checkbox });
                foundList.save();
            }
        }
        res.redirect('/');
    });
};
