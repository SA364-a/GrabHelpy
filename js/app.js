let products = [];

fetch("products.json")
.then(response => response.json())
.then(data => {

products = data;

loadCategories();

renderProducts(products);

});

function loadCategories(){

const categoryDropdown =
document.getElementById(
"categoryDropdown"
);

const categories =
[
...new Set(
products.map(
p => p.category
)
)
];

categories.forEach(category => {

const option =
document.createElement("option");

option.value = category;
option.textContent = category;

categoryDropdown.appendChild(option);

});

}

document
.getElementById(
"categoryDropdown"
)
.addEventListener(
"change",
function(){

const category =
this.value;

const subDropdown =
document.getElementById(
"subcategoryDropdown"
);

subDropdown.innerHTML =
'<option value="">Select Subcategory</option>';

if(!category){

renderProducts(products);
return;

}

const subcategories =
[
...new Set(
products
.filter(
p =>
p.category === category
)
.map(
p => p.subcategory
)
)
];

subcategories.forEach(sub => {

const option =
document.createElement("option");

option.value = sub;
option.textContent = sub;

subDropdown.appendChild(option);

});

showProducts();

}
);

document
.getElementById(
"subcategoryDropdown"
)
.addEventListener(
"change",
showProducts
);

document
.getElementById(
"priceSort"
)
.addEventListener(
"change",
showProducts
);

function showProducts(){

let filtered =
[...products];

const category =
document.getElementById(
"categoryDropdown"
).value;

const subcategory =
document.getElementById(
"subcategoryDropdown"
).value;

const sort =
document.getElementById(
"priceSort"
).value;

if(category){

filtered =
filtered.filter(
p =>
p.category === category
);

}

if(subcategory){

filtered =
filtered.filter(
p =>
p.subcategory === subcategory
);

}

if(sort === "low"){

filtered.sort(
(a,b)=>
a.price-b.price
);

}

if(sort === "high"){

filtered.sort(
(a,b)=>
b.price-a.price
);

}

renderProducts(filtered);

}

function searchProduct(){

const search =
document
.getElementById(
"productSearch"
)
.value
.toLowerCase()
.trim();

if(search === ""){

showProducts();
return;

}

const filtered =
products.filter(product => {

const text = (

(product.name || "") +
" " +
(product.category || "") +
" " +
(product.subcategory || "") +
" " +
(product.description || "") +
" " +
(product.seoKeywords || []).join(" ") +
" " +
(product.synonyms || []).join(" ")

).toLowerCase();

return text.includes(search);

});

renderProducts(filtered);

}

function getGoalScore(product, goal){

goal = goal.toLowerCase();

const words =
goal.split(" ");

const searchable = (

(product.name || "") +
" " +
(product.category || "") +
" " +
(product.subcategory || "") +
" " +
(product.description || "") +
" " +
(product.seoKeywords || []).join(" ") +
" " +
(product.synonyms || []).join(" ")

).toLowerCase();

let score = 0;

words.forEach(word => {

if(word.length < 3){
return;
}

if(searchable.includes(word)){
score += 20;
}

});

if(score > 100){
score = 100;
}

return score;

}

function analyzeGoal(){

const goal =
document
.getElementById(
"goalInput"
)
.value
.trim();

if(goal === ""){
return;
}

const matches =
products
.map(product => {

return {
product,
score:getGoalScore(product, goal)
};

})
.filter(item => item.score > 0)
.sort((a,b) => b.score - a.score);

const result =
document.getElementById(
"analysisResult"
);

if(matches.length === 0){

result.innerHTML =
"<p>No matching products found.</p>";

return;

}

let html =
"<h3>Goal Analysis Results</h3>";

matches.forEach(item => {

let recommendation =
"'If It's For You'--Analyzer";

if(item.score >= 80){
recommendation = "Excellent Fit";
}
else if(item.score >= 60){
recommendation = "Good Fit";
}
else if(item.score >= 40){
recommendation = "Possible Fit";
}
else{
recommendation = "Not For You";
}

html += `

<p>

<strong>${item.product.name}</strong>

<br>

Score:
${item.score}/100

<br>

${recommendation}

</p>

`;

});

result.innerHTML = html;

}

function analyzeBudget(){

const budget =
Number(
document
.getElementById(
"budgetInput"
)
.value
);

if(!budget){
return;
}

const filtered =
products.filter(
p =>
p.price <= budget
);

renderProducts(filtered);

}

function analyzeRegret(){

const goal =
document
.getElementById(
"goalInput"
)
.value
.trim();

if(goal === ""){

alert(
"Please enter your goal first."
);

return;

}

let highestScore = 0;

products.forEach(product => {

const score =
getGoalScore(
product,
goal
);

if(score > highestScore){

highestScore = score;

}

});

if(highestScore >= 45){

alert(

"Low Regret Risk\n\n" +

"This product matches your goal by " +

highestScore +

"%.\n\n" +

"The product appears strongly aligned with your stated goal."

);

}
else if(highestScore >= 5){

alert(

"Medium Regret Risk\n\n" +

"This product matches your goal by " +

highestScore +

"%.\n\n" +

"Consider reviewing alternatives before buying."

);

}
else{

alert(

"High Regret Risk\n\n" +

"This product matches your goal by " +

highestScore +

"%.\n\n" +

"The product does not appear aligned with your stated goal."

);

}

}
function renderProducts(items){

const grid =
document.getElementById(
"productsGrid"
);

grid.innerHTML = "";

if(items.length === 0){

grid.innerHTML =
"<h3>No products found.</h3>";

return;

}

items.forEach(product => {

const goal =
document
.getElementById(
"goalInput"
).value.trim();

let score = 0;

if(goal){
score =
getGoalScore(
product,
goal
);
}

let fitText =
"'If It's For You'--Analyzer";

if(score >= 80){
fitText = "Excellent Fit";
}
else if(score >= 60){
fitText = "Good Fit";
}
else if(score >= 40){
fitText = "Possible Fit";
}
else if(goal){
fitText = "Not For You";
}

grid.innerHTML += `

<div class="product-card">

<img
src="${product.image}"
alt="${product.name}">

<h3>${product.name}</h3>

<p>Price: $${product.price}</p>

<p>${fitText}</p>

<a
class="buy-link"
href="${product.buyLink}"
target="_blank">

Buy Now

</a>

<div class="product-buttons">

<button>
${fitText}
</button>

<a href="product.html?id=${product.id}">

<button>
Details
</button>

</a>

</div>

</div>

`;

});

}