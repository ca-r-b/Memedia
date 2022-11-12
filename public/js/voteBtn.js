// !!!!! THIS IS UNFINISHED AND INITIAL !!!!!

$("#upVote").click(function(){
    var temp = $("#post-upv-count").text();
    $("#post-upv-count").text(parseInt(temp) + 1);
    $("#post-upv").addClass("bi bi-caret-up-fill").removeClass("bi bi-caret-up");
});
$("#downVote").click(function(){
    var temp = $("#post-dv-count").text();
    $("#post-dv-count").text(parseInt(temp) - 1);
});