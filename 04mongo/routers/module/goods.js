//子路由：商品信息

const express = require('express');
const Router = express.Router();//Router==app

// let query = require('../../db/mysql');
let tokenFn = require('./token');
const mongo =require('../../db/mongo');
let {ObjectId} = require('mongodb');
//写接口 
// 商品信息列表：分页
Router.get('/goodlist',async(req,res) =>{
    let inf ={};
    try{
        let {page,pagesize,sortquery}=req.query
        let data = await mongo.findmore({
            colName:'goods',
            page,
            pagesize:pagesize*1,
            sortquery:sortquery*1
        });
        let allArr = await mongo.findall('goods');
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



//查询gid为xx的商品
Router.get('/getgood/:gid',async(req,res) =>{
    let inf ={}
    try{
        let {gid} = req.params;
        let _id = ObjectId(gid);
        let data =await mongo.find('goods',{_id});
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

// 修改gid为xx的商品信息
Router.put('/edit/:gid',async(req,res) => {
    let inf={};
    try{
        let {gid} = req.params;
        let _id = ObjectId(gid);
        let updatedata = await mongo.update('goods',{_id},{
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

// 删除gid的商品
Router.delete('/del/:gid',async(req,res)=>{
    let inf={};
    try{
        let {gid} = req.params;
        let _id = ObjectId(gid);
        let data = await mongo.remove('goods',{_id});
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


// 删除多个商品
Router.delete('/delmore',async(req,res) =>{
    try {
        let {ids}=req.body;
        let arr=`${ids}`;
        arr = eval(arr);
        let _id=[];
        for(let i =0;i<arr.length;i++){
            _id.push(ObjectId(arr[i]) )
        }
        let data = await mongo.remove('goods',{_id:{
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
});



// 新增商品
Router.post('/addshop',async(req,res) =>{
    let inf = {};
    try{
        let data = await mongo.create('goods',[req.body]);
        if (data.result.ok){
            // console.log(data)
            inf={
                code:2000,
                flag:true,
                message:'add shop success'
            }
        }else{
            inf = {
                code:3000,
                flag:false,
                message:'add shop failure'
            }
        }
        // res.send(inf);
    }catch(err){
        inf = {
            code:err.sqlState,
            flag:false,
            message:'查询失败'
        }
        // res.send(inf);
    }
    res.send(inf);
})


module.exports = Router;//导出路由对象