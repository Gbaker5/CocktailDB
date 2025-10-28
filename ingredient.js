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

        ////////Second Fetches uses those names to retreive full drinks and details


        //const drinkObjArr = [];
//
        //drinkNameArr.forEach(drink => {
        //        
        //        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`)
        //        .then(res => res.json()) // parse response as JSON
        //        .then(data => {
        //            console.log(data.drinks)
        //            drinkObjArr.push(data.drinks)
//
//
        //         })
        //        .catch(err => {
        //            console.log(`error ${err}`)
        //         });
        //    });
        //
        //console.log(drinkObjArr)

        async function getAllDrinks(drinkNameArr) {
          const drinkObjArr = [];
        
          for (const drink of drinkNameArr) {
            try {
                await new Promise(r => setTimeout(r, 300)); // wait 300ms
                const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`);
                const data = await res.json();
                //console.log(data.drinks);
                drinkObjArr.push(data.drinks);
            } catch (err) {
              console.error(`Error fetching ${drink}:`, err);
            }
          }
      
          // Flatten the array of arrays
          const allDrinks = drinkObjArr.flat();
          //console.log(allDrinks); 
          return allDrinks;
        }

        //////async function that awaits result of second fetch then displays cocktails

        (async () => {
            const drinksByIngArr = await getAllDrinks(drinkNameArr);
            console.log(drinksByIngArr)


            for(i=0;i<drinksByIngArr.length;i++){
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
            drinkImg.src = drinksByIngArr[i].strDrinkThumb
            drinkImg.classList.add('cocktailImg')
            document.getElementById(`inDivLeft${i}`).appendChild(drinkImg)

            //name
            const newDrinkName = document.createElement('h2');
            newDrinkName.innerText = drinksByIngArr[i].strDrink
            document.getElementById(`inDivRight${i}`).appendChild(newDrinkName)

            

            //info box
                //inset style
            

            //Alcoholic
            const alcoholicP = document.createElement('p')
            const alcoPText = drinksByIngArr[i].strAlcoholic
            alcoholicP.innerText = `Alcohol Content: ${alcoPText} `
            document.getElementById(`inDivRight${i}`).appendChild(alcoholicP)

            //Suggested Glass
            const myGlass = document.createElement('p')
            const myGlassText = drinksByIngArr[i].strGlass
            myGlass.innerText = `Suggested Glass: ${myGlassText}`
            document.getElementById(`inDivRight${i}`).appendChild(myGlass)

            //Ingredients

            let ingredientList = [];
            const keys = Object.keys(drinksByIngArr[i]) //keys of drink object
            //console.log(keys)
            const ingredientKeys = keys.filter( property => property.includes("strIngredient")) //ingredients keys
            //console.log(ingredientKeys) 
            
            ingredientKeys.forEach(ingredientKey => {
                const ingredientValue = drinksByIngArr[i][ingredientKey];
                if (ingredientValue) {
                ingredientList.push(ingredientValue);
                }
            });

            //console.log(ingredientList)

            
            //Measurements

            let measurementList = [];
            //const keys = Object.keys(data.drinks[i]) //keys of drink object
            //console.log(keys)
            const measurementKeys = keys.filter( property => property.includes("strMeasure")) //ingredients keys
            //console.log(ingredientKeys) 
            
            measurementKeys.forEach(measurementKey => {
                const measurementValue = drinksByIngArr[i][measurementKey];
                if (measurementValue) {
                measurementList.push(measurementValue);
                }
            });

            //console.log(measurementList)

        
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
            const drinkInstructText = drinksByIngArr[i].strInstructions
            drinkInstruct.innerText = `Instructions: ${drinkInstructText}` 
            document.getElementById(`inDivRight${i}`).appendChild(drinkInstruct)
            
        }
            
        })()

        
       


         




})
    .catch(err => {
        console.log(`error ${err}`)
    });
}