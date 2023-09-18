let express=require("express");
let cors = require("cors");
let app = express();
app.use(express.json());
app.use(cors());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Header",
        "Origin, X-Requested-With,Content-Type,Accept"
    );
    next();
});

const port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}`));

 let carMaster = [
    {model: "Swift Dzire VXi", make: "Maruti", fuel: "Diesel", 
     colors: ["White", "Silver Grey", "Metallic Blue", "Red"], type: "Sedan", transmission: "Manual"},
    {model: "Etios SMi", make: "Toyota", fuel: "Diesel",
     colors: ["White", "Steel Grey", "Black"], type: "Hatchback", transmission: "Manual"},
    {model: "City AXi", make: "Honda", fuel: "Petrol",
     colors: ["Silver Grey", "Metallic Blue", "Black"], type: "Sedan", transmission: "Automatic"},
    {model: "Swift DXi", make: "Maruti", fuel: "Diesel",
     colors: ["White", "Red", "Black"], type: "Hatchback", transmission: "Manual"},
    {model: "Etios VXi", make: "Toyota", fuel: "Diesel",
     colors: ["White", "Silver Grey", "Black"], type: "Sedan", transmission: "Manual"},
    {model: "City ZXi", make: "Honda", fuel: "Petrol",
     colors: ["Silver Grey", "Metallic Blue", "Red"], type: "Sedan", transmission: "Manual"}
   ];
   
let cars = [
    {id: "ABR12", price: 400000, year: 2015, kms: 25000, model: "Swift Dzire VXi", color: "White"},
    {id: "CBN88", price: 480000, year: 2012, kms: 75000, model: "Etios SMi", color: "Steel Grey"},
    {id: "XER34", price: 300000, year: 2013, kms: 55000, model: "City AXi", color: "Metallic Blue"},
    {id: "MPQ29", price: 400000, year: 2015, kms: 25000, model: "Swift DXi", color: "Black"},
    {id: "PYQ88", price: 480000, year: 2012, kms: 75000, model: "Etios VXi", color: "White"},
    {id: "DFI61", price: 300000, year: 2013, kms: 55000, model: "City ZXi", color: "Red"},
    {id: "JUW88", price: 400000, year: 2015, kms: 25000, model: "Swift Dzire VXi", color: "White"},
    {id: "KPW09", price: 285000, year: 2012, kms: 76321, model: "Swift Dzire VXi", color: "White"},
    {id: "NHH09", price: 725000, year: 2018, kms: 15000, model: "City ZXi", color: "Silver Grey"},
    {id: "CTT26", price: 815000, year: 2016, kms: 42500, model: "City AXi", color: "Metallic Blue"},
    {id: "VAU55", price: 345000, year: 2014, kms: 81559, model: "Swift DXi", color: "Red"},
    {id: "BTR31", price: 184000, year: 2011, kms: 120833, model: "Etios VXi", color: "Silver Grey"}
   ];

   app.get("/cars",function(req,res){
    let fuel = req.query.fuel;
    let type = req.query.type;
    let sort = req.query.sort;
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;
    console.log(req.query.minPrice)
    console.log(req.query.maxPrice)
    let carCopy=cars; 
    if(fuel==="Diesel"){
        carCopy=filterData("fuel",carMaster,carCopy,"Diesel")
    }
    if(fuel==="Petrol"){
        carCopy=filterData("fuel",carMaster,carCopy,"Petrol")
    }
    if(type==="Hatchback"){
        carCopy=filterData("type",carMaster,carCopy,"Hatchback")
    }
    if(type==="Sedan"){
        carCopy=filterData("type",carMaster,carCopy,"Sedan")
    }
    if(sort==="year"){
        carCopy=carCopy.sort((yr1,yr2)=>yr1.year-yr2.year)
    }
    if(sort==="kms"){
        carCopy=carCopy.sort((yr1,yr2)=>yr1.kms-yr2.kms)
    }
    if(sort==="price"){
        carCopy=carCopy.sort((yr1,yr2)=>yr1.price-yr2.price)
    }
    if(minPrice && maxPrice===undefined){
        carCopy=carCopy.filter((mn)=>mn.price>=minPrice);
    }
    else if(maxPrice && minPrice===undefined){
        carCopy=carCopy.filter((mx)=>mx.price<=maxPrice);
    }else if(maxPrice!=undefined&&minPrice!=undefined){
        carCopy=carCopy.filter((pr)=>pr.price>=minPrice && pr.price<=maxPrice);
    }

    res.send(carCopy);

    
   })
   function filterData(type,carMasterArr,carsArr,name){
        let arr1 = carMasterArr.filter((fl)=>fl[type]===name);
        arr1=carsArr.filter((ele)=>arr1.findIndex((elm)=>elm.model===ele.model)>=0) 
    return arr1;
   }

   app.get("/carMaster",function(req,res){
    res.send(carMaster);
   })

   app.get("/cars/:id",function(req,res){
    let id = req.params.id;
    let obj = cars.find((obj1) => obj1.id === id);
    if (obj) res.send(obj);
    res.send("not found");
   })

   app.post("/cars",function(req,res){
    let body = req.body;
    let maxId = cars.reduce((ele,curr)=>curr.id >= ele ? curr.id : ele , 0);
    let newId = maxId + 1;
    let newCar = {id:newId, ...body};
    cars.push(newCar);
    res.send(newCar);

})

   app.put("/cars/:id",function(req,res){
    let id = req.params.id;
    let body = req.body;
    let updateCar = {id:id, ...body};
    let index = cars.findIndex((ct)=>ct.id===id);
    if(index>=0){
    cars[index] = updateCar;
    res.send(updateCar);
    }else{
        res.status(404).send("No car found");
    }
})

app.delete("/cars/:id",function(req,res){
    let id = req.params.id;
    console.log(req.params);
    let index = cars.findIndex((ct)=>ct.id===id);
    let deletedCar
    if(index>=0){
        deletedCar = cars.splice(index,1);
    }
    // console.log(deletedCar);
    res.send(deletedCar);
})