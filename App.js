// const http=require('http');
// const server=http.createServer((req,res)=>{
//     console.log("server created")
//     res.end("Hello")
// });
// server.listen(5000,"localhost"),(()=>{
//     console.log("server is listening on port 5000")
// })

// const express=require("express");
// const app=express();
// const cors=require("cors")
// const port=5000;
// const data=require('./data.js');
// app.use(cors())
// app.get('/',(req,res)=>{
//     res.json(data)
// })
// app.get('/about',(req,res)=>{
//     res.json("about")
// })
// app.listen(port,()=>{
//     console.log("server is listening on "+port)
// })
const express=require("express");
const path=require("path")
const app=express()
const port=process.env.port || 5000;
const cors=require("cors");
app.use(cors())
const mongoose=require("mongoose");
const {mongoUrl}=require("./keys")
require('./models/models')
require('./models/post')
app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/createPost"))
app.use(require("./routes/user"))
mongoose.connect(mongoUrl)
mongoose.connection.on("connected",()=>{
    console.log("connected to mongo")
})
mongoose.connection.on("error",()=>{
    console.log("not connected mongo")
})
//serving front end
app.use(express.static(path.join(__dirname,"./frontend/instagram-clone/build")))
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"./frontend/instagram-clone/build/index.html")),
    function(err){
        res.status(500).send(err)
    }
})
app.listen(port,()=>{
    console.log("server is listening on "+port)
})
