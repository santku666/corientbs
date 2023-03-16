<?php

use App\Http\Controllers\Books;
use App\Http\Controllers\Library;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::resource("books",Books::class);
Route::prefix('manager')->controller(Library::class)->group(function(){
    Route::post('/assign-book','assign_book');
    Route::get('/users-with-books','books_assigned_to_users');
    Route::delete('/unassign-book/{id}','unassign_book');
});
