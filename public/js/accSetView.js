const srcInput = document.querySelector("#accSet-img-input");
var srcUploaded = "";

if (srcInput){
    srcInput.addEventListener("change", function(){
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            srcUploaded = reader.result;
            document.querySelector("#accSet-img").style.backgroundImage=`url(${srcUploaded})`;
        });
        reader.readAsDataURL(this.files[0]);
    })
}