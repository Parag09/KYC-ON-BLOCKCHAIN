import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import kyc from '../contracts/kyc';
const web3 = new Web3(window.web3.currentProvider);


class revoke_consent extends Component {

    constructor() {
        super();
        this.state = {
            banks:[],
            file:null
        };
       // this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        // this.getIPFSimage = this.getIPFSimage.bind(this)
        
    }

 componentDidMount() {
        console.log('working');
        if(localStorage.getItem('jwtToken')==null)
        {
            this.props.history.push('/login');
        }

        axios.defaults.headers.common['Authorization'] = "bearer "+ localStorage.getItem('jwtToken');
        console.log("token"+localStorage.getItem('jwtToken'));
        axios.get('/get_consented_bank')
        .then((result) => {
            console.log("result"+result.data.banks[0]._id);
            this.setState({ banks: result.data.banks });
        })
        .catch((error) => {
            console.log("reaced here");
            console.log(error);
            if(error.status === 401) {
                this.setState({ message: 'could not fetch data' });
            }
        });
       
    }

    

   async revokeconsent(e)
      { 
        var bankid= e.target.id;
        console.log(bankid);
        const url = '/get_banks_customer_etherAddress/'+e.target.id;
    axios.get(url)
        .then(async (result) => {
            console.log("bank eth adr"+result.data.ethaddress);
            var customerid=result.data.custid;
            console.log("customer id"+result.data.custid);
            
            const account= await web3.eth.getAccounts();
            console.log("accounts "+account[0]);
            await kyc.methods.consentInitiation(result.data.ethaddress).send({
                from:account[0],
                gas:1000000
            })
            .then(result=>{
                if(result.status==false)
                {
                    console.log("could not sent consent. re-try again");
                }
                else if(result.status==true)
                {
                    axios.post('/put_pending_customer',{
                        bankid:bankid,
                        custid:customerid
                    }).then((result)=>{
                        console.log("successfully added customer to pending customer list of bank");
                    }).catch(errorr=>{
                        console.log("could not update db");
                    });
                }
            });
           })
        .catch((error) => {
            console.log("reaced here");
            console.log(error);
            if(error.status === 401) {
                this.setState({ message: 'could not fetch data' });
            }
        });

      }
    
    render() {
        return (
            <div class="container">
            <h1>hi</h1>
            {/* <input type="file" onChange={this.onChange} /> */}
            <table>
                <tbody>
                    {
                        this.state.banks.map((item,key)=>{
                            console.log('hasdad');
                            return (
                                <tr key={key}>
                                    <td>{item.email}</td>
                                    <td>{item.ethaddress}</td>
                                    <td><button id={item._id} onClick = {this.revokeconsent}>Revoke consent</button></td>
                                    {/* <td><button ><a href={"/viewbankdocs/"+item._id}>VERIFY</a></button></td> */}
                                </tr>
                                
                            )
                        })
                    }
                </tbody>
            </table>
            </div>
        );
    }
}

export default revoke_consent;
