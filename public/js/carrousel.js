// Ajax function : get JSON data for built the carrousel
$('document').ready(function(){
    function carrousel(){
        $.ajax({
            url: "/api/carrousel",
            type: "GET",
            async: true,
            data: "",
            dataType: "json",
            success : function(response, status){
                if(typeof response != "undefined"){
                    
                    var data = response;
                    var html = "";
                    console.log(data);
                    
                    for(let x=0; x < data.length; x++)
                        {   
                            html =
                            '<input class="carousel-open" type="radio" id="carousel-1" name="carousel" aria-hidden="true" hidden="" checked="checked">'+
                            '<div class="carousel-item absolute opacity-0" style="height:50vh;">'+
                            '<div class="block h-full w-full bg-indigo-500 text-white text-5xl text-center">' + data[x].name +'</div></div>'+
                            '<label for="carousel-3" class="prev control-1 w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-blue-700 leading-tight text-center z-10 inset-y-0 left-0 my-auto">‹</label>'+
                            '<label for="carousel-2" class="next control-1 w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-blue-700 leading-tight text-center z-10 inset-y-0 right-0 my-auto">›</label>';
                        }
                                    $('#myCarrousel').append(html);
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
