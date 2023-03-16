<?php

namespace App\Http\Controllers;

use App\Services\Library_Service;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class Library extends Controller
{
    private $response;
    private $library_service;
    public function __construct()
    {
        $this->library_service=new Library_Service();
    }

    public function assign_book(Request $req)
    {
        try {
            $validator=Validator::make($req->all(),[
                'name'=>["required","max:100"]
            ],[
                "name.required"=>"User name is Mandatory",
                "name:max"=>"User name must be maximum 100 Characters"
            ]);
            if ($validator->fails()) {
                $body=[
                    "error"=>"",
                    "message"=>$validator->errors()
                ];
                $this->response=JsonResponse("error",$body);
            } else {
                $check_any_user_has_book=$this->library_service->getuserbybook($req->input('book_id'));
                if ($check_any_user_has_book['status']===true) {
                    $assign=$this->library_service->assign_book($req);
                    if ($assign===true) {
                        $body=[
                            "error"=>"",
                            "message"=>"book assigned successfully"
                        ];
                        $this->response=JsonResponse("success",$body);
                    } else {
                        $body=[
                            "error"=>"failed to assign book",
                            "message"=>"failed to assign book"
                        ];
                        $this->response=JsonResponse("error",$body);
                    }
                }else{
                    $body=[
                        "error"=>"failed to assign book",
                        "message"=>$check_any_user_has_book['message']
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

    public function books_assigned_to_users()
    {
        $result=$this->library_service->getAll();
        $body=[
            "error"=>"",
            "message"=>"book assigned successfully",
            "serverData"=>$result
        ];
        return $this->response=JsonResponse("success",$body);
    }

    public function unassign_book($id)
    {
        $unassign=$this->library_service->unassign_book($id);
        if ($unassign) {
            $body=[
                "error"=>"",
                "message"=>"book un-assigned successfully"
            ];
            $this->response=JsonResponse("success",$body);
        } else {
            $body=[
                "error"=>"failed to assign book",
                "message"=>"failed to assign book"
            ];
            $this->response=JsonResponse("error",$body);
        }
        return $this->response;
    }
}
