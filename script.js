const products = [
  {id:1,name:"Studio Wireless Headphones",category:"Tech",price:2499,emoji:"🎧",tag:"BESTSELLER",tone:"linear-gradient(135deg,#e7e9df,#d7ddcb)"},
  {id:2,name:"Everyday Retro Camera",category:"Tech",price:5499,emoji:"📷",tag:"POPULAR",tone:"linear-gradient(135deg,#f1e6d8,#e5d1bd)"},
  {id:3,name:"Classic Street Sneakers",category:"Fashion",price:3199,emoji:"👟",tag:"NEW",tone:"linear-gradient(135deg,#e7e8ef,#d5d8e5)"},
  {id:4,name:"Minimal Desk Lamp",category:"Home",price:1899,emoji:"💡",tag:"GOOD FIND",tone:"linear-gradient(135deg,#f2ead9,#e7dcbf)"},
  {id:5,name:"Daily Carry Backpack",category:"Fashion",price:2799,emoji:"🎒",tag:"POPULAR",tone:"linear-gradient(135deg,#e5e8df,#cbd5c6)"},
  {id:6,name:"Smart Fitness Watch",category:"Tech",price:3999,emoji:"⌚",tag:"TRENDING",tone:"linear-gradient(135deg,#e5e8ec,#ccd4dd)"},
  {id:7,name:"Ceramic Coffee Set",category:"Home",price:1299,emoji:"☕",tag:"JUST IN",tone:"linear-gradient(135deg,#f0e5dc,#e6d1c2)"},
  {id:8,name:"Weekend Football",category:"Sports",price:999,emoji:"⚽",tag:"VALUE PICK",tone:"linear-gradient(135deg,#e4ebdc,#d1dfc4)"}
];
let cart = [];
let activeCategory = "All";
let searchTerm = "";
let wishlist = new Set();
const $ = id => document.getElementById(id);
const money = n => "₹" + n.toLocaleString("en-IN");
function showToast(message){const toast=$("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2100)}
function renderProducts(){
  let list=products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&(`${p.name} ${p.category}`).toLowerCase().includes(searchTerm));
  const sort=$("sortSelect").value;
  if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);
  $("productGrid").innerHTML=list.map(p=>`<article class="product-card"><div class="product-image" style="background:${p.tone}"><span class="tag">${p.tag}</span><button class="heart ${wishlist.has(p.id)?"saved":""}" data-heart="${p.id}" aria-label="Add ${p.name} to wishlist">${wishlist.has(p.id)?"♥":"♡"}</button><span class="emoji">${p.emoji}</span></div><div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">Add to cart +</button></div></div></article>`).join("");
  $("emptyState").hidden=list.length>0;
}
function updateCart(){
  $("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);
  $("subtotal").textContent=money(cart.reduce((s,i)=>s+i.price*i.qty,0));
  $("cartEmpty").style.display=cart.length?"none":"block";
  $("cartItems").innerHTML=cart.map(i=>`<div class="cart-line"><div class="cart-thumb">${i.emoji}</div><div><h4>${i.name}</h4><small>${money(i.price)}</small><div class="qty"><button data-qty="${i.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-qty="${i.id}" data-change="1" aria-label="Increase quantity">+</button></div></div><button class="remove" data-remove="${i.id}" aria-label="Remove item">×</button></div>`).join("");
}
function addToCart(id){const p=products.find(x=>x.id===id);const found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({...p,qty:1});updateCart();showToast(`${p.name} added to your cart`)}
function openCart(){ $("overlay").classList.add("show");$("cartDrawer").classList.add("open");$("cartDrawer").setAttribute("aria-hidden","false")}
function closeCart(){ $("overlay").classList.remove("show");$("cartDrawer").classList.remove("open");$("cartDrawer").setAttribute("aria-hidden","true")}
$("productGrid").addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add)addToCart(Number(add.dataset.add));
 const heart=e.target.closest("[data-heart]");if(heart){const id=Number(heart.dataset.heart);wishlist.has(id)?wishlist.delete(id):wishlist.add(id);renderProducts();showToast(wishlist.has(id)?"Saved to wishlist":"Removed from wishlist")}
});
$("cartItems").addEventListener("click",e=>{
 const qty=e.target.closest("[data-qty]");if(qty){const item=cart.find(x=>x.id===Number(qty.dataset.qty));item.qty+=Number(qty.dataset.change);if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);updateCart()}
 const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));updateCart()}
});
$("categoryChips").addEventListener("click",e=>{const chip=e.target.closest("[data-category]");if(!chip)return;activeCategory=chip.dataset.category;$("categoryFilter").value=activeCategory;document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c===chip));renderProducts()});
$("searchForm").addEventListener("submit",e=>{e.preventDefault();searchTerm=$("searchInput").value.trim().toLowerCase();activeCategory=$("categoryFilter").value;document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c.dataset.category===activeCategory));renderProducts();$("products").scrollIntoView({behavior:"smooth"})});
$("categoryFilter").addEventListener("change",e=>{activeCategory=e.target.value;document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c.dataset.category===activeCategory));renderProducts()});
$("sortSelect").addEventListener("change",renderProducts);
$("cartOpen").addEventListener("click",openCart);$("cartClose").addEventListener("click",closeCart);$("overlay").addEventListener("click",closeCart);
$("wishlistBtn").addEventListener("click",()=>{showToast(wishlist.size?`${wishlist.size} item(s) saved in wishlist`:"Your wishlist is empty")});
$("checkoutBtn").addEventListener("click",()=>showToast(cart.length?"Demo checkout: payment is not connected yet.":"Your cart is empty"));
document.querySelectorAll("[data-nav]").forEach(a=>a.addEventListener("click",()=>{activeCategory=a.dataset.nav;$("categoryFilter").value=activeCategory;document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c.dataset.category===activeCategory));renderProducts()}));
$("year").textContent=new Date().getFullYear();renderProducts();updateCart();
