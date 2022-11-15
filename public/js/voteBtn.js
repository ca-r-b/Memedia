// !!!!! THIS IS UNFINISHED AND INITIAL !!!!!

$("#upVote").click(function(){
    var temp = $("#post-upv-count").text();
    // if class is up-fill, then remove vote
    if($("#post-upv").hasClass("bi-caret-up-fill")){
        $("#post-upv-count").text(parseInt(temp) - 1);
        $("#post-upv").addClass("bi-caret-up").removeClass("bi-caret-up-fill");
    }else if($("#post-upv").hasClass("bi-caret-up")){
        $("#post-upv-count").text(parseInt(temp) + 1);
        $("#post-upv").addClass("bi-caret-up-fill").removeClass("bi-caret-up");
    }
    
});

$("#downVote").click(function(){
    var temp = $("#post-dv-count").text();
    // if class is down-fill, then remove vote
    if($("#post-dv").hasClass("bi-caret-down-fill")){
        $("#post-dv-count").text(parseInt(temp) - 1);
        $("#post-dv").addClass("bi-caret-down").removeClass("bi-caret-down-fill");
    }else if($("#post-dv").hasClass("bi-caret-down")){
        $("#post-dv-count").text(parseInt(temp) + 1);
        $("#post-dv").addClass("bi-caret-down-fill").removeClass("bi-caret-down");
    }
    
});

function noReload(){
    event.preventDefault();
}