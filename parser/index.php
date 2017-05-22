<?php
require __DIR__ . '/../vendor/autoload.php';
require_once('mercury.php');
// $url = $argv[1];
$url = $_GET['url'];

$mercuryParser = new \Mercury\Parser;
$mercuryParser->dest = $url;
$parserData = $mercuryParser->parse();

if(strlen(strip_tags($parserData['content'])) < 20){
    $parsers =  \Jkphl\Micrometa\Parser\Microformats2::PARSE |  // Microformats = 1
    \Jkphl\Micrometa\Parser\Microdata::PARSE |      // Microdata = 2
    \Jkphl\Micrometa\Parser\JsonLD::PARSE;          // JSON-LD = 4

    exec("../phantomjs --load-images=false ./getSource.js ".$url, $output);

    $micrometaData =  \Jkphl\Micrometa::instance($url, implode("", $output), $parsers);
    $mercuryParser->dest = $micrometaData->rels()['amphtml'][0];
    $parserData = $mercuryParser->parse();
}

header('Content-type: application/json');
echo json_encode($parserData);
