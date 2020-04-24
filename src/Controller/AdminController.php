<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{

    private $session;

    public function __construct(SessionInterface $session)
    {
        $this->session = $session;
    }

    /**
     * @Route("/admin", name="admin")
     */
    public function index()
    {
        if (!$this->session->get('login'))
        {
            return $this->redirectToRoute('loginget');
        }

        return $this->render('admin/index.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }

    /**
     * @Route("/login", name="loginget", methods={"GET"})
     * @param Request $request
     * @return Response
     */
    public function loginget(Request $request)
    {
        if ($this->session->get('login'))
        {
            return $this->redirectToRoute('admin');
        }

        return $this->render('login/login.html.twig');
    }

    /**
     * @Route("/logout", name="logout", methods={"GET"})
     * @return Response
     */
    public function logout()
    {
        $this->session->set('login', false);
        return $this->redirectToRoute('loginget');
    }

    /**
     * @Route("/login", name="loginpost", methods={"POST"})
     * @param Request $request
     * @return Response
     */
    public function loginpost(Request $request)
    {   
        $login = $request->request->get('login');
        $password = $request->request->get('password');

        
        if($login == "admin" && $password == "admin")
        {
            $this->session->set('login', true);
            return $this->redirectToRoute('admin');
        }
        else
        {
            return $this->redirectToRoute('loginget');
        }
        
        //return $this->render('login/login.html.twig');
    }


    /**
     * @Route("/api/list", name="apiFilesList")
     */
    public function filesList()
    {

        if (!$this->session->get('login'))
        {
            throw $this->createNotFoundException('Permission denied');
        }

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
        if (!$this->session->get('login'))
        {
            throw $this->createNotFoundException('Permission denied');
        }

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
        if (!$this->session->get('login'))
        {
            throw $this->createNotFoundException('Permission denied');
        }

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
        if (!$this->session->get('login'))
        {
            throw $this->createNotFoundException('Permission denied');
        }

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
