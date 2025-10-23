

const buttons = document.querySelectorAll('.letter')

console.log(buttons)

Array.from(buttons).forEach(element => {
    element.addEventListener('click', cocktailList)
});

function cocktailList(){
    console.log('clicked')
}