const{ MongoClient } = require("mongodb");
// 引入模块
let urlDb = 'mongodb://localhost:27017';
// 连接数据库
MongoClient.connect(urlDb,async(err,client) => {
    if(err) throw err;
    let db = client.db('test');
    let col = db.collection('songs');
    // let song = [{
    //     "id": 1,
    //     "name": "月亮代表我的心"
    // }, {
    //     "id": 2,
    //     "name": "我心依旧"
    // }, {
    //     "id": 3,
    //     "name": "涛声依旧"
    // }, {
    //     "id": 4,
    //     "name": "匆匆那年"
    // }]
    // 插入数据
    // col.insertMany(song);

    // 删除数据







    client.close();
})