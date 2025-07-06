const canvas = document.getElementById('staff');
const ctx = canvas.getContext('2d');
const optionsDiv = document.getElementById('options');
const resultDiv = document.getElementById('result');

// Staff configuration
const staff = {
    x: 50,
    y: 50,
    width: 300,
    lineSpacing: 20,
    lines: 5,
};

// Notes from C4 to C5
const notes = [
    { name: 'C4', offset: 7 }, // ledger line below
    { name: 'D4', offset: 6 },
    { name: 'E4', offset: 5 },
    { name: 'F4', offset: 4 },
    { name: 'G4', offset: 3 },
    { name: 'A4', offset: 2 },
    { name: 'B4', offset: 1 },
    { name: 'C5', offset: 0 },
];

function drawStaff() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < staff.lines; i++) {
        const y = staff.y + i * staff.lineSpacing;
        ctx.beginPath();
        ctx.moveTo(staff.x, y);
        ctx.lineTo(staff.x + staff.width, y);
        ctx.stroke();
    }
}

function drawNote(note) {
    const centerX = staff.x + staff.width / 2;
    const y = staff.y + note.offset * (staff.lineSpacing / 2);
    ctx.beginPath();
    ctx.ellipse(centerX, y, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    // draw ledger lines if needed
    if (note.offset > 4) {
        for (let n = 5; n <= note.offset; n += 2) {
            const ly = staff.y + n * (staff.lineSpacing / 2);
            ctx.beginPath();
            ctx.moveTo(centerX - 15, ly);
            ctx.lineTo(centerX + 15, ly);
            ctx.stroke();
        }
    } else if (note.offset < 0) {
        for (let n = -1; n >= note.offset; n -= 2) {
            const ly = staff.y + n * (staff.lineSpacing / 2);
            ctx.beginPath();
            ctx.moveTo(centerX - 15, ly);
            ctx.lineTo(centerX + 15, ly);
            ctx.stroke();
        }
    }
}

function getRandomNote() {
    return notes[Math.floor(Math.random() * notes.length)];
}

function generateOptions(correct) {
    const noteNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    let opts = [correct.name[0]];
    while (opts.length < 4) {
        const candidate = noteNames[Math.floor(Math.random() * noteNames.length)];
        if (!opts.includes(candidate)) opts.push(candidate);
    }
    return shuffle(opts);
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

let currentNote;

function nextRound() {
    drawStaff();
    currentNote = getRandomNote();
    drawNote(currentNote);
    const opts = generateOptions(currentNote);
    optionsDiv.innerHTML = '';
    opts.forEach(o => {
        const button = document.createElement('button');
        button.textContent = o;
        button.onclick = () => checkAnswer(o);
        optionsDiv.appendChild(button);
    });
    resultDiv.textContent = '';
}

function checkAnswer(answer) {
    const correct = currentNote.name[0];
    if (answer === correct) {
        resultDiv.textContent = 'Correct!';
        resultDiv.style.color = 'green';
    } else {
        resultDiv.textContent = `Wrong! It was ${correct}`;
        resultDiv.style.color = 'red';
    }
    setTimeout(nextRound, 1000);
}

nextRound();
