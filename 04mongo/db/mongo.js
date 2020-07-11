// 封装
const { MongoClient } = require("mongodb");

let urlDb = 'mongodb://localhost:27017';
let dbName = 'test2';


// 连接数据库
async function connect(){
    try{
        let client = await MongoClient.connect(urlDb);
        return client;
    }catch(err){
        return err;
    }
}

// connect();
// 增
async function create(colName,data){
    try{
        let client = await connect();
        let db = client.db(dbName);  //连接该库
        let col = db.collection(colName);  //查找该集合
        let result = await col.insertMany(data);   //用集合该方法（insermany）插入数据到
        client.close();
        return result;  //返回插入数据
    }catch(err){
        return err;
    }
}

// let data = [{
//     "age": '55',
//     "name": "Aki"
// }, {
//     "age": '56',
//     "name": "Gakki"
// }, {
//     "age": '57',
//     "name": "loki"
// }, {
//     "age": '58',
//     "name": "miki"
// }];

// let createdata = create('user', data);
// createdata.then(res => {
//     console.log(res);
// })

// 删
async function remove(colName,query){
    try{
        let client = await connect();
        let db =client.db(dbName);
        let col = db.collection(colName);
        let result =await col.deleteMany(query);   //删除方法
        client.close();
        return result;
    }catch(err){
        return err;
    }
}

// let deletedata = remove('user',{ name: 'miki'});
// deletedata.then(res => {
//     console.log(res);
// })



// 改
async function update(colName,query,data){
    try{
        let client = await connect();
        let db =client.db(dbName);
        let col = db.collection(colName);
        let result =await col.updateMany(query,data);
        client.close();
        return result;
    }catch(err){
        return err;
    }
}

// let updatedata = update('user',{ name: 'Aki'},{
//     $set :{
//         age:'24'
//     }
// });
// updatedata.then(res => {
//     console.log(res)   //res.result.ok  === 1
// })

// 查
async function find(colName,query = {}){
    try{
        let client = await connect();
        let db =client.db(dbName);
        let col = db.collection(colName);
        let data =await col.find(query).toArray();
        client.close();
        return data;
    }catch(err){
        return err
    }
}

async function findall(colName){
    try{
        let client = await connect();
        let db =client.db(dbName);
        let col = db.collection(colName);
        let data =await col.find().toArray();
        client.close();
        return data;
    }catch(err){
        return err;
    }
}

// let check =find('user',{ name:'Aki'});
// check.then(res =>{
//     console.log(res);
// })


// 分页查询
async function findmore(opt){
    let defaultOpt = {
        query: {},
        page: 1,
        pagesize: 2,
        sortquery: {}
    }
    Object.assign(defaultOpt,opt);
    try{
        let client = await connect();
        let db =client.db(dbName);
        let col = db.collection(defaultOpt.colName);
        let index = (defaultOpt.page - 1)*defaultOpt.pagesize;
        // limit 条数 skip 从几开始 sort 排序 1 -1
        let data = await col.find(defaultOpt.query).limit(defaultOpt.pagesize).skip(index).sort(defaultOpt.sortquery).toArray();
        client.close();
        return data;
    }catch(err){
        return err;
    }
}
// let check =findmore({
//     colName:'user',
//     page:1,
//     pagesize:5,
//     sortquery:{ age:-1 }
// });
// check.then(res =>{
//     console.log(res);
// })

module.exports = {
    create,
    remove,
    update,
    find,
    findmore,
    findall
}




