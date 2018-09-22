import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import kyc from '../contracts/kyc';
const web3 = new Web3(window.web3.currentProvider);


class bank_show_customers extends Component {

    constructor() {
        super();
        this.state = {
            customers: [],
            file : null

        };
         this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        // this.getIPFSimage = this.getIPFSimage.bind(this)

    }

    componentDidMount() {
        console.log('working');
        if (localStorage.getItem('jwtToken') == null) {
            this.props.history.push('/login');
        }

        axios.defaults.headers.common['Authorization'] = "bearer " + localStorage.getItem('jwtToken');
        console.log("token" + localStorage.getItem('jwtToken'));
        axios.get('/get_pending_customer')
            .then((result) => {
                console.log("result" + result.data.data);
                this.setState({ customers: result.data.data });
            })
            .catch((error) => {
                console.log("reaced here");
                console.log(error);
                if (error.status === 401) {
                    this.setState({ message: 'could not fetch data' });
                }
            });

    }


    onChange(e) {
        console.log("beforefilestate " + e.target.files[0]);
        this.setState({ file: e.target.files[0] }, () => {
            console.log("filestate " + this.state.file);
        })

    }

    onFormSubmit(e){
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file).then((response)=>{
          console.log(response.data.encryptedkey);
          

        })
      }

      fileUpload(file){
        const url = '/bank_customer_documentupload';
        const formData = new FormData();
        formData.append('documents',file)
        console.log('working');
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return  axios.post(url, formData,config)
      }



    render() {
        return (
            <div class="container">
                <h1>h</h1>
                <table>
                    <tbody>
                        {
                            this.state.customers.map((item, key) => {
                               
                                return (
                                    <tr key={key}>
                                        <td>{item.email}</td>
                                        <td>{item.ethaddress}</td>
                                       <td><form onSubmit={this.onFormSubmit}>
                                         <input type="file" onChange={this.onChange} />
                                         <button type="submit">Upload</button>
                                        </form></td> 
                                     
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

export default bank_show_customers;
