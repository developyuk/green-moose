<?php
require __DIR__ . '/vendor/autoload.php';

$parsers =  \Jkphl\Micrometa\Parser\Microformats2::PARSE |  // Microformats = 1
            \Jkphl\Micrometa\Parser\Microdata::PARSE |      // Microdata = 2
            \Jkphl\Micrometa\Parser\JsonLD::PARSE;          // JSON-LD = 4
$dest = $_GET["url"];

$url = "http://browser:9000/";
$htmlSourceCode = file_get_contents($url.$dest);

$micrometaObjectData = \Jkphl\Micrometa::instance($dest, $htmlSourceCode,$parsers)->toJSON();

header('Content-type: application/json');
echo $micrometaObjectData;
