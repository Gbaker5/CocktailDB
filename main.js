

const buttons = document.querySelectorAll('.letter')


Array.from(buttons).forEach(button => {
    button.addEventListener('click', () => {
        cocktailList(button.value)

    })
});

//////////FETCH

function cocktailList(letter){
 

    const existingdrinks = document.querySelectorAll('.cocktailBox')
    Array.from(existingdrinks).forEach(div => {
        div.remove()
    });

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
        console.log(data.drinks)

        for(i=0;i<data.drinks.length;i++){
            //console.log(data.drinks[i].strAlcoholic)

            //create div ct
            const newDiv = document.createElement('div')
            newDiv.classList.add("cocktailBox")
            newDiv.id = `cb${i}`
            document.getElementById('cocktail-scrollbox').appendChild(newDiv)

            //left div - inside (cocktailbox)
            const insideDivOne = document.createElement('div')
            insideDivOne.classList.add('inDivLeft')
            insideDivOne.id = `inDivLeft${i}`
            document.getElementById(`cb${i}`).appendChild(insideDivOne)

            //right div - inside (cocktailbox)
            const insideDivTwo = document.createElement('div')
            insideDivTwo.classList.add('inDivRight')
            insideDivTwo.id = `inDivRight${i}`
            document.getElementById(`cb${i}`).appendChild(insideDivTwo)

            //image
            const drinkImg = document.createElement('img');
            drinkImg.src = data.drinks[i].strDrinkThumb
            drinkImg.classList.add('cocktailImg')
            document.getElementById(`inDivLeft${i}`).appendChild(drinkImg)

            //name
            const newDrinkName = document.createElement('h2');
            newDrinkName.innerText = data.drinks[i].strDrink
            document.getElementById(`inDivRight${i}`).appendChild(newDrinkName)

            

            //info box
                //inset style
            

            //Alcoholic
            const alcoholicP = document.createElement('p')
            const alcoPText = data.drinks[i].strAlcoholic
            alcoholicP.innerText = `Alcohol Content: ${alcoPText} `
            document.getElementById(`inDivRight${i}`).appendChild(alcoholicP)

            //Suggested Glass
            const myGlass = document.createElement('p')
            const myGlassText = data.drinks[i].strGlass
            myGlass.innerText = `Suggested Glass: ${myGlassText}`
            document.getElementById(`inDivRight${i}`).appendChild(myGlass)

            //Ingredients

            let ingredientList = [];
            const keys = Object.keys(data.drinks[i]) //keys of drink object
            //console.log(keys)
            const ingredientKeys = keys.filter( property => property.includes("strIngredient")) //ingredients keys
            //console.log(ingredientKeys) 
            
            ingredientKeys.forEach(ingredientKey => {
                const ingredientValue = data.drinks[i][ingredientKey];
                if (ingredientValue) {
                ingredientList.push(ingredientValue);
                }
            });

            console.log(ingredientList)

            
            //Measurements

            let measurementList = [];
            //const keys = Object.keys(data.drinks[i]) //keys of drink object
            //console.log(keys)
            const measurementKeys = keys.filter( property => property.includes("strMeasure")) //ingredients keys
            //console.log(ingredientKeys) 
            
            measurementKeys.forEach(measurementKey => {
                const measurementValue = data.drinks[i][measurementKey];
                if (measurementValue) {
                measurementList.push(measurementValue);
                }
            });

            console.log(measurementList)

        
            // Ingredient-Measurement Strings
            const ingredientMeasureContainer = document.createElement('ul'); // or 'div', up to you
            ingredientMeasureContainer.classList.add('ingredient-list');

            for (let j = 0; j < ingredientList.length; j++) {
              const ingredient = ingredientList[j];
              const measurement = measurementList[j] || ''; // Handle cases where there’s no measurement
              const listItem = document.createElement('li');
              listItem.innerText = `${measurement.trim()} ${ingredient}`;
              ingredientMeasureContainer.appendChild(listItem);
            }

            document.getElementById(`inDivRight${i}`).appendChild(ingredientMeasureContainer);


            //Instructions
            const drinkInstruct = document.createElement('p')
            const drinkInstructText = data.drinks[i].strInstructions
            drinkInstruct.innerText = `Instructions: ${drinkInstructText}` 
            document.getElementById(`inDivRight${i}`).appendChild(drinkInstruct)
            
        }
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
}