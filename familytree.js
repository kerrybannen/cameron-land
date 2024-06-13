  // JavaScript to handle bullet point collapse toggling
  $(document).ready(function(){
    $("ul.list-group li a").click(function(){
      $(this).next(".collapse").collapse('toggle');
    });
  });