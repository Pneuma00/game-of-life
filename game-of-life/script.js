const canvas = document.querySelector('#sim')
const ctx = canvas.getContext('2d')

ctx.fillStyle = '#e0e0e0'

const dy = [-1, -1, 0, 1, 1, 1, 0, -1], dx = [0, 1, 1, 1, 0, -1, -1, -1]

let config = { birth : [3], survive: [2, 3] }

let gen = 0, isPaused = false

let prevStat = new Array(102).fill(new Array(102).fill(false)), newStat = prevStat

// Generation

setInterval(() => {
    if (!isPaused) generate()

    render()

    document.querySelector('#gen').innerText = gen
}, 100)

const generate = () => {
    prevStat = newStat

    for (let i = 1; i <= 100; i++) {
        for (let j = 1; j <= 100; j++) {
            let cnt = 0
            for (let key = 0; key < 8; key++) cnt += prevStat[i + dy[key]][j + dx[key]]
            newStat[i][j] = !prevStat[i][j] && config.birth.includes(cnt) || prevStat[i][j] && config.survive.includes(cnt)
        }
    }

    gen += 1
}

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 1; i <= 100; i++) {
        for (let j = 1; j <= 100; j++) {
            if (newStat[i][j]) ctx.fillRect((j - 1) * 5, (i - 1) * 5, 5, 5)
        }
    }
}

document.querySelector('#pause').addEventListener('click', () => isPaused = true)

document.querySelector('#resume').addEventListener('click', () => isPaused = false)

document.querySelector('#step').addEventListener('click', generate)

document.querySelector('#random').addEventListener('click', () => {
    for (let j = 1; j <= 100; j++) {
        for (let i = 1; i <= 100; i++) {
            newStat[i][j] = Math.floor(Math.random() * 100) < 50
        }
    }
})