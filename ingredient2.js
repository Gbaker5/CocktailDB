const button2 = document.querySelector('#ingredient')
const ingredientValue = document.querySelector('#ingValue')

button2.addEventListener('click', () => {
        drinkByIngredient(ingredientValue.value)
    })


/////////Initial Fetch for Ingredient
function drinkByIngredient (inputValue){

    const existingdrinks = document.querySelectorAll('.cocktailBox')
    Array.from(existingdrinks).forEach(div => {
        div.remove()
    });

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

    const drinkIdArr = [];
    for (i = 0; i < data.drinks.length; i++) {
        drinkIdArr.push(data.drinks[i].idDrink);
    }

    function showLoader() {
        document.getElementById('loader').style.display = 'block';
    }

    function hideLoader() {
        document.getElementById('loader').style.display = 'none';
    }

    function disableLetterButtons() {
        const buttons = document.querySelectorAll('.letter');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = 0.4;
            btn.style.pointerEvents = 'none';
        });
    }

    function enableLetterButtons() {
        const buttons = document.querySelectorAll('.letter');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = 1;
            btn.style.pointerEvents = 'auto';
        });
    }

    function disableSearchBtn(){
        button2.disabled = true;
        button2.style.opacity = 0.4;
        button2.style.pointerEvents = 'none';
    }

    function enableSearchBtn(){
        button2.disabled = false;
        button2.style.opacity = 1;
        button2.style.pointerEvents = 'auto'; 
    }

    // 🚀 MUCH FASTER
    async function getAllDrinks(drinkIdArr) {

        disableLetterButtons();
        disableSearchBtn();
        showLoader();

        try {
            // 🔥 parallel fetch instead of sequential
            const requests = drinkIdArr.map(id =>
                fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
                    .then(res => res.json())
                    .then(data => data.drinks?.[0])
                    .catch(err => {
                        console.error(`Error fetching ${id}:`, err);
                        return null;
                    })
            );

            const results = await Promise.all(requests);
            return results.filter(Boolean);

        } finally {
            hideLoader();
            enableLetterButtons();
            enableSearchBtn();
        }
    }

    (async () => {
        const drinksByIngArr = await getAllDrinks(drinkIdArr);
        console.log(drinksByIngArr);

        // 🚀 batch DOM updates
        const fragment = document.createDocumentFragment();

        for (i = 0; i < drinksByIngArr.length; i++) {

            const newDiv = document.createElement('div');
            newDiv.classList.add("cocktailBox");
            newDiv.id = `cb${i}`;

            const insideDivOne = document.createElement('div');
            insideDivOne.classList.add('inDivLeft');
            insideDivOne.id = `inDivLeft${i}`;

            const insideDivTwo = document.createElement('div');
            insideDivTwo.classList.add('inDivRight');
            insideDivTwo.id = `inDivRight${i}`;

            newDiv.appendChild(insideDivOne);
            newDiv.appendChild(insideDivTwo);

            const drink = drinksByIngArr[i];

            // image
            const drinkImg = document.createElement('img');
            drinkImg.src = drink.strDrinkThumb;
            drinkImg.classList.add('cocktailImg');
            insideDivOne.appendChild(drinkImg);

            // name
            const newDrinkName = document.createElement('h2');
            newDrinkName.innerText = drink.strDrink;
            insideDivTwo.appendChild(newDrinkName);

            // Alcoholic
            const alcoholicP = document.createElement('p');
            alcoholicP.innerText = `Alcohol Content: ${drink.strAlcoholic}`;
            insideDivTwo.appendChild(alcoholicP);

            // Glass
            const myGlass = document.createElement('p');
            myGlass.innerText = `Suggested Glass: ${drink.strGlass}`;
            insideDivTwo.appendChild(myGlass);

            // Ingredients
            let ingredientList = [];
            const keys = Object.keys(drink);
            const ingredientKeys = keys.filter(property => property.includes("strIngredient"));

            ingredientKeys.forEach(key => {
                if (drink[key]) ingredientList.push(drink[key]);
            });

            // Measurements
            let measurementList = [];
            const measurementKeys = keys.filter(property => property.includes("strMeasure"));

            measurementKeys.forEach(key => {
                if (drink[key]) measurementList.push(drink[key]);
            });

            const ingredientMeasureContainer = document.createElement('ul');
            ingredientMeasureContainer.classList.add('ingredient-list');

            for (let j = 0; j < ingredientList.length; j++) {
                const listItem = document.createElement('li');
                listItem.innerText = `${(measurementList[j] || '').trim()} ${ingredientList[j]}`;
                ingredientMeasureContainer.appendChild(listItem);
            }

            insideDivTwo.appendChild(ingredientMeasureContainer);

            // Instructions
            const drinkInstruct = document.createElement('p');
            drinkInstruct.innerText = `Instructions: ${drink.strInstructions}`;
            insideDivTwo.appendChild(drinkInstruct);

            fragment.appendChild(newDiv);
        }

        document.getElementById('cocktail-scrollbox').appendChild(fragment);
    })();
})
    .catch(err => {
        console.log(`error ${err}`)
    });
}