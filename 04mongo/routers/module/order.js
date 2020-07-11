const express = require('express');
const Router = express.Router();//Router==app

// let query = require('../../db/mysql');
let tokenFn = require('./token');
const mongo =require('../../db/mongo');
let {ObjectId} = require('mongodb');

//写接口
// 新增订单(购物车新增商品)
Router.post('/addcart',async(req,res) =>{
    let inf = {};
    try{
        // let {user_id,good_id,num} =req.body;
        // // INSERT INTO `sephora`.`goods`(`title`, `info`, `src`, `price`) VALUES ('DrJart', '蒂佳婷修复新生精华露', 'https://ssl4.sephorastatic.cn/products/3/9/8/0/5/2/1_n_07551_350x350.jpg', 298.00);
        // let sql = `INSERT INTO cart(user_id,good_id,num) VALUES ('${user_id}','${good_id}',${num})`;
        // let data = await query(sql);
        let data = await mongo.create('order',[req.body]);
        if (data.result.ok){
            // 如果添加成功     //返回goods相同goods_id的商品  //后面再个接口
            console.log(data)
            inf={
                code:2000,
                flag:true,
                message:'add cart success'
            }
        }else{
            inf = {
                code:3000,
                flag:false,
                message:'add cart failure'
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





// 删除订单(购物车删除商品)
Router.delete('/del/:id',async(req,res)=>{
    let inf={};
    try{
        let {id} = req.params;
        let _id = ObjectId(id);
        let data = await mongo.remove('order',{_id});
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


// 批量删除
Router.delete('/delmore',async(req,res) =>{
    let inf = {};
    try {
        let {ids}=req.body;
        let arr=`${ids}`;
        arr = eval(arr);
        let _id=[];
        for(let i =0;i<arr.length;i++){
            _id.push(ObjectId(arr[i]) )
        }
        let data = await mongo.remove('order',{_id:{
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




// 修改订单  一般是该规格 数量  num
Router.put('/edit/:id',async(req,res) => {
    let inf={};
    try{
        let {id} = req.params;
        let _id = ObjectId(id);
        let updatedata = await mongo.update('order',{_id},{
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

// 查询订单列表(购物车多商铺数据查询)
Router.get('/getlist',async(req,res) =>{
    let inf ={}
    try{
        let {shop} = req.query;
        let data =await mongo.find('order',{shop});
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








// 查询某个订单
Router.get('/getcart/:id',async(req,res) =>{
    let inf ={}
    try{
        let {id} = req.params;
        let _id = ObjectId(id);
        let data =await mongo.find('order',{_id});
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






module.exports = Router;//导出路由对象