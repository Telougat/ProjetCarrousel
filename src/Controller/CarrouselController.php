<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Routing\Annotation\Route;

class CarrouselController extends AbstractController
{
    /**
     * @Route("/api/carrousel", name="carrousel")
     */
    public function carrousel()
    {

        if (file_exists("../storage/carrousel.json"))
        {
            $carrousel = json_decode(file_get_contents("../storage/carrousel.json"), true);
        }
        else
        {
            throw $this->createNotFoundException("Problème de lecture du fichier de carrousel");
        }

        return $this->json($carrousel);
    }
}
