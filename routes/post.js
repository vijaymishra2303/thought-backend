const express=require('express')
const router=express.Router()
const mongoose=require("mongoose")
const cors=require("cors")

const requireLogin=require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const Adminpost=mongoose.model("Postadmin")


router.use(cors({
    origin:["http://localhost:5173"],
    credentials:true
}))

router.get('/allpost',requireLogin,(req,res)=>{
Post.find()
.populate("postedBy", "_id name") //yaha pr agr user ki full detail chahiye to postedBy ka use krte hai, or selected feild hi chahiye to ex- _id , name likh denge 
.then(posts=>{
    res.json({posts})
})
.catch(err=>{
    console.log(err)
})
})

//admin post get method
router.get('/adminpost',(req,res)=>{
    Adminpost.find()
    .then(adminposts=>{
        res.json({adminposts})
    })
    .catch(err=>{
        console.log(err)
    })
})




router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body}=req.body
    if(!title || !body){
       return res.status(422).json({error:"plaese add all the fields"})
    }
    
//   console.log(req.user)
//     res.send("ok")
    const post=new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

//admin post
router.post('/adminpost', async(req,res)=>{
    const {title,body}=req.body
    if(!title || !body){
        return res.status(422).json({error:"Please add all the fields"})
    }
    const admin = new Adminpost({
        title,body
    })
    admin.save().then(result=>{
        res.json({admin:result})
    })
    .catch(err=>{
        console.log(err)
    })
})



router.get("/myposts",requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    } )
})


//likes 
// router.put('/like',requireLogin,(req,res)=>{
//     Post.findByIdAndUpdate(req.body.postId,{
//         $push:{likes:req.user._id}
//     },{
//         new:true
//     }).exec((err,result)=>{
//         if(err){
//             return res.status(422).json({error:err})
//         }else{
//             res.json(result)
//         }
//     })
// })


// router.put('/like', requireLogin, async (req, res) => {
//     try {
//         const result = await Post.findByIdAndUpdate(
//             req.body.postId,
//             {
//                 $push: { like: req.user._id }
//             },
//             {
//                 new: true
//             }
//         );

//         res.json(result);
//     } catch (err) {
//         console.error("Error updating the post:", err);
//         res.status(422).json({ error: err });
//     }
// });

//delet

router.delete('/deletepost/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        // Validate postId format here if necessary

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Ensure the response format is correct
        res.json({ message: "Post deleted successfully", deletedPost });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: "An error occurred while deleting the post" });
    }
});


module.exports = router