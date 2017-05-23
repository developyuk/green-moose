<?php

namespace GM;
use \DOMDocument;

class Related{
    public $url;
    public $htmlString;

    static function getHostnameFromUrl($url){
        return parse_url($url,PHP_URL_HOST);
    }

    static function relativeToAbsolute($rel,$base){
        /* return if already absolute URL */
        if (parse_url($rel, PHP_URL_SCHEME) != '') return $rel;

        /* queries and anchors */
        if ($rel[0]=='#' || $rel[0]=='?') return $base.$rel;

        /* parse base URL and convert to local variables:
        $scheme, $host, $path */
        extract(parse_url($base));

        /* remove non-directory element from path */
        $path = preg_replace('#/[^/]*$#', '', $path);

        /* destroy path if relative url points to root */
        if ($rel[0] == '/') $path = '';

        /* dirty absolute URL */
        $abs = "$host$path/$rel";

        /* replace '//' or '/./' or '/foo/../' with '/' */
        $re = array('#(/\.?/)#', '#/(?!\.\.)[^/]+/\.\./#');
        for($n=1; $n>0; $abs=preg_replace($re, '/', $abs, -1, $n)) {

        }

        /* absolute URL is ready! */
        return $scheme.'://'.$abs;
    }

    public function parse(){
        $doc = new DOMDocument();
        $doc->loadHTML($this->htmlString);
        $anchors = $doc->getElementsByTagName('a');
        $returnData=[];

        foreach($anchors as $v){
            foreach($v->attributes as $v2) {
                $absV2 = Related::relativeToAbsolute($v2->value,$this->url);
                if($v2->name =='href' && Related::getHostnameFromUrl($this->url) == Related::getHostnameFromUrl($absV2)) array_push($returnData,$absV2);
            }
        }
        return $returnData;
    }
}
