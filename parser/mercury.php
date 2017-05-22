<?php

namespace Mercury;

class Parser{
    public $dest;
    private $apiKey='API_KEY';
    private $ch;

    public function __construct() {
        $this->ch = curl_init();
    }

    private function getParserUrl(){
        return 'https://mercury.postlight.com/parser?url='.$this->dest;
    }

    static function getUserAgent(){
        $array = [
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/600.5.17 (KHTML, like Gecko) Version/8.0.5 Safari/600.5.17',
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0',
        ];

        $k = array_rand($array);
        return $array[$k];
    }

    private function getHeaders(){
        return [
            'x-api-key: '.$this->apiKey,
            'Content-Type: application/json; charset=utf-8',
            // 'Host: www.example.com',
            // 'Referer: http://www.example.com/index.php', //Your referrer address
            'User-Agent: '.Parser::getUserAgent()
        ];
    }

    public function parse(){
        curl_setopt($this->ch, CURLOPT_URL,$this->getParserUrl());
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($this->ch, CURLOPT_HTTPHEADER, $this->getHeaders());

        $output = curl_exec($this->ch);

        return json_decode($output, true);
    }

    public function __destruct(){
        curl_close ($this->ch);
    }
}
