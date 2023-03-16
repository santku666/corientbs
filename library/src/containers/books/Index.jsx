import React,{useState,useEffect,forwardRef, useImperativeHandle, useRef} from 'react'
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {GET,DELETE,POST} from '../../utilities/apiHelper';
import { Link } from "react-router-dom";
import { Required } from '../../utilities/validator';
export default function Index() {

    const ref = useRef();
    const [Bookslist, setBookslist] = useState({});
    const [BookID, setBookID] = useState(null);

    // get list of all books method
    const getBooks=async ()=>{
        try {
            let result=await GET("/books");
            setBookslist(result.data.serverData);
            
        } catch (error) {
            console.log("Javascript Error Occured"+error);
        }
    }

    // delete book method
    const DeleteBook =async(id) =>{
        try {
            let result=await DELETE(`/books/${id}`);
            if (result.status==200) {
                getBooks();
            }
        } catch (error) {
            console.log("Javascript Error Occured"+error);
        }
    }

    useEffect(() => {
        getBooks();
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
                <Card.Title className='mt-2'>Books List</Card.Title>
            </div>
            <div className="col-md-6">
                <div className="d-flex justify-content-end">
                    <Link to={'/books/new'}>
                        <button className='btn btn-primary'>Add</button>
                    </Link>
                </div>
            </div>
        </div>
    </Card.Header>
      <Card.Body>
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>Sr no</th>
          <th>Name</th>
          <th>Author</th>
          <th>Price</th>
          <th>Availablity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Bookslist.count > 0 ?
            Bookslist.data.map((record,index)=>(
                <tr key={record.id}>
                    <td>{index+1}</td>
                    <td>{record.name}</td>
                    <td>{record.author}</td>
                    <td>{record.price}</td>
                    <td>{record.availablity==0?"Available":"Asssigned"}</td>
                    <td>
                        <div className="d-flex">
                            <Link to={`/books/${record.id}`}>
                                <button className='btn btn-info btn-sm'>edit</button>
                            </Link>
                            &nbsp;&nbsp;
                            <button onClick={()=>{DeleteBook(record.id)}} className='btn btn-danger btn-sm'>delete</button>
                            &nbsp;&nbsp;
                            {
                                record.availablity===0
                                ?
                                <button onClick={()=>{ref.current.handleShow();setBookID(record.id)}} className='btn btn-warning btn-sm'>assign</button>
                                :
                                null
                            }
                        </div>
                    </td>
                </tr>
            ))
        :
        
        <tr>
          <td colSpan={4} className="text-center">No Books Available</td>
        </tr>
        }
        
      </tbody>
    </Table>
      </Card.Body>
    </Card>
    <ModalComp ref={ref} book_id={BookID} renderbooklist={getBooks} />
    
    </div>
   </>
  )
}



/**
 * -----------------------------------
 *         Modal Component
 * -----------------------------------
 * */ 
const ModalComp=forwardRef((props,ref)=>{

    let IsReadyToSubmit=false;                      //form submit flag
    const [show, setShow] = useState(false);        //modal visibility state
    const [Form_data, setForm_data] = useState({    //form data state
        name:{
            value:"",
            isValid:null,
            error:"",
            rules:["required"]
        }
    });

    // modal close method
    const handleClose = () => {
        setShow(false);
        setForm_data(state=>{
            const newState = {...state};
            newState.name.error="";
            newState.name.isValid=null
            return newState;
         })
    }

    // validate method to loop and check all fields are valid or not
    const validate = ()=>{
        for (const key in Form_data) {
            if (Object.hasOwnProperty.call(Form_data, key)) {
                const element = Form_data[key];
                check_rules(element.rules,element.value,key);
            }
        }
    }

    // method to check rules for a field
    const check_rules=(rules,value,name)=>{
        rules.map((rule)=>{
            let [rule_string,argument]=rule.split(":");
            switch (rule_string) {
                case "required":
                     let result=Required(value);
                     result===true?IsReadyToSubmit=true:IsReadyToSubmit=false;
                     setForm_data(state=>{
                        const newState = {...state};
                        result==false?newState[`${name}`].isValid=false:newState[`${name}`].isValid=true;
                        result==false?newState[`${name}`].error=`${name} is Mandatory`:newState[`${name}`].error="";
                        return newState;
                     })
                    break;
            
                default:
                    break;
            }
        })
    }
    
    // this handle  is used to invoke a child component method from a parent 
    useImperativeHandle(ref,()=>({
        handleShow(){
            setShow(true);
        }
    }))

    // form submit method
    const onFormSubmit=async ()=>{
        validate();

        if (IsReadyToSubmit===true) {
            let form_data=new FormData();
            form_data.append('name',Form_data.name.value);
            form_data.append('book_id',props.book_id);
            let result = await POST('/manager/assign-book',form_data);
            if (result.status==200) {
                props.renderbooklist();
                handleClose();
            }else{
                if (typeof result.response.data.message==="object") {
                    for (const key in result.data.message) {
                        if (Object.hasOwnProperty.call(Form_data, key)) {
                            const element = Form_data[key];
                            setForm_data(state=>{
                                const newState = {...state};
                                newState[`${key}`].isValid=false;
                                newState[`${key}`].error=`${key} is Mandatory`;
                                return newState;
                             })
                        }
                    }
                }else{
                    
                    setForm_data(state=>{
                        const newState = {...state};
                        newState[`name`].isValid=false;
                        newState[`name`].error=`${result.response.data.message}`;
                        return newState;
                     })
                }
            }
        }
        

    }

    // sets value in form field state
    const setvalue=(name,value)=>{
        setForm_data((state)=>{
            const newState={...state};
            newState[`${name}`].value=value;
            return newState;
        })
    }

    return (
        <>
   
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Assign To User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>   
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className='font-weight-bold'>Name</Form.Label>
                    <Form.Control type="text" name='name' onInput={(e)=>{setvalue(e.target.name,e.target.value)}} placeholder="Enter User Name.." />
                        {Form_data.name.error!=""?
                            <Form.Text className="text-danger">
                                {Form_data.name.error}
                            </Form.Text>
                        :
                        null
                        }
                        
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{onFormSubmit()}}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    );
});

