const $ = require('jquery');
const KenBurns = require('kenburns');
import { gsap } from 'gsap';
import rectCrop from "rect-crop";

let carrouselTimeline = gsap.timeline({onComplete:function() {
        this.restart()} //Loop into the timeline
}); //Define carrousel's timeline

let carrouselDiv = document.getElementById('carrousel'); //Select carrousel's main div

// Ajax function : get JSON data for built the carrousel
$('document').ready(function(){

    carrouselTimeline.pause(); //Stop the timeline

    let tl = gsap.timeline(); //Start other timeline animtions (header, etc...)
    tl.from(".header", {duration :2, opacity: 0, scale: 0.3,  ease:"elastic"});


    function addImageToCarrousel(id, imagePath) //Function to create new div+image into the carrousel
    {
        let newCanva = document.createElement('div');
        newCanva.id = "kenDiv"+id;
        newCanva.classList.add("overflow-hidden", "absolute", "hidden");
        newCanva.style.height = "600px";
        newCanva.style.width = "800px";

        let newImage = document.createElement("img");
        newImage.src = "photos/" + imagePath;
        newImage.id = "kenImage"+id;

        carrouselDiv.appendChild(newCanva);
        newCanva.appendChild(newImage);
    }

    function launchKenEffect(id, firstZoom, firstX, firstY, secondZoom, secondX, secondY, duration, originWidth, originHeight) //Function to launch instant the ken burns effect
    {
        let canva = document.getElementById('kenDiv'+id);
        let image = document.getElementById('kenImage'+id);

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
        carrouselTimeline.add(function(){ $('#kenDiv'+id).removeClass('hidden') } );
        carrouselTimeline.from("#kenDiv" + id, {duration :1.2, x:2000, scale: 1, ease: "back"}, (">"));
        carrouselTimeline.call(launchKenEffect, [id, data.firstZoom, data.firstX, data.firstY, data.secondZoom, data.secondX, data.secondY, data.duration, document.getElementById('kenImage'+id).naturalWidth, document.getElementById('kenImage'+id).naturalHeight]);
        carrouselTimeline.to("#kenDiv" + id, {duration :1.2, x:-2000, scale: 1, ease: "back.in(1.7)"}, (">" + (data.duration-0.2)));
        carrouselTimeline.add(function(){ $('#kenDiv'+id).addClass('hidden') } );
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
                        console.log('test');
                        addImageToCarrousel(x, data[x].name);
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
