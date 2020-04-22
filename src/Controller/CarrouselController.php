<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class CarrouselController extends AbstractController
{
    /**
     * @Route("/api/carrousel", name="carrousel")
     */
    public function carrousel()
    {
        $carrousel = 
        array(
            array(
                "name" => "photo/png",
                "duration" => "100sec",
                "zoom"=> "",
                "firstX"=>"",
                "firstY"=>"",
                "secondX"=>"",
                "secondY"=>"",
                "path" => "",
                "limit"=>""    
            ),
        );
        
        return $this->json($carrousel);
    }
}
