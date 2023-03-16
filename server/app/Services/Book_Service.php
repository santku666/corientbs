<?php
namespace App\Services;

use App\Models\Book;
use App\Models\BookManagement;

class Book_Service{

    public function __construct()
    {
        
    }

    public function getAll()
    {
        $result=Book::get();
        return [
            "data"=>$result->toArray(),
            'count'=>$result->count()
        ];
    }

    public function getOne(int $id)
    {
        $result=Book::findOrFail($id);
        return $result;
    }

    public function create($req):bool
    {
        $create=new Book();
        $create->name=sanatize($req->input('name'));
        $create->author=sanatize($req->input('author'));
        $create->price=$req->input('price');
        if ($create->save()) {
            return true;
        } else {
            return false;
        }   
    }

    public function update($req,int $id)
    {
        $update=Book::where('id',$id)->update([
            'name'=>sanatize($req->input('name')),
            'author'=>sanatize($req->input('author')),
            'price'=>$req->input('price')
        ]);
        return true;
    }

    public function delete(int $id)
    {
        $delete=Book::where('id',$id)->delete();
        $records=BookManagement::where('book_id',$id)->delete();
        return true;
    }

    public function check_book_status($book_id)
    {
        // 1 = Cannot be Assigned ; 0 = Can be Assigned
        $status=Book::where('id',$book_id)->first()?->availablity;
        $status==1?false:true;
    }

}