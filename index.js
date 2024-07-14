import express from "express"
import bodyParser from "body-parser"


import fs from "fs"
import path from "path"

import { dirname } from 'path';
import { fileURLToPath } from "url";


const app = express()
const port = 8000
const __dirname = dirname(fileURLToPath(import.meta.url))
let heading=""
let info=""
let ID = 2;



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:true}))

const blogpost = [
    {
        id : 1,
        title  : "Top 10 Scenic Routes for Your Next Adventure",
        cont : "India is a land of diverse landscapes, from majestic mountains to serene beaches, lush forests, and sprawling deserts............."
    },
    {
        id : 2,
        title : "How to Plan the Perfect Road Trip",
        cont : "Planning a road trip can be an exciting yet daunting task. A well-planned road trip ensures a smooth, enjoyable, and memorable journey........."
    }
]

app.get("/",(req,res)=>{
    res.render("../views/pages/index.ejs", {blogpost})
})

app.get("/pages/:id",(req,res)=>{
    const postId = req.params.id
    const post = blogpost.find((post)=>post.id == postId)

    if(post){
        res.render(`pages/post${post.id}`,{post})
    }
    else{
        res.sendStatus(404)
    }
})

app.get("/createblog",(req,res)=>{
    res.render("createblog.ejs")
})



app.post("/create",(req,res)=>{
const date= new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
++ID;
//console.log(ID)

heading = req.body.title
info = req.body.content

//console.log(heading)
//console.log(info)

const obj = {
    id : ID,
    title : heading,
    cont : info
}

blogpost.push(obj)


const fileName = `post${ID}.ejs`;
const filePath = path.join(__dirname, 'views', 'pages', fileName);

    // Template data
    const templateData = `
    <!DOCTYPE html>
    <html>
    <head>
        <title><%= post.title %></title>
        <link rel="stylesheet" href="/styles/style.css">
    </head>
    <body>
    <%-include("../partials/header.ejs")%>
        
    <h2 class="post-title"><%= post.title %></h2>
  <h3><i>${date}</i></h3>
    <p>${info}</p>
    </main>
         <%-include("../partials/footer.ejs")%>
    </body>
    </html>
    `;

    // Write the template data to a new file
    fs.writeFile(filePath, templateData, (err) => {
        if (err) {
            console.error('Error creating file:', err);
        
        }

      
    });

   // console.log(blogpost)
res.render("../views/pages/index.ejs",{blogpost})
})

app.delete("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = blogpost.findIndex(post => post.id === postId);

    if (postIndex !== -1) {
        // Remove post from the array
        blogpost.splice(postIndex, 1);

        // Delete the EJS file
        const filePath = path.join(__dirname, 'views', 'pages', `post${postId}.ejs`);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                res.sendStatus(500);
                
            }
            res.sendStatus(200);
        });
    } else {
        res.sendStatus(404);
    }
});

app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
})

