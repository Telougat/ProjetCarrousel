const $ = require('jquery');
const KenBurns = require('kenburns');
import { gsap } from 'gsap';
import rectCrop from "rect-crop";


let carrouselDiv = document.getElementById('carrousel'); //Select carrousel's main div

let carrouselTimeline = gsap.timeline({onComplete:function() {
        this.restart()} //Loop into the timeline
}); //Define carrousel's timeline

// Ajax function : get JSON data for built the carrousel
$('document').ready(function(){

    carrouselTimeline.pause(); //Stop the timeline

    let tl = gsap.timeline(); //Start other timeline animations (header, etc...)
    tl.from(".header", {duration :2, opacity: 0, scale: 0.3,  ease:"elastic"});
    tl.from(".loginButton", {duration :1, x: -1500, opacity: 0, scale: 0.3,  ease:"expo"}, "-=1");



    function addImageToCarrousel(id, imagePath, data) //Function to create new div+image into the carrousel
    {
        let newCanva = document.createElement('div');
        newCanva.id = "kenDiv"+id;
        newCanva.classList.add("overflow-hidden", "absolute");
        newCanva.style.height = "600px";
        newCanva.style.width = "800px";

        let newImage = document.createElement("img");

        carrouselDiv.appendChild(newCanva);
        newCanva.appendChild(newImage);

        newImage.src = "photos/" + imagePath;
        newImage.id = "kenImage"+id;
        newImage.style.position = "absolute";
        newCanva.classList.add("hidden");
    }

    function launchKenEffect(id, firstZoom, firstX, firstY, secondZoom, secondX, secondY, duration, originWidth, originHeight) //Function to launch instant the ken burns effect
    {
        let canva = document.getElementById('kenDiv'+id);
        let image = document.getElementById('kenImage'+id);

        if (!image.complete) {
            return false;
        }

        let kenburn = new KenBurns.DOM(canva);

        kenburn.animate(
            image,
            rectCrop(firstZoom, [firstX, firstY]),
            rectCrop(secondZoom, [secondX, secondY]),
            (parseInt(duration)*1000)
        );
    }

    function addImageToTimeline(id, data) // Add image to a timeline
    {
        let image = document.getElementById('kenImage'+id);

        image.onload = function()
        {
            carrouselTimeline.add(function(){ $('#kenDiv'+id).removeClass('hidden') }, ">0.1");
            carrouselTimeline.from("#kenDiv" + id, {duration :1.2, x: 2000, ease: "back"}, (">"));
            carrouselTimeline.call(launchKenEffect, [id, data.firstZoom, data.firstX, data.firstY, data.secondZoom, data.secondX, data.secondY, data.duration, document.getElementById('kenImage'+id).naturalWidth, document.getElementById('kenImage'+id).naturalHeight], "<");
            carrouselTimeline.to("#kenDiv" + id, {duration :1.2, x: -2000, ease: "back.in(1.7)"}, (">" + (data.duration-0.2)));
            carrouselTimeline.add(function(){ $('#kenDiv'+id).addClass('hidden') });
        }
    }

    function carrousel(){
        $.ajax({
            url: "/api/carrousel",
            type: "GET",
            async: true,
            data: "",
            dataType: "json",
            success : function(response, status){
                if(typeof response != "undefined"){

                    let data = response;

                    for(let x=0; x < data.length; x++)
                    {
                        addImageToCarrousel(x, data[x].name, data[x]);
                        addImageToTimeline(x, data[x]);
                    }

                    carrouselTimeline.resume(); //Start the carrousel timeline
                }
            },
            error: function(response, status){
                console.log(response);
                console.log(status);
            }
        });
    }
    carrousel();
});
