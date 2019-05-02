var canvas = document.createElement('canvas')
var ctx
var points = []
var minDistance
var positionJumpDistance = 0.5
//var updateSpeed = 1 // this with setTimeout or requestFrameAnimation can be used
var mouse = { x: null, y: null }
var color = { r: 100, g: 25, b: 255, a: 0.1 }
var showNumbers = false

function start() {
    // Creates canvas and appends to body
    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight
    document.body.appendChild(canvas)

    // Canvas context
    ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'aqua'
    ctx.font = '12px white'

    // Other variables
    minDistance = Math.round(Math.max(canvas.width, canvas.height) / 15)
    for (let i = 0; i < 100; i++)
        points.push(new createPoint())

    update()
}

function update() {
    clearCanvas()
    drawLines()
    updatePositions()
    requestAnimationFrame(update)
    //setTimeout(update, updateSpeed);
}

function createPoint() {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    // Chooses which will be randomized (speedX or speedY) and calculates the other
    if (Math.random() < 0.5) {
        let speedX = Math.random()
        this.speedX = speedX
        this.speedY = Math.sqrt(1 - speedX * speedX) * (Math.random() < 0.5 ? 1 : -1) // sin² + cos² = 1 -> sin = sqrt(1 - cos²)
    } else {
        let speedY = Math.random()
        this.speedY = speedY * (Math.random() < 0.5 ? 1 : -1)
        this.speedX = Math.sqrt(1 - speedY * speedY) * (Math.random() < 0.5 ? 1 : -1) // sin² + cos² = 1 -> cos = sqrt(1 - sin²)
    }
}

function clearCanvas() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawLines() {
    for (let i = 0; i < points.length; i++) {
        ctx.beginPath()
        ctx.moveTo(points[i].x, points[i].y)
        for (let j = 0; j < points.length; j++) {
            if (Math.abs(points[i].x - mouse.x) < minDistance * 1.5 &&
                Math.abs(points[i].y - mouse.y) < minDistance * 1.5) {
                ctx.lineTo(mouse.x, mouse.y) // line and move to mouse position
            }
            if (Math.abs(points[i].x - points[j].x) < minDistance &&
                Math.abs(points[i].y - points[j].y) < minDistance) {
                ctx.lineTo(points[j].x, points[j].y) // line and move to nearby point
                //ctx.moveTo(points[i].x, points[i].y) // Goes back to current point (i) position
                ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
                ctx.fill()
            }
        }
    }



    // Shows point
    if (showNumbers)
        points.forEach((point, index) => {
            ctx.fillStyle = `rgb(${150 / (points.length + 1) * index},255,${255 / (points.length + 1) * index})`
            ctx.fillText(index, point.x, point.y - 5, 100)
        })
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

canvas.addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

canvas.addEventListener('click', event => {
    for (let i = 0; i < points.length; i++) {
        if (Math.abs(points[i].x - mouse.x) < minDistance * 1.5 &&
            Math.abs(points[i].y - mouse.y) < minDistance * 1.5) {
            let arctan = Math.atan2(points[i].y - event.clientY, points[i].x - event.clientX)
            if (Math.random() < 0.5) {
                points[i].speedX = Math.cos(arctan) * 5
            } else {
                points[i].speedY = Math.sin(arctan) * 5
            }
        }
    }
})

function toggleOptions() {
    let elements = document.querySelectorAll('div#options :not(#toggleButton)')
    let toggleButton = document.getElementById('toggleButton')
    if (elements[0].style.display !== 'none') {
        elements.forEach(element => element.style.display = 'none')
        toggleButton.innerHTML = 'Show'
        toggleButton.style.backgroundColor = 'transparent'
    }
    else {
        elements.forEach(element => element.style.display = 'inline')
        toggleButton.innerHTML = 'Hide'
        toggleButton.style.backgroundColor = 'rgba(100,50,255,.5)'
    }

}

start()

/*  TODO:
- Change colors based on line length (distance)
*/