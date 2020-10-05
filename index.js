const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId=require('mongodb').ObjectId


require('dotenv').config()
const port = 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

app.get('/', (req, res) => {
  res.send(`${process.env.DB_User}`)
})


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.d6hxw.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("VolunteerTask").collection("volunteers");
  const taskCollection = client.db("allData").collection("allData");
  
  app.get("/tasks",(req,res) =>{
  collection.find({email:req.query.email})
  .toArray((err,documents) => {
      res.send(documents);
  })


  })

  app.get("/volunteers",(req,res) =>{
    collection.find({})
    .toArray((err,documents) => {
        res.send(documents);
    })
  
  
    })

  app.get("/taskList",(req,res) =>{
    taskCollection.find({})
    .toArray((err,documents) => {
        res.send(documents);
    })
  
  
    })


  app.post('/addNewTask',(req,res) =>{
  const tasks=req.body;
  taskCollection.insertMany(tasks)
  .then(result =>{
    console.log(result);
  })

  })

  app.delete('/delete/:newID',(req,res) =>{
  collection.deleteOne({_id:ObjectId(req.body.id)})
  .then(result=>{
   res.send(result.deletedCount>0)
  })

  })

  app.delete('/taskDelete/:newID',(req,res) =>{
    taskCollection.deleteOne({_id:ObjectId(req.body.id)})
    .then(result=>{
     res.send(result.deletedCount>0)
    })
  
    })

    app.delete('/volunteerDelete/:newID',(req,res) =>{
      collection.deleteOne({_id:ObjectId(req.body.id)})
      .then(result=>{
       res.send(result.deletedCount>0)
      })
    
      })


  
  app.post("/addTask",(req,res)=>{
     const task=req.body;
     collection.insertOne(task)
     .then(result=>{
         console.log("Task Added")
         res.redirect("http://localhost:3000/taskList")
        
     })




  })

  app.post("/adminTask",(req,res)=>{
    const task=req.body;
    taskCollection.insertOne(task)
    .then(result=>{
        console.log("Task Added")
        res.send(result.insertedCount>0)
       
    })




 })



});



app.listen(process.env.PORT || port)
