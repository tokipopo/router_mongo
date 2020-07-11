const express = require('express');
const Router = express.Router();

const userRouter = require('./module/user');
const uploadRouter = require('./module/upload');
const goodRouter = require('./module/goods');
const orderRouter = require('./module/order');

Router.use('/user',userRouter);
Router.use('/upload',uploadRouter);
Router.use('/goods',goodRouter);
Router.use('/order',orderRouter)

module.exports = Router;