'use strict'

const Sequelize = require('sequelize')

const sequelize = new Sequelize('authdb','root','1234',{
  dialect:'mysql',
  host:'localhost',
  port:3306,
  logging:true
})

const db = {}
db.sequelize=sequelize;
db.Sequelize=Sequelize;


module.exports=db;