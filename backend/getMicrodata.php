<?php
require __DIR__ . '/../vendor/autoload.php';

$parsers =  \Jkphl\Micrometa\Parser\Microformats2::PARSE |  // Microformats = 1
\Jkphl\Micrometa\Parser\Microdata::PARSE |      // Microdata = 2
\Jkphl\Micrometa\Parser\JsonLD::PARSE;          // JSON-LD = 4

$url = $argv[1];

exec("./src/phantomjs ./src/getSource.js ".$url,$output);

echo \Jkphl\Micrometa::instance($url, implode("", $output))->toJSON();
