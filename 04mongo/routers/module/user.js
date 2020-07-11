const express = require('express');
const Router = express.Router();
// let query = require('../../db/mysql');
let tokenFn = require('./token');


const mongo =require('../../db/mongo');
let {ObjectId} = require('mongodb');

// 查询用户名
Router.get('/checkname', async (req, res) => {
    try {
        // let data = await mongo.find('user', req.query);
        let data = await mongo.findmore({
            colName: 'user',
            query: req.query
        });
        if (data.length) {
            inf = {
                code: 3000,
                flag: false,
                message: '用户名已存在'
            }
        } else {
            inf = {
                code: 2000,
                flag: true,
                message: '允许注册'
            }
        }
        res.send(inf);

    } catch (err) {
        let inf = {
            code: err.sqlState,
            flag: false,
            message: '查询失败'
        }
        res.send(inf);
    }
});



// 注册 验证用户是否存在：存在就不给注册  

Router.post('/register',async(req,res) =>{
    let inf = {};
    try{
        let {name} =req.body;
        let selectname = await mongo.find('user',{name:`${name}`})
        // console.log(nametof.length)
        if(selectname.length===0){
            // console.log("ooo");
            // console.log(req.body)
            let data = await mongo.create('user',[req.body]);
            if (data.result.ok){
                console.log(data)
                inf={
                    code:2000,
                    flag:true,
                    message:'register success'
                }
            }else{
                inf = {
                    code:3000,
                    flag:false,
                    message:'register failure'
                }
            }
       }else{
            inf = {
                code:3000,
                flag:false,
                message:'username already exists'
            }
        }

    }catch(err){
        inf = {
            code:5000,
            flag:false,
            message:'select failure'
        }
    }
    res.send(inf);
    
})


// 登录  (get)
Router.get('/login',async(req,res) =>{
    let inf = {};
    let { psw } =req.query;
    try{
        let check = await mongo.find('user',req.query);
        let token = tokenFn.create(psw);  //tokenFn要在前面导入
        // console.log(token)
        if(check.length){
            inf= {
                code:2000,
                flag:true,
                message:'login success',
                token
            }
        }else{
            inf ={
                code:3000,
                flag:false,
                message:'username or password is wrong'
            }
        }
    }catch(err){
        inf = {
            code:5000,
            flag:false,
            message:'select failure'
        }
    }
    res.send(inf);
});

Router.get('/verify',async(req,res)=>{
    let inf = {};
    try{
        let {token} = req.query;
        let res = tokenFn.verify(token);
        if(res){
            inf = {
                code:2000,
                flag:true,
                message:'verify pass'
            }
        }else{
            inf = {
                code:3000,
                flag:false,
                message:'verify failure'
            }
        }
    }catch(err){
        inf = {
            code:5000,
            flag:false,
            message:'wrong by any'
        }
    }
    res.send(inf);
})

// 通过id查询用户
Router.get('/getuser/:id',async(req,res) =>{
    let inf ={}
    try{
        let {id} = req.params;
        let _id = ObjectId(id);
        let data =await mongo.find('user',{_id});
        if(data.length){
            inf = {
                code:2000,
                flag:true,
                message:'select success',
                data
            }
        }else{
            inf = {
                code:3000,
                flag:false,
                message:'select failure'
            }
        }
    }catch(err){
        inf = {
            code:5000,
            flag:false,
            message:'select failure'
        }
    }
    res.send(inf);
});


// 修改密码 put
Router.put('/edit/:id',async(req,res) => {
    let inf={};
    try{
        let {id} = req.params;
        let _id = ObjectId(id);
        let updatedata = await mongo.update('user',{_id},{
            $set :req.body
        })
        if(updatedata.result.ok){
            inf = {
                code:2000,
                flag:true,
                message:'edit success'
            }
        }else{
            inf = {
                code:3000,
                flag:false,
                message:'edit failure'
            }
        }
    }catch(err){
        inf = {
            code:err.sqlState,
            flag:false,
            message:'select failure'
        }
    }
    res.send(inf);
})


// 删除id为xx 的用户

Router.delete('/del/:id',async(req,res)=>{
    let inf={};
    try{
        let {id} = req.params;
        let _id = ObjectId(id);
        let data = await mongo.remove('user',{_id});
        if (data.result.ok) {
            inf = {
                code: 2000,
                flag: true,
                message: '删除成功'

            }
        } else {
            inf = {
                code: 3000,
                flag: false,
                message: '删除失败'
            }
        }
    }catch(err){
        inf = {
            code: 5000,
            flag: false,
            message: '查询失败'
        }
    }
    res.send(inf);
})

// 批量删除 删除多个用户
Router.delete('/delmore',async(req,res)=>{
    let inf={};
    try{
        let {ids}=req.body;
        let arr=`${ids}`;
        arr = eval(arr);
        let _id=[];
        for(let i =0;i<arr.length;i++){
            _id.push(ObjectId(arr[i]) )
        }
        let data = await mongo.remove('user',{_id:{
            $in:_id
        }});
        if (data.result.ok) {
            inf = {
                code: 2000,
                flag: true,
                message: '删除成功'

            }
        } else {
            inf = {
                code: 3000,
                flag: false,
                message: '删除失败'
            }
        }
    }catch(err){
        inf = {
            code: 5000,
            flag: false,
            message: '查询失败'
        }
    }
    res.send(inf);
})


// 查询所有用户
Router.get('/userlist',async(req,res) =>{
    let inf ={};
    try{
        let {page,pagesize}=req.query
        // console.log(req.query)
        // console.log(pagesize)
        let data = await mongo.findmore({
            colName:'user',
            page,
            pagesize:pagesize*1
            // pagesize:pagesize
            // query:req.query
            // query: req.query
        });
        let allArr = await mongo.findall('user');
        if(data.length){
            inf={
                code: 2000,
                flag: true,
                message: '查询成功',
                total:allArr.length,
                page,
                pagesize,
                pages:Math.ceil(allArr.length / pagesize),
                data
            }
        }else{
            inf = {
                code: 3000,
                flag: false,
                message: '查询失败'
            }
        }
    }catch(err){
        inf = {
            code: 5000,
            flag: false,
            message: '查询失败'
        }
    }
    res.send(inf);
})



module.exports = Router;