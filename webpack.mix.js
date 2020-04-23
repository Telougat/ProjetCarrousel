let mix = require('laravel-mix');

mix.js('resources/files.js', 'public/js/')
    .js('resources/carrousel.js', 'public/js');