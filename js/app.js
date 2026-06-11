let products = [];

// ================= LOAD DATA =================
fetch("products.json")
.then(res => res.json())
.then(data => {

products = data;

loadCategories();
renderProducts(products);

});

// ================= CORE SEARCH ENGINE =================
function getSearchableText(product){

return (
(product.name || "") + " " +
(product.title || "") + " " +
(product.category || "") + " " +
(product.subcategory || "") + " " +
(product.synonyms || []).join(" ") + " " +
JSON.stringify(product.article || {})
).toLowerCase();

}

// ================= LOAD CATEGORIES =================
function loadCategories(){

const dropdown = document.getElementById("categoryDropdown");

const categories = [...new Set(products.map(p => p.category))];

categories.forEach(c => {

const opt = document.createElement("option");
opt.value = c;
opt.textContent = c;

dropdown.appendChild(opt);

});

}

// ================= CATEGORY CHANGE =================
document.getElementById("categoryDropdown").addEventListener("change", function(){

const cat = this.value;

const container = document.getElementById("subcategoryContainer");
container.innerHTML = "";

if(!cat){
renderProducts(products);
return;
}

const subs = [...new Set(
products.filter(p => p.category === cat)
.map(p => p.subcategory)
)];

const label = document.createElement("label");
label.textContent = "Subcategory";

const select = document.createElement("select");
select.id = "subcategoryDropdown";

const defaultOpt = document.createElement("option");
defaultOpt.value = "";
defaultOpt.textContent = "Select Subcategory";
select.appendChild(defaultOpt);

subs.forEach(s => {
const opt = document.createElement("option");
opt.value = s;
opt.textContent = s;
select.appendChild(opt);
});

container.appendChild(label);
container.appendChild(select);

select.addEventListener("change", function(){

let filtered = products.filter(p => p.category === cat);

if(this.value){
filtered = filtered.filter(p => p.subcategory === this.value);
}

renderProducts(filtered);

});

// show category products initially
renderProducts(products.filter(p => p.category === cat));

});

// ================= SEARCH PRODUCT =================
function searchProduct(){

const q =
document.getElementById("productSearch").value.toLowerCase().trim();

if(!q){
renderProducts(products);
return;
}

const words = q.split(/\s+/);

const results = products
.map(p => {

const text = getSearchableText(p);

let score = 0;

// flexible matching (NOT strict every-word rule)
words.forEach(w => {

if(w.length < 2) return;

// exact match
if(text.includes(w)){
score += 10;
}

// fuzzy match for typo (ballon → balloon)
else {
for(let i = 0; i < text.length - 3; i++){
if(text.substring(i, i + w.length + 1).includes(w)){
score += 3;
break;
}
}
}

});

return { product: p, score };

})
.filter(x => x.score > 0)
.sort((a,b) => b.score - a.score)
.map(x => x.product);

renderProducts(results);

}

// ================= GOAL ANALYZER =================
function analyzeGoal(){

const goal = document.getElementById("goalInput").value.toLowerCase().trim();
if(!goal) return;

const words = goal.split(/\s+/);

const results = products.map(p => {

const text = getSearchableText(p);

let score = 0;

words.forEach(w=>{
if(w.length > 2 && text.includes(w)) score += 20;
});

return { product: p, score };

})
.filter(x => x.score > 0)
.sort((a,b)=>b.score-a.score);

let box = document.getElementById("analysisResult");
box.innerHTML = "<h3>Goal Analysis Results</h3>";

results.forEach(r => {

box.innerHTML += `
<div class="analysis-card">
<h3>${r.product.name}</h3>
<p>Score: ${r.score}/100</p>

<div style="text-align:center;">
<a href="product.html?id=${r.product.id}">
<button>Details</button>
</a>
</div>
</div>
<hr>
`;

});

}

// ================= BUDGET ANALYZER =================
function analyzeBudget(){

const budget = Number(document.getElementById("budgetInput").value);

if(!budget) return;

renderProducts(products.filter(p => p.price <= budget));

}

// ================= REGRET ANALYZER =================
function analyzeRegret(){

const input = document.getElementById("regretInput").value.toLowerCase().trim();

if(!input) return;

const words = input.split(/\s+/);

const results = products.map(p => {

const text = getSearchableText(p);

let score = 0;

words.forEach(w=>{
if(w.length > 2 && text.includes(w)) score += 25;
});

return { product: p, score };

})
.filter(x => x.score > 0)
.sort((a,b)=>b.score-a.score);

let box = document.getElementById("analysisResult");
box.innerHTML = "<h3>Regret Analysis Results</h3>";

results.forEach(r => {

box.innerHTML += `
<div class="analysis-card">
<h3>${r.product.name}</h3>
<p>Match Score: ${r.score}/100</p>

<div style="text-align:center;">
<a href="product.html?id=${r.product.id}">
<button>Details</button>
</a>
</div>
</div>
<hr>
`;

});

}

// ================= RENDER PRODUCTS =================
function renderProducts(items){

const grid = document.getElementById("productsGrid");

grid.innerHTML = "";

if(items.length === 0){
grid.innerHTML = "<h3>No products found</h3>";
return;
}

items.forEach(p => {

grid.innerHTML += `
<div class="product-card">

<img src="${p.image}" alt="${p.name}">

<h3>${p.name}</h3>

<p>Price: $${p.price}</p>

<div style="text-align:center;">
<a href="product.html?id=${p.id}">
<button>Details</button>
</a>
</div>

</div>
`;

});

}