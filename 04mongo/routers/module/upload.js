const multer = require('multer')
const express = require('express');
const Router = express.Router();
const { host } = require('../../config.json');
const mongo = require('../../db/mongo');
var { ObjectId } = require('mongodb');


var storage = multer.diskStorage({
    destination:'uploads/',
    filename:function(req,file,cb){
        let filename = file.originalname;
        let arr = filename.split('.');
        cb(null,arr[0]+'-'+Date.now()+'.'+arr[1]);
    }
})

var upload = multer({storage:storage});


// 上传头像
Router.post('/headphoto',upload.single('avatar'),async(req,res)  =>{
    let url = host + '/uploads/' + req.file.filename;
    let {_id}=req.body;
    _id = ObjectId(_id);
    let data = await mongo.update('user',{_id},{
        $set :{
            avatar:url
        }
    })
    let inf = {};
    if(data.result.ok){
        inf ={
            code: 2000,
            flag: true,
            message: '上传成功'
        }
    }else{
        inf ={
            code:3000,
            flag:false,
            message:"upload failuer"
        }
    }
    res.send(inf);
})

// 上传多张
Router.post('/goodimg', upload.array('photos', 3), async (req, res) => {
    let urlList = [];
    req.files.forEach(item => {
        let url = host + '/uploads/' + item.filename;
        urlList.push(url);
    });
    let { _id } = req.body;
    _id = ObjectId(_id);

    let data = await mongo.update('goods', { _id }, {
        $set: {
            urlList
        }
    })
    let inf = {};
    if (data.result.n) {
        //上传成功
        inf = {
            code: 2000,
            flag: true,
            message: '上传成功'

        }
    } else {
        inf = {
            code: 3000,
            flag: false,
            message: '上传失败'
        }
    }
    res.send(inf);
})


module.exports = Router;