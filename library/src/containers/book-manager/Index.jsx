import React,{useState,useEffect} from 'react'
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {GET,DELETE,POST} from '../../utilities/apiHelper';
import { Link } from "react-router-dom";
import { Required } from '../../utilities/validator';
export default function Index() {
    const [Bookslist, setBookslist] = useState({});

    // method to get users with books
    const getUsersHavingBooks=async ()=>{
        try {
            let result=await GET("/manager/users-with-books");
            setBookslist(result.data.serverData);
            console.log(Bookslist);
            
        } catch (error) {
            console.log("Javascript Error Occured"+error);
        }
    }

    // method to unassign book
    const Unassignbook =async(id) =>{
        try {
            let result=await DELETE(`/manager/unassign-book/${id}`);
            if (result.status==200) {
                getUsersHavingBooks();
            }
        } catch (error) {
            console.log("Javascript Error Occured"+error);
        }
    }

    useEffect(() => {
        getUsersHavingBooks();
        return () => {
        }
    }, [])
  

  return (
   <>
    <div className="container mt-5">
        
    <Card style={{ width: 'auto' }}>
    <Card.Header>
        <div className="row">
            <div className="col-md-6">
                <Card.Title className='mt-2'>List of Users with Books</Card.Title>
            </div>
           
        </div>
    </Card.Header>
      <Card.Body>
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>Sr no</th>
          <th>Book name</th>
          <th>Author</th>
          <th>User</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Bookslist.count > 0 ?
            Bookslist.data.map((record,index)=>(
                <tr key={record.id}>
                    <td>{index+1}</td>
                    <td>{record.book.name}</td>
                    <td>{record.book.author}</td>
                    <td>{record.user_name}</td>
                    <td>
                        <div className="d-flex">
                        <button onClick={()=>{Unassignbook(record.id)}} className='btn btn-warning btn-sm'>unassign</button>
                        </div>
                    </td>
                </tr>
            ))
        :
        
        <tr>
          <td colSpan={4} className="text-center">No Records Available</td>
        </tr>
        }
        
      </tbody>
    </Table>
      </Card.Body>
    </Card>
    </div>
   </>
  )
}


