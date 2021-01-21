let gen = 0, isPaused = false

let prevStat = new Array(10).fill(new Array(10).fill(0)), newStat = prevStat

document.querySelector('#pause').addEventListener('click', () => isPaused = true)

document.querySelector('#resume').addEventListener('click', () => isPaused = false)

setInterval(() => {
    if (isPaused) return

    prevStat.forEach((row, i) => {
        row.forEach((cell, j) => {
            // TODO
        })
    })

    gen += 1
    document.querySelector('#gen').innerText = gen
}, 100)