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
    
                console.log(response);
                var data = response;
                var html = "";
                console.log(data);
                
                for(let x=0; x < data.length; x++)
                    {   
                        html = 
                         
                        html +=  + data[x].name + '  '  + data[x].duration + '<br>';
                    }
                    
                $('#myCarrousel').append(html);

            },
            error: function(response, status){
                console.log(response);
                console.log(status);
            }
        });
    }
    carrousel();
});
