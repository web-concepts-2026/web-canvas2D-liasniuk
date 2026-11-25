document.addEventListener("DOMContentLoaded", ()=>{
    const canvas = document.getElementById("canvas");
    const wrapper = document.getElementById("wrapper");
    const ctx = canvas.getContext("2d", {willReadFrequently:true});
    const toolButtons = document.querySelectorAll(".tool-btn");
    const actionButtons = document.querySelectorAll(".action-btn");
    const sizeInput = document.getElementById("brush-size");
    const sizeValueDisplay = document.getElementById("size-value");
    const colorInput = document.getElementById("brush-color");
    
    const HISTORY_BUFFER = 10;
    const appState = {
        tool: "draw",
        color: colorInput.value,
        size: Number(sizeInput.value),
        prevX: null,
        prevY: null,
        history: [],
    };
    
    function resizeCanvas(){
        const rect = wrapper.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const heigh = Math.floor(rect.height);
        if(canvas.width === width && canvas.height === heigh) return;
        
        let tmpSnap = null;
        if(canvas.width>0&&canvas.height>0){
            tmpSnap = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
        }
        canvas.width = width;
        canvas.height = heigh;
        if(tmpSnap){
            ctx.putImageData(tmpSnap, 0, 0);
        }
    }
    
    function SaveSnap(){
        if(canvas.width === 0 || canvas.height === 0) return;
        
        if(appState.history.length>=HISTORY_BUFFER){
            appState.history.shift();
        }
        appState.history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
    
    function Undo(){
        if(appState.history.length === 0) return;
        
        const prevSnap = appState.history.pop();
        ctx.putImageData(prevSnap, 0, 0);
    }
    
    
    function Clean(){
        SaveSnap();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    function draw(x, y){
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = appState.size;

        if (appState.tool === "erase") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = appState.color;
        }

        const startX = appState.prevX !== null ? appState.prevX : x;
        const startY = appState.prevY !== null ? appState.prevY : y;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();

        appState.prevX = x;
        appState.prevY = y;
    }


    function placeStamp(x, y) {
        const outerRadius = Math.max(12, appState.size * 2.2);
        const innerRadius = outerRadius * 0.45;
        const spikes = 5;

        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#f7fb09"; // Monochrome dark ink
        ctx.strokeStyle = "#111827";
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";

        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const pointX = x + Math.cos(angle) * radius;
            const pointY = y + Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(pointX, pointY);
            } else {
                ctx.lineTo(pointX, pointY);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }


    function initStateMachine() {
        const STATES = {
            IDLE: "idle",
            ACTIVE: "active",
        };

        let currentState = STATES.IDLE;

        return {
            next(action, x, y) {
                switch (action) {
                    case "down":
                        SaveSnap();

                        if (appState.tool === "stamp") {
                            placeStamp(x, y);
                            currentState = STATES.IDLE;
                        } else {
                            currentState = STATES.ACTIVE;
                            appState.prevX = x;
                            appState.prevY = y;
                            draw(x, y); // Draw initial dot on click
                        }
                        break;

                    case "move":
                        if (currentState === STATES.ACTIVE) {
                            draw(x, y);
                        }
                        break;

                    case "up":
                    case "leave":
                        currentState = STATES.IDLE;
                        appState.prevX = null;
                        appState.prevY = null;
                        break;
                }
            },
        };
    }
    const machine = initStateMachine();

    function actualTool(toolName) {
        appState.tool = toolName;

        toolButtons.forEach((btn) => {
            const isSelected = btn.dataset.tool === toolName;
            btn.classList.toggle("active", isSelected);
            btn.setAttribute("aria-pressed", String(isSelected));
        });
    }

    canvas.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return; //left button
        machine.next("down", event.offsetX, event.offsetY);
    });

    canvas.addEventListener("mousemove", (event) => {
        machine.next("move", event.offsetX, event.offsetY);
    });

    canvas.addEventListener("mouseup", (event) => {
        machine.next("up", event.offsetX, event.offsetY);
    });

    canvas.addEventListener("mouseleave", (event) => {
        machine.next("leave", event.offsetX, event.offsetY);
    });

    toolButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            actualTool(btn.dataset.tool);
        });
    });

    actionButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const action = btn.dataset.action;
            if (action === "undo") Undo();
            if (action === "clean") Clean();
        });
    });

    sizeInput.addEventListener("input", (event) => {
        appState.size = Number(event.target.value);
        sizeValueDisplay.textContent = `${appState.size}px`;
    });

    colorInput.addEventListener("input", (event) => {
        appState.color = event.target.value;
        // switch to draw if color changes while ereasing
        if (appState.tool === "erase") {
            actualTool("draw");
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.target.tagName === "INPUT") return;

        const key = event.key.toLowerCase();

        if ((event.ctrlKey || event.metaKey) && key === "z") {
            event.preventDefault();
            Undo();
            return;
        }

        switch (key) {
            case "d":
                actualTool("draw");
                break;
            case "e":
                actualTool("erase");
                break;
            case "s":
                actualTool("stamp");
                break;
            case "c":
                Clean();
                break;
        }
    });
    
    window.addEventListener("resize", resizeCanvas);
    
    resizeCanvas();
    
    
})