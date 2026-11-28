## 2D web canvas drawing application
A browser drawing application based on `html`, `css` grid, and `JavaScript` vanilla. The project uses FSM to manage mouse pointer states properly.

## Features
- Draw Mode: Freehand drawing with custom defining stroke width and color.
- Erase Mode: Pixel-level erasing using `globalCompositeOperation = "destination-out"`.
- Stamp Mode: Places a monochrome star stamp at the click coordinates.
- Fill mode: Searching neighbor pixels(DFS) that match target point color to find all of them in work space that is contacted and reassign our selected color to it(manipulations with colors realized via RGBA) 
- Brush Size Control: Alternative stroke and stamp size (`1px` – `60px`) via range slider.
- Color Picker: Color selection for drawing strokes.
- Undo: Reverts up to 10 previous operations (include clearing).
- Clean Canvas: Clears entire workspace in one click.
- Weaknesses of current fill mode: as we used edge smoothing so when we check if such pixels(that are the combination of colors of its neighbors) correspond to our target color, it returns false, so we skip it 

## Shortcuts
- `D` | Draw mode
- `E` | Erase mode
- `S` | Stamp mode
- `F` | Fill mode
- `C` | Clean the canvas
- `Ctrl + Z`/ `↺` | Undo last operation 