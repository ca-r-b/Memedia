
$("#upVote").click(function(){
    if($("#downVote").prop("disabled")){
        $("#upVote").prop("disabled", true);
        $("#downVote").prop("disabled", false);
    }
});

$("#downVote").click(function(){
    if($("#upVote").prop("disabled")){
        $("#upVote").prop("disabled", true);
        $("#upVote").prop("disabled", false);
    }
});