const params =
new URLSearchParams(
window.location.search
);

const id =
Number(
params.get("id")
);

fetch("products.json")
.then(response => response.json())
.then(products => {

const product =
products.find(
p => p.id === id
);

if(!product){

document.body.innerHTML =
"<h2>Product Not Found</h2>";

return;

}

document.title =
product.seoTitle ||
product.name;

document
.getElementById(
"metaDescription"
)
.setAttribute(
"content",
product.seoDescription || ""
);

const container =
document.getElementById(
"productContainer"
);

container.innerHTML = `

<h1>${product.name}</h1>

<img
src="${product.image}"
style="max-width:400px;width:100%;">

<p><strong>Price:</strong> $${product.price}</p>

<p><strong>Category:</strong> ${product.category}</p>

<p><strong>Subcategory:</strong> ${product.subcategory}</p>

<h2>Introduction</h2>
<p>${product.article.introduction}</p>

<h2>Overview</h2>
<p>${product.article.product_overview}</p>

<h2>Why People Love This Suit</h2>
<ul>
${product.article.why_people_love_this_suit
.map(item => `<li>${item}</li>`)
.join("")}
</ul>

<h2>Key Features</h2>
<ul>
${product.article.key_features
.map(item => `<li>${item}</li>`)
.join("")}
</ul>

<h2>Buying Reasons</h2>
<ul>
${product.article.buying_reasons
.map(item => `<li>${item}</li>`)
.join("")}
</ul>

<h2>Conclusion</h2>
<p>${product.article.conclusion}</p>

<a
href="${product.buyLink}"
target="_blank">

<button>Buy Now</button>

</a>

`;
});