
# Day 2

### Task : To Create a Drawing Board that draws straight lines

1) In HTML Body we created svg element as canvas draw 
2) Created Style.css to style svg
3) Created script.js to draw lines

**Following Things Are used to draw lines**

- mousedown event listener to get starting point of line
- mousemove to dynamically show the line. 
- mouseup event to get ending point of line and stop drawing
- Paint line using a function inside mouseup event listener as follows:
   * create a namespace element line
   * set initial (x1, y1) and final (x2, y2) position as attribute
   * select current line using lastChild selector and update final position of line until mouseup event is triggered
   * set style attribute to give stroke width and color.
   * finally append line element to our drawing board
