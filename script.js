(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const money = n => n.toLocaleString("vi-VN") + "đ";
  let selectedColor = {name:"Xanh rêu", hex:"#687653"};
  let selectedSize = {size:"M", range:"35–48 cm"};
  let customColor = {name:"Xanh rêu", hex:"#687653"};
  let cart = [];
  const colorCollar = (el, color) => { if(el) el.style.borderColor = color; };

  function routeTo(page) {
    const valid = ["home","product","personalize","mypet","contact"];
    page = valid.includes(page) ? page : "home";
    $$(".page").forEach(p => p.classList.toggle("active", p.id === page));
    $$("#mainNav a").forEach(a => a.classList.toggle("active", a.dataset.page === page));
    $("#mainNav").classList.remove("open");
    if (location.hash !== "#" + page) history.replaceState(null, "", "#" + page);
    window.scrollTo({top:0, behavior:"smooth"});
  }
  window.addEventListener("hashchange", () => routeTo(location.hash.slice(1)));
  $$("#mainNav a, .brand, .footer-links a, .hero-actions a, .section-heading a, .teaser-meta a").forEach(a => {
    a.addEventListener("click", e => {
      const hash = a.getAttribute("href");
      if (hash && hash.startsWith("#")) { e.preventDefault(); routeTo(hash.slice(1)); }
    });
  });
  $("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));

  function setupSwatches(container, callback) {
    $$(".swatch", container).forEach(btn => btn.addEventListener("click", () => {
      $$(".swatch", container).forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      callback({name:btn.dataset.name, hex:btn.dataset.color});
    }));
  }
  setupSwatches($("#productSwatches"), c => {
    selectedColor = c; colorCollar($("#productCollar"), c.hex); $("#selectedColorName").textContent = c.name;
  });
  $$(".size-option").forEach(btn => btn.addEventListener("click", () => {
    $$(".size-option").forEach(b => b.classList.remove("selected")); btn.classList.add("selected");
    selectedSize = {size:btn.dataset.size, range:btn.dataset.range};
  }));
  setupSwatches($("#customSwatches"), c => {
    customColor = c; colorCollar($("#customCollar"), c.hex);
  });
  $("#petName").addEventListener("input", e => $("#customPreviewName").textContent = e.target.value.trim() || "Vòng cổ của bé");

  function addItem(item) {
    cart.push({...item, id:Date.now()+Math.random()});
    updateCart();
    openCart();
  }
  $("#addProduct").addEventListener("click", () => addItem({
    name:"Vòng cổ GPS 4G tiêu chuẩn", price:1599000,
    details:`Màu ${selectedColor.name} · Size ${selectedSize.size} (${selectedSize.range})`, color:selectedColor.hex
  }));
  $("#addCustom").addEventListener("click", () => {
    const pet = $("#petName").value.trim();
    const engraving = $("#engraving").value.trim();
    addItem({name:"Vòng cổ GPS 4G cá nhân hóa",price:1748000,
      details:`${pet ? "Tên bé: "+pet+" · " : ""}Màu ${customColor.name} · Size ${$("#customSize").value}${engraving ? " · Nội dung: "+engraving : ""}`,
      color:customColor.hex});
  });
  function updateCart() {
    $("#cartCount").textContent = cart.length;
    $("#cartItems").innerHTML = cart.length ? cart.map(item => `<div class="cart-item"><div class="cart-item-thumb" style="border-bottom:5px solid ${item.color}">🐾</div><div class="cart-item-info"><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.details)}</small><button class="remove-item" data-remove="${item.id}">Xóa</button></div><div class="cart-item-price">${money(item.price)}</div></div>`).join("") : '<p class="empty-cart">Giỏ hàng đang trống. Thêm một chiếc vòng cho bé nhé! 🐾</p>';
    $("#cartTotal").textContent = money(cart.reduce((sum, i) => sum+i.price, 0));
    $$("[data-remove]").forEach(btn => btn.addEventListener("click", () => {cart=cart.filter(i=>String(i.id)!==btn.dataset.remove);updateCart();}));
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function openCart() { $("#cartModal").classList.add("open"); $("#cartModal").setAttribute("aria-hidden","false"); }
  function closeCart() { $("#cartModal").classList.remove("open"); $("#cartModal").setAttribute("aria-hidden","true"); }
  $("#cartOpen").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  $("#cartModal").addEventListener("click", e => {if(e.target === $("#cartModal")) closeCart();});
  $("#checkoutButton").addEventListener("click", () => {
    $("#checkoutMessage").textContent = cart.length ? "Đây là bản demo — chưa có thanh toán hoặc đơn hàng thật." : "Giỏ hàng đang trống. Hãy thêm sản phẩm trước nhé.";
  });

  const tabLabels = {overview:"Tổng quan",pets:"Thú cưng",location:"Theo dõi vị trí",safezone:"Vùng an toàn",activity:"Hoạt động",alerts:"Thông báo",settings:"Cài đặt"};
  function showDashTab(tab) {
    $$(".dash-link").forEach(b => b.classList.toggle("active",b.dataset.tab===tab));
    $$(".dash-panel").forEach(p => p.classList.toggle("active",p.id==="panel-"+tab));
  }
  $$(".dash-link").forEach(btn => btn.addEventListener("click", () => showDashTab(btn.dataset.tab)));
  $$("[data-goto]").forEach(btn => btn.addEventListener("click", () => showDashTab(btn.dataset.goto)));
  $("#refreshDemo").addEventListener("click", () => {
    const steps = 6200 + Math.floor(Math.random()*1300);
    $(".stat-grid .stat-card:nth-child(2) .stat-value").innerHTML = steps.toLocaleString("vi-VN")+" <em>bước</em>";
    $(".map-toast") && ($("#mapToast").textContent="Đã làm mới vị trí mô phỏng.");
    $("#refreshDemo").textContent="✓ Đã làm mới";
    setTimeout(()=>$("#refreshDemo").textContent="↻ Làm mới demo",1400);
  });
  $("#findPet").addEventListener("click", () => {
    $("#mapToast").textContent="Đã tìm thấy Milo — vị trí mô phỏng, không phải GPS thật.";
    $("#mapToast").style.background="#e8efe0";
  });
  const zoneToggle = $("#zoneToggle"), zoneRadius = $("#zoneRadius");
  function syncZone() {
    const on = zoneToggle.checked, radius = Number(zoneRadius.value);
    $("#zoneStatus").textContent = on ? "Đang bật" : "Đang tắt";
    $("#zoneStatus").classList.toggle("tag-green",on);
    $("#radiusValue").textContent = radius.toLocaleString("vi-VN")+" m";
    ["#zoneCircle"].forEach(sel => {const c=$(sel); if(c){c.style.opacity=on?"1":"0.18";const size=100+radius/100*24;c.style.width=size+"px";c.style.height=size+"px";}});
    $("#zoneMessage").textContent = on ? "Vùng an toàn đang bật trong bản demo." : "Vùng an toàn đang tắt trong bản demo.";
  }
  zoneToggle.addEventListener("change",syncZone); zoneRadius.addEventListener("input",syncZone);
  $("#testAlert").addEventListener("click", () => {
    $("#zoneMessage").textContent = "Đã tạo cảnh báo minh họa! Không có thông báo thật nào được gửi.";
    const list=$("#alertsList");
    if(list && !list.textContent.includes("Cảnh báo demo vừa thử")) {
      const row=document.createElement("div"); row.className="notification-row";
      row.innerHTML='<span class="notif-icon notif-yellow">!</span><div><b>Cảnh báo demo vừa thử</b><small>Vừa xong · Không phải cảnh báo GPS thật</small></div><span class="tag">Demo</span>';
      list.prepend(row);
    }
  });
  $("#resetZone").addEventListener("click",()=>{zoneToggle.checked=true;zoneRadius.value=300;syncZone();$("#zoneMessage").textContent="Đã khôi phục cấu hình demo mặc định.";});
  $("#activityPeriod").addEventListener("change",e=>{
    const vals={today:["6.842","2,3"],week:["6.842","2,3"],month:["6.510","2,1"]};
    $("#stepStat").textContent=vals[e.target.value][0];$("#activeStat").innerHTML=vals[e.target.value][1]+" <em>giờ</em>";
  });
  $("#saveProfile").addEventListener("click",()=>{
    const name=$("#profileName").value.trim()||"Milo";
    $("#activePetName").textContent=name; $("#customPreviewName").textContent=name;
    $("#profileSaved").textContent="Đã cập nhật hồ sơ trong phiên demo.";
  });
  $("#markRead").addEventListener("click",()=>{
    $$(".notification-row",$("#alertsList")).forEach(row=>row.style.opacity=".55");
    $(".alert-count").textContent="0";$("#markRead").textContent="✓ Đã đọc";
  });
  $("#resetDemo").addEventListener("click",()=>{
    $("#profileName").value="Milo";$("#profileBreed").value="Golden Retriever";$("#profileWeight").value="12,4 kg";$("#profileBirthday").value="2023-05-12";$("#profileVaccines").value="Đã tiêm phòng định kỳ (dữ liệu mẫu)";
    $("#activePetName").textContent="Milo";zoneToggle.checked=true;zoneRadius.value=300;syncZone();
    $("#profileSaved").textContent="Đã khôi phục dữ liệu demo.";showDashTab("overview");
  });
  $("#contactForm").addEventListener("submit",e=>{e.preventDefault();$("#contactStatus").textContent="Cảm ơn bạn! Biểu mẫu demo chưa gửi dữ liệu tới máy chủ.";e.target.reset();});

  const chatReplies = {
    "giá sản phẩm":"Vòng cổ GPS 4G có giá 1.599.000đ. Tùy chọn cá nhân hóa dây đeo nâng cao phụ thu 149.000đ. Vận chuyển miễn phí nhé!",
    "cá nhân hóa":"Bạn có thể chọn một trong 6 màu dây, chọn size S/M/L, thêm tên bé và nội dung muốn in/khắc. Tổng giá cá nhân hóa là 1.748.000đ.",
    "my pet":"My Pet là giao diện demo gồm hồ sơ thú cưng, bản đồ vị trí minh họa, vùng an toàn, hoạt động và thông báo. Chưa kết nối GPS thật."
  };
  function sendChat(message) {
    const clean=message.trim(); if(!clean)return;
    const user=document.createElement("div");user.className="user-message";user.textContent=clean;$("#chatMessages").append(user);
    const key=clean.toLowerCase();let reply=chatReplies[key];
    if(!reply) reply=/giá|bao nhiêu|mua/i.test(key)?chatReplies["giá sản phẩm"]:/cá nhân|màu|size|khắc/i.test(key)?chatReplies["cá nhân hóa"]:/gps|vị trí|vùng|hoạt động|thú cưng|my pet/i.test(key)?chatReplies["my pet"]:"Mình có thể giới thiệu vòng cổ GPS 4G, tùy chọn cá nhân hóa hoặc giao diện My Pet demo. Bạn muốn tìm hiểu phần nào?";
    const bot=document.createElement("div");bot.className="bot-message";bot.textContent=reply;$("#chatMessages").append(bot);$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight;
  }
  $("#chatToggle").addEventListener("click",()=>$("#chatPanel").classList.toggle("open"));
  $("#chatClose").addEventListener("click",()=>$("#chatPanel").classList.remove("open"));
  $$(".chat-quick button").forEach(b=>b.addEventListener("click",()=>sendChat(b.dataset.chat)));
  $("#chatForm").addEventListener("submit",e=>{e.preventDefault();sendChat($("#chatInput").value);$("#chatInput").value="";});
  syncZone();
  routeTo(location.hash.slice(1)||"home");
})();