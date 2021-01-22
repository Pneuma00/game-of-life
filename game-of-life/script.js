const canvas = document.querySelector('#sim')
const ctx = canvas.getContext('2d')

ctx.fillStyle = '#e0e0e0'
ctx.strokeStyle = '#909090'

const dy = [-1, -1, 0, 1, 1, 1, 0, -1], dx = [0, 1, 1, 1, 0, -1, -1, -1]

let config = { birth : [3], survive: [2, 3] }

let gen = 0, isPaused = true

let prevStat = new Array(102).fill(null).map(() => new Array(102).fill(false)), newStat = prevStat

// Generation

setInterval(() => {
    if (!isPaused) generate()
}, 100)

setInterval(() => {
    render()
}, 10)

const generate = () => {
    prevStat = new Array(newStat.length).fill(null).map((_, i) => new Array(newStat[i].length).fill(null).map((_, j) => newStat[i][j]))

    for (let i = 1; i <= 100; i++) {
        for (let j = 1; j <= 100; j++) {
            let cnt = 0
            for (let key = 0; key < 8; key++) cnt += prevStat[i + dy[key]][j + dx[key]]
            newStat[i][j] = !prevStat[i][j] && config.birth.includes(cnt) || prevStat[i][j] && config.survive.includes(cnt)
        }
    }

    gen += 1
    document.querySelector('#gen').innerText = gen
}

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 1; i <= 100; i++) {
        for (let j = 1; j <= 100; j++) {
            if (newStat[i][j]) ctx.fillRect((j - 1) * 5, (i - 1) * 5, 5, 5)
        }
    }

    ctx.strokeRect((cursor.x - 1) * 5, (cursor.y - 1) * 5, 5, 5)
}

document.querySelector('#pause').addEventListener('click', () => isPaused = true)

document.querySelector('#resume').addEventListener('click', () => isPaused = false)

document.querySelector('#step').addEventListener('click', generate)

document.querySelector('#random').addEventListener('click', () => {
    for (let i = 1; i <= 100; i++) {
        for (let j = 1; j <= 100; j++) {
            newStat[i][j] = Math.floor(Math.random() * 100) < 20
        }
    }
})

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


document.querySelector('#sim').addEventListener('mousemove', evt => {
    let pos = getMousePosition(evt)
    let x = Math.ceil(pos.x / 5), y = Math.ceil(pos.y / 5)

    if (isMouseDown && (cursor.x !== x || cursor.y !== y)) {
        newStat[y][x] ^= true
        console.log(`Toggled cell at (${x}, ${y})`)
    }

    cursor = { x, y }
})