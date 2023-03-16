import React,{useState,useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link,useNavigate } from "react-router-dom";
import { Required } from '../../utilities/validator';
import { POST } from "../../utilities/apiHelper";

function Add(props) {

    let IsReadyToSubmit=false;       // form flag
    const navigate = useNavigate(); //initializing use navigate for redirect

    // state for storing input data
    const [Form_data, setForm_data] = useState({
        name:{
            value:"",
            isValid:null,
            error:"",
            rules:["required"]
        },
        author:{
            value:"",
            isValid:null,
            error:"",
            rules:["required"]
        },
        price:{
            value:"",
            isValid:null,
            error:"",
            rules:["required"]
        }
    });

    
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
                     console.log(Form_data);
                    break;
            
                default:
                    break;
            }
        })
    }

    // form submit method
    const onFormSubmit=async ()=>{
        validate();
        if (IsReadyToSubmit===true) {
            let form_data=new FormData();
            form_data.append('name',Form_data.name.value);
            form_data.append('author',Form_data.author.value);
            form_data.append('price',Form_data.price.value);
            let result = await POST('/books',form_data);
            console.log(result);
            if (result.status==200) {
                navigate('/books');
            }else{
                if (typeof result.response.data.message==="object") {
                    for (const key in result.response.data.message) {
                        if (Object.hasOwnProperty.call(result.response.data.message, key)) {
                            const element = result.response.data.message[key];
                            setForm_data(state=>{
                                const newState = {...state};
                                newState[`${key}`].isValid=false;
                                newState[`${key}`].error=`${element}`;
                                return newState;
                             })
                        }
                    }
                }else{
    
                }
            }
        }
        

    }


    useEffect(() => {
    }, [])

    return (
        <>
            <div className="container mt-5">
        
                <Card style={{ width: 'auto' }}>
                    <Card.Header>
                        <div className="row">
                            <div className="col-md-6">
                                <Card.Title className='mt-2'>Create New Book</Card.Title>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex justify-content-end">
                                    <Link to={'/books'}>
                                        <button className='btn btn-primary'>Back</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Form>   
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className='font-weight-bold'>Name</Form.Label>
                                <Form.Control type="text" name='name' onInput={(e)=>{Form_data.name.value=e.target.value}} placeholder="Enter Book Name.." />
                                    {Form_data.name.error!=""?
                                        <Form.Text className="text-danger">
                                            {Form_data.name.error}
                                        </Form.Text>
                                    :
                                    null
                                    }
                                    
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className='font-weight-bold'>Author</Form.Label>
                                <Form.Control type="text" name='author' onInput={(e)=>{Form_data.author.value=e.target.value}} placeholder="Enter Author Name.."  />
                                    {Form_data.author.error!=""?
                                            <Form.Text className="text-danger">
                                                {Form_data.author.error}
                                            </Form.Text>
                                        :
                                        null
                                    }
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className='font-weight-bold'>Price</Form.Label>
                                <Form.Control type="number" name='price' onInput={(e)=>{Form_data.price.value=e.target.value}} step={0.01} placeholder="Enter Price.."  />
                                    {Form_data.price.error!=""?
                                                <Form.Text className="text-danger">
                                                    {Form_data.price.error}
                                                </Form.Text>
                                            :
                                            null
                                    }
                            </Form.Group>
                            <Button variant="primary" onClick={()=>{onFormSubmit()}}>
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>                    
        </>
    );
}

export default Add;