$(document).ready(function() {

    let files = [];

    function getFiles()
    {
        $.ajax({
            url: "/api/list",
            type: "GET",
            async: true,
            data: "",
            dataType: "json",
            success : function(response){
                files = response;
                displayList();
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
            list += '<div class="font-bold text-xl flex flex-col justify-center mx-4 mb-4">' + '<img class="h-64 w-64" src="photos/' + files[x] + '" alt="' + files[x] + '">' + '<button class="mt-2 bg-blue-500 p-1 rounded-lg">Supprimer</button></div>';
        }

        $('#list').append(list);
    }

    getFiles();

});
