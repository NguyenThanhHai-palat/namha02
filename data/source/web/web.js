const canvas = document.getElementById("sodolop");
const ctx = canvas.getContext("2d");
let banhocList = [];
let sttthanhvien = {};
let vitringoi = {};
function showInfo(student) {
  const tbody = document.getElementById("infothanhvienlop");
  const today = new Date();
  const week = tinhTuanHoc(today);
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const formattedDate = `${dd}/${mm}/${yyyy}`;
  tbody.innerHTML = `
    <tr>
      <td>${student.stt}</td>
      <td>${student.name}</td>
      <td>${student.sx}</td>
      <td>${student.date}</td>
      <td>${student.chucvulop}</td>
      <td><a href="${student.fburl}" target="_blank">Link  (Lần cuối update 5/9/2024)</a></td>
      <td>${week}</td>
    </tr>
  `;
}
function tinhTuanHoc(dateStr) {
  const startDate = new Date(2025, 8, 8);
  const currentDate = new Date(dateStr);

  const diffTime = currentDate - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;

  return weekNumber;
}
function vebanhoc(x,y,z){
  const bx = 30 + (220*(x-1));
  const by = 30 + (120*(y-1));
  const bw = 200;
  const bh = 100;
  if(z>0){
    ctx.strokeRect(bx, by, bw, bh);
    ctx.beginPath();
    ctx.moveTo(bx + bw/2, by);
    ctx.lineTo(bx + bw/2, by + bh);
    ctx.stroke();
    banhocList.push({x: x+"A", y: y, bx: bx, by: by, bw: bw/2, bh: bh});
    banhocList.push({x: x+"B", y: y, bx: bx+bw/2, by: by, bw: bw/2, bh: bh});
  }
  else{
    ctx.strokeRect(bx, by, bw, bh);
    ctx.beginPath();
    ctx.stroke();
    banhocList.push({x: x, y: y, bx: bx, by: by, bw: bw, bh: bh});
  }
  
}
function rutGonTen(fullname) {
  let parts = fullname.trim().split(/\s+/);
  if (parts.length <= 2) return fullname;
  let shortened = parts.slice(0, parts.length - 1).map(word => {
    return word[0].toUpperCase() + "."; 
  }).join("");
  let last = parts[parts.length - 1];
  return shortened + last;
}

function veTen(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  for (let key in vitringoi.blocks){
    const [ix, iy] = key.split(",").map(Number);
    const block = vitringoi.blocks[key];
    for (let side of ["A","B"]){
      const stt = block[side];
      if (stt && sttthanhvien[stt]){
        const ban = banhocList.find(b=> b.x===ix+side && b.y===iy);
        if(ban){
          ctx.fillText(rutGonTen(sttthanhvien[stt].name), ban.bx+8, ban.by+20);
        }
      }
    }
  }
}
async function loadData(){
  const res1 = await fetch("https://12a02.palat.io.vn/data/source/user_admin/data.json");
  const text1 = await res1.text();
  const data = JSON.parse(text1); 
  const res2 = await fetch("https://dnc-svc.palat.io.vn/dschongoi");
  vitringoi = await res2.json();
  sttthanhvien = {};
  data.forEach(s => sttthanhvien[s.stt] = s);
  veTen();
}

loadData();

for(let i=1;i<=4;i++){
  for(let m=1;m<=6;m++){
    vebanhoc(i,m,1);
  }
}
vebanhoc(4.3,7.2,0);
canvas.addEventListener("click", function(e){
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (let ban of banhocList){
    if(mouseX >= ban.bx && mouseX <= ban.bx+ban.bw &&
       mouseY >= ban.by && mouseY <= ban.by+ban.bh){
      for (let key in vitringoi.blocks){
        const [ix, iy] = key.split(",").map(Number);
        const block = vitringoi.blocks[key];
        if (ban.x===ix+"A" && ban.y===iy && block.A && sttthanhvien[block.A]){
          showInfo(sttthanhvien[block.A]);
        }
        if (ban.x===ix+"B" && ban.y===iy && block.B && sttthanhvien[block.B]){
          showInfo(sttthanhvien[block.B]);
        }
      }
      break;
    }
  }
});