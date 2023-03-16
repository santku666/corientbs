<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookManagement extends Model
{
    use HasFactory,SoftDeletes;
    protected $table="book_management";
    protected $fillable=[
        "user_name","book_id"
    ];

    public function book()
    {
        return $this->belongsTo(Book::class,'book_id','id');
    }
}
