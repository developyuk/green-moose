<?php
require __DIR__ . '/../vendor/autoload.php';
require_once('mercury.php');
require_once('related.php');
// $url = $argv[1];
$url = $_GET['url'];

$mercuryParser = new \Mercury\Parser;
$mercuryParser->apiKey = 'API_KEY';
$mercuryParser->url = $url;
$parserData = $mercuryParser->parse();

$htmlString = '';

function getHtmlString($url){
    exec("../phantomjs --load-images=false ./getSource.js ".$url, $output);
    return implode(" ", $output);
}

if(strlen(strip_tags($parserData['content'])) < 20){
    $parsers =  \Jkphl\Micrometa\Parser\Microformats2::PARSE |  // Microformats = 1
    \Jkphl\Micrometa\Parser\Microdata::PARSE |      // Microdata = 2
    \Jkphl\Micrometa\Parser\JsonLD::PARSE;          // JSON-LD = 4

    $htmlString = getHtmlString($url);

    $micrometaData =  \Jkphl\Micrometa::instance($url, $htmlString, $parsers);
    $mercuryParser->url = $micrometaData->rels()['amphtml'][0];
    $parserData = $mercuryParser->parse();
}
if($htmlString == '') $htmlString = getHtmlString($url);

$relatedParser = new \GM\Related;
$relatedParser->url=$url;
$relatedParser->htmlString=$htmlString;
$relatedContent = $relatedParser->parse();
$parserData['relatedGM'] = $relatedContent;

header('Content-type: application/json');
echo json_encode($parserData);
