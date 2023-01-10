const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors=require("cors")
const ObjectId=require("mongodb").ObjectId;
const port =process.env.PORT || 5000
// added middlewire 
app.use(cors());
 app.use(express.json())

 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qbrq9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try{
    await client.connect();
      
    const database = client.db("deliveryDb");
    const offerCollection = database.collection("offers");
const usersCollection=database.collection("users")
  
    // get method of offfers

    app.get("/offers",async(req,res)=>{
     
      const result=await offerCollection.find({}).toArray();
      res.json(result);
    })

    // get method 

    app.get("/offers/:id",async(req,res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)};
      const result=await offerCollection.findOne(query);
    res.json(result)

    })
// post method user

app.post("/orderInfo",async(req,res)=>{
  const result=await usersCollection.insertOne(req.body);
  res.json(result);
});

// get method user 

app.get("/manageOrder",async(req,res)=>{

  const result=await usersCollection.find({}).toArray();
  res.json(result)
})

// delete method 

app.delete("/deleteOrder/:id",async(req,res)=>{
    const id=req.params.id;
    console.log(id)
    const query={_id:ObjectId(id)};
    console.log(query);
    const result= await usersCollection.deleteOne(query);
    console.log(result);
     res.json(result);
})
  // post method offers 
  app.post("/offers",async(req,res)=>{
    const query=req.body;
    const result=await offerCollection.insertOne(query)
    res.json(result);
  })

  // update method status 

  app.put("/update/:id",async(req,res)=>{
    id=req.params.id;
    const update=req.body;
    const filter={_id:ObjectId(id)};
    const updateBody={
      $set:{
        status:"approved"
      }
    }
    const result= await usersCollection.updateOne(filter,updateBody);
    // console.log(result,req.body)
    res.json(result);
  })
  }
  finally{
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
