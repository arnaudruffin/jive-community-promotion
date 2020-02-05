$.fn.random = function() {
    var randomIndex = Math.floor(Math.random() * this.length);  
    return jQuery(this[randomIndex]);
};

$(document).ready(function() {


    lastElement = undefined
    setInterval(() => {  

        if (lastElement){
            lastElement.click()
            lastElement = undefined
        }else{
            newElement = $('.idcard').random()
            newElement.click()
            lastElement = newElement
        }

       
    },2000);

   
});