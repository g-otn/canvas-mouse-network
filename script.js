var canvas
var ctx
var points = []
var minDistance = 1000
var positionJumpDistance = 0.1
var updateSpeed = 1

function start() {
    canvas = document.createElement('canvas')
    canvas.width = document.body.clientWidth - 10
    canvas.height = document.body.clientHeight - 10
    document.body.appendChild(canvas)
    ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'aqua'
    ctx.font = '20px white'
    for (let i = 0; i < 50; i++)
        points.push(new createPoint())
    update()
}

function update() {
    clearCanvas()
    drawLines()
    updatePositions()
    //requestAnimationFrame(update)
    setTimeout(update, updateSpeed);
}

function createPoint() {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    if (Math.random() < 0.5) {
        let speedX = Math.random()
        this.speedX = speedX
        this.speedY = Math.sqrt(1 - speedX * speedX) // sin² + cos² = 1 -> sin = sqrt(1 - cos²)
    } else {
        let speedY = Math.random()
        this.speedY = speedY
        this.speedX = Math.sqrt(1 - speedY * speedY) // sin² + cos² = 1 -> cos = sqrt(1 - sin²)
    }
}

function clearCanvas() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawLines() {
    ctx.fillStyle = 'white' // DEBUG: show point index
    ctx.beginPath()
    for (let i = 0; i < points.length; i++) {
        ctx.moveTo(points[i].x, points[i].y)
        for (let j = 0; j < points.length; j++)
            if (Math.abs(points[i].x - points[j].x) < minDistance ||
                Math.abs(points[i].y - points[j].y) < minDistance)
                ctx.lineTo(points[j].x, points[j].y)
        ctx.fillText(i, points[i].x, points[i].y - 5, 100) // DEBUG: show point index
    }
    ctx.stroke()
}

function updatePositions() {
    for (let i = 0; i < points.length; i++) {
        if (points[i].x < 0 || points[i].x > canvas.width)
            points[i].speedX *= -1
        else if (points[i].y < 0 || points[i].y > canvas.height)
            points[i].speedY *= -1
        points[i].x += points[i].speedX * positionJumpDistance
        points[i].y += points[i].speedY * positionJumpDistance
    }
}

start()