## 2D web canvas drawing application
A browser drawing application based on `html`, `css` grid, and `JavaScript` vanilla. The project uses FSM to manage mouse pointer states properly.

## Features
- Draw Mode: Freehand drawing with custom defining stroke width and color.
- Erase Mode: Pixel-level erasing using `globalCompositeOperation = "destination-out"`.
- Stamp Mode: Places a monochrome star stamp at the click coordinates.
- Brush Size Control: Alternative stroke and stamp size (`1px` – `60px`) via range slider.
- Color Picker: Color selection for drawing strokes.
- Undo: Reverts up to 10 previous operations (include clearing).
- Clean Canvas: Clears entire workspace in one click.

## Shortcuts
- `D` | Draw mode
- `E` | Erase mode
- `S` | Stamp mode
- `C` | Clean the canvas
- `Ctrl + Z`/ `↺` | Undo last operation 