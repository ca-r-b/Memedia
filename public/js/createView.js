const srcInput = document.querySelector("#create-post-input-content");
var srcUploaded = "";

if (srcInput){
    srcInput.addEventListener("change", function(){
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            srcUploaded = reader.result;
            document.querySelector("#create-post-content").style.backgroundImage=`url(${srcUploaded})`;
        });
        reader.readAsDataURL(this.files[0]);
    })
}