<?php
namespace App\Services;

use App\Models\Book;
use App\Models\BookManagement;
use Exception;
use Illuminate\Support\Facades\DB;

class Library_Service{

    public function __construct()
    {
        
    }

    public function getAll()
    {
        $result=BookManagement::with('book')->get();
        return [
            "data"=>$result->toArray(),
            "count"=>$result->count()
        ];
    }

    public function getuserbybook($book_id)
    {
        $user=BookManagement::where('book_id',$book_id)->first();
        if ($user!=null) {
            return [
                "message"=>"user for this book exists",
                "status"=>false,
            ];
        }else{
            return [
                "message"=>"",
                "status"=>true,
            ];
        }
    }

    public function assign_book($req){
        try {
            DB::beginTransaction();
            $assign=new BookManagement();
            $assign->user_name=sanatize($req->input('name'));
            $assign->book_id=$req->input('book_id');
            if ($assign->save()) {
                $book=Book::where('id',$req->input('book_id'))->update([
                    'availablity'=>1
                ]);
                DB::commit();
                return true;
            }else{
                DB::rollBack();
                return false;
            }
        } catch (Exception $e) {
            DB::rollBack();
            return false;
        }
    }

    public function unassign_book($id)
    {
        try {
            DB::beginTransaction();
            $book_id=BookManagement::where('id',$id)->first()?->book_id;
            $unassignbook=Book::where('id',$book_id)->update([
                'availablity'=>0
            ]);
            $delete=BookManagement::where('id',$id)->delete();
            if ($unassignbook) {
                DB::commit();
                return true;
            }else {
                DB::rollBack();
                return false;
            }
        } catch (Exception $e) {
            DB::rollBack();
            return false;
        }
    }
}