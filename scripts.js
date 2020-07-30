var noteNameMap={
    0:'C',
    1:'C#/Db',
    2:'D',
    3:'D#/Eb',
    4:'E',
    5:'F',
    6:'F#/Gb',
    7:'G',
    8:'G#/Ab',
    9:'A',
    10:'A#/Bb',
    11:'B'}


var root = document.getElementById("root");
var keyWidth = (window.innerWidth - 10) / 4, keyHeight = window.innerHeight / 8;
var sw, obxd;

var initnotes=[1,0,0,0,1,0,0,1,0,0,0,0]
var notesEl = document.getElementById("notes");
for(let i=0;i<12;i++){
    var a = document.createElement("input");
    a.type="range";
    a.name = "notes-note"+i;
    a.max=100
    a.step=1
    a.min=0
    a.value = initnotes[i]*100;
    a.className = "notes"
    notesEl.appendChild(a)
    var b = document.createElement('label');
    b.for = "notes-note"+i;
    b.innerText = noteNameMap[i]
    notesEl.appendChild(b)
}

var initoctaves=[0,0.5,1,0.5,0]

var notesEl = document.getElementById("octaves");
for(let i=2;i<7;i++){
    var a = document.createElement("input");
    a.type="range";
    a.name = "octaves-octave"+i;
    a.max=100
    a.min=0
    a.step=1
    a.value = initoctaves[i-2]*100;
    a.className = "octaves"
    notesEl.appendChild(a)
    var b = document.createElement('label');
    b.for = "octaves-octave"+i;
    b.innerText = i
    notesEl.appendChild(b)
}

function linexp(a,min,max,emin,emax){
    if(a===0){
        a+=0.00001;
    }
    if(min===0){
        min+=0.00001;
    }
    if(emin===0){
        emin+=0.00001;
    }
    if(a<min){
        a = min
    }
    if(a>max){
        a=max
    }
    var minLog = Math.log(emin);
    var maxLog = Math.log(emax);
    var scaleLog = (maxLog - minLog) / (max - min);
    return Math.exp((a-min)*scaleLog + minLog)
}

function wn(arr,parr){
    var c = parr.reduce((a,p,i)=>{
        for(let ii=0;ii<p;ii++){
            a.push(arr[i])
        }
        return a;
    },[])

    return c[Math.floor(Math.random()*c.length)]
}
var started = false;
function start(){
    started = true;
    for(let c=0;c<16;c++){
        setTimeout(()=>hit(c),Math.random()*1000)
    }
}

function stop(){
    started = false;
}

function hit(c){
    if(!started){
        return
    }
    var mlp = 4000;
    var llp = 1000;
    //var notes = [24, 28, 30];
    var notes = Array.from(document.getElementsByClassName("notes")).sort().map(f=>parseInt(f.value));
    var octaves = Array.from(document.getElementsByClassName("octaves")).sort().map(f=>parseInt(f.value));//[3,4,5,6,7]
    
    var t = linexp(c,0,16,llp,mlp);
    var octave = wn([2,3,4,5,6], octaves)
    var note = wn([0,1,2,3,4,5,6,7,8,9,10,11], notes)+12*octave;
    play(note,t)
    setTimeout(()=>hit(c),t);
}

function play(n,t){
    obxd.onMidi([0x90, n, Math.floor(Math.random()*20)+107]);
    setTimeout(()=>{obxd.onMidi([0xa0, n, 10]);},9*t/10)
    setTimeout(()=>{obxd.onMidi([0x80, n, 00]);},t)
}

// document.querySelectorAll('.row .but').forEach(f => {
//     Pressure.set('#' + f.id, {
//         start: function (event) {
//             f.style.backgroundColor = '#000000';
//             f.style.opacity = 0.5;
//             // if (f.id[0] === 'n') {
//             //     post('on', f.id, event.pressure);
//             // } else {
//             //     post('control', f.id);
//             // }
//             if (f.id[0] !== 'n') return
//             var spl = f.id.split('-');
//             var note = parseInt(spl[2]);
//             //let note = 48 + notesPositions[i];
//             obxd.onMidi([0x90, note-12, Math.round(Pressure.map(event.pressure, 0, 1, 50, 127))]);
//             obxd.onMidi([0x90, note, Math.round(Pressure.map(event.pressure, 0, 1, 50, 127))]);
//             obxd.onMidi([0x90, note+12, Math.round(Pressure.map(event.pressure, 0, 1, 50, 127))]);
//         },
//         end: function () {
//             f.style.backgroundColor = '#FFFFFF';
//             f.style.opacity = 1;
//             // post('off', f.id);
//             //   o.style.backgroundColor = '#443548';
//             //   o.style.opacity = 1;
//             //   let note = 48 + notesPositions[i];
//             var spl = f.id.split('-');
//             var note = parseInt(spl[2]);
//             obxd.onMidi([0x80, note+12, 0]);
//             obxd.onMidi([0x80, note, 0]);
//             obxd.onMidi([0x80, note-12, 0]);
//         },
//         change: function (force, event) {
//             //   o.style.backgroundColor = '#5F674B';
//             //   o.style.opacity = force;
//             //   let note = 48 + notesPositions[i];
//             var spl = f.id.split('-');
//             var note = parseInt(spl[2]);
//             obxd.onMidi([0xa0, note+12, Math.round(Pressure.map(force, 0, 1, 50, 127))]);
//             obxd.onMidi([0xa0, note, Math.round(Pressure.map(force, 0, 1, 50, 127))]);
//             obxd.onMidi([0xa0, note-12, Math.round(Pressure.map(force, 0, 1, 50, 127))]);
//         },
//         unsupported: function () {
//         }
//     });
//     interact('#n' + f.id)
//         .draggable({
//             inertia: true,
//             modifiers: [
//                 interact.modifiers.restrictRect({
//                     restriction: 'parent',
//                     endOnly: true
//                 })
//             ],
//             autoScroll: true,
//             onmove: dragMoveListener,
//             onend: function (event) {
//                 var target = event.target;
//                 target.style.webkitTransform =
//                     target.style.transform =
//                     'translate(' + 0 + 'px, ' + 0 + 'px)';
//                 target.setAttribute('data-x', 0)
//                 target.setAttribute('data-y', 0)
//             }
//         })
//     function dragMoveListener(event) {
//         var target = event.target
//         var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
//         var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

//         target.style.webkitTransform =
//             target.style.transform =
//             'translate(' + x + 'px, ' + y + 'px)'

//         target.setAttribute('data-x', x)
//         target.setAttribute('data-y', y)
//     }
// })

async function loadSynth() {
    let actx = new AudioContext();

    await WAM.OBXD.importScripts(actx);
    obxd = new WAM.OBXD(actx);
    obxd.connect(actx.destination);

    let gui = await obxd.loadGUI("skin");
    if (document.getElementById('controller').style.display !== 'none') {
        frontpanel.appendChild(gui);
        container.style.width = gui.width + "px";
        frontpanel.style.height = gui.height + "px";
        frontpanel.className = container.className = "ready";

        let midikeys = new QwertyHancock({
            container: document.querySelector("#keys"), height: 60,
            octaves: 6, startNote: 'C2', oct: 4,
            whiteNotesColour: 'white', blackNotesColour: 'black', activeColour: 'orange'
        });
        midikeys.keyDown = (note, name) => obxd.onMidi([0x90, note, 100]);
        midikeys.keyUp = (note, name) => obxd.onMidi([0x80, note, 100]);
    }
    //await obxd.loadBank("presets/factory.fxb");Designer/Kujashi-OBXD-Bank.fxb
    await obxd.loadBank("presets/Designer/Kujashi-OBXD-Bank.fxb");
    loadPatches();
    obxd.selectPatch(31);
}
async function bankChange() {
    var x = document.getElementById("banks").value;
    await obxd.loadBank("presets/" + x);
    loadPatches();
}
async function patchChange() {
    var x = document.getElementById("patches").value;
    obxd.selectPatch(x);
}
function loadPatches() {
    var array = obxd.patches;
    var patchList = document.getElementById("patches");
    patchList.innerHTML = '';
    for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i + ": " + array[i];
        patchList.appendChild(option);
    }
}

async function load() {
    try {
        await loadSynth();
        var el = document.getElementById("load");
        el.style.display = "none";
    } catch (e) {
        alert(e)
    }
}