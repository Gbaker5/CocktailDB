const button2 = document.querySelector('#ingredient')
const ingredientValue = document.querySelector('#ingValue')

button2.addEventListener('click', () => {
        drinkByIngredient(ingredientValue.value)
    })


/////////Initial Fetch for Ingredient
function drinkByIngredient (inputValue){

    /////Format Input
    //console.log(inputValue)
    const formatStr = inputValue
    .split(" ")
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
    //console.log(formatStr);

   
    ////First Ingredient fetch retreives list of drink names
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${formatStr}`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
        //console.log(data)
        //console.log(data.drinks.strDrink)
        const drinkNameArr = []
        for(i=0;i<data.drinks.length;i++){
            //console.log(data.drinks[i].strDrink)
            drinkNameArr.push(data.drinks[i].strDrink)
            //console.log(drinkNameArr)
        }

        const drinkObjArr = [];

        drinkNameArr.forEach(drink => {
                ////////Second Fetches uses those names to retreive full drinks and details
                fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`)
                .then(res => res.json()) // parse response as JSON
                .then(data => {
                    console.log(data.drinks)
                    drinkObjArr.push(data.drinks)


                 })
                .catch(err => {
                    console.log(`error ${err}`)
                 });
            });
        
        console.log(drinkObjArr)



})
    .catch(err => {
        console.log(`error ${err}`)
    });
}