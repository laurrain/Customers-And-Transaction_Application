$(document).ready(function(){
		$("#customersSearchBar").keyup(function(){
			var searchValue = $("#customersSearchBar").val();
			if(searchValue == ""){
				searchValue = "all";
			}

			$.get("/customer/search/" + searchValue, function(results){
				$("#customerList" ).html(results);
				//async: true
			});
		});

});

