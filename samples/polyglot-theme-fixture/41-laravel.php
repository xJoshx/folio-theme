<?php

Route::get('/health', fn () => response()->json([
    'service' => 'laravel',
    'healthy' => true,
]));
