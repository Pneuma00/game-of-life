const canvas = document.querySelector('#sim')
const ctx = canvas.getContext('2d')

ctx.fillStyle = '#e0e0e0'
ctx.strokeStyle = '#909090'

const dy = [-1, -1, 0, 1, 1, 1, 0, -1], dx = [0, 1, 1, 1, 0, -1, -1, -1]

let config = { birth : [3], survive: [2, 3] }

let gen = 0, isPaused = true

let newStat = new Array(142).fill(null).map(() => new Array(142).fill(false)), prevStat

// Generation

(async () => {
    while (true) {
        if (!isPaused) generate()
        await new Promise(res => setTimeout(res, Math.pow(10, 4 - document.querySelector('#speed').value / 10)))
    }
})()

setInterval(() => {
    render()
    document.querySelector('#gen').innerText = 'Generation: ' + gen
}, 10)

const generate = () => {
    prevStat = new Array(newStat.length).fill(null).map((_, i) => new Array(newStat[i].length).fill(null).map((_, j) => newStat[i][j]))

    for (let i = 1; i <= 140; i++) {
        for (let j = 1; j <= 140; j++) {
            let cnt = 0
            for (let key = 0; key < 8; key++) {
                let _i = i + dy[key], _j = j + dx[key]

                if (_i === 0) _i = 140
                else if (_i === 141) _i = 1

                if (_j === 0) _j = 140
                else if (_j === 141) _j = 1

                cnt += prevStat[_i][_j]
            }
            newStat[i][j] = !prevStat[i][j] && config.birth.includes(cnt) || prevStat[i][j] && config.survive.includes(cnt)
        }
    }

    gen += 1
}

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 1; i <= 140; i++) {
        for (let j = 1; j <= 140; j++) {
            if (newStat[i][j]) ctx.fillRect((j - 1) * 5, (i - 1) * 5, 5, 5)
        }
    }

    ctx.strokeRect((cursor.x - 1) * 5, (cursor.y - 1) * 5, 5, 5)
}

// Buttons

document.querySelector('#reset').addEventListener('click', () => {
    if (!confirm('Are you sure to reset?')) return
    isPaused = true
    gen = 0
    newStat = new Array(142).fill(null).map(() => new Array(142).fill(false))
})

document.querySelector('#pause').addEventListener('click', () => isPaused = !isPaused)

document.querySelector('#step').addEventListener('click', generate)

document.querySelector('#random').addEventListener('click', () => {
    for (let i = 1; i <= 140; i++) {
        for (let j = 1; j <= 140; j++) {
            newStat[i][j] = Math.floor(Math.random() * 100) < document.querySelector('#randomratio').value
        }
    }
})

// Edit Feature

let cursor = { x: 0, y: 0 }, isMouseDown = false

const getMousePosition = evt => {
    let rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top }
}

document.querySelector('#sim').addEventListener('mousedown', evt => {
    isMouseDown = true
    console.log('Mouse is down')
})

document.querySelector('#sim').addEventListener('mouseup', evt => {
    isMouseDown = false
    console.log('Mouse is up')
})

document.querySelector('#sim').addEventListener('click', evt => {
    let pos = getMousePosition(evt)
    let x = Math.ceil(pos.x / 5), y = Math.ceil(pos.y / 5)
    
    newStat[y][x] ^= true
    console.log(`Toggled cell at (${x}, ${y})`)
})

document.querySelector('#sim').addEventListener('mousemove', evt => {
    let pos = getMousePosition(evt)
    let x = Math.ceil(pos.x / 5), y = Math.ceil(pos.y / 5)

    if (isMouseDown && (cursor.x !== x || cursor.y !== y)) {
        newStat[y][x] ^= true
        console.log(`Toggled cell at (${x}, ${y})`)
    }

    cursor = { x, y }
})