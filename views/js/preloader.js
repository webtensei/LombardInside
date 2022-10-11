$(window).on("load", function () {
  //for use in production please remove this setTimeOut
  setTimeout(function () {
    $(".preloader").addClass("preloader-deactivate");
  }, 1000);
  //uncomment this line for use this snippet in production
  // $(".preloader").addClass("preloader-deactivate");
});
