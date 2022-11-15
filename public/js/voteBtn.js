$("#upVote").click(function(){
    var temp1 = $("#post-upv-count").text();
    var temp2 = $("#post-dv-count").text();
    // if class is up-fill, then remove vote
    if($("#post-upv").hasClass("bi-caret-up-fill")){
        // Update view
        console.log("cool");
        $("#post-upv-count").text(parseInt(temp1) - 1);
        $("#post-upv").addClass("bi-caret-up").removeClass("bi-caret-up-fill");
    }else if($("#post-upv").hasClass("bi-caret-up")){
        // Update view
        $("#post-upv-count").text(parseInt(temp1) + 1);
        $("#post-upv").addClass("bi-caret-up-fill").removeClass("bi-caret-up");

        // Unvote if downvote is already voted
        if($("#post-dv").hasClass("bi-caret-down-fill")){
            $("#post-dv-count").text(parseInt(temp2) - 1);
            $("#post-dv").addClass("bi-caret-down").removeClass("bi-caret-down-fill");
        }
    }
    
});

$("#downVote").click(function(){
    var temp1 = $("#post-upv-count").text();
    var temp2 = $("#post-dv-count").text();

    // if class is down-fill, then remove vote
    if($("#post-dv").hasClass("bi-caret-down-fill")){
        $("#post-dv-count").text(parseInt(temp2) - 1);
        $("#post-dv").addClass("bi-caret-down").removeClass("bi-caret-down-fill");
    }else if($("#post-dv").hasClass("bi-caret-down")){
        $("#post-dv-count").text(parseInt(temp2) + 1);
        $("#post-dv").addClass("bi-caret-down-fill").removeClass("bi-caret-down");

        if($("#post-upv").hasClass("bi-caret-up-fill")){
            // Update view
            $("#post-upv-count").text(parseInt(temp1) - 1);
            $("#post-upv").addClass("bi-caret-up").removeClass("bi-caret-up-fill");
        }
    }
    
});

function noReload(){
    event.preventDefault();
}