const $ = require("jquery");
const Cropper = require("cropperjs");

let files = [];
let i = 0;
let object = {};
let infos = [];

let finalJson = [];

function getCropper(img, key, path) //Return crooper object
{
    return new Cropper(img, {
        viewMode: 3,
        zoomable: false,
        center: false,
        guides: false,
        movable: false,
        toggleDragModeOnDblclick: false,
        crop(event) {
            infos[key] = {"path" : path,"x" : event.detail.x, "y" : event.detail.y, "width": event.detail.width, "height": event.detail.height, "originWidth": img.naturalWidth, "originHeight": img.naturalHeight};
        },
    })
}

function calculateZoom(width, height, zoomWidth, zoomHeight)
{
   /* let origineAera = width * height;
    let finalAera = zoomWidth * zoomHeight;*/

    return zoomWidth/width;
}

function calculateDistanceWithTheCenterInPercentage(distance, halfInsideDistance, origin)
{
    return (distance + halfInsideDistance) / origin;
}

function toJson()
{
    let combine = [];
    let y = 0;

    while(infos && infos.length)
    {
        let first = infos.shift();
        let second = infos.shift();
        let duration = parseInt($("#duration" + y).val());

        let firstZoom = calculateZoom(first.originWidth, first.originHeight, first.width, first.height);
        let secondZoom = calculateZoom(second.originWidth, second.originHeight, second.width, second.height);

        let firstW = calculateDistanceWithTheCenterInPercentage(first.x, (first.width / 2), first.originWidth);
        let firstH = calculateDistanceWithTheCenterInPercentage(first.y, (first.height / 2), first.originHeight);

        let secondW = calculateDistanceWithTheCenterInPercentage(second.x, (second.width / 2), second.originWidth);
        let secondH = calculateDistanceWithTheCenterInPercentage(second.y, (second.height / 2), second.originHeight);

        combine.push({"name": first.path, "firstX": firstW, "firstY": firstH, "secondX": secondW, "secondY": secondH, "firstWidth": first.width, "firstHeight": first.height, "secondWidth": second.width, "secondHeight": second.height, "duration": duration, "firstZoom": firstZoom, "secondZoom": secondZoom});
        y+=2;
    }

    let dataString = JSON.stringify(combine);
    
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/api/generate",
        data: dataString,
        contentType: "application/json; charset=utf-8",
        success: function(data){
            alert('Votre image '+ combine[0].name+ ' a été ajoutée au diaporama');
        },
        error: function(e){
            console.log(e.message);
        }
    });
}

$(document).ready(function() {

    function imageToolsAnimations()
    {
        $("img").mouseenter(function ()
        {
            $(this).next().removeClass('hidden');
        });

        $(".imgTools").mouseleave(function ()
        {
            $(this).addClass('hidden');
        });
    }

    function makeSlideDeletable() {


        $(".deleteSlide").unbind('click');

        $('.deleteSlide').click(function () {

            event.stopPropagation();

            console.log('Passage !');

            console.log(infos);


            let key = parseInt($(this).data('begin'));
            $('#Slide' + $(this).data('begin')).remove();

            console.log("Key = " + key);

            console.log(infos.splice(key, 2));


            console.log('final');
            console.log(infos);
        });

    }

    function getFiles() //Get the file list with call API
    {
        $.ajax({
            url: "/api/list",
            type: "GET",
            async: true,
            data: "",
            dataType: "json",
            success : function(response){
                files = response;
                displayList(); //Call function to display the file list


                $(".deleteButton").click( "click", function () { //When the user click on remove button

                    $.post("/api/deletefile", //Post via ajax API call to delete a file
                        { filename: $(this).data('link') } )
                        .done(function()
                        {
                            getFiles(); //Refresh file list
                        })
                        .error(function () {
                            console.log('Erreur');
                        });
                });

                $(".selectButton").click("click", function () {

                    let already = false; //Necessary to notify if the image is in the slideshow

                    for (let x = 0; x < infos.length; x++) //Check if the image is already in the slideshow
                    {
                        if (infos[x].path === $(this).data('link'))
                        {
                            already = true;
                            break;
                        }
                    }

                    if (already === true) //Dont push image into the slideshow because he is already present
                        return false; //TODO Notify user with a front message.


                    $('#effectFrame').append(

                    '<div id="Slide' + i + '" class="flex justify-center w-full my-24">' +

                        '<div class="lg:w-3/4 xl:w-1/2 mx-2 md:mx-0 p-8 border-2 rounded-lg">' +

                        '<div class="md:flex">' +

                        '<div class="md:w-3/4 lg:w-1/2">' +
                            '<img id="' + i + '" class="w-full" src="photos/' + $(this).data('link') + '">' +
                        '</div>' +

                        '<div class="md:w-3/4 lg:w-1/2 mt-2 md:mt-0 md:ml-2">' +
                            '<img id="' + (i+1) + '" class="w-full" src="photos/' + $(this).data('link') + '">' +
                            
                        '</div>' +

                        '</div>' +

                        '<div class="mt-6 flex justify-center">' +

                        '<div class="text-center">' +
                            '<label>Durée d\'affichage (Secondes)</label><br>' +
                            '<input id="duration' + i + '" type="number" value="2" class="text-right mt-2 border-2 px-1 border-black"><br>' +
                            //'<button data-begin="' + i + '" class="deleteSlide bg-black text-white font-bold p-2 mt-8 rounded-lg">Supprimer cette slide</button>' +
                    '</div>' +
                            
                    '</div>' +

                    '</div>' +
                    
                    '</div>'
                    
                    );


                    let first = document.getElementById(i);
                    let second = document.getElementById(i+1);

                    [].push.call(object, getCropper(first, i, $(this).data('link')));
                    [].push.call(object, getCropper(second, i+1, $(this).data('link')));

                    makeSlideDeletable();

                    i = i+2;
                });


            },
            error: function(response){
                console.log('Erreur');
            }
        });
    }

    function displayList()
    {
        let list = "";

        for (let x = 2; x < (Object.keys(files).length + 2); x++)
        {
            //list += '<div class="h-64 w-64 font-bold text-xl flex flex-col justify-center mx-4 mb-4 text-white">' + '<img class="h-full w-full" src="photos/' + files[x] + '" alt="' + files[x] + '">' + '<button data-link="' + files[x] + '" class="selectButton mt-2 bg-blue-500 p-1 rounded-lg">Selectionner</button><button data-link="' + files[x] + '" class="deleteButton mt-2 bg-blue-500 p-1 rounded-lg">Supprimer</button></div>';
            //list += '<div style="max-height: 600px;" class="w-1/4 overflow-hidden">' + '<img class="w-full" src="photos/' + files[x] + '" alt="' + files[x] + '"></div>';

            list += '<div style="max-height: 400px;" class="w-1/4 overflow-hidden relative">' +

                        '<img class="object-contains" src="photos/' + files[x] + '">' +

                        '<div class="imgTools hidden absolute top-0 w-full h-full flex flex-col justify-center items-center">' +

                            '<button data-link="' + files[x] + '" class="selectButton cursor-pointer text-white font-bold text-2xl bg-red-500 p-2 rounded-lg">Sélectionner</button>' +

                            '<button data-link="' + files[x] + '" class="deleteButton mt-4 cursor-pointer text-white font-bold text-2xl bg-red-500 p-2 rounded-lg">Supprimer</button>' +

                        '</div>' +

                    '</div>'
        }

        $('#list').html(list);

        imageToolsAnimations();
    }

    getFiles();

    $('#jsonB').click(function () {
        toJson();
    });
});

