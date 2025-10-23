

const buttons = document.querySelectorAll('.letter')


Array.from(buttons).forEach(button => {
    button.addEventListener('click', () => {
        cocktailList(button.value)

    })
});

//////////FETCH
let isFetchedCalled = false;
let inputArray = [];

function cocktailList(letter){
   //console.log('clicked', letter)

   //inputArray.push(letter)
   ////console.log(inputArray)

   //inputLength = inputArray.length; 
   ////console.log(inputLength)

   //let lastEntry = inputArray[inputLength -1];
   //let previousEntry = inputArray[inputLength -2];

   ////console.log(lastEntry)
   ////console.log(previousEntry)
   //
   //if(lastEntry === previousEntry){
   //console.log("Cannot Fetch Again!")
   //}else 

    const existingdrinks = document.querySelectorAll('.cocktailBox')
    Array.from(existingdrinks).forEach(div => {
        div.remove()
    });

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
        console.log(data.drinks)

        for(i=0;i<data.drinks.length;i++){

            const newDiv = document.createElement('div')
            newDiv.classList.add("cocktailBox")
            newDiv.id = `cb${i}`
            document.getElementById('cocktail-scrollbox').appendChild(newDiv)

            //name
            const newDrinkName = document.createElement('h2');
            newDrinkName.innerText = data.drinks[i].strDrink
            document.getElementById(`cb${i}`).appendChild(newDrinkName)



        }
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
}