

'use strict';
var mongoose=require('mongoose');

var Users=require('../models/user').Users;
//var customerlistbanks=require('../models/customerlistbanks').customerlistbanks;

var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');

var Path = require('path');

var axios = require('axios');




exports.getbanks = (req,res)=>{
    Users.find({ role:1},(err,banks)=>{
        res.status(200).json({
            banks
        });
    });}

 exports.getbankEtherAddress= (req,res)=>{
        
    console.log(req.params.bankid);
    Users.find({ _id:req.params.bankid},(err,banks)=>{
            console.log( 'addddad');
       
        console.log("cust id"+req.userData.userId);
            res.status(200).json({  
                ethaddress : banks[0].ethaddress,
                custid: req.userData.userId
            });
        });
    
    }


//  exports.putcustomerlist= (req,res)=>{
        
//         console.log(req.params.customerid);
//         var customerid  = req.params.customerid;
//         customerlistbanks.save


        
//         }