<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    /**
     * @Route("/admin", name="admin")
     */
    public function index()
    {
        return $this->render('admin/index.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }


    /**
     * @Route("/api/list", name="apiFilesList")
     */
    public function filesList()
    {
        $list = scandir('photos/');
        unset($list[0]);
        unset($list[1]);

        return $this->json($list);
    }

    /**
     * @route("/api/generate", name="generate", methods={"POST"})
     * @param Request $request
     * @return Response
     */
    public function generateJson(Request $request)
    {
        $filesystem = new Filesystem();
        $jsonArray = array();

        $jsonArray = $request->getContent();

        try {
            $filesystem->dumpFile('../storage/carrousel.json', $jsonArray);
        }
        catch(\Exception $e)
        {
            throw $this->createNotFoundException("Erreur lors de l'enregistrement des données");
        }


        return $this->json("écriture des données OK");
    }

    /**
     * @Route("/api/deletefile", name="deleteFile", methods={"POST"})
     * @param Request $request
     * @return Response
     */
    public function deleteFile(Request $request)
    {
        $filesystem = new Filesystem();
        $filename = $request->get('filename');

        if(file_exists('photos/' . $filename))
        {
            $filesystem->remove('photos/' . $filename);
        }
        else
        {
            throw $this->createNotFoundException("Fichier non trouvé !");
        }

        $response = new Response();
        $response->setStatusCode(Response::HTTP_OK);
        return $response->send();
    }


    /**
     * @Route("/upload", name="upload", methods={"POST"})
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function upload(Request $request)
    {
        $allowedExtensions = ['gif', 'jpeg', 'jpg', 'png'];

        $files = $request->files->get('files');

        if (empty($files))
        {
            throw $this->createNotFoundException("Vous n'avez pas séléctionnez de fichiers ...");
        }


        foreach ($files as $file)
        {
            $originalName = str_replace(' ', '', $file->getClientOriginalName());
            $originalName = str_replace('\'', '', $originalName);

            if ($file->isValid() && in_array($file->getClientOriginalExtension(), $allowedExtensions))
            {
                if (!file_exists('photos/' . $originalName))
                {
                    $file->move('photos', $originalName);
                }
                else
                {
                    throw $this->createNotFoundException("Un fichier possède déjà le meme nom !");
                }
            }
            else
            {
                throw $this->createNotFoundException("Fichier non valide");
            }
        }

        return $this->redirectToRoute('admin'); //TODO: Find best way to advert user when upload is successful.
    }
}
