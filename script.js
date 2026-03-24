const enter=document.getElementById("enter")
const profile=document.getElementById("profile")
const music=document.getElementById("music")
const banner=document.getElementById("bannerWindow")
const card=document.getElementById("card")

let cfg={}

fetch("config.txt").then(r=>r.text()).then(text=>{

text.split("\n").forEach(line=>{
let p=line.split("=")
cfg[p[0]]=p[1]
})

document.getElementById("bio").innerText=cfg.bio
document.getElementById("avatar").src=cfg.avatar
document.getElementById("discord").href=cfg.discord
document.getElementById("twitter").href=cfg.twitter
document.getElementById("github").href=cfg.github

document.getElementById("bg").style.backgroundImage=`url(${cfg.background})`
banner.style.backgroundImage=`url(${cfg.banner})`

if(cfg.profile_glow=="true")card.classList.add("glow")

if(cfg.typing=="true"){typeUsername(cfg.username)}
else{document.getElementById("username").innerText=cfg.username}

if(cfg.view_counter=="true"){
let views=localStorage.getItem("views")||0
views++
localStorage.setItem("views",views)
document.getElementById("views").innerText="views: "+views
}

})

function typeUsername(name){
let i=0
let el=document.getElementById("username")
function type(){
if(i<name.length){el.innerHTML+=name.charAt(i);i++;setTimeout(type,80)}
}
type()
}

enter.onclick=()=>{

enter.style.opacity="0"
setTimeout(()=>{
enter.style.display="none"
profile.classList.remove("hidden")
},1000)

if(cfg.music=="true"){
music.play()
if(cfg.music_visualizer=="true")startVisualizer()
}

if(cfg.snow_particles=="true")startParticles()
}

document.addEventListener("mousemove",(e)=>{

if(cfg.banner_parallax=="true"){
const x=(e.clientX/window.innerWidth-.5)*40
const y=(e.clientY/window.innerHeight-.5)*40
banner.style.transform=`translate(${x}px,${y}px)`
}

if(cfg.profile_tilt=="true"){
let x=(e.clientX/window.innerWidth-.5)*10
let y=(e.clientY/window.innerHeight-.5)*10
card.style.transform=`translateX(-50%) rotateY(${x}deg) rotateX(${-y}deg)`
}

if(cfg.cursor_sparkle=="true")sparkle(e)
})

function startParticles(){
const canvas=document.createElement("canvas")
document.getElementById("particles").appendChild(canvas)
const ctx=canvas.getContext("2d")
canvas.width=window.innerWidth
canvas.height=window.innerHeight

let particles=[]
for(let i=0;i<80;i++){
particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,speed:Math.random()*0.7,size:Math.random()*2})
}

function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height)
particles.forEach(p=>{
ctx.beginPath()
ctx.arc(p.x,p.y,p.size,0,Math.PI*2)
ctx.fillStyle="white"
ctx.fill()
p.y+=p.speed
if(p.y>canvas.height)p.y=0
})
requestAnimationFrame(draw)
}
draw()
}

function sparkle(e){
let s=document.createElement("div")
s.className="spark"
s.style.left=e.clientX+"px"
s.style.top=e.clientY+"px"
document.body.appendChild(s)
setTimeout(()=>s.remove(),800)
}

function startVisualizer(){
const canvas=document.getElementById("visualizer")
const ctx=canvas.getContext("2d")
canvas.width=window.innerWidth
canvas.height=120

const audioCtx=new AudioContext()
const src=audioCtx.createMediaElementSource(music)
const analyser=audioCtx.createAnalyser()
src.connect(analyser)
analyser.connect(audioCtx.destination)
analyser.fftSize=64

const bufferLength=analyser.frequencyBinCount
const data=new Uint8Array(bufferLength)

function draw(){
requestAnimationFrame(draw)
analyser.getByteFrequencyData(data)
ctx.clearRect(0,0,canvas.width,canvas.height)
let barWidth=canvas.width/bufferLength

for(let i=0;i<bufferLength;i++){
let barHeight=data[i]
ctx.fillStyle="white"
ctx.fillRect(i*barWidth,canvas.height-barHeight,barWidth-2,barHeight)
}
}
draw()
}