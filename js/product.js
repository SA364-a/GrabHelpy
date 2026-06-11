const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

fetch("products.json")
.then(res => res.json())
.then(products => {

const product = products.find(p => p.id === id);

if(!product){
document.body.innerHTML = "<h2>Product Not Found</h2>";
return;
}

document.title = product.name;

document.getElementById("productContainer").innerHTML = `
<h1>${product.name}</h1>
<img src="${product.image}" style="max-width:400px;width:100%;">

<p><strong>Price:</strong> $${product.price}</p>

<h2>Details</h2>
<p>${product.article?.introduction || ""}</p>

<a href="${product.buyLink}" target="_blank">
<button>Buy Now</button>
</a>
`;

});