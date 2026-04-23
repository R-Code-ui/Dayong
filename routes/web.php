<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ContributionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\ReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public welcome page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ========== DASHBOARD (using controller with stats) ==========
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ========== ADMIN ROUTES (protected by role:admin) ==========
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Members
    Route::resource('members', MemberController::class);
    // Events
    Route::resource('events', EventController::class);
    // Contributions
    Route::get('contributions', [ContributionController::class, 'index'])->name('contributions.index');
    Route::patch('contributions/{contribution}', [ContributionController::class, 'update'])->name('contributions.update');
    Route::post('contributions/bulk', [ContributionController::class, 'bulkUpdate'])->name('contributions.bulk');
    // Dashboard (admin specific – same controller but different route name)
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Exports & Reports
    Route::get('export/csv', [ExportController::class, 'csv'])->name('export.csv');
    Route::get('report/pdf', [ReportController::class, 'pdf'])->name('report.pdf');
});

// ========== MEMBER-ONLY ROUTES ==========
Route::middleware(['auth', 'role:member'])->group(function () {
    Route::get('/my-contributions', [ContributionController::class, 'myContributions'])->name('my.contributions');
});

require __DIR__.'/auth.php';
