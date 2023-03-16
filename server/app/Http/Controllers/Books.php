<?php

namespace App\Http\Controllers;

use App\Services\Book_Service;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class Books extends Controller
{

    private $book_service;
    private $response;
    public function __construct()
    {
        $this->book_service=new Book_Service(); # initializing book service
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $books=$this->book_service->getAll();
        $body=[
            "message"=>"request successfull",
            "serverData"=>$books
        ];
        return $this->response=JsonResponse("success",$body);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //unused
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $validator=Validator::make($request->all(),[
                "name"=>["required","max:100","unique:books"],
                "author"=>["required","max:100"],
                "price"=>["required","numeric","min:0"]
            ],[
                "name.required"=>"Name is Mandatory",
                "name:max"=>"Name must be maximum 100 Characters",
                "name.unique"=>"Book with {$request->input("name")} already exists",
                "author.required"=>"Author name is Mandatory",
                "author.max"=>"Author name must be maximum 100 Characters",
                "price.required"=>"Price is Mandatory",
                "price.numeric"=>"Price must be numeric value",
                "price.min  "=>"Price must be non negative value"
            ]);
            if ($validator->fails()) {
                $body=[
                    "error"=>"",
                    "message"=>$validator->errors()
                ];
                $this->response=JsonResponse("error",$body);
            } else {
                $isCreated=$this->book_service->create($request);
                if ($isCreated===true) {
                    $body=[
                        "error"=>"",
                        "message"=>"record created successfully"
                    ];
                    $this->response=JsonResponse("success",$body);
                } else {
                    $body=[
                        "error"=>"",
                        "message"=>"failed to create record"
                    ];
                    $this->response=JsonResponse("error",$body);
                }
                
            }
            
        } catch (Exception $e) {
            $body=[
                "error"=>$e->getMessage()." ON LINE ".$e->getLine()." File ".$e->getFile(),
                "message"=>"Oops...something went wrong"
            ];
            $this->response=JsonResponse("error",$body);
        }
        return $this->response;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $books=$this->book_service->getOne($id);
        $body=[
            "message"=>"request successfull",
            "serverData"=>$books
        ];
        return $this->response=JsonResponse("success",$body);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $validator=Validator::make($request->all(),[
                "name"=>["required","max:100",Rule::unique('books')->ignore($id)],
                "author"=>["required","max:100"],
                "price"=>["required","numeric","min:0"]
            ],[
                "name.required"=>"Name is Mandatory",
                "name:max"=>"Name must be maximum 100 Characters",
                "name.unique"=>"Book with {$request->input("name")} already exists",
                "author.required"=>"Author name is Mandatory",
                "author.max"=>"Author name must be maximum 100 Characters",
                "price.required"=>"Price is Mandatory",
                "price.numeric"=>"Price must be numeric value",
                "price.min"=>"Price must be non negative value"
            ]);
            if ($validator->fails()) {
                $body=[
                    "error"=>"",
                    "message"=>$validator->errors()
                ];
                $this->response=JsonResponse("error",$body);
            } else {
                $isUpdated=$this->book_service->update($request,$id);
                if ($isUpdated===true) {
                    $body=[
                        "error"=>"",
                        "message"=>"record updated successfully"
                    ];
                    $this->response=JsonResponse("success",$body);
                } else {
                    $body=[
                        "error"=>"",
                        "message"=>"failed to update record"
                    ];
                    $this->response=JsonResponse("error",$body);
                }
            }
            
        } catch (Exception $e) {
            $body=[
                "error"=>$e->getMessage()." ON LINE ".$e->getLine()." File ".$e->getFile(),
                "message"=>"Oops...something went wrong"
            ];
            $this->response=JsonResponse("error",$body);
        }
        return  $this->response;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->book_service->delete($id);
        $body=[
            "message"=>"request successfull",   
        ];
        return $this->response=JsonResponse("success",$body);
    }
    
}
